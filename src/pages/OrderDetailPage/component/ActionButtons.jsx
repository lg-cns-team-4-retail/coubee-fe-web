import React, { useState } from "react";
import styled from "styled-components";
import { useUpdateOrderStatusMutation } from "../../../redux/api/orderApi";
import Button from "../../../components/common/Button";
import { toast } from "react-toastify";
import { MdQrCodeScanner } from "react-icons/md";
import OrderCancelModal from "./OrderCancelModal";
import QRScanModal from "./QRScanModal";

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem 0;
`;

const ActionButtons = ({ status, orderId }) => {
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const handleUpdate = async (newStatus) => {
    try {
      await updateStatus({ orderId, status: newStatus }).unwrap();
      toast.success(`주문 상태가 '${newStatus}'(으)로 변경되었습니다.`);
    } catch (err) {
      toast.error(err.data?.message || "상태 변경에 실패했습니다.");
    }
  };

  const renderButtons = () => {
    switch (status) {
      case "PAID":
        return (
          <>
            <Button
              variant="primary"
              onClick={() => handleUpdate("PREPARING")}
              disabled={isLoading}
            >
              주문 수락
            </Button>
            <Button
              variant="tertiary"
              onClick={() => setCancelModalOpen(true)}
              disabled={isLoading}
            >
              주문 취소
            </Button>
          </>
        );
      case "PREPARING":
        return (
          <Button
            variant="primary"
            onClick={() => handleUpdate("PREPARED")}
            disabled={isLoading}
          >
            포장 완료
          </Button>
        );
      case "PREPARED":
        return (
          <Button
            variant="primary"
            style={{ gap: "0.5rem" }}
            onClick={() => setQrModalOpen(true)}
          >
            <MdQrCodeScanner /> QR 스캔
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <ButtonContainer>
      {renderButtons()}
      {/* QR 코드 모달은 추후 구현 */}
      <OrderCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        orderId={orderId}
      />

      <QRScanModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </ButtonContainer>
  );
};

export default ActionButtons;
