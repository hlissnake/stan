import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import useBackspace from "../hooks/useBackspace";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchPrograms,
  setSelectedProgram,
} from "../store/slices/programsSlice";
import StanImage from "../components/StanImage/StanImage";

const ProgramContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: var(--layout-gutter);
  color: white;
  padding: 0 var(--layout-gutter);
  margin: var(--entry-gutter-x) 0;
  height: 100%;
`;

const ProgramImage = styled.div<{ $isLoading?: boolean }>`
  width: calc(100% / var(--entry-count-grid) - var(--entry-gutter-x));
  aspect-ratio: 228 / 342;

  ${(props) =>
    props.$isLoading
      ? `background-color: var(--colour-white-20); opacity:1`
      : ""};
`;

const ProgramTitle = styled.h1<{ $isLoading?: boolean }>`
  font-size: 2.5rem;
  margin-bottom: 1rem;

  ${(props) =>
    props.$isLoading
      ? `
      background-color: var(--colour-white-20);
      width: 300px;
      height: 50px;
      `
      : ""};
`;

const ProgramDescription = styled.p<{ $isLoading?: boolean }>`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  width: 800px;

  ${(props) =>
    props.$isLoading
      ? `
    background-color: var(--colour-white-20);
    height: 200px;
    `
      : ""};
`;

const Program: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { programs, selectedProgram, status } = useAppSelector(
    (state) => state.programs
  );

  const program = selectedProgram || (id ? programs.byIds[id] : null);
  const isLoading = status === "loading";

  useEffect(() => {
    if (programs.ids.length === 0 && status === "idle") {
      dispatch(fetchPrograms());
    }
  }, [programs.ids, status, dispatch]);

  useEffect(() => {
    if (program) {
      dispatch(setSelectedProgram(program));
    }
  }, [program, dispatch]);

  useBackspace(() => {
    navigate("/");
  });

  if (status === "failed") {
    return (
      <div data-testid="program-error">
        An unknown error occurred. please try again later
      </div>
    );
  }

  return (
    <ProgramContainer>
      <ProgramImage $isLoading={isLoading} data-testid="program-image">
        {program?.image && (
          <StanImage src={program.image} alt={program.title} />
        )}
      </ProgramImage>
      <div>
        <ProgramTitle $isLoading={isLoading} data-testid="program-title">
          {program?.title}
        </ProgramTitle>
        <ProgramDescription $isLoading={isLoading} data-testid="program-desc">
          {program?.description}
        </ProgramDescription>
      </div>
    </ProgramContainer>
  );
};

export default Program;
