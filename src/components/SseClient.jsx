import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { EventSourcePolyfill } from "event-source-polyfill";
import { toast } from "react-toastify";
import axios from "axios";

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
      localStorage.setItem("expiresIn", access.expiresIn);

      console.log("✅ 토큰이 성공적으로 갱신되었습니다.");
      return access.token;
    } catch (error) {
      console.error("❌ 토큰 갱신 실패:", error);
      return null;
    }
  };

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

  /*  const connectSSE = useCallback(() => {
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
 */

  const handleOrderNotification = useCallback((data) => {
    console.log("주문 상태 변경:", {
      messageType: data.messageType,
      title: data.title,
      message: data.message,
      userId: data.userId,
    });

    const { title, message, storeId } = data;

    toast.info(
      ({ closeToast }) => (
        <ToastComponent
          closeToast={closeToast}
          title={title}
          message={message}
          url={"/view-store/1177"}
        />
      ),
      {
        autoClose: false, // 자동으로 닫히지 않는 기능은 유지
        closeOnClick: false, // 📜 라이브러리의 기본 클릭-닫기 기능은 비활성화합니다.
      }
    );

    if (Notification.permission === "granted") {
      new Notification(data.title, {
        body: data.message,
        icon: "/notification-icon.png",
        tag: `order-${data.userId}-${data.messageType}`,
      });
    }
  }, []);

  const connectSSE = useCallback(async () => {
    // 📜 2. async 함수로 변경
    if (!isLoggedIn || isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;

    try {
      // 📜 3. SSE 연결 전에 토큰 만료 여부를 확인하고 갱신합니다.
      const expiresIn = localStorage.getItem("expiresIn");
      let token = localStorage.getItem("accessToken");

      // 만료 시간이 지났거나, 만료 시간 정보가 없으면 갱신 시도
      if (!expiresIn || Date.now() >= parseInt(expiresIn, 10)) {
        console.log("🔄 Access Token이 만료되어 갱신을 시도합니다.");
        token = await refreshTokenAndGet(); // 새 토큰을 받아옵니다.
      }

      // 토큰이 여전히 없으면 (갱신 실패 포함) 함수를 종료합니다.
      if (!token) {
        console.error("🚫 유효한 토큰이 없어 SSE 연결을 시작할 수 없습니다.");
        isConnectingRef.current = false;
        return;
      }

      // 기존 연결이 있다면 정리합니다.
      if (esRef.current && esRef.current.readyState !== EventSource.CLOSED) {
        esRef.current.close();
      }
      esRef.current = null;

      console.log(`🔄 SSE 연결 시도...`);
      const eventSource = new EventSourcePolyfill(
        `${API_BASE_URL}/notification/subscribe`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 📜 유효성이 보장된 토큰 사용
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
          },
          heartbeatTimeout: 50000,
          silentTimeout: 10000,
        }
      );
      esRef.current = eventSource;

      // ... (이하 모든 event listener 로직은 기존과 동일)
      eventSource.addEventListener("open", () => {
        console.log("✅ SSE 연결 성공");
        reconnectCountRef.current = 0;
        isConnectingRef.current = false;
        resetHeartbeatTimeout();
      });
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
      eventSource.addEventListener("CONNECTION_REPLACED", (event) => {
        console.log("🔄 연결이 다른 탭에서 교체됨:", event.data);
        cleanup();
        return;
      });
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
      eventSource.onerror = (error) => {
        isConnectingRef.current = false;

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

        if (reconnectCountRef.current < 10 && isLoggedIn) {
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
    }
  }, [
    isLoggedIn,
    API_BASE_URL,
    resetHeartbeatTimeout,
    getReconnectDelay,
    handleOrderNotification,
  ]);

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
