import { Suspense, lazy } from "react";
import styled from "styled-components";
import Header from "./components/Banner/Header";
import ProfComponent from "./components/Banner/ProfComponent";
import Clients from "./components/Clients/Clients";
import Footer from "./components/Footer/Footer";
import Projects from "./components/Projects/Projects";
import Services from "./components/Service/Services";
import ParticleField from "./components/ParticleField/ParticleField";
import Hero3DBoundary from "./components/Hero3D/Hero3DBoundary";
import useCanRender3D from "./hooks/useCanRender3D";

const Hero3D = lazy(() => import("./components/Hero3D/Hero3D"));

function App() {
  const canRender3D = useCanRender3D();

  return (
    <Container>
      <Ambient>
        <ParticleField variant="ambient" />
      </Ambient>
      <Content>
        <Header />
        {canRender3D ? (
          <Hero3DBoundary>
            <Suspense fallback={<ProfComponent />}>
              <Hero3D />
            </Suspense>
          </Hero3DBoundary>
        ) : (
          <ProfComponent />
        )}
        <Services />
        <Projects />
        <Clients />
        <Footer />
      </Content>
    </Container>
  );
}

export default App;

const Container = styled.div`
  position: relative;
  background-color: var(--color-void);
`;

const Ambient = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  @media (max-width: 640px) {
    display: none;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;
