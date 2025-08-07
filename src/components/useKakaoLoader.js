import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_JS_API_KEY;

export default function useKakaoLoader() {
  const [loading, error] = useKakaoLoaderOrigin({
    appkey: KAKAO_MAP_KEY,
    libraries: ["clusterer", "drawing", "services"],
  });
  return [loading, error];
}
