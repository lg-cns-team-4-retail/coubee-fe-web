import React, { useState } from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import { FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import ImageUploader from "../../../components/ImageUploader";
import { updateStoreDetail } from "../../../redux/slices/viewStoreSlice";
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const LockScroll = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); // 뒷 배경을 어둡게 처리
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // 다른 요소들 위에 표시
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.bg_page || "#fff"};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;

  width: 90vw;
  max-width: 700px;
  max-height: 85vh;
  border-radius: 16px;
  overflow: hidden;

  /* --- 모바일/태블릿 반응형 스타일 (768px 이하) --- */
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0; // 모바일에서는 꽉 채우므로 radius 제거
  }
`;

const ModalHeader = styled.header`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#eae4de"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0; // 높이가 줄어들지 않도록
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text || "#333"};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  font-size: 1.5rem;
  padding: 0.25rem;
  line-height: 1;

  &:hover {
    color: #000;
  }
`;

const ModalBody = styled.div`
  flex: 1; // 남는 공간을 모두 차지하도록 설정
  overflow-y: auto; // 내용이 많아지면 자동으로 스크롤바 생성
  padding: 1.5rem;
`;

const ModalFooter = styled.footer`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border || "#eae4de"};
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-shrink: 0; // 높이가 줄어들지 않도록
`;

const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;

  // isPrimary prop에 따라 스타일 변경
  background-color: ${({ isPrimary, theme }) =>
    isPrimary ? theme.primary : theme.bg_element2};
  color: ${({ isPrimary, theme }) => (isPrimary ? "white" : theme.text)};
  border-color: ${({ isPrimary, theme }) =>
    isPrimary ? theme.primary : theme.border};

  &:hover {
    opacity: 0.9;
  }
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

const Section = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 18px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  border: 1px solid grey;
`;
const LabelContainer = styled.div`
  margin-top: 1rem;
`;
const InformationEditModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const {
    description,
    contactNo,
    workingHour,
    storeTag,
    backImg,
    profileImg,
    storeId,
  } = useSelector((state) => state.viewStore.storeData);

  const filteredTag = storeTag.map((item) => item.name).join(",");
  const [data, setData] = useState({
    description: description,
    storeTag: filteredTag,
    backImg: backImg,
    profileImg: profileImg,
    contactNo: contactNo,
    workingHour: workingHour,
    storeId,
  });

  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const resetImage = (type) => {
    setData((prev) => ({ ...prev, [type]: null }));
  };

  const handleProfileImageUpload = (file) => {
    setData((prev) => ({ ...prev, profileImg: file }));
  };

  const handleBackgroundImageUpload = (file) => {
    setData((prev) => ({ ...prev, backImg: file }));
  };

  const handleUpdateStoreDetail = async () => {
    try {
      console.log(data);
      const response = await dispatch(updateStoreDetail(data)).unwrap();
      onClose();
    } catch (err) {
      console.error("error");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <LockScroll />
      <ModalBackdrop>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>가게 정보 수정</ModalTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            {/**가게 정보 Section */}
            <LabelContainer>
              <FormLabel required htmlFor="description">
                가게 정보
              </FormLabel>
              <FormTextArea
                id="description"
                placeholder="가게를 소개해주세요."
                value={data.description}
                onChange={handleChange}
              />
              {errors.description && (
                <ErrorMessage>{errors.description}</ErrorMessage>
              )}
            </LabelContainer>
            {/**가게 태그 Section */}
            <LabelContainer>
              <FormLabel required htmlFor="storeTag">
                가게 태그
              </FormLabel>
              <FormInput
                id="storeTag"
                placeholder="가게를 대표하는 태그를 작성해보세요. 예: 신선도 최고,당도 보장"
                value={data.storeTag}
                onChange={handleChange}
              />
              {errors.storeTag && (
                <ErrorMessage>{errors.storeTag}</ErrorMessage>
              )}
            </LabelContainer>
            <LabelContainer>
              <FormLabel required htmlFor="workingHour">
                영업 시간
              </FormLabel>
              <FormTextArea
                id="workingHour"
                placeholder="예: 평일 09:00 ~ 18:00"
                value={data.workingHour}
                onChange={handleChange}
              />
              {errors.workingHour && (
                <ErrorMessage>{errors.workingHour}</ErrorMessage>
              )}
            </LabelContainer>
            {/**가게 배경이미지 Section */}
            <LabelContainer>
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
                  aspectRatio={8 / 1}
                  onUploadComplete={handleBackgroundImageUpload}
                />
              )}
            </LabelContainer>

            {/**가게 태그 Section */}

            <LabelContainer>
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
                  onUploadComplete={handleProfileImageUpload}
                />
              )}
            </LabelContainer>
          </ModalBody>
          <ModalFooter>
            <StyledButton onClick={onClose}>취소</StyledButton>
            <StyledButton isPrimary onClick={handleUpdateStoreDetail}>
              저장하기
            </StyledButton>
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
    </>
  );
};

export default InformationEditModal;
