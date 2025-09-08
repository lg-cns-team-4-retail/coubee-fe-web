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

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const StatusSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

// 주문 상태 옵션 정의
const ORDER_STATUSES = [
  { value: "", label: "전체" },
  { value: "PAID", label: "결제됨" },
  { value: "PREPARING", label: "픽업 준비중" },
  { value: "PREPARED", label: "픽업 준비 완료" },
  { value: "RECEIVED", label: "수령완료" },
];

const OrderSection = () => {
  const { storeId } = useSelector((state) => state.viewStore.storeData);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState(""); // 빈 문자열은 '전체'를 의미

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
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500); // 500ms 지연

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  // 3. 필터 변경 시 페이지를 0으로 초기화
  useEffect(() => {
    setPage(0);
  }, [debouncedKeyword, status]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <SectionContainer>
      <Title>주문 내역</Title>

      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="상품명으로 검색 해보세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <StatusSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </StatusSelect>
      </FilterContainer>

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
