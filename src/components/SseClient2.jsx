import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { EventSourcePolyfill } from "event-source-polyfill";
import { toast } from "react-toastify";
import axios from "axios";

// 토스트 알림을 위한 커스텀 컴포넌트
const ToastComponent = ({ closeToast, title, message, url }) => {
  const handleClick = () => {
    if (url) {
      window.location.href = url;
    }
    closeToast();
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <h4 style={{ margin: 0, fontWeight: "bold" }}>{title}</h4>
      <p style={{ margin: 0, fontSize: "0.9em" }}>{message}</p>
    </div>
  );
};

// 토큰 갱신을 위한 독립 함수
const refreshTokenAndGet = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("리프레시 토큰이 없습니다.");

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const response = await axios.post(
      `${API_BASE_URL}/user/auth/refresh`,
      { token: refreshToken },
      { withCredentials: true }
    );

    const { access } = response.data.data;
    localStorage.setItem("accessToken", access.token);
    // 📜 **수정**: 로그인 로직과 일관성을 위해 'accessTokenExpiresIn' 키를 사용합니다.
    localStorage.setItem("accessTokenExpiresIn", access.expiresIn);

    console.log("✅ 토큰이 성공적으로 갱신되었습니다.");
    return access.token;
  } catch (error) {
    console.error("❌ 토큰 갱신 실패:", error);
    // 여기서 강제 로그아웃 등의 처리를 할 수 있습니다.
    return null;
  }
};

export default function SseListener() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const esRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectCountRef = useRef(0);
  const heartbeatTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);

  const { isLoggedIn } = useSelector((state) => state.user);
  const storeList = useSelector((state) => state.myStore.storeList);

  const MAX_RECONNECT_ATTEMPTS = 10;
  const INITIAL_RECONNECT_DELAY = 2000;
  const MAX_RECONNECT_DELAY = 30000;
  const HEARTBEAT_TIMEOUT = 45000;

  const resetHeartbeatTimeout = useCallback(() => {
    clearTimeout(heartbeatTimeoutRef.current);
    heartbeatTimeoutRef.current = setTimeout(() => {
      console.warn("💔 Heartbeat timeout - attempting reconnection");
      if (esRef.current) esRef.current.close();
      esRef.current = null;
      connectSSE();
    }, HEARTBEAT_TIMEOUT);
  }, []);

  const getReconnectDelay = useCallback(() => {
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY *
        Math.pow(2, Math.min(reconnectCountRef.current, 4)),
      MAX_RECONNECT_DELAY
    );
    return delay + Math.random() * 1000;
  }, []);

  const handleOrderNotification = useCallback(
    (data) => {
      const { title, message } = data;
      const storeNameMatch = message.match(/\[(.*?)\]/);
      const storeNameFromMessage = storeNameMatch ? storeNameMatch[1] : null;

      const targetStore = storeNameFromMessage
        ? storeList.find((store) => store.storeName === storeNameFromMessage)
        : null;

      const storeId = targetStore ? targetStore.storeId : null;
      const redirectUrl = storeId
        ? `/view-store/${storeId}/orders`
        : "/my-store";

      toast.info(
        ({ closeToast }) => (
          <ToastComponent
            closeToast={closeToast}
            title={title}
            message={message}
            url={redirectUrl}
          />
        ),
        { autoClose: false, closeOnClick: false }
      );

      if (Notification.permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "/notification-icon.png",
          tag: `order-${storeId || new Date().getTime()}`,
        });
      }
    },
    [storeList]
  );

  const handleSSEMessage = useCallback((data) => {
    // 서버에서 오는 다양한 타입의 메시지를 여기서 처리할 수 있습니다.
    switch (data.messageType) {
      default:
        console.log("📄 수신된 일반 메시지:", data);
    }
  }, []);

  const cleanup = useCallback(() => {
    console.log("🧹 SSE 연결 정리");
    isConnectingRef.current = false;
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    clearTimeout(reconnectTimeoutRef.current);
    clearTimeout(heartbeatTimeoutRef.current);
    reconnectCountRef.current = 0;
  }, []);

  const connectSSE = useCallback(async () => {
    if (!isLoggedIn || isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;

    try {
      // 📜 **핵심 수정**: 'accessTokenExpiresIn' 키를 사용하여 만료 시간을 올바르게 확인합니다.
      const expiresIn = localStorage.getItem("accessTokenExpiresIn");
      let token = localStorage.getItem("accessToken");

      if (!expiresIn || Date.now() >= parseInt(expiresIn, 10)) {
        console.log("🔄 Access Token이 만료되어 갱신을 시도합니다.");
        token = await refreshTokenAndGet();
      }

      if (!token) {
        console.error("🚫 유효한 토큰이 없어 SSE 연결을 시작할 수 없습니다.");
        isConnectingRef.current = false;
        return;
      }

      if (esRef.current) esRef.current.close();

      console.log(`🔄 SSE 연결 시도...`);
      const eventSource = new EventSourcePolyfill(
        `${API_BASE_URL}/notification/subscribe`,
        {
          headers: { Authorization: `Bearer ${token}` },
          heartbeatTimeout: 45000,
        }
      );
      esRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("✅ SSE 연결 성공");
        reconnectCountRef.current = 0;
        isConnectingRef.current = false;
        resetHeartbeatTimeout();
      };

      // 📜 **중요**: 서버에서 보내는 이벤트 이름과 정확히 일치해야 합니다. (대소문자 포함)
      eventSource.addEventListener("ORDER_NOTIFICATION", (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📦 주문 알림 수신:", data);
          resetHeartbeatTimeout();
          handleOrderNotification(data);
        } catch (err) {
          console.error("주문 알림 파싱 오류:", err);
        }
      });

      // 이름이 지정되지 않은 모든 메시지를 처리합니다. 디버깅에 유용합니다.
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // "HEARTBEAT" 나 "INIT" 같은 단순 문자열도 여기에 포함될 수 있습니다.
          if (typeof data === "object" && data.messageType) {
            console.log("📨 SSE 기본 메시지 수신 (JSON):", data);
            handleSSEMessage(data);
          } else {
            console.log("📨 SSE 기본 메시지 수신 (Raw):", event.data);
          }
          resetHeartbeatTimeout();
        } catch (err) {
          console.log("📨 SSE 원시 데이터:", event.data);
          resetHeartbeatTimeout();
        }
      };

      eventSource.onerror = (error) => {
        isConnectingRef.current = false;
        console.error("❌ SSE 연결 오류:", error);
        esRef.current.close();

        clearTimeout(heartbeatTimeoutRef.current);
        if (reconnectCountRef.current < MAX_RECONNECT_ATTEMPTS && isLoggedIn) {
          const delay = getReconnectDelay();
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectCountRef.current++;
            connectSSE();
          }, delay);
        } else {
          console.error("🚫 최대 재연결 시도 횟수 초과");
        }
      };
    } catch (err) {
      isConnectingRef.current = false;
      console.error("SSE 초기화 실패:", err);
    }
  }, [
    isLoggedIn,
    API_BASE_URL,
    handleOrderNotification,
    handleSSEMessage,
    getReconnectDelay,
    resetHeartbeatTimeout,
    cleanup,
  ]);

  useEffect(() => {
    if (!isLoggedIn) {
      cleanup();
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // 페이지가 처음 로드될 때 즉시 연결
    connectSSE();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 페이지가 비활성화되면 연결을 잠시 끊을 수 있습니다 (선택사항).
        // cleanup();
      } else {
        // 페이지가 다시 활성화되면 연결을 재시도합니다.
        if (!esRef.current && !isConnectingRef.current) {
          console.log("👁️ 페이지 활성화 - 연결 재시도");
          connectSSE();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cleanup();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoggedIn, connectSSE, cleanup]);

  return null;
}
