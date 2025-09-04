import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useGetOrdersByStoreQuery } from "../../../../redux/api/orderApi";

import OrderCard from "./OrderCard";
import OrderSkeleton from "./OrderSkeleton";
import Text from "../../../../components/common/Text";

const SectionContainer = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled(Text)`
  font-weight: 600;
  font-size: 1.25rem;
`;

const EmptyOrders = styled.div`
  padding: 4rem;
  text-align: center;
  color: #888;
  border: 2px dashed #eee;
  border-radius: 12px;
`;

const OrderSection = () => {
  const { storeId } = useSelector((state) => state.viewStore.storeData);
  const [page, setPage] = useState(0);

  const {
    data: orderData,
    isLoading,
    isFetching,
  } = useGetOrdersByStoreQuery({ storeId, page, size: 10 }, { skip: !storeId });

  const orders =
    orderData?.content.filter((item) => item.status !== "PENDING") || [];
  const last = orderData?.last || false;
  const observerRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && !isFetching && !last) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [isFetching, last]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <SectionContainer>
      <Title>주문 내역</Title>
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)}

      {!isLoading &&
        orders.length > 0 &&
        orders.map((order) => <OrderCard key={order.orderId} order={order} />)}

      {isFetching &&
        !isLoading &&
        Array.from({ length: 2 }).map((_, i) => (
          <OrderSkeleton key={`fetching-${i}`} />
        ))}

      {!isFetching && !last && (
        <div ref={observerRef} style={{ height: "10px" }} />
      )}

      {!isLoading && orders.length === 0 && (
        <EmptyOrders>
          <Text>아직 받은 주문이 없습니다.</Text>
        </EmptyOrders>
      )}
    </SectionContainer>
  );
};

export default OrderSection;
