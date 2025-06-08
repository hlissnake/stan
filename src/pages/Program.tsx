import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import useBackspace from "../hooks/useBackspace";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPrograms } from "../store/slices/programsSlice";

const ProgramContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: var(--layout-gutter);
  color: white;
  padding: 0 var(--layout-gutter);
`;

const ProgramImage = styled.img`
  width: 240px;
  aspect-ratio: 228 / 342;
  object-fit: cover;
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { programs, status } = useAppSelector((state) => state.programs);

  const program = id ? programs.byIds[id] : null;

  useEffect(() => {
    if (programs.ids.length === 0 && status === "idle") {
      dispatch(fetchPrograms());
    }
  }, [programs.ids, status]);

  useBackspace(() => {
    navigate("/");
  });

  return (
    <ProgramContainer>
      <ProgramImage src={program?.image} />
      <div>
        <ProgramTitle>Program {id}</ProgramTitle>
        <ProgramDescription>{program?.description}</ProgramDescription>
      </div>
    </ProgramContainer>
  );
};

export default Program;
