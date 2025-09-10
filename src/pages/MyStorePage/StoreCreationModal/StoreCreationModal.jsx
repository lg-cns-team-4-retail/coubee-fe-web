import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { FaRegPaperPlane } from "react-icons/fa";
import coubeeIcon from "../../../assets/coubee.svg";
import ImageUploader from "../../../components/ImageUploader";

const CameraIcon = ({ size = 24, strokeWidth = 1.5 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

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
  margin-right: 10px;
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

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Step1 = ({
  data,
  onChange,
  onImageUpload,
  onProfileImageUpload,
  imagePreviewUrl,
  errors,
  resetImage,
}) => {
  return (
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
          <FormLabel>가게 배경 이미지</FormLabel>

          {data.backgroundImage && (
            <ActionButton onClick={() => resetImage("background")}>
              다시 업로드
            </ActionButton>
          )}
          {!data.backgroundImage && (
            <ImageUploader
              type={"background"}
              aspectRatio={16 / 6}
              onUploadComplete={onImageUpload}
            />
          )}
        </section>
        <ImageContainer>
          {data.backgroundImage && (
            <img
              src={data.backgroundImage}
              alt="가게 배경 미리보기"
              height={"320px"}
              style={{ marginTop: "1rem", borderRadius: "8px" }}
            />
          )}
        </ImageContainer>
      </div>

      <div>
        <section>
          <FormLabel>가게 프로필 이미지</FormLabel>
          {data.profileImage && (
            <ActionButton onClick={() => resetImage("profile")}>
              다시 업로드
            </ActionButton>
          )}
          {!data.profileImage && (
            <ImageUploader
              type={"profile"}
              aspectRatio={1 / 1}
              onUploadComplete={onProfileImageUpload}
            />
          )}
        </section>
        <ImageContainer>
          {data.profileImage && (
            <img
              src={data.profileImage}
              alt="가게 배경 미리보기"
              height={"240px"}
              style={{ marginTop: "1rem", borderRadius: "8px" }}
            />
          )}
        </ImageContainer>
      </div>
    </StepContentWrapper>
  );
};

const Step2 = ({ data, onChange, errors }) => (
  <StepContentWrapper>
    <div>
      <FormLabel htmlFor="bizNumber">사업자 번호</FormLabel>
      <FormInput
        id="bizNumber"
        placeholder="- 없이 입력"
        value={data.bizNumber}
        onChange={onChange}
      />
      {errors.bizNumber && <ErrorMessage>{errors.bizNumber}</ErrorMessage>}
    </div>
    <div>
      <FormLabel htmlFor="ownerName">사업자 성함</FormLabel>
      <FormInput
        id="ownerName"
        placeholder="예: 홍길동"
        value={data.ownerName}
        onChange={onChange}
      />
      {errors.ownerName && <ErrorMessage>{errors.ownerName}</ErrorMessage>}
    </div>
  </StepContentWrapper>
);

const Step3 = ({ data, onChange, errors }) => (
  <StepContentWrapper>
    <div>
      <FormLabel htmlFor="address">가게 위치</FormLabel>
      <FormInput
        id="address"
        placeholder="도로명 주소를 입력해주세요."
        value={data.address}
        onChange={onChange}
      />
      {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
    </div>
    <div>
      <FormLabel htmlFor="hours">영업 시간</FormLabel>
      <FormInput
        id="hours"
        placeholder="예: 평일 09:00 ~ 18:00"
        value={data.hours}
        onChange={onChange}
      />
      {errors.hours && <ErrorMessage>{errors.hours}</ErrorMessage>}
    </div>
  </StepContentWrapper>
);

const Step4 = ({ data }) => (
  <StepContentWrapper>
    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
      <FaRegPaperPlane size={48} color="#8E6559" />
      <h3 style={{ marginTop: "1rem" }}>마지막 단계입니다.</h3>
      <p>입력하신 정보를 확인하시고 제출 버튼을 눌러주세요.</p>
      <div
        style={{
          textAlign: "left",
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>가게 이름:</strong> {data.storeName}
        </p>
        <p>
          <strong>사업자 번호:</strong> {data.bizNumber}
        </p>
        <p>
          <strong>가게 위치:</strong> {data.address}
        </p>
      </div>
    </div>
  </StepContentWrapper>
);

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1100px;
  padding: 2rem;

  @media (max-width: 768px) {
    max-width: 95vw;
  }
`;

const ModalTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 4rem;
  color: #333;
`;

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
  margin-bottom: 2.5rem;
`;

const ProgressTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
  background-color: #8e6559;
  border-radius: 2px;
  width: ${({ progress }) => progress}%;
  transition: width 0.4s ease;
`;

const StepNodeWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const StepNodeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StepNode = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ active }) => (active ? "#8E6559" : "#e0e0e0")};
  border: 3px solid white;
  border-radius: 50%;
  z-index: 1;
  transition: background-color 0.4s ease;
`;

const StepLabel = styled.span`
  position: absolute;
  top: 150%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: ${({ active }) => (active ? "black" : "#aaa")};
  white-space: nowrap;
`;

const ProgressIcon = styled.img`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  z-index: 2;
  display: ${({ show }) => (show ? "block" : "none")};
  transition: left 0.4s ease;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background-color: #8e6559;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background-color: #f0f0f0;
  color: #555;
  &:hover {
    background-color: #e0e0e0;
    opacity: 1;
  }
`;
const ModalContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.5rem; /* 스크롤바가 콘텐츠를 가리는 것을 방지 */

  @media (max-width: 1024px) {
    max-height: 60vh;
  }

  @media (max-width: 768px) {
    max-height: 50vh;
    padding-right: 0;
  }
`;

const ProgressBar = ({ currentStep, totalSteps, stepTitles }) => {
  const progress =
    totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <ProgressBarContainer>
      <ProgressTrack />
      <ProgressFill progress={progress} />
      <StepNodeWrapper>
        {stepTitles.map((title, index) => (
          <StepNodeContainer key={index}>
            <ProgressIcon
              src={coubeeIcon}
              alt="current step"
              show={index + 1 === currentStep}
            />
            <StepNode active={index + 1 <= currentStep} />
            <StepLabel active={index + 1 <= currentStep}>{title}</StepLabel>
          </StepNodeContainer>
        ))}
      </StepNodeWrapper>
    </ProgressBarContainer>
  );
};

const StoreCreationModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    storeDesc: "",
    backgroundImage: null,
    profileImage: null,
    bizNumber: "",
    ownerName: "",
    address: "",
    hours: "",
  });
  const [backgroundImagePreview, setBackgroundImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  };
  const resetImage = (type) => {
    if (type === "background") {
      setFormData((prev) => ({ ...prev, backgroundImage: null }));
    }
    if (type === "businessImage") {
      setFormData((prev) => ({ ...prev, businessImage: null }));
    }
    if (type === "profileImage") {
      setFormData((prev) => ({ ...prev, profileImage: null }));
    }
  };

  const validateStep = (step, data) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!data.storeName.trim())
          newErrors.storeName = "가게 이름을 입력해주세요.";
        if (!data.storeDesc.trim())
          newErrors.storeDesc = "가게 정보를 입력해주세요.";
        break;
      case 2:
        if (!data.bizNumber.trim()) {
          newErrors.bizNumber = "사업자 번호를 입력해주세요.";
        } /*  else if (!/^\d{10}$/.test(data.bizNumber)) {
          newErrors.bizNumber = "유효한 사업자 번호 10자리를 입력해주세요.";
        } */
        if (!data.ownerName.trim())
          newErrors.ownerName = "사업자 성함을 입력해주세요.";
        break;
      case 3:
        if (!data.address.trim())
          newErrors.address = "가게 위치를 입력해주세요.";
        if (!data.hours.trim()) newErrors.hours = "영업 시간을 입력해주세요.";
        break;
      default:
        break;
    }
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleNext = () => {
    const { isValid, errors: newErrors } = validateStep(currentStep, formData);
    setErrors(newErrors);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    onClose();
  };

  const handleImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, backgroundImage: file }));
  };
  const handleProfileImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };

  const steps = [
    {
      title: "가게 정보",
      component: (
        <Step1
          data={formData}
          onChange={handleChange}
          onImageUpload={handleImageUpload}
          onProfileImageUpload={handleProfileImageUpload}
          imagePreviewUrl={backgroundImagePreview}
          errors={errors}
          resetImage={resetImage}
        />
      ),
    },
    {
      title: "사업자 정보",
      component: (
        <Step2 data={formData} onChange={handleChange} errors={errors} />
      ),
    },
    {
      title: "영업 정보",
      component: (
        <Step3 data={formData} onChange={handleChange} errors={errors} />
      ),
    },
    { title: "최종 확인", component: <Step4 data={formData} /> },
  ];

  const totalSteps = steps.length;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>당신의 가게를 등록해보세요</ModalTitle>
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepTitles={steps.map((s) => s.title)}
        />
        <ModalContent>{steps[currentStep - 1].component}</ModalContent>

        <ModalActions>
          <SecondaryButton onClick={handlePrev} disabled={currentStep === 1}>
            이전
          </SecondaryButton>
          {currentStep === totalSteps ? (
            <ActionButton onClick={handleSubmit}>제출</ActionButton>
          ) : (
            <ActionButton onClick={handleNext}>다음</ActionButton>
          )}
        </ModalActions>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default StoreCreationModal;
