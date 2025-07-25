import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import coubee from "../assets/coubee.svg";
import { FaSun, FaMoon, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const HeaderContainer = styled.header`
  background-color: #8e6559;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s, border-color 0.3s;
  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 64px;
  }
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;

  .logo-image {
    transition: transform 0.3s ease-in-out;
  }

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    color: white;
    transition: transform 0.3s ease-in-out;
    text-decoration: none;
    .logo-image {
      transform: scaleX(-1);
    }
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ;
    text-decoration: underline;
  }
`;
const NonNavButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;
const SecondButton = styled(Link)`
  background-color: #d7b88d;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 18px;
  text-decoration: none;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const MobileNav = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #d7b88d;

  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 4rem 2rem;
  gap: 1.5rem;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.8rem;
  }
`;

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const LoggedOutMenu = () => (
    <NavContainer>
      <NavButton to="/login">로그인</NavButton>
      <SecondButton to="/registration">회원가입</SecondButton>
      {/*       <NonNavButton onClick={handleToggleTheme}>
        {themeMode === "light" ? <FaMoon /> : <FaSun />}
      </NonNavButton> */}
    </NavContainer>
  );

  const LoggedInMenu = () => (
    <NavContainer>
      <SecondButton to="/ask">질문하기</SecondButton>

      <NonNavButton onClick={handleLogout}>
        <FaSignOutAlt /> 로그아웃
      </NonNavButton>
      {/*       <NonNavButton onClick={handleToggleTheme}>
        {themeMode === "light" ? <FaMoon /> : <FaSun />}
      </NonNavButton> */}
    </NavContainer>
  );

  return (
    <>
      <HeaderContainer>
        <LogoLink to="/view">
          <img
            src={coubee}
            alt="쿠비 로고"
            width={33}
            height={39}
            className="logo-image"
            priority
          />
          <span>쿠비</span>
        </LogoLink>

        {isLoggedIn ? <LoggedInMenu /> : <LoggedOutMenu />}

        <MobileMenuButton onClick={toggleMobileMenu}>
          <FaBars />
        </MobileMenuButton>
      </HeaderContainer>

      <MobileNav isOpen={isMobileMenuOpen}>
        <MobileMenuButton onClick={toggleMobileMenu} className="close-button">
          <FaTimes />
        </MobileMenuButton>
        {isLoggedIn ? (
          <>
            <SecondButton to="/ask">
              <FaFeatherAlt /> 질문하기
            </SecondButton>

            <NonNavButton>
              <FaSignOutAlt /> 로그아웃
            </NonNavButton>
            <NonNavButton onClick={handleToggleTheme}>
              {themeMode === "light" ? <FaMoon /> : <FaSun />}
            </NonNavButton>
          </>
        ) : (
          <>
            <NavButton to="/login" onClick={toggleMobileMenu}>
              로그인
            </NavButton>
            <NavButton to="/registration" onClick={toggleMobileMenu}>
              회원가입
            </NavButton>
            {/*             <NonNavButton onClick={handleToggleTheme}>
              {themeMode === "light" ? <FaMoon /> : <FaSun />}
            </NonNavButton> */}
          </>
        )}
      </MobileNav>
    </>
  );
}

export default Header;
