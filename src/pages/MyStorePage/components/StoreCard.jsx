import React, { useState } from "react";
import styled from "styled-components";
import Text from "../../../components/common/Text";
import { useNavigate } from "react-router-dom";
import { FaStore } from "react-icons/fa";
import NotificationModal from "../../../components/NotificationModal"; // 모달 컴포넌트 임포트 확인
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const StoreCardContainer = styled.div`
  background-color: ${({ theme }) => theme.secondary || "#fff"};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border || "#EAE4DE"};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    cursor: pointer;
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  height: 200px;
  background-image: ${({ backgroundImage }) =>
    backgroundImage ? `url(${backgroundImage})` : "none"};
  background-color: ${({ theme, backgroundImage }) =>
    backgroundImage ? "transparent" : theme.secondary};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const StatusChip = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  background-color: ${({ status, theme }) =>
    status === "APPROVED"
      ? theme.success
      : status === "REJECTED"
      ? theme.error
      : theme.primary};
  z-index: 1;
  text-transform: capitalize;
`;

const StoreLogo = styled.img`
  position: absolute;
  bottom: -25px;
  left: 20px;
  width: 80px;
  height: 80px;
  background-image: ${({ profileImg }) =>
    profileImg ? `url(${profileImg})` : "none"};
  background-color: ${({ profileImg }) =>
    profileImg ? "transparent" : "white"};
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;
const DefaultProfilePicture = styled.div`
  position: absolute;
  bottom: -25px;
  left: 20px;
  width: 80px;
  height: 80px;
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

const CardContent = styled.div`
  background-color: #fff;
  padding: 2.5rem 1.5rem 1.5rem;
  flex-grow: 1; // 부모 컨테이너의 남은 공간을 모두 차지
  display: flex;
  flex-direction: column;
`;

const StoreDescription = styled(Text)`
  flex-grow: 1;
  min-height: 2.4em;
  margin: 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  color: grey;
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

const StoreCard = ({ data }) => {
  const navigate = useNavigate();
  const {
    storeName,
    storeAddress,
    status,
    description,
    storeId,
    backImg,
    profileImg,
    rejectReason,
    storeTag,
  } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    if (status === "APPROVED") {
      navigate(`/view-store/${storeId}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getModalContent = () => {
    if (status === "PENDING") {
      return {
        title: "심사 중인 매장",
        message: "현재 관리자의 승인을 기다리고 있는 매장입니다.",
        modalType: "info",
      };
    }
    if (status === "REJECTED") {
      return {
        title: "승인 거절된 매장",
        message: rejectReason || "거절 사유가 등록되지 않았습니다.",
        modalType: "fail",
      };
    }
    return {};
  };

  const modalContent = getModalContent();

  return (
    <>
      <StoreCardContainer onClick={handleCardClick}>
        <CardImageContainer backgroundImage={backImg}>
          <StatusChip status={status}>
            {status === "PENDING"
              ? "심사 중"
              : status === "APPROVED"
              ? "승인됨"
              : "거절됨"}
          </StatusChip>

          {profileImg ? (
            <StoreLogo
              profileImg={profileImg}
              src={profileImg}
              alt={`${storeName} logo`}
            />
          ) : (
            <DefaultProfilePicture>
              <FaStore />
            </DefaultProfilePicture>
          )}
        </CardImageContainer>
        <CardContent>
          <Text variant="h3" weight="bold">
            {storeName}
          </Text>
          <StoreDescription variant="p" color="gray">
            {description}
          </StoreDescription>
          <Text variant="p" color="gray">
            {storeAddress}
          </Text>
          {storeTag.length > 0 && (
            <TagContainer>
              {storeTag.map((item) => (
                <Tag key={item.categoryId}>#{item.name}</Tag>
              ))}
            </TagContainer>
          )}
        </CardContent>
      </StoreCardContainer>

      {isModalOpen && (
        <NotificationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalContent.title}
          message={modalContent.message}
          onSuccess={closeModal}
          buttonText="확인"
          modalType={modalContent.modalType}
        />
      )}
    </>
  );
};

export default StoreCard;
