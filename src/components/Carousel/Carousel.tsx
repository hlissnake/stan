import React, { useEffect, useMemo } from "react";
import styled from "styled-components";

import useKeyboardNavigation from "../../hooks/useKeyboardNavigation";
import useScreenSize from "../../hooks/useScreenSize";

const CarouselContainer = styled.div`
  position: relative;
  height: auto;
  padding-left: var(--layout-gutter);
  padding-right: var(--layout-gutter);
  overflow: hidden;

  // @media (min-width: 1920px) {
  //   overflow: visible; // TODO: will trigger window horizontal scrolling but will be OK in TV screen
  // }
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: var(--entry-gutter-x);
  width: auto;
  height: 100%;
  margin: var(--entry-gutter-x) 0;
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
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: -4px -4px 1px -4px;
    border: 3px solid var(--colour-stan-blue);
    border-radius: 4px;
    opacity: ${(props) => (props.isSelected ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

interface CarouselProps<T> {
  data: T[];
  initialSlide?: number;
  onEnter: (index: number) => void;
  children: (slide: T, index: number) => React.ReactNode;
}

const Carousel = <T extends { id: number }>({
  data,
  onEnter,
  children: onRender,
}: CarouselProps<T>) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [translateX, setTranslateX] = React.useState(0);

  const screenSize = useScreenSize();

  const slidePageSize = useMemo(() => {
    switch (screenSize) {
      case "XXL":
        return 8; // 1080p
      default:
        return 5;
    }
  }, [screenSize]);

  const selectedIndex = useKeyboardNavigation(onEnter, data.length);

  useEffect(() => {
    setCurrentSlide((prev) => {
      const index = selectedIndex - prev * slidePageSize;
      if (index >= slidePageSize) {
        return prev + 1;
      } else if (index < 0) {
        return prev - 1;
      }
      return prev;
    });
  }, [selectedIndex, slidePageSize]);

  useEffect(() => {
    if ((currentSlide + 1) * slidePageSize > data.length) {
      setTranslateX(
        ((data.length - currentSlide * slidePageSize) * 100) / slidePageSize +
          (currentSlide - 1) * 100
      );
    } else {
      setTranslateX(currentSlide * 100);
    }
  }, [currentSlide, slidePageSize, data.length]);

  return (
    <CarouselContainer>
      <CarouselTrack style={{ transform: `translateX(-${translateX}%)` }}>
        {data.map((slide, index) => (
          <CarouselSlide key={slide.id} isSelected={selectedIndex === index}>
            {onRender(slide, index)}
          </CarouselSlide>
        ))}
      </CarouselTrack>
    </CarouselContainer>
  );
};

export default Carousel;
