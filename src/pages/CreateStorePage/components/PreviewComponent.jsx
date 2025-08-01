import React, { useState } from "react";
import styled from "styled-components";
import { FaStore } from "react-icons/fa";

const Wrapper = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

const PreviewContainer = styled.div`
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  position: relative;
`;

const BackgroundImage = styled.div`
  width: 100%;
  height: 180px;
  background-image: ${({ src }) => (src ? `url(${src})` : "none")};
  background-color: #eee;
  background-size: cover;
  background-position: center;

  @media (max-width: 768px) {
    height: 140px;
  }
`;

const ProfileInfo = styled.div`
  padding: 1rem 2rem;
  position: relative;
  background-color: white;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProfilePictureContainer = styled.div`
  margin-top: -80px;
  margin-left: 10px;
  display: flex;
  align-items: flex-end;

  @media (max-width: 768px) {
    margin-top: -60px;
  }
`;

const ProfilePicture = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`;

const DefaultProfilePicture = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 60%;
    height: 60%;
    color: grey;
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`;

const StoreDetails = styled.div`
  margin-top: 0.5rem;
  margin-left: 10px;
`;

const StoreName = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StoreDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ddd;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  background-color: ${({ active }) => (active ? "white" : "#E8D0A9")};
  color: ${({ active, theme }) => (active ? theme.primary : "#555")};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid
    ${({ active, theme }) => (active ? theme.primary : "transparent")};

  &:hover {
    background-color: #8e6559;
    color: white;
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const ContentContainer = styled.div`
  padding: 2rem;
  background-color: white;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const DetailText = styled.p`
  font-size: 1rem;
  color: #555;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BizImagePreview = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  margin-top: 1rem;
`;

const PreviewComponent = ({ data }) => {
  const [activeTab, setActiveTab] = useState("store");

  const renderContent = () => {
    switch (activeTab) {
      case "store":
        return (
          <div>
            <DetailSection>
              <DetailTitle>가게 이름</DetailTitle>
              <DetailText>{data.storeName}</DetailText>
            </DetailSection>
            <DetailSection>
              <DetailTitle>가게 설명</DetailTitle>
              <DetailText>{data.storeDesc}</DetailText>
            </DetailSection>
            <DetailSection>
              <DetailTitle>가게 태그</DetailTitle>
              <DetailText>
                {data.storeTag || "입력된 태그가 없습니다."}
              </DetailText>
            </DetailSection>
          </div>
        );
      case "business":
        return (
          <div>
            <DetailSection>
              <DetailTitle>사업자 이름</DetailTitle>
              <DetailText>{data.bizOwnerName}</DetailText>
            </DetailSection>
            <DetailSection>
              <DetailTitle>사업자 등록번호</DetailTitle>
              <DetailText>{data.bizNo}</DetailText>
            </DetailSection>
            <DetailSection>
              <DetailTitle>사업자 등록증</DetailTitle>
              {data.bizImg ? (
                <BizImagePreview
                  src={
                    typeof data.bizImg === "string"
                      ? data.bizImg
                      : URL.createObjectURL(data.bizImg)
                  }
                  alt="사업자 등록증"
                />
              ) : (
                <DetailText>등록된 이미지가 없습니다.</DetailText>
              )}
            </DetailSection>
          </div>
        );
      case "operation":
        return (
          <div>
            <DetailSection>
              <DetailTitle>연락처</DetailTitle>
              <DetailText>{data.contactNo}</DetailText>
            </DetailSection>
            <DetailSection>
              <DetailTitle>영업 시간</DetailTitle>
              <DetailText>{data.workingHour}</DetailText>
            </DetailSection>
            <DetailSection>
              <DetailTitle>가게 주소</DetailTitle>
              <DetailText>{data.storeAddress}</DetailText>
            </DetailSection>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <PreviewContainer>
        <ProfileHeader>
          <BackgroundImage src={data.backgroundImage} />
        </ProfileHeader>
        <ProfileInfo>
          <ProfilePictureContainer>
            {data.profileImage ? (
              <ProfilePicture
                src={
                  typeof data.profileImage === "string"
                    ? data.profileImage
                    : URL.createObjectURL(data.profileImage)
                }
                alt="Profile"
              />
            ) : (
              <DefaultProfilePicture>
                <FaStore />
              </DefaultProfilePicture>
            )}
          </ProfilePictureContainer>
          <StoreDetails>
            <StoreName>{data.storeName}</StoreName>
            <StoreDescription>{data.storeDesc}</StoreDescription>
          </StoreDetails>
        </ProfileInfo>

        <TabContainer>
          <TabButton
            active={activeTab === "store"}
            onClick={() => setActiveTab("store")}
          >
            가게 정보
          </TabButton>
          <TabButton
            active={activeTab === "business"}
            onClick={() => setActiveTab("business")}
          >
            사업자 정보
          </TabButton>
          <TabButton
            active={activeTab === "operation"}
            onClick={() => setActiveTab("operation")}
          >
            영업 정보
          </TabButton>
        </TabContainer>

        <ContentContainer>{renderContent()}</ContentContainer>
      </PreviewContainer>
    </Wrapper>
  );
};

export default PreviewComponent;
