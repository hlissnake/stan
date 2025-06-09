import React from "react";
import { render, screen } from "@testing-library/react";
import Carousel from "../Carousel";
import useScreenSize from "../../../hooks/useScreenSize";
import useKeyboardNavigation from "../../../hooks/useKeyboardNavigation";

// Mock the custom hooks
jest.mock("../../../hooks/useScreenSize");
jest.mock("../../../hooks/useKeyboardNavigation");

const mockUseScreenSize = useScreenSize as jest.MockedFunction<
  typeof useScreenSize
>;
const mockUseKeyboardNavigation = useKeyboardNavigation as jest.MockedFunction<
  typeof useKeyboardNavigation
>;

// Test data
const mockData = [
  { id: 1, title: "Program 1" },
  { id: 2, title: "Program 2" },
  { id: 3, title: "Program 3" },
  { id: 4, title: "Program 4" },
  { id: 5, title: "Program 5" },
  { id: 6, title: "Program 6" },
  { id: 7, title: "Program 7" },
  { id: 8, title: "Program 8" },
  { id: 9, title: "Program 9" },
  { id: 10, title: "Program 10" },
];

const renderCarousel = (props = {}) => {
  const defaultProps = {
    data: mockData,
    onEnter: jest.fn(),
    children: (item: (typeof mockData)[0]) => (
      <div data-testid={`carousel-content-${item.id}`}>{item.title}</div>
    ),
    ...props,
  };

  return render(<Carousel {...defaultProps} />);
};

describe("Carousel", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Default mock implementations
    mockUseScreenSize.mockReturnValue("MD"); // default 5 items per page
    mockUseKeyboardNavigation.mockReturnValue(0); // Start at first item
  });

  it("renders loading state correctly", () => {
    renderCarousel({ isLoading: true });

    const container = screen.getByTestId("carousel-container");
    expect(container).toBeInTheDocument();

    const track = screen.getByTestId("carousel-track");
    expect(track).toBeInTheDocument();

    const slides = screen.getAllByTestId(/carousel-slide-\d+/);
    expect(slides).toHaveLength(6); // slidePageSize + 1 for MD screen

    slides.forEach((slide) => {
      expect(slide).toHaveStyle({
        backgroundColor: "var(--colour-white-20)",
        opacity: "1",
      });
    });
  });

  it("renders all items in the carousel", () => {
    renderCarousel();

    mockData.forEach((item) => {
      expect(
        screen.getByTestId(`carousel-content-${item.id}`)
      ).toBeInTheDocument();
    });
  });

  describe("Track Movement", () => {
    it("moves track when selected index changes", () => {
      const { rerender } = renderCarousel();
      const track = screen.getByTestId("carousel-track");

      // Initial position (0%)
      expect(track).toHaveStyle({ transform: "translateX(-0%)" });

      // Move to next page (8 items)
      mockUseKeyboardNavigation.mockReturnValue(8);
      rerender(
        <Carousel
          data={mockData}
          onEnter={jest.fn()}
          children={(item) => (
            <div data-testid={`carousel-content-${item.id}`}>{item.title}</div>
          )}
        />
      );

      // Should move to next page (100%)
      expect(track).toHaveStyle({ transform: "translateX(-100%)" });
    });

    it("handles last page with partial items correctly", () => {
      // Set screen size to show 8 items per page
      mockUseScreenSize.mockReturnValue("XXL");

      const { rerender } = renderCarousel();
      const track = screen.getByTestId("carousel-track");

      // Move to last page
      mockUseKeyboardNavigation.mockReturnValue(8);
      rerender(
        <Carousel
          data={mockData}
          onEnter={jest.fn()}
          children={(item) => (
            <div data-testid={`carousel-content-${item.id}`}>{item.title}</div>
          )}
        />
      );

      // Should move to next page (100%)
      expect(track).toHaveStyle({ transform: "translateX(-25%)" });
    });
  });

  describe("Slide Selection", () => {
    it("highlights selected slide", () => {
      const { rerender } = renderCarousel();

      // Initial selection (index 0)
      let selectedSlide = screen.getByTestId("carousel-slide-1");
      expect(selectedSlide).toHaveClass("slide-selected");

      // Change selection to index 5
      mockUseKeyboardNavigation.mockReturnValue(5);
      rerender(
        <Carousel
          data={mockData}
          onEnter={jest.fn()}
          children={(item) => (
            <div data-testid={`carousel-content-${item.id}`}>{item.title}</div>
          )}
        />
      );

      selectedSlide = screen.getByTestId("carousel-slide-6");
      expect(selectedSlide).toHaveClass("slide-selected");
    });
  });

  describe("Screen Size Adaptation", () => {
    it("adjusts items per page based on screen size", () => {
      // Test XXL screen (8 items)
      mockUseScreenSize.mockReturnValue("XXL");
      const { rerender } = renderCarousel();
      let track = screen.getByTestId("carousel-track");
      expect(track.children).toHaveLength(mockData.length);

      // Test MD screen (5 items)
      mockUseScreenSize.mockReturnValue("MD");
      rerender(
        <Carousel
          data={mockData}
          onEnter={jest.fn()}
          children={(item) => (
            <div data-testid={`carousel-content-${item.id}`}>{item.title}</div>
          )}
        />
      );
      track = screen.getByTestId("carousel-track");
      expect(track.children).toHaveLength(mockData.length);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty data array", () => {
      renderCarousel({ data: [] });
      const track = screen.getByTestId("carousel-track");
      expect(track.children).toHaveLength(0);
    });

    it("handles single item", () => {
      renderCarousel({ data: [mockData[0]] });
      const track = screen.getByTestId("carousel-track");
      expect(track.children).toHaveLength(1);
      expect(screen.getByTestId("carousel-content-1")).toBeInTheDocument();
    });
  });
});
