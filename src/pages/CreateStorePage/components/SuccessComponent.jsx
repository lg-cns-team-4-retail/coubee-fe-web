import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import coubeeCreated from "../../../assets/coubeeCreated.svg";
import Button from "../../../components/common/Button";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 아이콘이 통통 튀는 애니메이션
const popIn = keyframes`
  0% { transform: scale(0.8); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const beeFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
    transform: translateX(-20px);
  }
 `;

const SuccessContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  background-color: ${({ theme }) => theme.bg_page || "#fff"};
  border: 1px solid ${({ theme }) => theme.border || "#eae4de"};
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: ${({ theme }) =>
    theme.utils?.shadow_lg || "0 10px 25px -5px rgba(0,0,0,0.1)"};
  animation: ${fadeIn} 0.7s ease-out forwards;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
`;

const IconWrapper = styled.div`
  margin-bottom: 1.5rem;
  animation: ${popIn} 0.9s 0.4s cubic-bezier(0.88, -0.55, 0.265, 1.55) both;

  svg {
    width: 80px;
    height: 80px;

    @media (max-width: 768px) {
      width: 60px;
      height: 60px;
    }
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.font?.size.h3 || "1.75rem"};
  font-weight: ${({ theme }) => theme.font?.weight.bold || "700"};
  color: ${({ theme }) => theme.text || "#333"};
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.font?.size.h4 || "1.5rem"};
  }
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.font?.size.body || "1rem"};
  color: ${({ theme }) => theme.text_secondary || "#666"};
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.font?.size.caption || "0.875rem"};
  }
`;

const SuccessComponent = ({
  title = "가게 등록 절차가 완료되었습니다!",
  message = "쿠비가 검토하고 연락드릴게요",
  buttonText = "확인",
  onConfirm,
}) => {
  return (
    <SuccessContainer>
      <IconWrapper>
        <img src={coubeeCreated} alt="icon" />
      </IconWrapper>
      <Title>{title}</Title>
      <Message>{message}</Message>
      <Button fullWidth onClick={onConfirm}>
        {buttonText}
      </Button>
    </SuccessContainer>
  );
};

export default SuccessComponent;
