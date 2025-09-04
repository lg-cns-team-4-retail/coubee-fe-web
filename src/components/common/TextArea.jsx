import React from "react";
import styled from "styled-components";

const TextareaWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const StyledLabel = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.primary};
  display: block;
  margin-bottom: 0.5rem;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.text_strong};
  background-color: ${({ theme }) => theme.bg_element1};
  resize: vertical; /* 사용자가 수직으로만 크기 조절 가능 */

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}33`};
  }
`;

const Textarea = ({ label, id, name, value, onChange, required, rows = 5 }) => {
  return (
    <TextareaWrapper>
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
      <StyledTextarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
      />
    </TextareaWrapper>
  );
};

export default Textarea;
