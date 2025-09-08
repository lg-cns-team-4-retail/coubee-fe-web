import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import landingVideo from "../../../assets/coubee-landing-video.mp4";

// HeroContainer: 비디오와 콘텐츠를 감싸는 최상위 컨테이너
const HeroContainer = styled.section`
  position: relative; // 자식 요소의 absolute 포지셔닝을 위한 기준점
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh; // 높이를 지정하여 비디오가 채울 공간을 확보
  padding: 2rem;
  background-color: #000; // 비디오 로딩 전 배경색
  overflow: hidden; // 컨테이너 밖으로 나가는 비디오 부분을 숨김
`;

// BackgroundVideo: 배경 역할을 하는 비디오
const BackgroundVideo = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); // 정중앙에 위치시키기
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 1; // 가장 아래에 위치
`;

// VideoOverlay: 텍스트 가독성을 위한 반투명 오버레이
const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); // 50% 투명도의 검은색
  z-index: 2; // 비디오 위에 위치
`;

// Content: 텍스트와 버튼을 담는 컨테이너
const Content = styled.div`
  position: relative; // 오버레이 위에 위치하도록 z-index 설정
  z-index: 3;
  max-width: 800px;
  text-align: center;
  color: #fff; // 텍스트 색상을 흰색으로
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7); // 텍스트 그림자 효과 추가
  color: #fff; // 텍스트 색상을 흰색으로
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7); // 텍스트 그림자 효과 추가
`;

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <HeroContainer>
      <BackgroundVideo autoPlay loop muted playsInline>
        <source src={landingVideo} type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </BackgroundVideo>
      <VideoOverlay />
      <Content>
        <Title>오프라인 매장과 온라인 고객을 가장 쉽게 연결하는 방법</Title>
        <Subtitle>
          복잡한 코딩 없이, 단 몇 번의 클릭만으로 당신의 가게를 위한 온라인 픽업
          스토어를 만드세요. 지금 바로 쿠비와 함께 스마트한 판매를 시작해보세요.
        </Subtitle>
        <Button onClick={() => navigate("/registration")}>
          지금 바로 시작하기
        </Button>
      </Content>
    </HeroContainer>
  );
};

export default HeroSection;
