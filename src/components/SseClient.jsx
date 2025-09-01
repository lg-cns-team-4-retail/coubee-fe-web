import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { EventSourcePolyfill } from "event-source-polyfill";

export default function SseListener() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const esRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectCountRef = useRef(0);
  const heartbeatTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);
  const { isLoggedIn } = useSelector((state) => state.user);

  const MAX_RECONNECT_ATTEMPTS = 10;
  const INITIAL_RECONNECT_DELAY = 2000; // 2초로 증가
  const MAX_RECONNECT_DELAY = 30000;
  const HEARTBEAT_TIMEOUT = 45000; // 45초 (서버 heartbeat 15초 + 여유시간)

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  const resetHeartbeatTimeout = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    heartbeatTimeoutRef.current = setTimeout(() => {
      console.warn("💔 Heartbeat timeout - attempting reconnection");
      if (esRef.current && esRef.current.readyState !== EventSource.CLOSED) {
        esRef.current.close();
      }
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

  const connectSSE = useCallback(() => {
    const token = getToken();
    if (!token || !isLoggedIn || isConnectingRef.current) {
      return;
    }

    if (esRef.current) {
      try {
        if (esRef.current.readyState !== EventSource.CLOSED) {
          esRef.current.close();
        }
      } catch (e) {
        console.debug("Error closing existing connection:", e);
      }
      esRef.current = null;
    }

    isConnectingRef.current = true;

    try {
      console.log(
        `🔄 SSE 연결 시도... (시도 횟수: ${reconnectCountRef.current + 1})`
      );

      // Native EventSource 사용 (더 안정적)
      const eventSource = new EventSourcePolyfill(
        `${API_BASE_URL}/notification/subscribe`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
          },
          heartbeatTimeout: 50000, // 50초로 증가
          silentTimeout: 10000, // 10초 대기
        }
      );

      esRef.current = eventSource;

      // 연결 성공
      eventSource.addEventListener("open", () => {
        console.log("✅ SSE 연결 성공");
        reconnectCountRef.current = 0;
        isConnectingRef.current = false;
        resetHeartbeatTimeout();
      });

      // 초기 연결 메시지
      eventSource.addEventListener("INIT", (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("🔗 SSE 초기화 완료:", data);
          resetHeartbeatTimeout();
        } catch (e) {
          console.log("🔗 SSE 초기화 완료:", event.data);
          resetHeartbeatTimeout();
        }
      });

      // Heartbeat 처리
      eventSource.addEventListener("HEARTBEAT", (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "initial_heartbeat") {
            console.log("💓 초기 Heartbeat 수신");
          } else {
            console.log("💓 Heartbeat 수신");
          }
          resetHeartbeatTimeout();
        } catch (e) {
          console.log("💓 Heartbeat 수신");
          resetHeartbeatTimeout();
        }
      });

      // 연결 교체 알림
      eventSource.addEventListener("CONNECTION_REPLACED", (event) => {
        console.log("🔄 연결이 다른 탭에서 교체됨:", event.data);
        cleanup();
        return;
      });

      // 주문 알림 처리
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

      // 일반 메시지 처리
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 SSE 메시지 수신:", data);
          resetHeartbeatTimeout();
          handleSSEMessage(data);
        } catch (err) {
          console.log("📨 SSE 원시 메시지:", event.data);
          resetHeartbeatTimeout();
        }
      };

      // 에러 처리
      eventSource.onerror = (error) => {
        isConnectingRef.current = false;

        // 타임아웃 에러는 경고로 처리
        const errorMsg =
          error.error?.message || error.message || "Unknown error";
        if (
          errorMsg.includes("1000 milliseconds") ||
          errorMsg.includes("timeout")
        ) {
          console.warn("⚠️ 연결 타임아웃 (정상적인 재연결 과정)");
        } else {
          console.error("❌ SSE 연결 오류:", error);
        }

        if (esRef.current) {
          try {
            if (esRef.current.readyState !== EventSource.CLOSED) {
              esRef.current.close();
            }
          } catch (e) {
            console.debug("Error closing connection on error:", e);
          }
          esRef.current = null;
        }

        clearTimeout(heartbeatTimeoutRef.current);

        // 재연결 시도
        if (reconnectCountRef.current < MAX_RECONNECT_ATTEMPTS && isLoggedIn) {
          const delay = getReconnectDelay();
          console.log(`🔄 ${Math.round(delay)}ms 후 재연결 시도...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectCountRef.current++;
            connectSSE();
          }, delay);
        } else {
          console.error("🚫 최대 재연결 시도 횟수 초과");
          reconnectCountRef.current = 0;
        }
      };
    } catch (err) {
      isConnectingRef.current = false;
      console.error("SSE 초기화 실패:", err);

      if (reconnectCountRef.current < MAX_RECONNECT_ATTEMPTS && isLoggedIn) {
        const delay = getReconnectDelay();
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectCountRef.current++;
          connectSSE();
        }, delay);
      }
    }
  }, [isLoggedIn, API_BASE_URL, resetHeartbeatTimeout, getReconnectDelay]);

  const handleOrderNotification = useCallback((data) => {
    console.log("주문 상태 변경:", {
      messageType: data.messageType,
      title: data.title,
      message: data.message,
      userId: data.userId,
    });

    if (Notification.permission === "granted") {
      new Notification(data.title, {
        body: data.message,
        icon: "/notification-icon.png",
        tag: `order-${data.userId}-${data.messageType}`,
      });
    }
  }, []);

  const handleSSEMessage = useCallback((data) => {
    switch (data.messageType) {
      case "SYSTEM":
        console.log("🔧 시스템 메시지:", data.message);
        break;
      case "PROMOTION":
        console.log("🎉 프로모션 알림:", data.message);
        break;
      default:
        console.log("📄 일반 메시지:", data);
    }
  }, []);

  const cleanup = useCallback(() => {
    console.log("🧹 SSE 연결 정리");

    isConnectingRef.current = false;

    if (esRef.current) {
      try {
        if (esRef.current.readyState !== EventSource.CLOSED) {
          esRef.current.close();
        }
      } catch (e) {
        console.debug("Error during cleanup:", e);
      }
      esRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }

    reconnectCountRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      cleanup();
      return;
    }

    if (esRef.current || isConnectingRef.current) {
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // 1초 후에 연결 시도 (서버 초기화 대기)
    const initialTimeout = setTimeout(() => {
      connectSSE();
    }, 1000);

    const handleVisibilityChange = () => {
      if (
        !document.hidden &&
        isLoggedIn &&
        !esRef.current &&
        !isConnectingRef.current
      ) {
        console.log("👁️ 페이지 활성화 - 연결 재시도");
        setTimeout(connectSSE, 500);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(initialTimeout);
      cleanup();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoggedIn, connectSSE, cleanup]);

  return null;
}
