// src/components/common/Text.jsx
import styled from "styled-components";

const StyledText = styled.p`
  margin: 0;
  padding: 0;

  ${({ theme, variant = "body" }) => theme.typography[variant] || ""}

  color: ${({ theme, color }) => theme[color] || theme.text};

  font-weight: ${({ theme, weight }) =>
    theme.font.weight[weight] || theme.font.weight.regular};
`;

const Text = ({
  as = "p",
  children,
  variant = "body",
  color = "text",
  weight = "regular",
  ...props
}) => {
  return (
    <StyledText
      as={as}
      variant={variant}
      color={color}
      weight={weight}
      {...props}
    >
      {children}
    </StyledText>
  );
};

export default Text;
