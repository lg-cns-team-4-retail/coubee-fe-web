import React, { useState } from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import { FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import ImageUploader from "../../../components/ImageUploader";
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

const ItemModal = ({ itemData, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <LockScroll />
      <ModalBackdrop>
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
            <ItemForm />
          </ModalBody>
          <ModalFooter>
            <StyledButton onClick={onClose}>취소</StyledButton>
            <StyledButton isPrimary onClick={onClose}>
              {itemData ? "수정하기" : "등록하기"}
            </StyledButton>
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
    </>
  );
};

export default ItemModal;
