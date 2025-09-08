import React from "react";
import styled from "styled-components";
import { FaShoppingBag, FaPalette, FaChartLine } from "react-icons/fa";

const FeaturesContainer = styled.section`
  padding: 6rem 2rem;
  background-color: #fff;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
`;

const features = [
  {
    icon: <FaShoppingBag />,
    title: "간편한 O2O 픽업 서비스",
    text: "온라인으로 주문을 받고, 고객은 매장에서 직접 찾아가는 O2O 서비스를 통해 고객 경험과 매출을 동시에 향상시키세요.",
  },
  {
    icon: <FaPalette />,
    title: "코딩 없는 나만의 상점 디자인",
    text: "전문가가 아니어도 괜찮습니다. 직관적인 편집 도구를 사용하여 당신의 가게만의 개성이 담긴 온라인 스토어를 손쉽게 만드세요.",
  },
  {
    icon: <FaChartLine />,
    title: "강력한 판매 데이터 분석",
    text: "일별, 주별, 월별 매출 데이터를 시각적인 차트로 확인하고, 어떤 상품이 인기가 많은지 분석하여 비즈니스 전략을 세워보세요.",
  },
];

const FeaturesSection = () => {
  return (
    <FeaturesContainer>
      <SectionTitle>쿠비의 특별한 기능들</SectionTitle>
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <IconWrapper>{feature.icon}</IconWrapper>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureText>{feature.text}</FeatureText>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </FeaturesContainer>
  );
};

export default FeaturesSection;
