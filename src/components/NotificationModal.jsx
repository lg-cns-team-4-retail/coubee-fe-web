import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

// --- 스타일 컴포넌트 정의 (애니메이션 제거) ---
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SuccessIcon = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill="#4CAF50"
    />
  </svg>
);

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const ModalMessage = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: ${(props) => (props.hasButton ? "24px" : "8px")};
  line-height: 1.5;
`;

const ConfirmButton = styled.button`
  background-color: #8e6559;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #7a584e;
  }
`;

// --- 범용 모달 컴포넌트 (애니메이션 로직 제거) ---
const NotificationModal = ({
  isOpen,
  onClose,
  title,
  message,
  onSuccess,
  buttonText = "확인",
}) => {
  // isOpen이 false이면 아무것도 렌더링하지 않습니다.
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (onSuccess) {
      onSuccess();
    }
    // onSuccess 실행 후 모달을 닫습니다.
    onClose();
  };

  return (
    // 배경 클릭 시 onClose 함수를 직접 호출합니다.
    <ModalBackdrop onClick={onClose}>
      {/* 컨텐츠 영역 클릭 시 이벤트 전파를 막아 모달이 닫히지 않게 합니다. */}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <SuccessIcon />
        <ModalTitle>{title}</ModalTitle>
        <ModalMessage hasButton={!!onSuccess}>{message}</ModalMessage>

        {/* onSuccess prop이 존재할 때만 버튼을 렌더링합니다. */}
        {onSuccess && (
          <ConfirmButton onClick={handleConfirm}>{buttonText}</ConfirmButton>
        )}
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default NotificationModal;

/**
 * 
 * 
 *  사용처
 * 
      <NotificationModal
        isOpen={isSimpleModalOpen}
        onClose={() => setSimpleModalOpen(false)}
        title="보고 드리옵니다"
        message="모든 성문이 굳건히 닫혔음을 확인하였나이다."
      />


      <NotificationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="성공적으로 완수하였나이다"
        message="전하의 어명이 모든 백성에게 전달되었습니다."
        onSuccess={handleSuccessAction}
        buttonText="다음 명을 내린다"
      />
 */
