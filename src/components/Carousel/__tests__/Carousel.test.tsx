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

  it("renders loading skeleton correctly in 720P", () => {
    renderCarousel({ isLoading: true });

    const container = screen.getByTestId("carousel-container");
    expect(container).toBeInTheDocument();

    const track = screen.getByTestId("carousel-track");
    expect(track).toBeInTheDocument();

    let slides = screen.getAllByTestId(/carousel-slide-\d+/);
    expect(slides).toHaveLength(6); // slidePageSize + 1 for MD screen

    slides.forEach((slide) => {
      expect(slide).toHaveStyle({
        backgroundColor: "var(--colour-white-20)",
        opacity: "1",
      });
    });
  });

  it("renders loading skeleton correctly in 1080P", () => {
    mockUseScreenSize.mockReturnValue("XXL");
    renderCarousel({ isLoading: true });

    let slides = screen.getAllByTestId(/carousel-slide-\d+/);
    expect(slides).toHaveLength(9); // slidePageSize + 1 for MD screen

    slides.forEach((slide) => {
      expect(slide).toHaveStyle({
        backgroundColor: "var(--colour-white-20)",
        opacity: "1",
      });
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

    it("render elements only inside viewport when moving track to next slide", () => {
      const { rerender } = renderCarousel();
      // Only render 1 - 6 items
      let insideItems = screen.getAllByTestId(/carousel-content-(1|2|3|4|5|6)/);
      expect(insideItems).toHaveLength(6);
      // Should not render 7 - 10 items
      let outsideItems = screen.queryAllByTestId(/carousel-content-(7|8|9|10)/);
      expect(outsideItems).toHaveLength(0);

      // Move to last page
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

      // Only render 5 - 10 items
      insideItems = screen.getAllByTestId(/carousel-content-(5|6|7|8|9|10)/);
      expect(insideItems).toHaveLength(6);
      // Should not render 1 - 4 items
      outsideItems = screen.queryAllByTestId(/carousel-content-(1|2|3|4)^/);
      expect(outsideItems).toHaveLength(0);
    });
  });

  describe("Keyboard Selection", () => {
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

  describe("Responsive Screen Size Adaptation", () => {
    it("renders items only visible in the screen viewport", () => {
      const { rerender } = renderCarousel();

      // Test MD screen (6 items visible)
      let slides = screen.getAllByTestId(/carousel-content-\d+/);
      expect(slides).toHaveLength(6);

      // Test XXL screen (9 items visible)
      mockUseScreenSize.mockReturnValue("XXL");
      rerender(
        <Carousel
          data={mockData}
          onEnter={jest.fn()}
          children={(item) => (
            <div data-testid={`carousel-content-${item.id}`}>{item.title}</div>
          )}
        />
      );
      slides = screen.getAllByTestId(/carousel-content-\d+/);
      expect(slides).toHaveLength(9);
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
