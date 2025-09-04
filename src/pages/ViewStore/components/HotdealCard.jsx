import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Text from "../../../components/common/Text";
import { FaFire } from "react-icons/fa";

const HotdealInfoCard = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  color: white;
  box-shadow: 0 8px 16px rgba(255, 107, 107, 0.3);
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconWrapper = styled.div`
  svg {
    width: 48px;
    height: 48px;
  }
`;

const InfoTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoTitle = styled(Text)`
  color: white;
`;

const InfoContent = styled(Text)`
  font-weight: 500;

  opacity: 0.9;
  margin-bottom: 0;
`;

const HotdealCard = () => {
  const { hotdeal } = useSelector((state) => state.viewStore.storeData);

  if (!hotdeal) {
    return null;
  }

  return (
    <HotdealInfoCard>
      <IconWrapper>
        <FaFire />
      </IconWrapper>
      <InfoTextContainer>
        <InfoTitle as="h3">🔥 지금은 핫딜 진행 중!</InfoTitle>
        <InfoContent as="p">
          전체 상품 {(hotdeal.saleRate * 100).toFixed(0)}% 할인 (최대{" "}
          {hotdeal.maxDiscount.toLocaleString()}원)
        </InfoContent>
      </InfoTextContainer>
    </HotdealInfoCard>
  );
};

export default HotdealCard;
