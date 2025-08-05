import { useEffect, useRef } from "react";

const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

const loadKakaoScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      "script[src*='dapi.kakao.com']"
    );
    if (existingScript) {
      if (window.kakao && window.kakao.maps) {
        resolve();
      } else {
        existingScript.addEventListener("load", resolve);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

const KakaoMap = ({ lat, lng }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    loadKakaoScript().then(() => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.load) {
        console.error("Kakao Maps SDK 로드 실패 또는 load 함수 없음");
        return;
      }

      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        const center = new window.kakao.maps.LatLng(lat, lng);
        const map = new window.kakao.maps.Map(container, {
          center,
          level: 5,
        });

        new window.kakao.maps.Marker({
          position: center,
          map,
          title: "가게 위치",
        });
      });
    });
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
      }}
    ></div>
  );
};

export default KakaoMap;
