import React from "react";
import styled, { keyframes } from "styled-components";

const skeletonLoading = keyframes`
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
`;

const SkeletonContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
  min-height: calc(100vh - 64px);
`;

const SkeletonBanner = styled.div`
  height: 12rem;
  width: 100%;
  animation: ${skeletonLoading} 1s linear infinite alternate;
  @media (min-width: 768px) {
    height: 16rem;
  }
`;

const SkeletonProfileSection = styled.div`
  padding: 1rem;
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const SkeletonProfileInfo = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-top: -3rem;
  z-index: 10;
  @media (min-width: 640px) {
    margin-top: -3rem;
  }
`;

const SkeletonProfileImage = styled.div`
  width: 7rem;
  height: 7rem;
  border-radius: 9999px;
  border: 4px solid white;
  background-color: #e0e0e0;
  animation: ${skeletonLoading} 1s linear infinite alternate;
  @media (min-width: 640px) {
    width: 8rem;
    height: 8rem;
  }
`;

const SkeletonStoreInfo = styled.div`
  margin-left: 1rem;
`;

const SkeletonStoreName = styled.div`
  width: 150px;
  height: 2rem;
  border-radius: 0.25rem;
  animation: ${skeletonLoading} 1s linear infinite alternate;
  @media (min-width: 640px) {
    width: 200px;
    height: 2.5rem;
  }
`;

const SkeletonStoreBranch = styled.div`
  width: 100px;
  height: 1rem;
  margin-top: 0.5rem;
  border-radius: 0.25rem;
  animation: ${skeletonLoading} 1s linear infinite alternate;
`;

const SkeletonTabNav = styled.div`
  margin-top: 1.5rem;
`;

const SkeletonTabNavContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  @media (min-width: 640px) {
    gap: 2rem;
  }
`;

const SkeletonTabButton = styled.div`
  width: 60px;
  height: 2rem;
  border-radius: 0.25rem;
  animation: ${skeletonLoading} 1s linear infinite alternate;
`;

const SkeletonDescriptionContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
  flex-direction: column;
`;

const SkeletonTitle = styled.div`
  width: 40%;
  height: 1.5rem;
  border-radius: 0.25rem;
  animation: ${skeletonLoading} 1s linear infinite alternate;
`;

const SkeletonDescription = styled.div`
  width: 100%;
  height: 1rem;
  border-radius: 0.25rem;
  animation: ${skeletonLoading} 1s linear infinite alternate;
`;

const StoreSkeleton = () => (
  <SkeletonContainer>
    <SkeletonBanner />
    <SkeletonProfileSection>
      <SkeletonProfileInfo>
        <SkeletonProfileImage />
        <SkeletonStoreInfo>
          <SkeletonStoreName />
          <SkeletonStoreBranch />
        </SkeletonStoreInfo>
      </SkeletonProfileInfo>
      <SkeletonTabNav>
        <SkeletonTabNavContainer>
          {[...Array(4)].map((_, i) => (
            <SkeletonTabButton key={i} />
          ))}
        </SkeletonTabNavContainer>
      </SkeletonTabNav>
    </SkeletonProfileSection>
    <SkeletonDescriptionContainer>
      {[...Array(3)].map((_, i) => (
        <React.Fragment key={i}>
          <SkeletonTitle />
          <SkeletonDescription />
        </React.Fragment>
      ))}
    </SkeletonDescriptionContainer>
  </SkeletonContainer>
);

export default StoreSkeleton;
