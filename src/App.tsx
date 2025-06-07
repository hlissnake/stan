import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Program from "./pages/Program";
import "./styles.css";

const GlobalStyle = createGlobalStyle`

  @font-face {
    font-family: Garet;
    font-weight: 400;
    src: url('/fonts/garet-regular.woff2') format('woff2');
  }

  @font-face {
    font-family: Garet;
    font-weight: 500;
    src: url('/fonts/garet-medium.woff2') format('woff2');
  }

  @font-face {
    font-family: Garet;
    font-weight: 700;
    src: url('/fonts/garet-bold.woff2') format('woff2');
  }

  @font-face {
    font-family: Garet;
    font-weight: 800;
    src: url('/fonts/garet-extra-bold.woff2') format('woff2');
  }
    
  :root {
    --entry-gutter-x: 0.5rem;
    --entry-gutter-y: 0.5rem;
    --entry-count-grid: 5;
    --layout-gutter: 2rem;
    --component-margin: 2rem;
    --background-color: #141414;
    --colour-white-20: hsla(0, 0%, 100%, .2);
    --font-family: "Garet", sans-serif;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  font: 400 1rem var(--font-family);
`;

const MainContent = styled.main`
  margin-top: 6rem;
  flex: 1;
  color: #fff;
  padding-left: var(--layout-gutter);
  padding-right: var(--layout-gutter);
`;

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/program" element={<Program />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App;
