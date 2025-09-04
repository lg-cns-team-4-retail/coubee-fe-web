import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import {
  useActivateHotdealMutation,
  useDeactivateHotdealMutation,
} from "../../../redux/api/hotdealApi";
import { useDispatch } from "react-redux";
import { updateHotdealStatus } from "../../../redux/slices/viewStoreSlice";

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
  overflow: hidden;
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const ModalFooter = styled.footer`
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #eae4de;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const HotdealEditModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { storeId, hotdeal } = useSelector(
    (state) => state.viewStore.storeData
  );
  const [formData, setFormData] = useState({
    saleRate: "",
    maxDiscount: "",
  });

  const [activateHotdeal, { isLoading: isActivating }] =
    useActivateHotdealMutation();
  const [deactivateHotdeal, { isLoading: isDeactivating }] =
    useDeactivateHotdealMutation();

  const isHotdealActive = hotdeal && hotdeal.hotdealStatus === "ACTIVE";

  useEffect(() => {
    if (isHotdealActive) {
      setFormData({
        saleRate: hotdeal.saleRate * 100, // % 단위로 표시
        maxDiscount: hotdeal.maxDiscount,
      });
    } else {
      setFormData({ saleRate: "", maxDiscount: "" });
    }
  }, [isOpen, hotdeal, isHotdealActive]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivate = async () => {
    try {
      const payload = {
        storeId,
        saleRate: parseFloat(formData.saleRate) / 100, // API를 위해 다시 소수점으로 변환
        maxDiscount: parseInt(formData.maxDiscount, 10),
      };
      const result = await activateHotdeal(payload).unwrap();
      dispatch(updateHotdealStatus(payload));
      toast.success("핫딜이 성공적으로 등록되었습니다.");
      onClose();
    } catch (err) {
      toast.error(err.data?.message || "핫딜 등록에 실패했습니다.");
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateHotdeal(storeId).unwrap();
      dispatch(updateHotdealStatus(null));
      toast.success("핫딜이 비활성화되었습니다.");
      onClose();
    } catch (err) {
      toast.error(err.data?.message || "핫딜 비활성화에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <LockScroll />
      <ModalBackdrop>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>핫딜 관리</ModalTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <Input
              label="할인율 (%)"
              id="saleRate"
              name="saleRate"
              type="number"
              value={formData.saleRate}
              onChange={handleChange}
              placeholder="예: 30"
              disabled={isHotdealActive}
            />
            <Input
              label="최대 할인 금액 (원)"
              id="maxDiscount"
              name="maxDiscount"
              type="number"
              value={formData.maxDiscount}
              onChange={handleChange}
              placeholder="예: 5000"
              disabled={isHotdealActive}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={onClose}>
              취소
            </Button>
            {isHotdealActive ? (
              <Button
                variant="secondary"
                onClick={handleDeactivate}
                disabled={isDeactivating}
              >
                {isDeactivating ? "해제 중..." : "핫딜 해제하기"}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleActivate}
                disabled={isActivating}
              >
                {isActivating ? "등록 중..." : "핫딜 등록하기"}
              </Button>
            )}
          </ModalFooter>
        </ModalContainer>
      </ModalBackdrop>
    </>
  );
};

export default HotdealEditModal;
