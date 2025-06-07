import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  color: white;
  padding: 2rem;
`;

const HomeTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const HomeDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <HomeTitle>Welcome to Stan</HomeTitle>
      <HomeDescription>
        Your ultimate destination for streaming movies and TV shows.
        Discover our extensive collection of entertainment content.
      </HomeDescription>
    </HomeContainer>
  );
};

export default Home; 