import React from 'react';
import styled from 'styled-components';

const ProgramContainer = styled.div`
  color: white;
  padding: 2rem;
`;

const ProgramTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ProgramDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Program: React.FC = () => {
  return (
    <ProgramContainer>
      <ProgramTitle>Program Details</ProgramTitle>
      <ProgramDescription>
        Explore our featured programs and discover your next favorite show.
        From blockbuster movies to award-winning TV series, we have it all.
      </ProgramDescription>
    </ProgramContainer>
  );
};

export default Program; 