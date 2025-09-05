// src/pages/OrderDetailPage/component/OrderCancelModal.jsx (신규 파일)

import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCancelOrderMutation } from "../../../redux/api/orderApi";
import Textarea from "../../../components/common/TextArea";
import Button from "../../../components/common/Button";

const LockScroll = createGlobalStyle` body { overflow: hidden; } `;

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
  padding: 1.5rem;
`;
const ModalFooter = styled.footer`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #eae4de;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const OrderCancelModal = ({ isOpen, onClose, orderId }) => {
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();

  const handleSubmit = async () => {
    if (!cancelReason.trim()) {
      toast.warn("취소 사유를 입력해주세요.");
      return;
    }
    try {
      await cancelOrder({ orderId, cancelReason }).unwrap();
      toast.success("주문이 정상적으로 취소되었습니다.");
      onClose();
    } catch (err) {
      toast.error(err.data?.message || "주문 취소에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <LockScroll />
      <ModalBackdrop>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>주문 취소</ModalTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <Textarea
              label="취소 사유를 입력해주세요."
              id="cancelReason"
              name="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="고객에게 전달될 취소 사유를 명확하게 기재해주세요."
              rows={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={onClose}>
              닫기
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ backgroundColor: "#EF4444", borderColor: "#EF4444" }} // Error color
            >
              {isLoading ? "취소 중..." : "주문 취소 확정"}
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
    </>
  );
};

export default OrderCancelModal;
