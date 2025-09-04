import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Text from "../../../components/common/Text";
import KakaoMap from "../../../components/KakaoMap";
import { FaStore, FaMapMarkerAlt, FaClock, FaPhoneAlt } from "react-icons/fa";
import Button from "../../../components/common/Button";
import InformationEditModal from "./InformationEditModal";
import HotdealCard from "./HotdealCard";
import HotdealEditModal from "./HotdealEditModal";

const InfoSectionContainer = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.bg_page || "#fff"};
  border-radius: 16px;
  padding: 1.5rem 2rem;

  border: 1px solid ${({ theme }) => theme.border || "#eae4de"};
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
  }
  &:hover {
    cursor: pointer;
    box-shadow: ${({ theme }) =>
      theme.utils?.shadow_lg || "0 8px 16px rgba(0,0,0,0.1)"};
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-weight: 600;
  font-size: 1.25rem;
`;

const IconWrapper = styled.div`
  background-color: ${({ theme }) => theme.secondary}33;
  color: ${({ theme }) => theme.primary};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const InfoTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoTitle = styled(Text)`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.primary};
  font-size: 0.9rem;
`;

const InfoContent = styled(Text)`
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.text};
  white-space: pre-wrap;
  line-height: 1.6;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const MapContainer = styled.div`
  height: 350px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  /*   box-shadow: ${({ theme }) =>
    theme.utils?.shadow_lg || "0 8px 16px rgba(0,0,0,0.1)"}; */
  border: 1px solid ${({ theme }) => theme.border || "#eae4de"};
`;

const EditLinkButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};

  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const InformationSection = () => {
  const storeData = useSelector((store) => store.viewStore.storeData);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isHotdealModal, setIsHotdealModal] = useState(false);
  const closeIsEditModal = () => {
    setIsEditModal(false);
  };
  if (!storeData) {
    return <InfoCard>가게 정보를 불러오는 중입니다...</InfoCard>;
  }

  const {
    description = "등록된 가게 정보가 없습니다.",
    storeTag,
    storeAddress = "등록된 주소가 없습니다.",
    workingHour = "등록된 영업시간 정보가 없습니다.",
    contactNo = "등록된 연락처가 없습니다.",
    latitude,
    longitude,
    storeName,
  } = storeData;

  return (
    <InfoSectionContainer>
      <TitleContainer>
        <Title>가게 소개</Title>
        <div>
          <EditLinkButton
            onClick={() => setIsHotdealModal(true)}
            style={{ marginRight: "0.5rem" }}
          >
            핫딜 관리
          </EditLinkButton>
          <EditLinkButton onClick={() => setIsEditModal(true)}>
            정보 수정
          </EditLinkButton>
        </div>
      </TitleContainer>

      <HotdealCard />

      <InfoCard onClick={() => setIsEditModal(true)}>
        <InfoRow>
          <IconWrapper>
            <FaStore />
          </IconWrapper>
          <InfoTextContainer>
            <InfoTitle as="h3">가게 설명</InfoTitle>
            <InfoContent as="h5">{description}</InfoContent>
            {storeTag.length > 0 && (
              <TagContainer>
                {storeTag.map((item) => (
                  <Tag key={item.categoryId}>#{item.name}</Tag>
                ))}
              </TagContainer>
            )}
          </InfoTextContainer>
        </InfoRow>
      </InfoCard>

      <InfoCard onClick={() => setIsEditModal(true)}>
        <InfoRow>
          <IconWrapper>
            <FaClock />
          </IconWrapper>
          <InfoTextContainer>
            <InfoTitle as="h2">영업 시간</InfoTitle>
            <InfoContent as="h5">{workingHour}</InfoContent>
          </InfoTextContainer>
        </InfoRow>
      </InfoCard>
      <InfoCard onClick={() => setIsEditModal(true)}>
        <InfoRow>
          <IconWrapper>
            <FaPhoneAlt />
          </IconWrapper>
          <InfoTextContainer>
            <InfoTitle as="h2">가게 연락처</InfoTitle>
            <InfoContent as="a" href={`tel:${contactNo}`}>
              {contactNo}
            </InfoContent>
          </InfoTextContainer>
        </InfoRow>
      </InfoCard>
      <InfoCard onClick={() => setIsEditModal(true)}>
        <InfoRow>
          <IconWrapper>
            <FaMapMarkerAlt />
          </IconWrapper>
          <InfoTextContainer>
            <InfoTitle as="h2">가게 위치</InfoTitle>
            <InfoContent as="h5">{storeAddress}</InfoContent>
          </InfoTextContainer>
        </InfoRow>
        <MapContainer>
          {latitude && longitude && <KakaoMap lat={latitude} lng={longitude} />}
        </MapContainer>
      </InfoCard>

      <InformationEditModal isOpen={isEditModal} onClose={closeIsEditModal} />
      <HotdealEditModal
        isOpen={isHotdealModal}
        onClose={() => setIsHotdealModal(false)}
      />
    </InfoSectionContainer>
  );
};

export default InformationSection;
