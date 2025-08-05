import React from "react";
import styled, { css } from "styled-components";
import ImageUploader from "../../../components/ImageUploader";

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

const ProfileImagePreview = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
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

const FirstStep = ({
  data,
  onChange,
  onImageUpload,
  onProfileImageUpload,
  errors,
  resetImage,
}) => {
  return (
    <StepContainer>
      <Section>
        <SectionTitle>가게 기본 정보</SectionTitle>
        <div>
          <FormLabel required htmlFor="storeName">
            가게 이름
          </FormLabel>
          <FormInput
            id="storeName"
            placeholder="예: 장씨네 과일가게"
            value={data.storeName}
            onChange={onChange}
          />
          {errors.storeName && <ErrorMessage>{errors.storeName}</ErrorMessage>}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <FormLabel required htmlFor="description">
            가게 정보
          </FormLabel>
          <FormTextArea
            id="description"
            placeholder="가게를 소개해주세요."
            value={data.description}
            onChange={onChange}
          />
          {errors.description && (
            <ErrorMessage>{errors.description}</ErrorMessage>
          )}
        </div>
        <div>
          <FormLabel htmlFor="storeTag">가게 태그</FormLabel>
          <FormInput
            id="storeTag"
            placeholder="가게를 대표하는 태그를 작성해보세요. 예: 신선도 최고,당도 보장"
            value={data.storeTag}
            onChange={onChange}
          />
          {errors.storeTag && <ErrorMessage>{errors.storeTag}</ErrorMessage>}
        </div>
      </Section>

      <Section>
        <FormLabel>
          가게 배경 이미지
          {data.backImg && (
            <ChangeImageButton onClick={() => resetImage("backImg")}>
              이미지 변경
            </ChangeImageButton>
          )}
        </FormLabel>
        {data.backImg ? (
          <ImagePreviewContainer>
            <ImagePreview src={data.backImg} alt="가게 배경 미리보기" />
          </ImagePreviewContainer>
        ) : (
          <ImageUploader
            type={"background"}
            aspectRatio={16 / 6}
            onUploadComplete={onImageUpload}
          />
        )}
      </Section>

      <Section>
        <FormLabel>
          가게 프로필 이미지
          {data.profileImg && (
            <ChangeImageButton onClick={() => resetImage("profileImg")}>
              이미지 변경
            </ChangeImageButton>
          )}
        </FormLabel>
        {data.profileImg ? (
          <ImagePreviewContainer>
            <ProfileImagePreview
              src={data.profileImg}
              alt="가게 프로필 미리보기"
            />
          </ImagePreviewContainer>
        ) : (
          <ImageUploader
            type={"profile"}
            aspectRatio={1 / 1}
            onUploadComplete={onProfileImageUpload}
          />
        )}
      </Section>
    </StepContainer>
  );
};

export default FirstStep;
