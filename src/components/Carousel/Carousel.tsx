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

const CarouselSlide = styled.div<{
  isSelected?: boolean;
  isLoading?: boolean;
  isInView?: boolean;
}>`
  flex: 0 0 auto;
  width: calc(100% / var(--entry-count-grid) - var(--entry-gutter-x));
  aspect-ratio: 228 / 342;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  ${(props) =>
    props.isLoading
      ? `background-color: var(--colour-white-20); opacity:1`
      : ""};

  opacity: ${(props) => (props.isInView ? 1 : 0)};
  transition: opacity 0.4s ease-in-out 0.2s;

  &::after {
    content: "";
    position: absolute;
    inset: -4px;
    border: 3px solid var(--colour-stan-blue);
    border-radius: 4px;
    opacity: ${(props) => (props.isSelected ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

interface CarouselProps<T> {
  data: T[];
  isLoading?: boolean;
  initialSlide?: number;
  onEnter: (index: number) => void;
  children: (slide: T, index: number) => React.ReactNode;
}

const Carousel = <T extends { id: number }>({
  data,
  isLoading,
  onEnter,
  children: onRender,
}: CarouselProps<T>) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [translateX, setTranslateX] = React.useState(0);
  const [startVisible, setStartVisible] = React.useState(0);
  const [endVisible, setEndVisible] = React.useState(0);

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
    if (data.length == 0) return;
    if ((currentSlide + 1) * slidePageSize > data.length) {
      setTranslateX(
        ((data.length - currentSlide * slidePageSize) * 100) / slidePageSize +
          (currentSlide - 1) * 100
      );
    } else {
      setTranslateX(currentSlide * 100);
    }
    // Calculating the visible item range in side the viewport screen
    setStartVisible(currentSlide * slidePageSize - 1);
    setEndVisible((currentSlide + 1) * slidePageSize + 1);
  }, [currentSlide, slidePageSize, data.length]);

  if (isLoading) {
    const dummyData = Array(slidePageSize + 1).fill(0);
    return (
      <CarouselContainer>
        <CarouselTrack>
          {dummyData.map((_, index) => (
            <CarouselSlide key={index} isLoading isInView />
          ))}
        </CarouselTrack>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer>
      <CarouselTrack style={{ transform: `translateX(-${translateX}%)` }}>
        {data.map((slide, index) => {
          // Use intersaction observer solution instead of calculation, will discuss trade-off later
          const isInView = true; //index >= startVisible && index <= endVisible;
          return (
            <CarouselSlide
              key={slide.id}
              isSelected={selectedIndex === index}
              isInView={isInView}
            >
              {isInView && onRender(slide, index)}
            </CarouselSlide>
          );
        })}
      </CarouselTrack>
    </CarouselContainer>
  );
};

export default Carousel;
