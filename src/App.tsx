import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Header from "./components/Header/Header";
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
    --layout-gutter: 2rem;
    --component-margin: 2rem;
    --colour-charcoal: #141414;
    --font-family: "Garet", sans-serif;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--colour-charcoal);
  font: 400 1rem var(--font-family);
`;

const MainContent = styled.main`
  margin-top: 64px;
  padding: 2rem;
  flex: 1;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
  }
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <MainContent>
          <ContentWrapper></ContentWrapper>
        </MainContent>
      </AppContainer>
    </>
  );
};

export default App;
