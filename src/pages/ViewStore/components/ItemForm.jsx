import React from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageContainer = styled.div`
  border: 3px solid green;
  flex: 1;
  @media (max-width: 768px) {
    width: 50%; /* 데스크탑에서 너비 50%를 차지합니다 */
    flex: none;
  }
`;

const LabelContainer = styled.div`
  flex: 1;
  border: 4px solid red;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ItemForm = ({ data }) => {
  return (
    <FormContainer>
      <ImageContainer>
        <h1>HI</h1>
      </ImageContainer>
      <LabelContainer>
        <h1>bye</h1>
      </LabelContainer>
    </FormContainer>
  );
};

export default ItemForm;
