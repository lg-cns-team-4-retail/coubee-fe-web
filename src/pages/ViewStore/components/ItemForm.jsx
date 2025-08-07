import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ImageUploader from "../../../components/ImageUploader";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { useParams } from "react-router-dom";

const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 2rem;

  @media (max-width: 768px) {
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
`;

import { forwardRef } from "react";

const ItemForm = forwardRef(({ initialData, onSubmit }, ref) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    originPrice: "",
    salePrice: "",
    stock: "",
    img: "",
    storeId: id,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploadComplete = (imageUrl) => {
    setFormData((prev) => ({ ...prev, img: imageUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <ImageContainer>
        <ImageUploader
          aspectRatio={1}
          onUploadComplete={handleImageUploadComplete}
          type="productImg"
        />
        {formData.img && <img src={formData.img} alt="product" width="100%" />}
      </ImageContainer>
      <FieldsContainer>
        <Input
          label="상품명"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />
        <Input
          label="설명"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <Input
          label="원가"
          id="originPrice"
          name="originPrice"
          type="number"
          value={formData.originPrice}
          onChange={handleChange}
          required
        />
        <Input
          label="판매가"
          id="salePrice"
          name="salePrice"
          type="number"
          value={formData.salePrice}
          onChange={handleChange}
          required
        />
        <Input
          label="재고"
          id="stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          required
        />
      </FieldsContainer>
    </FormContainer>
  );
});

export default ItemForm;
