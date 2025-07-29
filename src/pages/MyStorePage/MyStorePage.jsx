import React, { useState } from "react";
import styled from "styled-components";
import { FaInfoCircle } from "react-icons/fa";
import StoreCreationModal from "./StoreCreationModal/StoreCreationModal";

const mockStores = [
  {
    id: 1,
    name: "장씨네 과일가게",
    description: "싱싱하고 맛있는 제철 과일을 판매하는 매장입니다.",
    imageUrl: "https://placehold.co/600x400/E2D3C2/433431?text=Store+Image",
    logoUrl: "https://placehold.co/100x100/FFFFFF/8E6559?text=Logo",
  },
  {
    id: 2,
    name: "김씨네 정육점",
    description: "최고급 한우와 한돈을 전문으로 취급합니다.",
    imageUrl: "https://placehold.co/600x400/E2D3C2/433431?text=Store+Image",
    logoUrl: "https://placehold.co/100x100/FFFFFF/8E6559?text=Logo",
  },
  {
    id: 3,
    name: "박씨네 생선가게",
    description: "매일 아침 들어오는 신선한 해산물이 가득합니다.",
    imageUrl: "https://placehold.co/600x400/E2D3C2/433431?text=Store+Image",
    logoUrl: "https://placehold.co/100x100/FFFFFF/8E6559?text=Logo",
  },
  {
    id: 4,
    name: "이씨네 야채가게",
    description: "친환경 농법으로 재배한 건강한 야채를 판매합니다.",
    imageUrl: "https://placehold.co/600x400/E2D3C2/433431?text=Store+Image",
    logoUrl: "https://placehold.co/100x100/FFFFFF/8E6559?text=Logo",
  },
  {
    id: 5,
    name: "최씨네 빵가게",
    description: "매일 직접 구운 따끈한 빵을 만나보세요.",
    imageUrl: "https://placehold.co/600x400/E2D3C2/433431?text=Store+Image",
    logoUrl: "https://placehold.co/100x100/FFFFFF/8E6559?text=Logo",
  },
  {
    id: 6,
    name: "정씨네 떡집",
    description: "전통 방식 그대로 만든 쫄깃한 떡을 판매합니다.",
    imageUrl: "https://placehold.co/600x400/E2D3C2/433431?text=Store+Image",
    logoUrl: "https://placehold.co/100x100/FFFFFF/8E6559?text=Logo",
  },
];

const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.bg || "#FDFBF7"};
  padding: 2rem;
  min-height: 100vh;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text || "#433431"};
  text-align: center;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  // Desktop (기본값): 3열
  grid-template-columns: repeat(3, 1fr);

  // Tablet: 2열
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Mobile: 1열
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StoreCard = styled.div`
  background-color: ${({ theme }) => theme.bg_page || "#FFFFFF"};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border || "#EAE4DE"};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const CardImageContainer = styled.div`
  position: relative;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const StoreLogo = styled.img`
  position: absolute;
  bottom: -25px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const CardContent = styled.div`
  padding: 2.5rem 1.5rem 1.5rem;
`;

const StoreName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text || "#433431"};
  margin-bottom: 0.5rem;
`;

const StoreDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text_secondary || "#7A6A65"};
  margin-bottom: 1.5rem;
  height: 40px; // 설명 높이 고정
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.bg_component || "#F3EDE2"};
  color: ${({ theme }) => theme.text_secondary || "#7A6A65"};
  border: 1px solid ${({ theme }) => theme.border || "#EAE4DE"};
  border-radius: 16px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primary || "#8E6559"};
    color: white;
  }
`;

export default function StoreListPage() {
  const [creationModal, setCreationModal] = useState(false);

  const closeCreationModal = () => {
    setCreationModal(false);
  };
  return (
    <PageContainer>
      <TitleContainer>
        <PageTitle>현재 등록된 매장 정보</PageTitle>
        <FaInfoCircle color="#A89E9A" />
        <button onClick={() => setCreationModal(true)}>Create</button>
      </TitleContainer>
      <CardGrid>
        {mockStores.map((store) => (
          <StoreCard key={store.id}>
            <CardImageContainer>
              <CardImage
                src={store.imageUrl}
                alt={`${store.name} 매장 이미지`}
              />
              <StoreLogo src={store.logoUrl} alt={`${store.name} 로고`} />
            </CardImageContainer>
            <CardContent>
              <StoreName>{store.name}</StoreName>
              <StoreDescription>{store.description}</StoreDescription>
              <CardActions>
                <ActionButton>재고 현황 보기</ActionButton>
                <ActionButton>주문내역</ActionButton>
                <ActionButton>매장관리</ActionButton>
              </CardActions>
            </CardContent>
          </StoreCard>
        ))}
      </CardGrid>

      <StoreCreationModal isOpen={creationModal} onClose={closeCreationModal} />
    </PageContainer>
  );
}
