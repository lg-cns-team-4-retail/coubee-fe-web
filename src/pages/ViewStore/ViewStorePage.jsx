import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetViewStoreStatus,
  viewStoreDetail,
} from "../../redux/slices/viewStoreSlice";
import StoreSkeleton from "./components/StoreSkeleton";
import NotificationModal from "../../components/NotificationModal";
import InformationSection from "./components/InformationSection";
import ItemSection from "./components/ItemSection";
import useKakaoLoader from "../../components/useKakaoLoader";
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const Main = styled.div`
  max-width: 100%;
  margin: 0 auto;
  height: calc(100vh - 64px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StoreContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  @media (min-width: 1300px) {
    max-width: 1200px;
  }
`;

const StoreBanner = styled.img`
  height: 11.25em;
  width: 100%;
  object-fit: cover; /* 이미지가 잘리지 않고 채워지도록 수정 */
  flex-shrink: 0;
  @media (max-width: 768px) {
    height: 5.625em;
  }
`;

const ProfileAndNavContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
  flex-shrink: 0;
  width: 100%;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ProfileImage = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 9999px;
  border: 4px solid white;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  position: relative;

  @media (min-width: 640px) {
    width: 8rem;
    height: 8rem;
  }
`;
const ProfileImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -4rem;
  @media (min-width: 768px) {
    margin-top: -3rem;
  }
`;

const StoreInfo = styled.div`
  padding-bottom: 0.5rem;
  margin-top: 0.5rem;
`;

const StoreName = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  @media (min-width: 640px) {
    font-size: 1.875rem;
  }
`;

const TabNav = styled.nav`
  margin-top: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  width: 100%; /* 탭 하단 경계선이 전체 너비를 차지하도록 설정 */
`;

const TabNavContainer = styled.div`
  display: flex;
  justify-content: center; /* 탭 버튼들 중앙 정렬 */
  gap: 1.5rem;
  @media (min-width: 640px) {
    gap: 2rem;
  }
`;

const StyledTabButton = styled.button`
  padding: 0.5rem 0.25rem;
  font-size: 1.125rem;
  font-weight: ${({ active }) => (active ? "700" : "500")};
  transition: color 0.3s;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;

  color: ${({ active, theme }) => (active ? theme.primary : "#6b7280")};
  border-color: ${({ active, theme }) =>
    active ? theme.primary : "transparent"};

  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
`;

const TabContent = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 0 1rem 1rem 1rem;
`;

const TABS = {
  정보: InformationSection,
  상품: ItemSection,
  차트: () => <div>차트 정보</div>, // Placeholder
  주문내역: () => <div>주문 내역</div>, // Placeholder
};

const ViewStorePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mapLoading] = useKakaoLoader();

  const { loading, storeData, error } = useSelector((state) => state.viewStore);
  const [activeTab, setActiveTab] = useState("상품");

  const closeErrorModal = () => {
    dispatch(resetViewStoreStatus());
    navigate("/my-store");
  };

  useEffect(() => {
    dispatch(viewStoreDetail(id));
  }, [dispatch, id]);

  const ActiveSection = TABS[activeTab];

  return (
    <Main>
      {(loading === "pending" || loading === "idle") && <StoreSkeleton />}

      {loading === "succeeded" && storeData && (
        <>
          <StoreBanner
            src={`${IMG_BASE_URL}${storeData.backImg}`}
            alt="가게 배너 이미지"
          />
          <ProfileImageContainer>
            <ProfileImage
              src={`${IMG_BASE_URL}${storeData.profileImg}`}
              alt="가게 프로필 이미지"
            />
          </ProfileImageContainer>
          <StoreContainer>
            <ProfileAndNavContainer>
              <StoreInfo>
                <StoreName>{storeData.storeName}</StoreName>
              </StoreInfo>
              <TabNav>
                <TabNavContainer>
                  {Object.keys(TABS).map((tab) => (
                    <StyledTabButton
                      key={tab}
                      active={activeTab === tab}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </StyledTabButton>
                  ))}
                </TabNavContainer>
              </TabNav>
            </ProfileAndNavContainer>

            <ContentWrapper>
              <TabContent>
                <ActiveSection mapReady={!mapLoading} />
              </TabContent>
            </ContentWrapper>
          </StoreContainer>
        </>
      )}

      <NotificationModal
        isOpen={!!error}
        onClose={closeErrorModal}
        title={"매장 정보 불러오기 실패"}
        message={error}
        onSuccess={closeErrorModal}
        buttonText="확인"
        modalType={"fail"}
      />
    </Main>
  );
};

export default ViewStorePage;
