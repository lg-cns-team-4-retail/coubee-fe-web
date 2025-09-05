import React from "react";
import styled from "styled-components";
import Text from "../../../components/common/Text";

const STEPS = [
  { id: "PAID", label: "결제 완료" },
  { id: "PREPARING", label: "상품 준비중" },
  { id: "PREPARED", label: "픽업 대기중" },
  { id: "RECEIVED", label: "픽업 완료" },
];

const TrackerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 3rem 1rem;

  @media (max-width: 768px) {
    margin: 1.5rem 0.5rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background-color: #e0e0e0;
    transform: translateY(-50%);
  }
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  height: 4px;
  background-color: ${({ theme }) => theme.primary};
  width: ${({ progress }) => progress}%;
  transform: translateY(-50%);
  transition: width 0.4s ease;
`;

const Step = styled.div`
  position: relative;
  text-align: center;
`;

const StepCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ active, theme }) =>
    active ? theme.primary : "#e0e0e0"};
  border: 4px solid white;
  z-index: 1;
  transition: background-color 0.4s ease;
`;

const StepLabel = styled(Text)`
  position: absolute;
  top: 150%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.9em;
  color: ${({ active }) => (active ? "black" : "#888")};
`;

const ProcessTracker = ({ currentStatus, history }) => {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStatus);
  const progress =
    currentIndex >= 0 ? (currentIndex / (STEPS.length - 1)) * 100 : 0;

  return (
    <TrackerContainer>
      <ProgressLine progress={progress} />
      {STEPS.map((step, index) => (
        <Step key={step.id}>
          <StepCircle active={index <= currentIndex} />
          <StepLabel active={index <= currentIndex}>{step.label}</StepLabel>
        </Step>
      ))}
    </TrackerContainer>
  );
};

export default ProcessTracker;
