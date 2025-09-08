import React from "react";
import styled, { keyframes } from "styled-components";

const loadingAnimation = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const SkeletonContainer = styled.div`
  width: 100%;
  padding: 1rem;
`;

const SkeletonBlock = styled.div`
  height: ${(props) => props.height || "1em"};
  width: ${(props) => props.width || "100%"};
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${loadingAnimation} 1.5s infinite;
  margin: ${(props) => props.margin || "0"};
`;

const ChartSkeleton = () => (
  <SkeletonContainer>
    <SkeletonBlock width="40%" height="2rem" margin="0 0 1rem 0" />
    <SkeletonBlock width="150px" height="2rem" margin="0 0 2rem 0" />
    <SkeletonBlock height="300px" />
  </SkeletonContainer>
);

export default ChartSkeleton;
