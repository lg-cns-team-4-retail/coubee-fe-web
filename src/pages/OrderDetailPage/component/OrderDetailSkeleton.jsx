import React from "react";
import styled, { keyframes } from "styled-components";

const loadingAnimation = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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

const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 16px;
  border: 1px solid #eae4de;
  padding: 2rem;
`;

const OrderDetailSkeleton = () => (
  <PageContainer>
    <Card>
      <SkeletonBlock width="40%" height="1.8em" margin="0 0 1.5rem 0" />
      <SkeletonBlock width="150px" height="40px" margin="0 0 3rem 0" />
      <SkeletonBlock height="4px" />
    </Card>
    <Card>
      <SkeletonBlock width="60%" height="1.5em" />
    </Card>
    <Card>
      <SkeletonBlock width="30%" height="1.5em" margin="0 0 1.5rem 0" />
      <SkeletonBlock height="1.2em" margin="0 0 1rem 0" />
      <SkeletonBlock height="1.2em" margin="0 0 1rem 0" />
      <SkeletonBlock width="80%" height="1.2em" />
    </Card>
  </PageContainer>
);

export default OrderDetailSkeleton;
