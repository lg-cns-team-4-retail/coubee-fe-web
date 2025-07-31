import React, { useState } from "react";
import styled, { css } from "styled-components";
import DaumPostcode from "react-daum-postcode";
import { getCoordinates } from "../../../api/mapApi";
const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
`;

const Section = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 18px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const FormLabel = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
  display: block;
  margin-bottom: 0.5rem;
  ${(props) =>
    props.required &&
    css`
      &::after {
        content: "";
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #8e6559;
        margin-left: 4px;

        position: relative;
        top: -2px;
      }
    `}
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;
const FormTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
`;

const ErrorMessage = styled.p`
  color: #d9534f;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const AddressSearchButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ThirdStep = ({ data, onChange, onAddressSelect, errors }) => {
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const handleComplete = async (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    const coordinates = await getCoordinates(fullAddress);
    console.log(coordinates);
    onAddressSelect({
      storeAddress: fullAddress,
      ...coordinates,
    });

    setIsPostcodeOpen(false);
  };

  return (
    <StepContainer>
      <Section>
        <SectionTitle>영업 정보</SectionTitle>
        <div>
          <FormLabel required htmlFor="contactNo">
            연락처
          </FormLabel>
          <FormInput
            id="contactNo"
            placeholder="예: 010-1234-5678"
            value={data.contactNo}
            onChange={onChange}
          />
          {errors.contactNo && <ErrorMessage>{errors.contactNo}</ErrorMessage>}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <FormLabel required htmlFor="workingHour">
            영업 시간
          </FormLabel>
          <FormTextArea
            id="workingHour"
            placeholder="예: 평일 09:00 ~ 18:00"
            value={data.workingHour}
            onChange={onChange}
          />
          {errors.workingHour && (
            <ErrorMessage>{errors.workingHour}</ErrorMessage>
          )}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <FormLabel required>가게 주소</FormLabel>
          <FormInput
            id="storeAddress"
            placeholder="예: 서울특별시 중구 필동로 1길 30"
            value={data.storeAddress}
            onClick={() => setIsPostcodeOpen(true)}
            readOnly
          />
          {/*           <AddressSearchButton onClick={() => setIsPostcodeOpen(true)}>
            주소 검색
          </AddressSearchButton> */}
          {errors.storeAddress && (
            <ErrorMessage>{errors.storeAddress}</ErrorMessage>
          )}
        </div>
      </Section>

      {isPostcodeOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "400px", background: "white", padding: "20px" }}>
            <DaumPostcode onComplete={handleComplete} />
            <AddressSearchButton
              onClick={() => setIsPostcodeOpen(false)}
              style={{ marginTop: "10px" }}
            >
              닫기
            </AddressSearchButton>
          </div>
        </div>
      )}
    </StepContainer>
  );
};

export default ThirdStep;
