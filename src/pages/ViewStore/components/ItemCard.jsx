import React from "react";

import styled from "styled-components";

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const CardContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
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

const Price = styled.p`
  font-size: 1em;
  color: #e44d26;
  margin: 0 0 5px 0;
`;

const Stock = styled.p`
  font-size: 0.9em;
  color: #777;
  margin: 0;
  margin-top: auto; /* 재고 정보를 항상 하단에 위치시킵니다 */
`;

const ItemCard = ({ item, onEditClick }) => {
  const { productImg, productName, salePrice, stock } = item;
  return (
    <CardContainer onClick={onEditClick}>
      <ImageContainer>
        <ProductImage src={IMG_BASE_URL + productImg} alt={name} />
      </ImageContainer>
      <Content>
        <Name>{productName}</Name>
        <Price>{salePrice.toLocaleString()} 원</Price>
        <Stock>재고 {stock}개</Stock>
      </Content>
    </CardContainer>
  );
};

export default ItemCard;
