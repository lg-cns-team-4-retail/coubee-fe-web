import React, { useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FaTimes } from "react-icons/fa";
import ItemForm from "./ItemForm";

const LockScroll = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

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
  background-color: ${({ theme }) => theme.bg_page || "#fff"};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  width: 90vw;
  max-width: 700px;
  max-height: 85vh;
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  }
`;

const ModalHeader = styled.header`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border || "#eae4de"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
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
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

const ModalFooter = styled.footer`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border || "#eae4de"};
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;

  background-color: ${({ isPrimary, theme }) =>
    isPrimary ? theme.primary : theme.bg_element2};
  color: ${({ isPrimary, theme }) => (isPrimary ? "white" : theme.text)};
  border-color: ${({ isPrimary, theme }) =>
    isPrimary ? theme.primary : theme.border};

  &:hover {
    opacity: 0.9;
  }
`;

const ItemModal = ({ itemData, isOpen, onClose, onSubmit }) => {
  const formRef = useRef();

  if (!isOpen) return null;

  const handleFormSubmit = (formData) => {
    onSubmit(formData);
    onClose();
  };

  const triggerSubmit = () => {
    formRef.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  return (
    <>
      <LockScroll />
      <ModalBackdrop onClick={onClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              {itemData ? "물품 수정하기" : "물품 등록하기"}
            </ModalTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <ItemForm
              ref={formRef}
              initialData={itemData}
              onSubmit={handleFormSubmit}
            />
          </ModalBody>
          <ModalFooter>
            <StyledButton onClick={onClose}>취소</StyledButton>
            <StyledButton isPrimary onClick={triggerSubmit}>
              {itemData ? "수정하기" : "등록하기"}
            </StyledButton>
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
    </>
  );
};

export default ItemModal;
