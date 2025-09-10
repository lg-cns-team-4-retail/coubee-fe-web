import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import regiImg from "../../assets/coubeeRegi.svg";
import { useDispatch } from "react-redux";
import easterImg from "../../assets/coubeeWelcome.svg";
import NotificationModal from "../../components/NotificationModal";
import { registerUser } from "../../redux/slices/userSlice";
const WEB_ROLE = import.meta.env.VITE_APP_ROLE;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0.75rem;
  min-height: calc(100vh - 64px);
  background-color: #d7b88d80;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  border-radius: 12px;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.h4};
  text-align: center;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
  color: ${({ theme }) => theme.title};
`;
const SubTitle = styled.h1`
  ${({ theme }) => theme.typography.p};
  text-align: center;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
  color: ${({ theme }) => theme.title};
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
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
  height: 180px;
  width: 280px;
  @media (max-width: 768px) {
    height: 20vh;
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

export default function RegistrationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickName: "",
    role: WEB_ROLE,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onSuccess: null,
    modalType: undefined,
    buttonText: "",
  });
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [easterCount, setEasterCount] = useState(1);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await dispatch(registerUser(formData)).unwrap();

      setModalState({
        isOpen: true,
        title: "회원가입 성공",
        message: "쿠비에 가입해주셔서 감사합니다!",
        onSuccess: () => {
          setModalState({ ...modalState, isOpen: false });
          navigate("/login");
        },
        buttonText: "로그인 하러 가기",
        modalType: "success",
      });
    } catch (err) {
      console.error("회원가입 실패:", err);
      setModalState({
        isOpen: true,
        title: "로그인 실패",
        message: err.message || "알 수 없는 오류가 발생했습니다.",
        onSuccess: () => setModalState({ ...modalState, isOpen: false }),
        buttonText: "닫기",
        modalType: "fail",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessAction = () => {
    navigate("/login");
  };

  const onClickEaster = () => {
    setEasterCount((prev) => prev + 1);
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: "",
      message: "",
      onSuccess: null,
      modalType: undefined,
      buttonText: "",
    });
  };

  return (
    <LoginContainer>
      <LoginImageContainer>
        <SubTitle>성공적인 판매까지, 단 3단계면 충분합니다</SubTitle>

        <Title>가장 쉬운 온라인 판매, 지금 바로 시작하세요</Title>
        <LoginImage
          onClick={onClickEaster}
          src={easterCount >= 6 ? easterImg : regiImg}
          alt="쿠비"
        />
      </LoginImageContainer>
      <LoginForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="username">아이디</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
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

        <InputGroup>
          <Label htmlFor="nickName">사용자 이름</Label>
          <Input
            id="nickName"
            name="nickName"
            placeholder="홍길동"
            value={formData.nickName}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "회원가입중..." : "회원가입"}
        </SubmitButton>
        <StyledLink to="/login">
          <StyledTextButton>로그인하러 가기</StyledTextButton>
        </StyledLink>
      </LoginForm>

      <NotificationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        onSuccess={modalState.onSuccess}
        buttonText={modalState.buttonText}
        modalType={modalState.modalType} // modalType prop 전달
      />
    </LoginContainer>
  );
}
