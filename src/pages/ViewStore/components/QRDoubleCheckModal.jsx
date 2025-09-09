import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import {
  useLazyGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/api/orderApi";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Text from "../../../components/common/Text";
import OrderCard from "./Order/OrderCard";
import { convertKoreanToEnglish } from "../../../utils/keyboardMap";

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
  z-index: 1000;

  /* ✅ 수정된 부분: 다시 중앙 정렬로 변경하고 불필요한 스타일 제거 */
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  width: 90vw;
  max-width: 500px;
  border-radius: 16px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
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
  min-height: 200px;
  overflow-y: auto;
`;

const ScanGuideText = styled.p`
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1.5rem 0;
`;

const OrderInfoPreview = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModalFooter = styled.footer`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #eae4de;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const QrDoubleCheckModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("scan");
  const [scannedOrderId, setScannedOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const inputRef = useRef(null);

  const { storeId } = useSelector((state) => state.viewStore.storeData);

  const [triggerGetOrder, { isLoading: isFetching }] =
    useLazyGetOrderDetailsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  useEffect(() => {
    if (isOpen) {
      setStep("scan");
      setScannedOrderId("");
      setOrderDetails(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleFetchOrder = async () => {
    if (!scannedOrderId.trim()) {
      toast.warn("주문 번호를 스캔하거나 입력해주세요.");
      return;
    }
    try {
      const result = await triggerGetOrder({
        storeId,
        orderId: scannedOrderId,
      }).unwrap();
      setOrderDetails(result);
      setStep("confirm");
    } catch (err) {
      toast.error(err.data?.message || "유효하지 않은 주문 번호입니다.");
    }
  };

  const handleConfirmPickup = async () => {
    try {
      await updateStatus({
        orderId: orderDetails.orderId,
        status: "RECEIVED",
      }).unwrap();
      toast.success("픽업이 정상적으로 확인되었습니다.");
      onClose();
    } catch (err) {
      toast.error("이미 픽업된 물품입니다");
    }
  };
  const handleInputChange = (e) => {
    const convertedValue = convertKoreanToEnglish(e.target.value);
    setScannedOrderId(convertedValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleFetchOrder();
  };

  if (!isOpen) return null;

  return (
    <>
      <LockScroll />
      <ModalBackdrop>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>QR 픽업 확인</ModalTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            {step === "scan" && (
              <>
                <ScanGuideText>고객의 QR을 스캔해주세요</ScanGuideText>
                <Input
                  ref={inputRef}
                  id="orderIdInput"
                  value={scannedOrderId}
                  /* onChange={(e) => setScannedOrderId(e.target.value)} */
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="여기에 커서를 두고 스캔하세요"
                />
              </>
            )}
            {step === "confirm" && orderDetails && (
              <>
                <ScanGuideText>
                  {orderDetails?.status === "RECEIVED"
                    ? "이미 픽업이 완료 된 물품이에요"
                    : "주문 내역을 확인해주세요"}
                </ScanGuideText>

                <OrderCard order={orderDetails} />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={onClose}>
              취소
            </Button>
            {step === "scan" && (
              <Button onClick={handleFetchOrder} disabled={isFetching}>
                {isFetching ? "조회 중..." : "주문 조회하기"}
              </Button>
            )}
            {step === "confirm" && (
              <Button
                onClick={handleConfirmPickup}
                disabled={isUpdating || orderDetails?.status === "RECEIVED"}
                style={{ backgroundColor: "#10B981" }}
              >
                {isUpdating ? "처리 중..." : "픽업 완료 처리"}
              </Button>
            )}
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
    </>
  );
};

export default QrDoubleCheckModal;
