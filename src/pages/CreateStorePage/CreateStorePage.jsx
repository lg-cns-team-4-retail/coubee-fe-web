import React from "react";
import styled from "styled-components";
import ProgressBar from "./components/ProgressBar";
import FirstStep from "./components/FirstStep";
import SecondStep from "./components/SecondStep";
import ThirdStep from "./components/ThirdStep";
import PreviewComponent from "./components/PreviewComponent";
import Button from "../../components/common/Button";
import SuccessComponent from "./components/SuccessComponent";
import useCreateStoreForm from "../../hooks/useCreateStoreForm";

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
  const {
    currentStep,
    formData,
    errors,
    success,
    handleChange,
    resetImage,
    handleImageUpload,
    handleProfileImageUpload,
    handleBizImageUpload,
    handleAddressSelect,
    handleStepClick,
    handleNext,
    handlePrev,
    handleSubmit,
    handleFinish,
  } = useCreateStoreForm();

  const steps = [
    { title: "가게 정보" },
    { title: "사업자 정보" },
    { title: "영업 정보" },
    { title: "최종 확인" },
  ];

  const totalSteps = steps.length;

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
