import React from "react";
import styled from "styled-components";
import Text from "../../../components/common/Text";
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const CardContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 18px;
  overflow: hidden;
  background-color: #fff;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  @media (max-width: 768px) {
    flex-direction: row; // 가로 방향으로 변경
    align-items: center; // 세로 중앙 정렬
    gap: 1rem;
    padding: 0.75rem;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  @media (max-width: 768px) {
    width: 30%; // 이미지 너비 고정
    flex-shrink: 0;
  }
`;

const ProductImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  @media (max-width: 768px) {
    padding: 0; // 기존 패딩 제거
  }
`;

const Name = styled.h3`
  font-size: 1.1em;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 5px 0;
`;

const SalePrice = styled.span`
  font-size: 1.1em;
  font-weight: bold;
  color: #e44d26;
`;

const OriginPrice = styled.span`
  font-size: 0.9em;
  color: #888;
  text-decoration: line-through;
`;

const DiscountRate = styled.span`
  font-size: 1.1em;
  font-weight: bold;
  color: #2a9d8f; // 할인율 강조 색상
`;

const Stock = styled.p`
  font-size: 0.9em;
  color: #777;
  margin: 0;
  margin-top: auto;
`;

const ItemDescription = styled(Text)`
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
const ItemCard = ({ item, onEditClick }) => {
  const {
    productImg,
    productName,
    salePrice,
    stock,
    originPrice,
    description,
  } = item;

  const isSale = originPrice && originPrice > salePrice;
  const discountRate = isSale
    ? Math.round(((originPrice - salePrice) / originPrice) * 100)
    : 0;

  return (
    <CardContainer onClick={onEditClick}>
      <ImageContainer>
        <ProductImage src={productImg} alt={productName} />
      </ImageContainer>
      <Content>
        <Name>{productName}</Name>
        <ItemDescription variant="h5">{description}</ItemDescription>
        <PriceContainer>
          {isSale ? (
            <>
              <DiscountRate>{discountRate}%</DiscountRate>
              <SalePrice>{salePrice.toLocaleString()}원</SalePrice>
              <OriginPrice>{originPrice.toLocaleString()}원</OriginPrice>
            </>
          ) : (
            <SalePrice>{salePrice.toLocaleString()}원</SalePrice>
          )}
        </PriceContainer>
        <Stock>재고 {stock}개</Stock>
      </Content>
    </CardContainer>
  );
};

export default ItemCard;
