"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "@/utils/axiosConfig";
import { useSearchParams } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./popup.css";

// form-data 형식의 메시지를 객체로 변환하는 함수 (예: "송신자 : test@3 메세지 : ㅇㅇ")
const parseFormDataMessage = (str: string) => {
  const regex = /송신자\s*:\s*(.*?)\s*메세지\s*:\s*(.*)/;
  const match = str.match(regex);
  if (match) {
    return { sEmail: match[1], content: match[2] };
  }
  return { sEmail: "알 수 없음", content: str };
};

const MessageAlram = () => {
  // URL의 쿼리 파라미터에서 대상 이메일(채팅 상대방)을 가져옴 (옵션)
  const searchParams = useSearchParams();
  const targetEmail = searchParams.get("email");

  // 현재 로그인한 사용자의 이메일은 localStorage에서 가져옴
  const userEmail = localStorage.getItem("userEmail");

  // 채팅 관련 상태 관리
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // 읽지 않은(새) 메시지 수
  const [unreadCount, setUnreadCount] = useState(0);

  // WebSocket(STOMP) 클라이언트 참조
  const stompClient = useRef<Client | null>(null);

  // 1. WebSocket 연결 및 구독 설정
  useEffect(() => {
    if (!userEmail) return; // targetEmail 없이도 연결

    const socket = new SockJS("http://13.213.242.176:8081/chat/ws");

    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공!");
        stompClient.current?.subscribe(`/chat/sub/${userEmail}`, (response) => {
          let chatMessage;
          try {
            chatMessage = JSON.parse(response.body);
          } catch (error) {
            console.warn("JSON 파싱 실패, form-data 형식으로 처리:", response.body);
            chatMessage = parseFormDataMessage(response.body);
          }
          // 기본 값 설정 (필요시)
          if (!chatMessage.sEmail) {
            chatMessage.sEmail = "알 수 없음";
          }
          if (!chatMessage.content) {
            chatMessage.content = response.body;
          }
          // 자신이 보낸 메시지가 아니라면 unreadCount 증가 및 로그 출력
          if (chatMessage.sEmail !== userEmail) {
            setUnreadCount((prev) => prev + 1);
            // chatMessage.content를 파싱해서 송신자와 메시지 내용만 추출
            const parsed = parseFormDataMessage(chatMessage.content);
            console.log(
              `새 메시지 도착 - 송신자: ${parsed.sEmail}, 메시지: ${parsed.content}`
            );
          }
          setMessages((prevMessages) => [...prevMessages, chatMessage]);
        });
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [userEmail, targetEmail]);

  // 2. 서버에서 채팅 기록 불러오기 (targetEmail이 있을 때만)
  const fetchChatHistory = async () => {
    if (!userEmail || !targetEmail) return;
    setLoading(true);
    try {
      console.log("📥 채팅 기록 불러오기...");
      const response = await axios.get(
        `/chat/history?sEmail=${userEmail}&rEmail=${targetEmail}`
      );
      if (response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("🚨 채팅 기록 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. 채팅창 열기: 채팅 기록 불러온 후 unreadCount 초기화
  const handleOpenChat = async () => {
    if (!userEmail) {
      alert("로그인이 필요합니다.");
      return;
    }
    await fetchChatHistory();
    setUnreadCount(0);
    setIsChatOpen(true);
  };

  // 4. 메시지 전송
  const sendMessage = () => {
    if (!stompClient.current || !message.trim() || !targetEmail) return;
    // sender 변수를 선언하여 송신자 이메일을 저장
    const sender = userEmail;
    const chatMessage = {
      sEmail: sender,
      rEmail: targetEmail,
      content: message,
    };
    stompClient.current.publish({
      destination: "/chat/pub/send",
      body: JSON.stringify(chatMessage),
    });
    setMessages((prevMessages) => [...prevMessages, chatMessage]);
    setMessage("");
  };

  return (
    <div>
      {/* 채팅창 열기 버튼에 unreadCount 배지를 표시 */}
      <button onClick={handleOpenChat}>
        채팅 열기 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isChatOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50">
          <div className="chat-popup">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {targetEmail ? `${targetEmail}님과의 채팅` : "전체 채팅"}
            </h2>

            {/* 채팅 기록 영역 */}
            {loading ? (
              <p>로딩 중...</p>
            ) : (
              <div className="max-h-64 overflow-y-auto p-2 border rounded-lg bg-gray-100 mb-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 my-1 rounded-lg ${
                      msg.sEmail === userEmail ? "bg-blue-200 text-right" : "bg-gray-200 text-left"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 메시지 입력 및 전송 영역 */}
            <div className="chat-messageinput">
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>전송</button>
            </div>

            {/* 채팅창 닫기 버튼 */}
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-3 right-3 text-gray-700 hover:text-red-500 text-xl"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageAlram;
