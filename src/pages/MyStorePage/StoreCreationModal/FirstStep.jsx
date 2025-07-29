import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import ImageUploader from "../../../components/ImageUploader";

const StepContentWrapper = styled.div`
  padding: 1rem 0;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormLabel = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const FormTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
`;

const ErrorMessage = styled.p`
  color: #d9534f;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const FirstStep = ({
  data,
  onChange,
  onImageUpload,
  imagePreviewUrl,
  errors,
}) => {
  return (
    <>
      <StepContentWrapper>
        <div>
          <FormLabel htmlFor="storeName">가게 이름</FormLabel>
          <FormInput
            id="storeName"
            placeholder="예: 장씨네 과일가게"
            value={data.storeName}
            onChange={onChange}
          />
          {errors.storeName && <ErrorMessage>{errors.storeName}</ErrorMessage>}
        </div>
        <div>
          <FormLabel htmlFor="storeDesc">가게 정보</FormLabel>
          <FormTextArea
            id="storeDesc"
            placeholder="가게를 소개해주세요."
            value={data.storeDesc}
            onChange={onChange}
          />
          {errors.storeDesc && <ErrorMessage>{errors.storeDesc}</ErrorMessage>}
        </div>

        <div>
          <section>
            <FormLabel>배경 이미지</FormLabel>
            <ImageUploader
              aspectRatio={1 / 1}
              onUploadComplete={onImageUpload}
            />
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt="배경 미리보기"
                width="320"
                style={{ marginTop: "1rem", borderRadius: "8px" }}
              />
            )}
          </section>
        </div>
      </StepContentWrapper>
    </>
  );
};

export default FirstStep;
