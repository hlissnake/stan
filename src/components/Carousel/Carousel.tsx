import React from "react";
import styled from "styled-components";

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: var(--entry-gutter-x);
  width: auto;
  height: 100%;
  transition: transform 0.5s ease-in-out;
`;

const CarouselSlide = styled.div`
  flex: 0 0 auto;
  width: calc(100% / var(--entry-count-grid) - var(--entry-gutter-x));
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

interface CarouselProps<T> {
  slides: T[];
  children: (slide: T, index: number) => React.ReactNode;
}

const Carousel = <T extends { id: number }>({
  slides,
  children: onRender,
}: CarouselProps<T>) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  return (
    <CarouselContainer>
      <CarouselTrack
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <CarouselSlide key={slide.id}>{onRender(slide, index)}</CarouselSlide>
        ))}
      </CarouselTrack>
    </CarouselContainer>
  );
};

export default Carousel;
