import React from "react";
import styled, { keyframes } from "styled-components";

const loadingAnimation = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const SkeletonCard = styled.div`
  background-color: white;
  border-radius: 12px;
  border: 1px solid #eae4de;
  padding: 1.5rem;
`;

const SkeletonBlock = styled.div`
  height: ${(props) => props.height || "1.2em"};
  width: ${(props) => props.width || "100%"};
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${loadingAnimation} 1.5s infinite;
  margin-bottom: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const OrderSkeleton = () => (
  <SkeletonCard>
    <Header>
      <SkeletonBlock width="40%" height="1.5em" />
      <SkeletonBlock width="20%" height="1.8em" />
    </Header>
    <SkeletonBlock width="30%" height="1.2em" />
    <SkeletonBlock width="50%" height="2em" style={{ marginTop: "1rem" }} />
  </SkeletonCard>
);

export default OrderSkeleton;
