import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import Carousel from "../components/Carousel/Carousel";
import StanImage from "../components/StanImage/StanImage";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPrograms } from "../store/slices/programsSlice";

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
  const { programs, status } = useAppSelector((state) => state.programs);

  const carouselData = React.useMemo(() => {
    return programs.ids.map((id) => {
      const program = programs.byIds[id];
      return program;
    });
  }, [programs]);

  const handleEnter = useCallback(
    (index: number) => {
      if (index >= 0) {
        const programId = carouselData[index]?.id;
        if (programId) {
          navigate(`/program/${programId}`);
        }
      }
    },
    [navigate, carouselData]
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
