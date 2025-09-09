import React, { useState } from "react";
import styled from "styled-components";
import Text from "../../../../components/common/Text";
import { useNavigate } from "react-router-dom";
import OrderStatusChip from "../../../../components/common/OrderStatusChip";
import { useParams } from "react-router-dom";

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
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const OrderInfo = styled.div`
  flex: 1; /* 남는 공간을 모두 차지하도록 설정 */
  min-width: 0; /* flex 아이템이 내용보다 작아질 수 있도록 허용 */
`;

const OrderIdText = styled(Text)`
  word-break: break-all;
`;

const CustomerInfo = styled.div`
  margin-bottom: 1rem;
`;

const ItemList = styled.div`
  border-top: 1px solid #f0f0f0;
  margin-top: 1rem;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 0.75rem;
  border-radius: 8px;
`;

const ItemInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (
      e.target.closest("button") === e.currentTarget.querySelector("button")
    ) {
      e.stopPropagation();
      setShowDetails(!showDetails);
      return;
    }
    navigate(`/view-store/${id}/orders/${order.orderId}`);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("ko-KR");

  return (
    <Card onClick={handleCardClick}>
      <CardHeader>
        {/* ✅ 3. 기존 div와 Text를 새로운 스타일 컴포넌트로 교체 */}
        <OrderInfo>
          <Text weight="bold">{formatDate(order.createdAt)}</Text>
          <OrderIdText variant="small" weight="bold" color="text_secondary">
            주문 번호 - {order.orderId}
          </OrderIdText>
        </OrderInfo>
        <OrderStatusChip status={order.status} />
      </CardHeader>

      <CustomerInfo>
        <Text weight="semibold">주문자: {order.customerInfo.nickname}</Text>
        <Text weight="bold" variant="h4" style={{ marginTop: "0.5rem" }}>
          총 {order.totalAmount.toLocaleString()}원
        </Text>
      </CustomerInfo>

      <DetailsToggle>
        {showDetails ? "주문 내역 숨기기" : "주문 내역 상세보기"}
      </DetailsToggle>

      {showDetails && (
        <ItemList>
          {order.items.map((item) => (
            <Item key={item.productId}>
              <ItemInfoContainer>
                <Text weight="semibold">{item.productName}</Text>
                <Text variant="small" color="text_secondary">
                  {item.quantity}개
                </Text>
              </ItemInfoContainer>
              {item.totalPrice ? (
                <Text weight="bold">{item.totalPrice.toLocaleString()}원</Text>
              ) : (
                <Text weight="bold">
                  {(item.quantity * item.price).toLocaleString()}원
                </Text>
              )}
            </Item>
          ))}
        </ItemList>
      )}
    </Card>
  );
};

export default OrderCard;
