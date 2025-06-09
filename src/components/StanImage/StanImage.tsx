import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface StanImageProps {
  src: string;
  alt: string;
}

const ImageContainer = styled.div<{ $isInView?: boolean }>`
  width: 100%;
  height: 100%;
  aspect-ratio: 228 / 342;
  position: relative;
  opacity: ${(props) => (props.$isInView ? 1 : 0)};
  transition: opacity 0.3s ease-in-out 0.1s;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StanImage: React.FC<StanImageProps> = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      {
        root: null,
        rootMargin: "100px", // Start loading when image is 50px from viewport
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
    };
  }, [isInView, src]);

  return (
    <ImageContainer
      ref={containerRef}
      data-testid={`stan-image-container`}
      $isInView={isInView}
    >
      {isInView && imageSrc && (
        <StyledImage
          src={imageSrc}
          alt={alt}
          loading="lazy"
          data-testid={`stan-image-src`}
        />
      )}
    </ImageContainer>
  );
};

export default StanImage;
