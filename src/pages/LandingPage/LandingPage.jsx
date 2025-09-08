import React from "react";
import styled from "styled-components";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CtaSection from "./components/CtaSection";

const LandingPageContainer = styled.div`
  background-color: ${({ theme }) => theme.bg_page};
  color: ${({ theme }) => theme.text};
`;

const LandingPage = () => {
  return (
    <LandingPageContainer>
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </LandingPageContainer>
  );
};

export default LandingPage;
