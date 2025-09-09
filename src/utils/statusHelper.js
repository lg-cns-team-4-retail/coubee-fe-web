/**
 * 주문 상태에 따른 한글 명칭과 색상 정보를 반환하는 함수
 * @param {string} status - 주문 상태 (예: 'PAID')
 * @param {object} theme - styled-components의 theme 객체
 * @returns {{label: string, color: string}}
 */
export const getOrderStatusInfo = (status, theme) => {
  const defaultColors = {
    success: "#28a745",
    accent: "#ffc107",
    error: "#dc3545",
    grey: "#6c757d",
    dark: "#343a40",
    lightGrey: "#ced4da",
  };

  const statusMap = {
    PAID: {
      label: "결제 완료",
      color: theme?.success || defaultColors.success,
    },
    PREPARING: {
      label: "준비 중",
      color: theme?.accent || defaultColors.accent,
    },
    PREPARED: {
      label: "준비 완료",
      color: theme?.primary || defaultColors.primary,
    },
    RECEIVED: {
      label: "수령 완료",
      color: theme?.text_secondary || defaultColors.dark,
    },
    CANCELLED_ADMIN: {
      label: "가게 취소",
      color: theme?.error || defaultColors.error,
    },
    CANCELLED_USER: { label: "사용자 취소", color: defaultColors.grey },
  };

  const upperStatus = typeof status === "string" ? status.toUpperCase() : "";

  return (
    statusMap[upperStatus] || {
      label: upperStatus || "상태 없음",
      color: defaultColors.lightGrey,
    }
  );
};
