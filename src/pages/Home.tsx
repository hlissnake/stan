import React, { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import Carousel from "../components/Carousel/Carousel";
import StanImage from "../components/StanImage/StanImage";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchPrograms,
  setSelectedProgram,
} from "../store/slices/programsSlice";

const HomeContainer = styled.div`
  color: white;
  position: relative;
`;

const ProgramOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background-color);
  z-index: 1;
`;

// const StyledImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { programs, selectedProgram, status } = useAppSelector(
    (state) => state.programs
  );

  const carouselData = useMemo(() => {
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
    [selectedProgram, programs.ids]
  );

  const handleEnter = useCallback(
    (index: number) => {
      if (index >= 0) {
        const program = carouselData[index];
        if (program) {
          dispatch(setSelectedProgram(program));
          navigate(`program/${program.id}`);
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

  const isProgramRoute = location.pathname !== "/";

  return (
    <HomeContainer>
      <Carousel
        data={carouselData}
        onEnter={handleEnter}
        isLoading={status === "loading"}
        initialSelected={selectedProgramIndex}
      >
        {(program) => (
          <Link to={`program/${program.id}`} style={{ width: "100%" }}>
            <StanImage src={program.image} alt={`${program.title} poster`} />
            {/* <StyledImage src={program.image} alt={`${program.title} poster`} loading="lazy" /> */}
          </Link>
        )}
      </Carousel>
      {isProgramRoute && (
        <ProgramOverlay>
          <Outlet />
        </ProgramOverlay>
      )}
    </HomeContainer>
  );
};

export default Home;
