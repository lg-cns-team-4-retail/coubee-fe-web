// src/components/common/Card.jsx
import styled from "styled-components";

const CardContainer = styled.div`
  ${({ theme }) => theme.utils.card};
`;

const Card = ({ children, ...props }) => {
  return <CardContainer {...props}>{children}</CardContainer>;
};

export default Card;
