import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStoreList } from "../../redux/slices/myStoreSlice";
import Button from "../../components/common/Button";
import StoreCard from "./components/StoreCard";
import Text from "../../components/common/Text";
import { resetViewStoreStatus } from "../../redux/slices/viewStoreSlice";

const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.bg || "#FDFBF7"};
  padding: 2rem;
  min-height: calc(100vh - 64px);
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export default function StoreListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storeList = useSelector((state) => state.myStore.storeList);

  const handleCreateButtonClick = () => {
    window.location.href = "/create-store";
  };

  useEffect(() => {
    dispatch(getStoreList());
    dispatch(resetViewStoreStatus());
  }, []);

  return (
    <PageContainer>
      <TitleContainer>
        <Text variant="h4" weight="bold">
          환진님의 매장 정보
        </Text>

        <Button onClick={handleCreateButtonClick}>매장 등록하기</Button>
      </TitleContainer>
      <CardGrid>
        {storeList.map((item) => (
          <StoreCard
            onClick={() => {
              navigate(`/view-store/${item.storeId}`);
            }}
            key={item.storeId}
            data={item}
          />
        ))}
      </CardGrid>
    </PageContainer>
  );
}
