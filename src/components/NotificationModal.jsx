import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { MdOutlineCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";

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

const IconWrapper = styled.div`
  margin-bottom: 16px;
`;

// --- 아이콘을 조건부로 렌더링하는 컴포넌트 ---
const ModalIcon = ({ type }) => {
  if (type === "success") {
    return (
      <IconWrapper>
        <FaCheck size={48} color="#4CAF50" />
      </IconWrapper>
    );
  }
  if (type === "fail") {
    return (
      <IconWrapper>
        <MdOutlineCancel size={56} color="#EF4444" />
      </IconWrapper>
    );
  }
  if (type === "info") {
    return (
      <IconWrapper>
        <FaExclamationTriangle size={48} color="#8e6559" />
      </IconWrapper>
    );
  }
  return null;
};

const NotificationModal = ({
  isOpen,
  modalType,
  onClose,
  title,
  message,
  onSuccess,
  buttonText = "확인",
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <ModalBackdrop>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalIcon type={modalType} />
        <ModalTitle>{title}</ModalTitle>
        <ModalMessage hasButton={!!onSuccess}>{message}</ModalMessage>

        {onSuccess && (
          <ConfirmButton onClick={handleConfirm}>{buttonText}</ConfirmButton>
        )}
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default NotificationModal;
