import React, { useEffect } from "react";
import styled from "styled-components";

import useKeyboardNavigation from "../../hooks/useKeyboardNavigation";

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding-left: var(--layout-gutter);
  padding-right: var(--layout-gutter);
  overflow: hidden;
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: var(--entry-gutter-x);
  width: auto;
  height: 100%;
  transition: transform 0.5s ease-in-out;
`;

const CarouselSlide = styled.div<{ isSelected?: boolean }>`
  flex: 0 0 auto;
  width: calc(100% / var(--entry-count-grid) - var(--entry-gutter-x));
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  ${(props) =>
    props.isSelected
      ? "border: 2px solid var(--colour-stan-blue); border-radius: 4px;"
      : ""}
`;

interface CarouselProps<T> {
  slides: T[];
  onEnter: (index: number) => void;
  children: (slide: T, index: number) => React.ReactNode;
}

const Carousel = <T extends { id: number }>({
  slides,
  onEnter,
  children: onRender,
}: CarouselProps<T>) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const selectedIndex = useKeyboardNavigation(onEnter, slides.length);

  useEffect(() => {
    setCurrentSlide((prev) => {
      const index = selectedIndex - prev * 5;
      if (index >= 5) {
        return prev + 1;
      } else if (index < 0) {
        return prev - 1;
      }
      return prev;
    });
  }, [selectedIndex]);

  return (
    <CarouselContainer>
      <CarouselTrack
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <CarouselSlide key={slide.id} isSelected={selectedIndex === index}>
            {onRender(slide, index)}
          </CarouselSlide>
        ))}
      </CarouselTrack>
    </CarouselContainer>
  );
};

export default Carousel;
