import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Program from "./pages/Program";
import "./styles.css";
import { Provider } from "react-redux";
import { store } from "./store";

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
    --entry-count-grid: 5; /* default for 720p */
    --layout-gutter: 2rem;
    --layout-max-width: 120rem;
    --component-margin: 2rem;
    --background-color: #141414;
    --colour-stan-blue: #0072fb;
    --colour-white-20: hsla(0, 0%, 100%, .2);
    --font-family: "Garet", sans-serif;
    background-color: var(--background-color);
  }

  @media (min-width: 1920px) {
    :root {
      --entry-count-grid: 8; /* for 1080p and above */
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  font: 400 1rem var(--font-family);

  @media (min-width: 1920px) {
    width: var(--layout-max-width);
    margin: 0 auto;
  }
`;

const MainContent = styled.main`
  margin-top: 6rem;
  flex: 1;
  color: #fff;
`;

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/program/:id" element={<Program />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
