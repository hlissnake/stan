import React, { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import Carousel from "../components/Carousel/Carousel";
import StanImage from "../components/StanImage/StanImage";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchPrograms,
  setSelectedProgram,
} from "../store/slices/programsSlice";

const HomeContainer = styled.div`
  color: white;
`;

// const StyledImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { programs, selectedProgram, status } = useAppSelector(
    (state) => state.programs
  );

  const carouselData = React.useMemo(() => {
    return programs.ids.map((id) => {
      const program = programs.byIds[id];
      return program;
    });
  }, [programs]);

  const selectedProgramIndex = useMemo(
    () =>
      selectedProgram
        ? programs.ids.findIndex((id) => id === selectedProgram.id.toString())
        : 0,
    [selectedProgram]
  );

  const handleEnter = useCallback(
    (index: number) => {
      if (index >= 0) {
        const program = carouselData[index];
        if (program) {
          dispatch(setSelectedProgram(program));
          navigate(`/program/${program.id}`);
        }
      }
    },
    [navigate, carouselData, dispatch]
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPrograms());
    }
  }, [status, dispatch]);

  if (status === "failed") {
    return (
      <div data-testid="home-error">
        An unknown error occurred. please try again later
      </div>
    );
  }

  return (
    <HomeContainer>
      <Carousel
        data={carouselData}
        onEnter={handleEnter}
        isLoading={status === "loading"}
        initialSelected={selectedProgramIndex}
      >
        {(program) => (
          <Link to={`/program/${program.id}`} style={{ width: "100%" }}>
            <StanImage src={program.image} alt={`${program.title} poster`} />
            {/* <StyledImage src={program.image} alt={`${program.title} poster`} loading="lazy" /> */}
          </Link>
        )}
      </Carousel>
    </HomeContainer>
  );
};

export default Home;
