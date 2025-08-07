import React from "react";
import styled, { keyframes } from "styled-components";

const loadingAnimation = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const SkeletonContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${loadingAnimation} 1.5s infinite;
`;

const SkeletonContent = styled.div`
  padding: 15px;
  flex-grow: 1;
`;

const SkeletonBlock = styled.div`
  height: ${(props) => props.height || "1.2em"};
  width: ${(props) => props.width || "100%"};
  border-radius: 4px;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${loadingAnimation} 1.5s infinite;
`;

const ItemSkeleton = () => {
  return (
    <SkeletonContainer>
      <SkeletonImage />
      <SkeletonContent>
        <SkeletonBlock width="80%" />
        <SkeletonBlock width="60%" />
        <SkeletonBlock width="40%" height="1em" />
      </SkeletonContent>
    </SkeletonContainer>
  );
};

export default ItemSkeleton;
