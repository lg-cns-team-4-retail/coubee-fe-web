import React, { useState } from "react";
import styled from "styled-components";
import { FaRegPaperPlane } from "react-icons/fa";
import ProgressBar from "./components/ProgressBar";
import FirstStep from "./components/FirstStep";
import SecondStep from "./components/SecondStep";
import ThirdStep from "./components/ThirdStep";
import PreviewComponent from "./components/PreviewComponent";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin: 1rem 0;
  text-align: center;
  color: #333;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CreateActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  gap: 1rem;
  margin: 1rem 0;
  max-width: 800px;
`;
const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
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
/**
 *
 * @returns
 * "https://coubee-api.murkui.com/api/store/images/store/background/2b6708e1-494e-40d0-bb7a-d862e0779267.jpeg",
 */
const CreateStorePage = () => {
  const [currentStep, setCurrentStep] = useState(4);
  const [formData, setFormData] = useState({
    //가게 정보
    storeName: "",
    storeDesc: "",
    storeTag: "",
    backgroundImage: null,
    profileImage: null,
    //사업자 정보
    bizOwnerName: "",
    bizNo: "",
    bizImg: null,
    //영업 정보
    contactNo: "",
    workingHour: "",
    storeAddress: "",
    latitude: "",
    longitude: "",
  });

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
  const [errors, setErrors] = useState({});
  const resetImage = (type) => {
    if (type === "background") {
      setFormData((prev) => ({ ...prev, backgroundImage: null }));
    }
    if (type === "bizImg") {
      setFormData((prev) => ({ ...prev, bizImg: null }));
    }
    if (type === "profileImage") {
      setFormData((prev) => ({ ...prev, profileImage: null }));
    }
  };
  const handleImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, backgroundImage: file }));
    console.log(file);
  };
  const handleProfileImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };
  const handleBizImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, bizImg: file }));
  };
  const handleAddressSelect = (address) => {
    console.log(address, "check from store");
    setFormData((prev) => ({ ...prev, ...address }));
    console.log(formData, "check from store");
  };

  const steps = [
    {
      title: "가게 정보",
    },
    {
      title: "사업자 정보",
    },
    {
      title: "영업 정보",
    },
    {
      title: "최종 확인",
    },
  ];

  const totalSteps = steps.length;

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
        if (!data.bizNo.trim()) {
          newErrors.bizNo = "사업자 등록번호를 입력해주세요.";
        }
        if (!data.bizOwnerName.trim())
          newErrors.bizOwnerName = "사업자 이름을 입력해주세요.";

        if (!data.bizImg) newErrors.bizImg = "사업자 등록증을 올려주세요.";
        break;
      case 3:
        if (!data.storeAddress.trim())
          newErrors.storeAddress = "가게 위치를 입력해주세요.";
        if (!data.workingHour.trim())
          newErrors.workingHour = "영업 시간을 입력해주세요.";
        if (!data.contactNo.trim())
          newErrors.contactNo = "영업 시간을 입력해주세요.";

        break;
      default:
        break;
    }
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const handleNext = () => {
    const { isValid, errors: newErrors } = validateStep(currentStep, formData);
    console.log(newErrors);
    setErrors(newErrors);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step) => {
    if (step === currentStep) return;

    if (step < currentStep) {
      setErrors({});
      setCurrentStep(step);
      return;
    }

    for (let i = currentStep; i < step; i++) {
      const { isValid, errors: newErrors } = validateStep(i, formData);
      if (!isValid) {
        setErrors(newErrors);
        setCurrentStep(i);
        return;
      }
    }

    setErrors({});
    setCurrentStep(step);
  };
  const handleSubmit = () => {
    console.log("제출할 데이터:", formData);
  };

  return (
    <>
      <Title>당신의 가게를 등록하세요</Title>
      <ProgressContainer>
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepTitles={steps.map((s) => s.title)}
          onStepClick={handleStepClick}
        />
      </ProgressContainer>
      <MainContainer>
        <>
          {currentStep === 1 && (
            <FirstStep
              data={formData}
              onChange={handleChange}
              onImageUpload={handleImageUpload}
              onProfileImageUpload={handleProfileImageUpload}
              errors={errors}
              resetImage={resetImage}
            />
          )}

          {currentStep === 2 && (
            <SecondStep
              data={formData}
              onChange={handleChange}
              onImageUpload={handleBizImageUpload}
              errors={errors}
              resetImage={resetImage}
            />
          )}

          {currentStep === 3 && (
            <ThirdStep
              data={formData}
              onChange={handleChange}
              onAddressSelect={handleAddressSelect}
              errors={errors}
            />
          )}

          {currentStep === 4 && <PreviewComponent data={formData} />}
        </>
        <CreateActions>
          <SecondaryButton onClick={handlePrev} disabled={currentStep === 1}>
            이전
          </SecondaryButton>
          {currentStep === totalSteps ? (
            <ActionButton onClick={handleSubmit}>제출</ActionButton>
          ) : (
            <ActionButton onClick={handleNext}>다음</ActionButton>
          )}
        </CreateActions>
      </MainContainer>
    </>
  );
};

export default CreateStorePage;
