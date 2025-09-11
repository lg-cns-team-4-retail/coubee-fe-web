import React from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApi";
import ProcessTracker from "./component/ProcessTracker";
import ActionButtons from "./component/ActionButtons";
import OrderDetailSkeleton from "./component/OrderDetailSkeleton";
import Text from "../../components/common/Text";
import { MdArrowBackIos } from "react-icons/md";

const PageContainer = styled.div`
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // 모바일 환경을 위해 간격 조정
  position: relative;

  @media (min-width: 768px) {
    margin: 2rem auto;
    gap: 2rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 16px;
  border: 1px solid #eae4de;
  padding: 1.5rem; // 모바일 패딩 조정
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const CustomerCard = styled(Card)`
  display: flex;
  /* 📜 모바일: 수직 정렬, 중앙 정렬 */
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;

  /* 📜 데스크톱: 수평 정렬 */
  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    gap: 1.5rem;
  }
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%; // 둥근 프로필 이미지로 변경
  object-fit: cover;
`;

const SectionTitle = styled(Text)`
  font-weight: 700;
  font-size: 1.1rem; // 모바일 글자 크기 조정
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem; // 아이템 간 간격 추가
`;

const TotalAmount = styled.div`
  border-top: 2px solid #f0f0f0;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  color: #333;
  font-size: 1.3rem; // 모바일 아이콘 크기
  width: 40px;
  transition: background-color 0.2s ease, color 0.2s ease;
  z-index: 10;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }

  &:hover {
    background-color: #f0f0f0;
    color: ${({ theme }) => theme.primary};
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  border-top: 2px solid #f0f0f0;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
`;

const OrderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // 간격 조정
  padding: 1rem 0;
`;

const OrderInfoText = styled(Text)`
  color: #6b7280;
  font-size: 0.9rem;
`;

const OrderTitle = styled(Text)`
  font-weight: 700;
  color: black;
  font-size: 1.25rem; // 모바일 글자 크기 조정
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const OrderQuote = (status) => {
  switch (status) {
    case "PAID":
      return "새로운 주문이 들어왔어요!";
    case "PREPARING":
      return "고객님의 물건을 준비해주세요";
    case "PREPARED":
      return "고객님을 기다리는 시간이에요";
    case "RECEIVED":
      return "오늘도 한 건 하셨군요!";
    default:
      return "주문 상태를 확인해주세요";
  }
};

const OrderDetailPage = () => {
  const { id: storeId, orderId } = useParams();
  const navigate = useNavigate();
  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderDetailsQuery(
    { storeId, orderId },
    { skip: !storeId || !orderId }
  );

  if (isLoading) return <OrderDetailSkeleton />;
  if (isError || !order)
    return <PageContainer>주문 정보를 불러오는 데 실패했습니다.</PageContainer>;

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)}>
        <MdArrowBackIos />
      </BackButton>

      {/* 주문 상태 카드 */}
      <Card>
        <OrderInfoContainer style={{ paddingTop: 0, marginTop: 0 }}>
          <OrderTitle as="h1">{OrderQuote(order.status)}</OrderTitle>
          <OrderInfoText>
            주문시간: {new Date(order.createdAt).toLocaleString("ko-KR")}
          </OrderInfoText>
          <OrderInfoText>주문번호: {order.orderId}</OrderInfoText>
        </OrderInfoContainer>

        <ProcessTracker
          currentStatus={order.status}
          history={order.statusHistory}
        />
        <ActionButtons status={order.status} orderId={orderId} />

        <ProfileContainer>
          <ProfileImage
            src={order.customerInfo.profileImageUrl}
            alt="profile"
          />
          <Text variant="h4" weight="bold">
            {order.customerInfo.nickname} 고객님
          </Text>
        </ProfileContainer>
      </Card>

      {/* 주문 목록 카드 */}
      <Card>
        <SectionTitle as="h3">주문 목록</SectionTitle>
        <ItemList>
          {order.items.map((item, index) => (
            <Item key={index}>
              <Text weight="bold" variant="h4">
                {item.productName} ({item.quantity}개)
              </Text>
              <Text weight="bold" variant="h4">
                {item.totalPrice.toLocaleString()}원
              </Text>
            </Item>
          ))}
        </ItemList>
        <TotalAmount>
          <Text weight="bold" variant="h4">
            결제 금액
          </Text>
          <Text weight="bold" variant="h4">
            {order.totalAmount.toLocaleString()}원
          </Text>
        </TotalAmount>
      </Card>
    </PageContainer>
  );
};

export default OrderDetailPage;
