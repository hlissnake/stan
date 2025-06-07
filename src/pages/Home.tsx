import React from "react";
import styled from "styled-components";
import Carousel from "../components/Carousel/Carousel";
import { Link } from "react-router-dom";

const HomeContainer = styled.div`
  color: white;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
`;

const Home: React.FC = () => {
  const slides = [
    {
      id: 1,
      content:
        "https://streamcoimg-a.akamaihd.net/000/672/98/67298-PosterArt-2039396c9e27d6271c96776414d6a38c.jpg?resize=512px:*&quality=75&preferredFormat=image/jpeg",
    },
    {
      id: 2,
      content:
        "https://streamcoimg-a.akamaihd.net/000/672/98/67298-PosterArt-2039396c9e27d6271c96776414d6a38c.jpg?resize=512px:*&quality=75&preferredFormat=image/jpeg",
    },
    {
      id: 3,
      content:
        "https://streamcoimg-a.akamaihd.net/000/672/98/67298-PosterArt-2039396c9e27d6271c96776414d6a38c.jpg?resize=512px:*&quality=75&preferredFormat=image/jpeg",
    },
    {
      id: 4,
      content:
        "https://streamcoimg-a.akamaihd.net/000/672/98/67298-PosterArt-2039396c9e27d6271c96776414d6a38c.jpg?resize=512px:*&quality=75&preferredFormat=image/jpeg",
    },
    {
      id: 5,
      content:
        "https://streamcoimg-a.akamaihd.net/000/672/98/67298-PosterArt-2039396c9e27d6271c96776414d6a38c.jpg?resize=512px:*&quality=75&preferredFormat=image/jpeg",
    },
    {
      id: 6,
      content:
        "https://streamcoimg-a.akamaihd.net/000/672/98/67298-PosterArt-2039396c9e27d6271c96776414d6a38c.jpg?resize=512px:*&quality=75&preferredFormat=image/jpeg",
    },
  ];

  return (
    <HomeContainer>
      <Carousel slides={slides}>
        {(slide, index) => (
          <Link to={`/program/${slide.id}`}>
            <CarouselImage src={slide.content} />
          </Link>
        )}
      </Carousel>
    </HomeContainer>
  );
};

export default Home;
