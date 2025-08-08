import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import ImageUploader from "../../../components/ImageUploader";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { useParams } from "react-router-dom";

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
    align-items: center;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }
`;

const FieldsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormLabel = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.primary};
  display: block;
  margin-bottom: 0.5rem;
`;

const ChangeImageButton = styled.button`
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemForm = ({ data, onFormChange, onImageUpload, resetImage }) => {
  return (
    <FormContainer>
      <ImageContainer>
        <FormLabel>
          상품 이미지{" "}
          {data.productImg && (
            <ChangeImageButton onClick={() => resetImage("productImg")}>
              이미지 변경
            </ChangeImageButton>
          )}
        </FormLabel>

        {data.productImg ? (
          <ImagePreview
            src={IMG_BASE_URL + data.productImg}
            alt="가게 상품 미리보기"
          />
        ) : (
          <ImageUploader
            type={"productImg"}
            aspectRatio={1}
            onUploadComplete={onImageUpload}
          />
        )}
      </ImageContainer>
      <FieldsContainer>
        <Input
          label="상품명"
          id="productName"
          name="productName"
          value={data.productName}
          onChange={onFormChange}
          required
        />
        <Input
          label="설명"
          id="description"
          name="description"
          value={data.description}
          onChange={onFormChange}
          required
        />
        <Input
          label="원가"
          id="originPrice"
          name="originPrice"
          type="number"
          value={data.originPrice}
          onChange={onFormChange}
          required
        />
        <Input
          label="판매가"
          id="salePrice"
          name="salePrice"
          type="number"
          value={data.salePrice}
          onChange={onFormChange}
          required
        />
        <Input
          label="재고"
          id="stock"
          name="stock"
          type="number"
          value={data.stock}
          onChange={onFormChange}
          required
        />
      </FieldsContainer>
    </FormContainer>
  );
};

export default ItemForm;
