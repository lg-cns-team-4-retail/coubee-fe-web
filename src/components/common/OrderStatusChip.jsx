import React from "react";
import styled, { useTheme } from "styled-components";
import { getOrderStatusInfo } from "../../utils/statusHelper"; // 위에서 만든 파일 경로

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
  // styled-components의 ThemeProvider로부터 theme 객체를 가져옵니다.
  const theme = useTheme();

  // status 값에 맞는 라벨과 색상을 헬퍼 함수로부터 받아옵니다.
  const { label, color } = getOrderStatusInfo(status, theme);

  return <ChipContainer backgroundColor={color}>{label}</ChipContainer>;
};

export default OrderStatusChip;
