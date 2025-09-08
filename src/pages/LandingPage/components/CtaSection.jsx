import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";

const CtaContainer = styled.section`
  padding: 6rem 2rem;
  background-color: ${({ theme }) => theme.secondary}40;
  text-align: center;
`;

const CtaTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
`;

const CtaText = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CtaSection = () => {
  const navigate = useNavigate();
  return (
    <CtaContainer>
      <CtaTitle>지금 바로 당신의 비즈니스를 성장시키세요</CtaTitle>
      <CtaText>
        쿠비와 함께라면 온라인 판매가 그 어느 때보다 쉬워집니다. 지금 가입하고
        새로운 고객들을 만나보세요.
      </CtaText>
      <Button onClick={() => navigate("/registration")} size="large">
        무료로 시작하기
      </Button>
    </CtaContainer>
  );
};

export default CtaSection;
