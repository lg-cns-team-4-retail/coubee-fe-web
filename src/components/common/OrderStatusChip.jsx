import React from "react";
import styled, { useTheme } from "styled-components";
import { getOrderStatusInfo } from "../../utils/statusHelper";

const ChipContainer = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-align: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  white-space: nowrap;
  flex-shrink: 0;
`;

const OrderStatusChip = ({ status }) => {
  const theme = useTheme();

  const { label, color } = getOrderStatusInfo(status, theme);

  return <ChipContainer backgroundColor={color}>{label}</ChipContainer>;
};

export default OrderStatusChip;
