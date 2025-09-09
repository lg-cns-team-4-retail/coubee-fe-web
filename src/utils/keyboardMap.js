// 한글 키를 영문 키로 매핑하는 객체
const KOR_TO_ENG_MAP = {
  ㅂ: "q",
  ㅈ: "w",
  ㄷ: "e",
  ㄱ: "r",
  ㅅ: "t",
  ㅛ: "y",
  ㅕ: "u",
  ㅑ: "i",
  ㅐ: "o",
  ㅔ: "p",
  ㅁ: "a",
  ㄴ: "s",
  ㅇ: "d",
  ㄹ: "f",
  ㅎ: "g",
  ㅗ: "h",
  ㅓ: "j",
  ㅏ: "k",
  ㅣ: "l",
  ㅋ: "z",
  ㅌ: "x",
  ㅊ: "c",
  ㅍ: "v",
  ㅠ: "b",
  ㅜ: "n",
  ㅡ: "m",

  ㅃ: "Q",
  ㅉ: "W",
  ㄸ: "E",
  ㄲ: "R",
  ㅆ: "T",
  ㅒ: "O",
  ㅖ: "P",
};

/**
 * 한글 입력값을 영문 QWERTY 자판 기준으로 변환하는 함수
 * @param {string} text - 변환할 텍스트
 * @returns {string} 영문으로 변환된 텍스트
 */
export const convertKoreanToEnglish = (text) => {
  return text
    .split("")
    .map((char) => KOR_TO_ENG_MAP[char] || char) // 맵에 있는 한글이면 영어로, 아니면 원래 문자로 반환
    .join("");
};
