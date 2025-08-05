import React from "react";
import Text from "../../../components/common/Text";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import KakaoMap from "../../../components/KakaoMap";

const Description = styled(Text)`
  white-space: pre-wrap; /* 이 한 줄이 핵심이옵니다. */
  line-height: 1.6; /* 가독성을 위한 줄 간격 설정이옵니다. */
  font-weight: 600;
`;
const Title = styled(Text)`
  margin: 15px 0px;
`;
const MapContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const InformationSection = ({ mapReady }) => {
  const storeData = useSelector((store) => store.viewStore.storeData);
  return (
    <div>
      <Title variant="h3" weight="bold">
        가게 정보
      </Title>
      {/* <Description variant="h5">{storeData.description}</Description> */}
      <Title variant="h3" weight="bold">
        가게 위치
      </Title>
      {/* <Description variant="h5">{storeData.storeAddress}</Description> */}
      <MapContainer>
        {mapReady && (
          <KakaoMap lat={37.5110678983636} lng={126.72956366886919} />
        )}
      </MapContainer>
    </div>
  );
};

export default InformationSection;
