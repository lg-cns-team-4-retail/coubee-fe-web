import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUpdateOrderStatusMutation } from "../../../redux/api/orderApi";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

const LockScroll = createGlobalStyle` body { overflow: hidden; } `;
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContainer = styled.div`
  background-color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  width: 90vw;
  max-width: 500px;
  border-radius: 16px;
`;
const ModalHeader = styled.header`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eae4de;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ModalTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.25rem;
`;
const ModalBody = styled.div`
  padding: 2rem 1.5rem;
  text-align: center;
`;
const ScanGuideText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
`;
const ScanSubText = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin: 0 0 1.5rem 0;
`;
const ModalFooter = styled.footer`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #eae4de;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const QRScanModal = ({ isOpen, onClose }) => {
  const [scannedResult, setScannedResult] = useState("");
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100); // 약간의 딜레이 후 포커스
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!scannedResult.trim()) {
      toast.warn("주문 번호를 스캔해주세요.");
      return;
    }

    try {
      await updateStatus({
        orderId: scannedResult,
        status: "RECEIVED",
      }).unwrap();
      toast.success("픽업이 정상적으로 확인되었습니다.");
      onClose();
    } catch (err) {
      toast.error(err.data?.message || "픽업 확인에 실패했습니다.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <LockScroll />
      <ModalBackdrop>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>픽업 확인</ModalTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <ScanGuideText>고객의 QR을 스캔해주세요</ScanGuideText>
            <ScanSubText>
              한번 확정 후 되돌릴 수 없으니 신중하게 스캔 해주세요
            </ScanSubText>
            <Input
              ref={inputRef}
              label="주문 번호"
              id="orderIdInput"
              value={scannedResult}
              onChange={(e) => setScannedResult(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="여기에 커서를 두고 스캔하세요"
            />
          </ModalBody>
          <ModalFooter>
            {/* <Button variant="tertiary" onClick={onClose}>
              취소
            </Button> */}
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "확인 중..." : "스캔 완료 (픽업 확인)"}
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
    </>
  );
};

export default QRScanModal;
