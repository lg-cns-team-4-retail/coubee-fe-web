import axios from "axios";
import apiClient from ".";

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_REST_API_KEY;

export const getCoordinates = async (address) => {
  try {
    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      }
    );

    if (response.data.documents.length > 0) {
      const { x, y } = response.data.documents[0].address;
      return { longitude: x, latitude: y };
    }
    return null;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
