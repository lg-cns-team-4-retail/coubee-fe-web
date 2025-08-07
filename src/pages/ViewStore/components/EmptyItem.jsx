import React from "react";
import styled from "styled-components";
import Text from "../../../components/common/Text";
import Button from "../../../components/common/Button";
import coubeeLogo from "../../../assets/coubeeLogin.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 1rem;
  border: 1px dashed grey;
  border-radius: 8px;
  background-color: white;
  text-align: center;
  margin: 20px 0;
  height: 80%;
  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    img {
      transition: transform 0.4s ease-in-out;
      transform: scaleX(-1);
    }
  }
`;
const LogoImage = styled.img`
  width: 280px;
  height: 300px;
  @media (max-width: 768px) {
    width: 140px;
    height: 150px;
  }
`;
const Message = styled(Text)`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CreateButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
`;

const EmptyItems = ({
  message = "등록된 상품이 없습니다.",
  buttonText = "상품 등록하기",
  onButtonClick,
}) => {
  return (
    <Container onClick={onButtonClick}>
      <LogoImage src={coubeeLogo} alt="create logo" />
      <Message>{message}</Message>
      {onButtonClick && (
        <CreateButton onClick={onButtonClick}>{buttonText}</CreateButton>
      )}
    </Container>
  );
};

export default EmptyItems;
