"use client";
import { createGlobalStyle, css } from "styled-components";

// =============================================================================
// 🎨 COLOR PALETTE (색상 팔레트)
// =============================================================================

export const lightTheme = {
  name: "light",
  primary: "#8E6559", // 주색 (Warm Brown)
  secondary: "#D7B88D", // 부색 (Soft Gold)
  accent: "#E59866", // 강조색 (Soft Terracotta)
  bg: "#f2f3f7", // 전체 배경색 (Off-White Cream)
  bg_page: "#FFFFFF", // 페이지/카드 배경색 (Pure White)
  bg_component: "#F3EDE2", // 컴포넌트 배경색 (Light Beige)
  text: "#433431", // 주 텍스트 색상 (Dark Brown)
  text_secondary: "#7A6A65", // 부 텍스트 색상 (Medium Brown-Gray)
  text_subtle: "#A89E9A", // 보조 텍스트 색상 (Light Brown-Gray)
  border: "#EAE4DE", // 테두리 색상 (Warm Light Gray)
  success: "#10B981",
  error: "#EF4444",
  title: "#574F4F",
};

// 새로운 라이트 모드 테마와 조화를 이루는 다크 모드 테마
export const darkTheme = {
  name: "dark",
  primary: "#B99081", // 주색 (Lighter Warm Brown)
  secondary: "#E8D0A9", // 부색 (Lighter Soft Gold)
  accent: "#F0B286", // 강조색 (Lighter Terracotta)
  bg: "#211D1C", // 전체 배경색 (Very Dark Brown)
  bg_page: "#3A3230", // 페이지/카드 배경색 (Dark Brown)
  bg_component: "#4F4644", // 컴포넌트 배경색 (Medium-Dark Brown)
  text: "#F3EFE9", // 주 텍스트 색상 (Light Cream)
  text_secondary: "#B8AEAA", // 부 텍스트 색상 (Soft Beige-Gray)
  text_subtle: "#857E7B", // 보조 텍스트 색상 (Medium Beige-Gray)
  border: "#4F4644", // 테두리 색상 (Dark Brown-Gray)
  success: "#34D399",
  error: "#F87171",
  title: "574F4F",
};

// =============================================================================
// ✍️ TYPOGRAPHY (타이포그래피)
// =============================================================================

const font = {
  family: {
    main: "'SUIT', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif",
  },
  size: {
    h1: "2.5rem", // 40px
    h2: "2rem", // 32px
    h3: "1.75rem", // 28px
    h4: "1.5rem", // 24px

    body: "1rem", // 16px
    caption: "0.875rem", // 14px
    small: "0.75rem", // 12px
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// =============================================================================
// 🧱 SHARED STYLES (공유 스타일)
// =============================================================================

const utils = {
  shadow_sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  shadow_md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  shadow_lg:
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  card: `
    background-color: ${({ theme }) => theme.bg_page};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border};
    box-shadow: ${({ theme }) => theme.utils.shadow_md};
    padding: 1.5rem;
  `,
};

const typography = {
  h1: css`
    font-size: ${({ theme }) => theme.font.size.h1}; /* 40px */
    @media (max-width: 768px) {
      font-size: 2rem; /* 32px */
    }
  `,
  h2: css`
    font-size: ${({ theme }) => theme.font.size.h2}; /* 32px */
    @media (max-width: 768px) {
      font-size: 1.5rem; /* 24px */
    }
  `,
  h3: css`
    font-size: ${({ theme }) => theme.font.size.h3}; /* 28px */
    @media (max-width: 768px) {
      font-size: 1.25rem; /* 20px */
    }
  `,
  h4: css`
    font-size: ${({ theme }) => theme.font.size.h4}; /* 24px */
    @media (max-width: 768px) {
      font-size: 1.125rem; /* 18px */
    }
  `,
  body: css`
    font-size: ${({ theme }) => theme.font.size.body}; /* 16px */
    @media (max-width: 768px) {
      font-size: 0.9rem; /* 14.4px */
    }
  `,
  caption: css`
    font-size: ${({ theme }) => theme.font.size.caption}; /* 14px */
  `,
  small: css`
    font-size: ${({ theme }) => theme.font.size.small}; /* 12px */
  `,
};

// =============================================================================
// 🌐 GLOBAL STYLE (전역 스타일)
// =============================================================================

export const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
  @import url('https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/variable/woff2/SUIT-Variable.css');

   * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
  }

  body {
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    font-family: ${({ theme }) => theme.font.family.main};
    font-weight: ${({ theme }) => theme.font.weight.regular};
    line-height: 1.6;
    transition: background-color 0.3s, color 0.3s;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.font.weight.bold};
    color: ${({ theme }) => theme.text};
  }
  
  p {
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  * {
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
  }

  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-track {
    background-color: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.5); 
    }
  }
  *::-webkit-scrollbar-button {
    display: none; 
  }
`;

// 테마 객체에 font와 utils를 포함하여 export
lightTheme.font = font;
darkTheme.font = font;
lightTheme.utils = utils;
darkTheme.utils = utils;
lightTheme.typography = typography;
darkTheme.typography = typography;
