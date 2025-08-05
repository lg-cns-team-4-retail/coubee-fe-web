import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ProgressBar from "./components/ProgressBar";
import FirstStep from "./components/FirstStep";
import SecondStep from "./components/SecondStep";
import ThirdStep from "./components/ThirdStep";
import PreviewComponent from "./components/PreviewComponent";
import { registerStore } from "../../redux/slices/storeSlice";
import Button from "../../components/common/Button";
import SuccessComponent from "./components/SuccessComponent";
import { resetRegisterStatus } from "../../redux/slices/storeSlice";
import { useNavigate } from "react-router-dom";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin: 1rem 0;
  text-align: center;
  color: #333;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ActionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  max-width: 800px;
`;

const CreateStorePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    storeTag: "",
    backImg: null,
    profileImg: null,
    bizOwnerName: "",
    bizNo: "",
    bizImg: null,
    contactNo: "",
    workingHour: "",
    storeAddress: "",
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.store);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const resetImage = (type) => {
    setFormData((prev) => ({ ...prev, [type]: null }));
  };

  const handleImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, backImg: file }));
  };

  const handleProfileImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, profileImg: file }));
  };

  const handleBizImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, bizImg: file }));
  };

  const handleAddressSelect = (address) => {
    setFormData((prev) => ({ ...prev, ...address }));
  };

  const handleStepClick = (step) => {
    if (step === currentStep) return;

    if (step < currentStep) {
      setErrors({});
      setCurrentStep(step);
      return;
    }

    // 앞으로 가는 경우, 현재 단계부터 목표 단계까지 순차적으로 유효성 검사
    for (let i = 1; i < step; i++) {
      if (!validateStep(i)) {
        // 유효성 검사에 실패한 첫 번째 단계로 이동
        setCurrentStep(i);
        return;
      }
    }

    // 모든 중간 단계가 유효하면 목표 단계로 이동
    setErrors({});
    setCurrentStep(step);
  };

  const steps = [
    { title: "가게 정보" },
    { title: "사업자 정보" },
    { title: "영업 정보" },
    { title: "최종 확인" },
  ];

  const totalSteps = steps.length;

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.storeName.trim())
          newErrors.storeName = "가게 이름을 입력해주세요.";
        if (!formData.description.trim())
          newErrors.description = "가게 설명을 입력해주세요.";
        break;
      case 2:
        if (!formData.bizOwnerName.trim())
          newErrors.bizOwnerName = "사업자 이름을 입력해주세요.";
        if (!formData.bizNo.trim())
          newErrors.bizNo = "사업자 등록번호를 입력해주세요.";
        if (!formData.bizImg)
          newErrors.bizImg = "사업자 등록증을 첨부해주세요.";
        break;
      case 3:
        if (!formData.contactNo.trim())
          newErrors.contactNo = "연락처를 입력해주세요.";
        if (!formData.workingHour.trim())
          newErrors.workingHour = "영업 시간을 입력해주세요.";
        if (!formData.storeAddress.trim())
          newErrors.storeAddress = "가게 주소를 입력해주세요.";
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    console.log(formData, "check store");
    e.preventDefault();
    if (validateStep(1) && validateStep(2) && validateStep(3)) {
      dispatch(registerStore(formData));
    }
  };
  const handleFinish = () => {
    dispatch(resetRegisterStatus());

    navigate("/my-store");
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FirstStep
            data={formData}
            onChange={handleChange}
            onImageUpload={handleImageUpload}
            onProfileImageUpload={handleProfileImageUpload}
            errors={errors}
            resetImage={resetImage}
          />
        );
      case 2:
        return (
          <SecondStep
            data={formData}
            onChange={handleChange}
            onImageUpload={handleBizImageUpload}
            errors={errors}
            resetImage={resetImage}
          />
        );
      case 3:
        return (
          <ThirdStep
            data={formData}
            onChange={handleChange}
            onAddressSelect={handleAddressSelect}
            errors={errors}
          />
        );
      case 4:
        return <PreviewComponent data={formData} />;
      default:
        return null;
    }
  };

  if (success) {
    return <SuccessComponent onConfirm={handleFinish} />;
  }

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
        {renderStepContent()}
        <ActionsContainer>
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            이전
          </Button>
          {currentStep === totalSteps ? (
            <Button variant="primary" onClick={handleSubmit}>
              제출하기
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              다음
            </Button>
          )}
        </ActionsContainer>
      </MainContainer>
    </>
  );
};

export default CreateStorePage;
