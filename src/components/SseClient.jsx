import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { EventSourcePolyfill } from "event-source-polyfill";
import { toast } from "react-toastify";
import axios from "axios";

export default function SseListener() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const esRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const heartbeatTimeoutRef = useRef(null);
  const connectionTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);
  const maxReconnectAttempts = 5;
  const { isLoggedIn } = useSelector((state) => state.user);

  // Toast 컴포넌트
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

  // 토큰 갱신 함수
  const refreshTokenAndGet = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("리프레시 토큰이 없습니다.");

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

  // Heartbeat 타임아웃 리셋
  const resetHeartbeatTimeout = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    heartbeatTimeoutRef.current = setTimeout(() => {
      console.warn("💔 Heartbeat timeout - 재연결 시도");
      if (esRef.current && esRef.current.readyState !== EventSource.CLOSED) {
        esRef.current.close();
      }
      esRef.current = null;
      connectSSE();
    }, 40000); // 40초 타임아웃 (적당히 단축)
  }, []);

  // 주문 알림 처리
  const handleOrderNotification = useCallback((data) => {
    console.log("📦 주문 알림 수신:", data);

    const { title, message, storeId, messageData } = data;
    const orderId = messageData.orderId;
    toast.info(
      ({ closeToast }) => (
        <ToastComponent
          closeToast={closeToast}
          title={title}
          message={message}
          url={`/view-store/${storeId}/orders/${orderId}`}
        />
      ),
      {
        autoClose: false,
        closeOnClick: false,
      }
    );

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/notification-icon.png",
        tag: `order-${data.userId || Date.now()}-${data.messageType}`,
      });
    }
  }, []);

  // SSE 연결 함수
  const connectSSE = useCallback(async () => {
    if (!isLoggedIn) {
      console.log("❌ 로그인되지 않아 연결 중단");
      return;
    }

    if (esRef.current || isConnectingRef.current) {
      console.log("⚠️ 이미 연결 중이거나 연결이 존재함");
      return;
    }

    isConnectingRef.current = true;

    try {
      // 토큰 만료 확인 및 갱신
      const expiresIn = localStorage.getItem("expiresIn");
      let token = localStorage.getItem("accessToken");

      if (!expiresIn || Date.now() >= parseInt(expiresIn, 10)) {
        console.log("🔄 토큰 갱신 시도...");
        token = await refreshTokenAndGet();
      }

      if (!token) {
        console.error("🚫 유효한 토큰이 없어 SSE 연결할 수 없습니다.");
        isConnectingRef.current = false;
        return;
      }

      console.log("🔄 SSE 연결 시도...");
      // console.log("🔗 연결 URL:", `${API_BASE_URL}/notification/subscribe`);
      // console.log("🔑 토큰 길이:", token.length);

      // 연결 타임아웃 설정 (10초로 단축)
      connectionTimeoutRef.current = setTimeout(() => {
        console.warn("⏰ 연결 타임아웃 - 10초 내 연결되지 않음");
        isConnectingRef.current = false;
        if (esRef.current) {
          esRef.current.close();
          esRef.current = null;
        }
        // 즉시 재시도
        setTimeout(() => {
          if (isLoggedIn && !esRef.current && !isConnectingRef.current) {
            connectSSE();
          }
        }, 2000);
      }, 10000);

      const eventSource = new EventSourcePolyfill(
        `${API_BASE_URL}/notification/subscribe`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          heartbeatTimeout: 30000, // 30초로 단축
          withCredentials: false,
        }
      );

      esRef.current = eventSource;

      // 연결 성공 시 즉시 로그
      eventSource.addEventListener("open", () => {
        console.log("🌐 SSE 연결 열림 (open event)");
        isConnectingRef.current = false;
      });

      eventSource.addEventListener("INIT", () => {
        console.log("✅ SSE 연결 완료 (INIT event)");
        isConnectingRef.current = false;
        reconnectAttempts.current = 0;
        // 연결 성공시 연결 타임아웃 해제
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }
        resetHeartbeatTimeout();
      });

      // Heartbeat 처리
      eventSource.addEventListener("HEARTBEAT", (event) => {
        console.log("💓 Heartbeat 수신");
        resetHeartbeatTimeout();
      });

      eventSource.addEventListener("ORDER_NOTIFICATION", (event) => {
        try {
          if (!event.data || event.data.trim() === "") {
            console.warn("⚠️ 빈 ORDER_NOTIFICATION 데이터");
            resetHeartbeatTimeout();
            return;
          }

          const data = JSON.parse(event.data);
          handleOrderNotification(data);
          resetHeartbeatTimeout();
        } catch (err) {
          console.error("주문 알림 파싱 오류:", {
            error: err.message,
            data: event.data,
          });
          resetHeartbeatTimeout(); // 파싱 에러여도 연결 유지
        }
      });

      eventSource.onmessage = (e) => {
        try {
          // 빈 데이터나 공백만 있는 경우 처리
          if (!e.data || e.data.trim() === "") {
            console.log("📨 빈 SSE 메시지 수신 (heartbeat일 가능성)");
            resetHeartbeatTimeout();
            return;
          }

          const data = JSON.parse(e.data);
          console.log("📨 SSE 메시지:", data);
          resetHeartbeatTimeout();
        } catch (err) {
          console.warn("⚠️ SSE 파싱 오류 (무시하고 계속):", {
            error: err.message,
            data: e.data,
            dataLength: e.data?.length,
          });
          // 파싱 에러가 발생해도 heartbeat는 리셋 (연결 유지)
          resetHeartbeatTimeout();
        }
      };

      eventSource.onerror = (err) => {
        console.error("❌ SSE 연결 오류:", err);
        console.error("🔍 Error details:", {
          type: err.type,
          message: err.message || err.error?.message,
          readyState: esRef.current?.readyState,
          url: esRef.current?.url,
        });

        isConnectingRef.current = false;

        if (esRef.current) {
          esRef.current.close();
          esRef.current = null;
        }

        // 타임아웃들 정리
        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current);
        }
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }

        // 빠른 재연결 시도
        if (reconnectAttempts.current < maxReconnectAttempts && isLoggedIn) {
          reconnectAttempts.current++;
          const delay = Math.min(2000 * reconnectAttempts.current, 10000); // 2초씩 증가
          console.log(
            `🔄 ${delay}ms 후 재연결 시도 (${reconnectAttempts.current}/${maxReconnectAttempts})`
          );

          setTimeout(() => {
            if (isLoggedIn) {
              connectSSE();
            }
          }, delay);
        } else {
          console.error("🚫 최대 재연결 시도 횟수 초과 - 10초 후 재시작");
          reconnectAttempts.current = 0;
          setTimeout(() => {
            if (isLoggedIn && !esRef.current) {
              console.log("🔄 재시작 - 연결 시도");
              connectSSE();
            }
          }, 10000);
        }
      };
    } catch (err) {
      console.error("SSE 초기화 실패:", err);
      isConnectingRef.current = false;
    }
  }, [isLoggedIn, handleOrderNotification, resetHeartbeatTimeout]);

  useEffect(() => {
    // 로그인 상태가 아니면 연결하지 않음
    if (!isLoggedIn) {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      isConnectingRef.current = false;
      reconnectAttempts.current = 0;
      return;
    }

    if (esRef.current || isConnectingRef.current) {
      return;
    }

    // 브라우저 알림 권한 요청
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    connectSSE();

    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      isConnectingRef.current = false;
      reconnectAttempts.current = 0;
    };
  }, [isLoggedIn, connectSSE]);

  return null;
}
