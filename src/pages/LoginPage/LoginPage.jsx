import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../../assets/coubeeLogin.svg";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  min-height: calc(100vh - 64px);
  background-color: #d7b88d80;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  border-radius: 12px;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.h3};
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.title};
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #d8d8e0;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.text_subtle};
    cursor: not-allowed;
  }
`;
const StyledTextButton = styled.button`
  background: transparent;
  border: none;
  margin-top: 10px;
  color: ${({ theme }) => theme.primary};

  padding: 8px 16px;
  cursor: pointer;
  font-size: 1.1rem; /* 기본 폰트 크기 (16px) */
  font-weight: 600;
  outline: none;
  width: 100%;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(142, 101, 89, 0.1);
  }

  &:active {
    background-color: rgba(142, 101, 89, 0.2);
    transform: translateY(1px);
  }
`;

const LoginImage = styled.img`
  height: 300px;
  width: 280px;
  @media (max-width: 768px) {
    height: 30vh;
    width: 280px;
  }
`;
const LoginImageContainer = styled.div`
  text-align: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(formData);
      navigate("/view");
    } catch (error) {
      console.error("회원가입 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginImageContainer>
        <LoginImage src={loginImg} alt="쿠비" />
      </LoginImageContainer>
      <LoginForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="userId">아이디</Label>
          <Input
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="아이디"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </SubmitButton>
        <StyledLink to="/registration">
          <StyledTextButton>회원가입</StyledTextButton>
        </StyledLink>
      </LoginForm>
    </LoginContainer>
  );
}
