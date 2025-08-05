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
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const Main = styled.main`
  max-width: 100%;
  margin: 0 auto;
`;

const StoreContainer = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
  min-height: calc(100vh - 64px);
`;

const StoreBanner = styled.div`
  height: 12rem;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-image: url(${(props) => props.bgImage});
  @media (min-width: 768px) {
    height: 16rem;
  }
`;

const ProfileSection = styled.div`
  padding: 1rem;
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const ProfileInfo = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-top: -3rem;
  z-index: 10;
  @media (min-width: 640px) {
    margin-top: -3rem;
  }
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
  margin-top: 1.5rem;
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
  padding: 2rem 0;
`;

const ViewStorePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorFetching, setErrorFetching] = useState(false);

  const { loading, storeData, error } = useSelector((state) => state.viewStore);
  const [activeTab, setActiveTab] = useState("상품");
  const tabs = ["정보", "상품", "차트", "주문내역"];

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
      console.log("check", errorFetching);
      setErrorFetching(true);
    }
  }, [loading]);

  /*  if (loading === "pending" || !storeData) {
    return (
      <Main>
        <StoreSkeleton />
      </Main>
    );
  } */

  return (
    <Main>
      {loading === "pending" && <StoreSkeleton />}
      {loading === "succeeded" && (
        <StoreContainer>
          <StoreBanner bgImage={IMG_BASE_URL + storeData.backImg} />
          <ProfileSection>
            <ProfileInfo>
              <ProfileImage
                src={IMG_BASE_URL + storeData.profileImg}
                alt="가게 프로필 이미지"
              />
              <StoreInfo>
                <StoreName>{storeData.storeName}</StoreName>
                <StoreBranch>{storeData.branchName}</StoreBranch>
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

            <TabContent>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>

              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {activeTab} 콘텐츠가 여기에 표시됩니다.
              </h2>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                전하의 명에 따라 이 부분은 현재 비워두었나이다.
              </p>
            </TabContent>
          </ProfileSection>
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
