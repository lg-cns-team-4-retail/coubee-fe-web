import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetViewStoreStatus,
  viewStoreDetail,
} from "../../redux/slices/viewStoreSlice";
import StoreSkeleton from "./components/StoreSkeleton";
import NotificationModal from "../../components/NotificationModal";
import { useNavigate } from "react-router-dom";
import InformationSection from "./components/InformationSection";
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const Main = styled.main`
  max-width: 100%;
  margin: 0 auto;
`;

const StoreContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`;

const StoreBanner = styled.div`
  height: 12rem;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-image: url(${(props) => props.bgImage});
  flex-shrink: 0;
  @media (min-width: 768px) {
    height: 16rem;
  }
`;

const ProfileAndNavContainer = styled.div`
  padding: 1rem;
  position: relative; // ProfileInfo의 z-index를 위해 추가
  z-index: 10;
  flex-shrink: 0; // 이 부분은 높이가 고정되도록 설정
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;
const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden; // 이 컨테이너가 스크롤을 제어하도록 변경
  padding: 0 1.5rem; // TabContent의 padding을 이곳으로 이동
  display: flex;
  flex-direction: column;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: -3rem; // 배너 높이와 프로필 이미지 크기에 맞춰 조정
`;

const ProfileImage = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 9999px;
  border: 4px solid white;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  @media (min-width: 640px) {
    width: 8rem;
    height: 8rem;
  }
`;

const StoreInfo = styled.div`
  margin-left: 1rem;
  padding-bottom: 0.5rem; // TabNav와의 간격을 위해 추가
`;

const StoreName = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  @media (min-width: 640px) {
    font-size: 1.875rem;
  }
`;

const StoreBranch = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const TabNav = styled.nav`
  margin-top: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const TabNavContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  @media (min-width: 640px) {
    gap: 2rem;
  }
`;

const StyledTabButton = styled.button`
  padding: 0.5rem 0.25rem;
  font-size: 1.125rem;
  font-weight: 500;
  transition: color 0.3s;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;

  color: ${({ active }) => (active ? "#111827" : "#6b7280")};
  border-color: ${({ active }) => (active ? "#1f2937" : "transparent")};

  &:hover {
    color: #1f2937;
  }
`;

const TabContent = styled.div`
  overflow-y: auto;
  flex: 1; // ContentWrapper 내에서 남은 공간을 모두 차지
`;

const ViewStorePage = ({ mapReady }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorFetching, setErrorFetching] = useState(false);

  const { /* loading,  */ storeData, error } = useSelector(
    (state) => state.viewStore
  );
  const [activeTab, setActiveTab] = useState("상품");
  const tabs = ["정보", "상품", "차트", "주문내역"];
  const loading = "succeeded";
  const closeErrorModal = () => {
    setErrorFetching(false);
    dispatch(resetViewStoreStatus());
    navigate("/my-store");
  };

  useEffect(() => {
    dispatch(viewStoreDetail(id));
  }, []);

  useEffect(() => {
    if (loading === "failed") {
      setErrorFetching(true);
    }
  }, [loading]);

  const SectionRender = () => {
    if (activeTab === "정보") {
      return <InformationSection mapReady={mapReady} />;
    }
  };

  return (
    <Main>
      {loading === "pending" && <StoreSkeleton />}
      {loading === "succeeded" && (
        <StoreContainer>
          <StoreBanner
            bgImage={storeData ? IMG_BASE_URL + storeData.backImg : ""}
          />

          {/* --- ⬇️ JSX 구조 변경 ⬇️ --- */}
          <ProfileAndNavContainer>
            <ProfileInfo>
              <ProfileImage
                src={storeData ? IMG_BASE_URL + storeData.profileImg : ""}
                alt="가게 프로필 이미지"
              />
              <StoreInfo>
                {/* <StoreName>{storeData.storeName}</StoreName> */}
                <StoreName>{"가게"}</StoreName>
              </StoreInfo>
            </ProfileInfo>
            <TabNav>
              <TabNavContainer>
                {tabs.map((tab) => (
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
              <SectionRender />
            </TabContent>
          </ContentWrapper>
        </StoreContainer>
      )}

      <NotificationModal
        isOpen={errorFetching}
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
