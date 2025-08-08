// src/components/common/Input.jsx
import React from "react";
import styled, { css } from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.primary};
  display: block;
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.bg_page};
  color: ${({ theme }) => theme.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.secondary}40;
  }
`;

const StyledErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: ${({ theme }) => theme.font.size.small};
  margin-top: 0.25rem;
  margin-bottom: 0;
`;

const Input = ({ label, id, error, ...props }) => {
  return (
    <InputWrapper>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      <StyledInput id={id} {...props} />
      {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
    </InputWrapper>
  );
};

export default Input;
