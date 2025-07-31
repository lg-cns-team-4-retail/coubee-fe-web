import React from "react";
import styled from "styled-components";
import coubeeIcon from "../../../assets/coubee.svg";

const ProgressBarContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1024px;
  width: 100%;
  height: 30px;
  margin-bottom: 2.5rem;
  @media (max-width: 1023px) {
    max-width: 80vw;
  }
`;

const ProgressTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
  background-color: #8e6559;
  border-radius: 2px;
  width: ${({ progress }) => progress}%;
  transition: width 0.4s ease;
`;

const StepNodeWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  &:hover {
    cursor: pointer;
  }
`;

const StepNodeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StepNode = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ active }) => (active ? "#8E6559" : "#e0e0e0")};
  border: 3px solid white;
  border-radius: 50%;
  z-index: 1;
  transition: background-color 0.4s ease;
  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

const StepLabel = styled.span`
  position: absolute;
  top: 150%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: ${({ active }) => (active ? "black" : "#aaa")};
  white-space: nowrap;
`;

const ProgressIcon = styled.img`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  z-index: 2;
  display: ${({ show }) => (show ? "block" : "none")};
  transition: left 0.4s ease;
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    left: 77%;
    top: -15px;
  }
  &:hover {
    width: 53px;
    height: 53px;
  }
`;
const ProgressBar = ({ currentStep, totalSteps, stepTitles, onStepClick }) => {
  const progress =
    totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <>
      <ProgressBarContainer>
        <ProgressTrack />
        <ProgressFill progress={progress} />
        <StepNodeWrapper>
          {stepTitles.map((title, index) => (
            <StepNodeContainer
              key={index}
              onClick={() => onStepClick && onStepClick(index + 1)}
            >
              <ProgressIcon
                src={coubeeIcon}
                alt="current step"
                show={index + 1 === currentStep}
              />
              <StepNode active={index + 1 <= currentStep} />
              <StepLabel active={index + 1 <= currentStep}>{title}</StepLabel>
            </StepNodeContainer>
          ))}
        </StepNodeWrapper>
      </ProgressBarContainer>
    </>
  );
};

export default ProgressBar;
