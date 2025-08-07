import React from "react";
import styled from "styled-components";
import ImageUploader from "../../../components/ImageUploader";

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
`;

const Section = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 18px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const FormLabel = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
  display: block;
  margin-bottom: 0.5rem;
  ${(props) =>
    props.required &&
    css`
      &::after {
        content: "";
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #8e6559;
        margin-left: 4px;

        position: relative;
        top: -2px;
      }
    `}
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

const ImagePreviewContainer = styled.div`
  margin-top: 1rem;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
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

const SecondStep = ({ data, onChange, onImageUpload, errors, resetImage }) => {
  console.log(data);
  return (
    <StepContainer>
      <Section>
        <SectionTitle>사업자 정보</SectionTitle>
        <div>
          <FormLabel htmlFor="bizOwnerName">사업자 이름</FormLabel>
          <FormInput
            id="bizOwnerName"
            value={data.bizOwnerName}
            onChange={onChange}
          />
          {errors.bizOwnerName && (
            <ErrorMessage>{errors.bizOwnerName}</ErrorMessage>
          )}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <FormLabel htmlFor="bizNo">사업자 등록번호</FormLabel>
          <FormInput
            id="bizNo"
            placeholder="사업자 번호"
            value={data.bizNo}
            onChange={onChange}
          />
          {errors.bizNo && <ErrorMessage>{errors.bizNo}</ErrorMessage>}
        </div>
        <div>
          <FormLabel>
            사업자 등록증
            {data.bizImg && (
              <ChangeImageButton onClick={() => resetImage("bizImg")}>
                이미지 변경
              </ChangeImageButton>
            )}
          </FormLabel>
          {data.bizImg ? (
            <ImagePreviewContainer>
              <ImagePreview
                src={IMG_BASE_URL + data.bizImg}
                alt="사업자 등록증"
              />
            </ImagePreviewContainer>
          ) : (
            <ImageUploader
              type={"bizImg"}
              aspectRatio={10 / 16}
              onUploadComplete={onImageUpload}
            />
          )}
        </div>
        {errors.bizImg && <ErrorMessage>{errors.bizImg}</ErrorMessage>}
      </Section>
    </StepContainer>
  );
};

export default SecondStep;
