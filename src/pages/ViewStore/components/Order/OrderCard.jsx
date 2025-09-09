import React, { useState } from "react";
import styled from "styled-components";
import Text from "../../../../components/common/Text";
import Button from "../../../../components/common/Button";
import { useNavigate } from "react-router-dom";
import OrderStatusChip from "../../../../components/common/OrderStatusChip";

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  border: 1px solid #eae4de;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  transition: transform 0.3s ease, box-shadow 0.3s ease;

  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const StatusChip = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "PENDING":
        return theme.accent;
      case "CONFIRMED":
        return theme.success;
      case "CANCELLED_ADMIN":
        return theme.error;
      default:
        return "#888";
    }
  }};
`;

const CustomerInfo = styled.div`
  margin-bottom: 1rem;
`;

const ItemList = styled.div`
  border-top: 1px solid #f0f0f0;
  margin-top: 1rem;
  padding-top: 1rem;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const DetailsToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
`;

const OrderCard = ({ order }) => {
  const [showDetails, setShowDetails] = useState(true);

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(order.orderId);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("ko-KR");

  return (
    <Card onClick={handleCardClick}>
      <CardHeader>
        <div>
          <Text weight="bold">{formatDate(order.createdAt)}</Text>
          <Text variant="small" weight="bold" color="text_secondary">
            주문 번호 - {order.orderId}
          </Text>
        </div>
        <OrderStatusChip status={order.status} />
      </CardHeader>

      <CustomerInfo>
        <Text weight="semibold">주문자: {order.customerInfo.nickname}</Text>
        <Text weight="bold" variant="h4" style={{ marginTop: "0.5rem" }}>
          총 {order.totalAmount.toLocaleString()}원
        </Text>
      </CustomerInfo>

      <DetailsToggle onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "주문 내역 숨기기" : "주문 내역 상세보기"}
      </DetailsToggle>

      {showDetails && (
        <ItemList>
          {order.items.map((item) => (
            <Item key={item.productId}>
              <Text>
                {item.productName} ({item.quantity}개)
              </Text>
              <Text weight="semibold">
                {(item.quantity * item.price).toLocaleString()}원
              </Text>
            </Item>
          ))}
        </ItemList>
      )}
    </Card>
  );
};

export default OrderCard;
