import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import programsReducer, {
  setSelectedProgram,
  fetchPrograms,
} from "../../store/slices/programsSlice";
import Program from "../Program";
import useBackspace from "../../hooks/useBackspace";

// Mock the useBackspace hook
jest.mock("../../hooks/useBackspace");
const mockUseBackspace = useBackspace as jest.MockedFunction<
  typeof useBackspace
>;

// Mock the StanImage component
jest.mock("../../components/StanImage/StanImage", () => {
  return function MockStanImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} data-testid="stan-image" />;
  };
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Test data
const mockProgram = {
  id: 123,
  title: "Test Program",
  description:
    "This is a test program description that should be displayed in the component.",
  image: "https://example.com/test-image.jpg",
  type: "movie" as const,
  rating: "PG",
  genre: "Action",
  year: 2023,
  language: "English",
};

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      programs: programsReducer,
    },
    preloadedState: {
      programs: {
        programs: {
          byIds: {
            "123": mockProgram,
          },
          ids: ["123"],
        },
        selectedProgram: null,
        status: "succeeded" as const,
        error: null,
        ...initialState,
      },
    },
  });
};

const renderProgram = (initialState = {}, route = "/program/123") => {
  const store = createTestStore(initialState);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={<div data-testid="mock-home-page" />} />
          <Route path="/program/:id" element={<Program />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("Program", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBackspace.mockImplementation(() => {});
  });

  describe("Program Content Display", () => {
    it("displays program information when program is found", () => {
      renderProgram();

      expect(screen.getByTestId("program-title")).toHaveTextContent(
        "Test Program"
      );
      expect(screen.getByTestId("program-desc")).toHaveTextContent(
        "This is a test program description that should be displayed in the component."
      );
      expect(screen.getByTestId("stan-image")).toHaveAttribute(
        "src",
        "https://example.com/test-image.jpg"
      );
      expect(screen.getByTestId("stan-image")).toHaveAttribute(
        "alt",
        "Test Program"
      );
    });

    it("displays loading state when status is loading", () => {
      renderProgram({ status: "loading" });

      expect(screen.getByTestId("program-image")).toHaveStyle({
        backgroundColor: "var(--colour-white-20)",
      });
      expect(screen.getByTestId("program-title")).toHaveStyle({
        backgroundColor: "var(--colour-white-20)",
      });
      expect(screen.getByTestId("program-desc")).toHaveStyle({
        backgroundColor: "var(--colour-white-20)",
      });
    });

    it("displays error state when status is failed", () => {
      renderProgram({ status: "failed" });

      expect(screen.getByTestId("program-error")).toHaveTextContent(
        "An unknown error occurred. please try again later"
      );
    });

    it("uses selectedProgram from Redux state when available", () => {
      const selectedProgram = {
        ...mockProgram,
        title: "Selected Program",
        description: "This is the selected program",
      };

      renderProgram({ selectedProgram });

      expect(screen.getByTestId("program-title")).toHaveTextContent(
        "Selected Program"
      );
      expect(screen.getByTestId("program-desc")).toHaveTextContent(
        "This is the selected program"
      );
    });

    it("falls back to program by ID when selectedProgram is not available", () => {
      renderProgram({ selectedProgram: null });

      expect(screen.getByTestId("program-title")).toHaveTextContent(
        "Test Program"
      );
      expect(screen.getByTestId("program-desc")).toHaveTextContent(
        "This is a test program description that should be displayed in the component."
      );
    });
  });

  describe("Redux Integration", () => {
    it("dispatches setSelectedProgram when program is found", async () => {
      const store = createTestStore();
      const dispatchSpy = jest.spyOn(store, "dispatch");

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/program/123"]}>
            <Routes>
              <Route path="/program/:id" element={<Program />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          setSelectedProgram(mockProgram)
        );
      });
    });

    it("dispatches fetchPrograms when programs are not loaded", () => {
      const store = createTestStore({
        programs: { byIds: {}, ids: [] },
        status: "idle",
      });
      const dispatchSpy = jest.spyOn(store, "dispatch");

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/program/123"]}>
            <Routes>
              <Route path="/program/:id" element={<Program />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Navigation", () => {
    it("navigates to home when backspace is pressed", async () => {
      let backspaceCallback: (() => void) | undefined;
      mockUseBackspace.mockImplementation((callback) => {
        backspaceCallback = callback;
      });

      renderProgram();

      act(() => {
        if (backspaceCallback) {
          backspaceCallback();
        }
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("URL Parameters", () => {
    it("uses program ID from URL parameters", () => {
      const customProgram = {
        ...mockProgram,
        id: 456,
        title: "Custom Program",
      };

      const store = createTestStore({
        programs: {
          byIds: {
            "456": customProgram,
          },
          ids: ["456"],
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/program/456"]}>
            <Routes>
              <Route path="/program/:id" element={<Program />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId("program-title")).toHaveTextContent(
        "Custom Program"
      );
    });
  });
});
