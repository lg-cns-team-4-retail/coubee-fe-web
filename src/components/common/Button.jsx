// src/components/common/Button.jsx
import styled, { css } from "styled-components";

const variants = {
  primary: css`
    background-color: ${({ theme }) => theme.primary};
    color: white;
    &:hover {
      opacity: 0.9;
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.text};
    &:hover {
      opacity: 0.9;
    }
  `,
  tertiary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.text_secondary};
    border: 1px solid ${({ theme }) => theme.border};
    &:hover {
      background-color: ${({ theme }) => theme.bg_component};
    }
  `,
  grey: css`
    background-color: #f0f0f0;
    color: #555;
    border: 1px solid ${({ theme }) => theme.border};
    &:hover {
      background-color: #e0e0e0;
      opacity: 1;
    }
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  cursor: pointer;
  border: none;
  transition: all 0.2s ease-in-out;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  ${({ variant }) => variants[variant] || variants.primary}

  &:disabled {
    background-color: ${({ theme }) => theme.text_subtle};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButton variant={variant} fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
