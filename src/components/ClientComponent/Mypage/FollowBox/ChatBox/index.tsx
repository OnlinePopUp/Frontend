"use client";
import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatBoxProps {
  recipientEmail: string | null;
  closeChat: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ recipientEmail, closeChat }) => {
  const [message, setMessage] = useState(""); // ✅ 입력된 메시지
  const [messages, setMessages] = useState<any[]>([]); // ✅ 채팅 메시지 목록 (기존 채팅 기록 + 실시간 메시지)
  const userEmail = localStorage.getItem("userEmail"); // ✅ 보내는 사람 이메일
  const stompClient = useRef<Client | null>(null); // ✅ STOMP 클라이언트 저장

  useEffect(() => {
    if (!userEmail || !recipientEmail) {
      console.warn("🚨 이메일 정보가 없습니다. WebSocket 연결 중단.");
      return;
    }

    // ✅ 채팅 기록 불러오기 (최초 실행 시)
    const fetchChatHistory = async () => {
      try {
        console.log("📥 채팅 기록 불러오기...");
        const response = await fetch(
          `http://47.130.76.132:8080/chat/history?sEmail=${userEmail}&rEmail=${recipientEmail}`
        );
        const data = await response.json();
        setMessages(data); // ✅ 불러온 채팅 기록을 저장
        console.log("📜 채팅 기록:", data);
      } catch (error) {
        console.error("🚨 채팅 기록을 불러오는 중 오류 발생:", error);
      }
    };

    fetchChatHistory(); // ✅ 채팅 기록 가져오기

    // ✅ WebSocket 서버 연결
    const socket = new SockJS("http://13.213.242.176:8081/chat/ws"); // WebSocket 엔드포인트
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // ✅ 자동 재연결 (5초 후)
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공!");

        // ✅ 메시지 구독
        stompClient.current?.subscribe(`/chat/sub/${userEmail}`, (response) => {
          const chatMessage = JSON.parse(response.body);
          console.log("📩 수신된 메시지:", chatMessage);

          if (chatMessage.rEmail === userEmail || chatMessage.sEmail === userEmail) {
            setMessages((prevMessages) => [...prevMessages, chatMessage]); // ✅ 새 메시지를 추가
          }
        });
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP 오류:", frame.headers["message"]);
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate(); // ✅ 컴포넌트 언마운트 시 WebSocket 해제
    };
  }, [userEmail, recipientEmail]);

  // ✅ 메시지 전송 함수
  const sendMessage = () => {
    if (stompClient.current && message.trim() && recipientEmail) {
      const chatMessage = {
        sEmail: userEmail, // 보내는 사람
        rEmail: recipientEmail, // 받는 사람
        content: message, // 메시지 내용
      };

      console.log("📤 전송 메시지:", chatMessage);
      stompClient.current.publish({
        destination: "/chat/pub/send",
        body: JSON.stringify(chatMessage),
      });

      setMessages((prevMessages) => [...prevMessages, chatMessage]); // ✅ 전송한 메시지도 추가
      setMessage(""); // ✅ 입력 필드 초기화
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">💬 {recipientEmail}님과의 채팅</h2>

        {/* ✅ 채팅 메시지 목록 */}
        <div className="max-h-64 overflow-y-auto p-2 border rounded-lg bg-gray-100 mb-4">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-lg ${
                  msg.sEmail === userEmail ? "bg-blue-200 text-right" : "bg-gray-200 text-left"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">메시지가 없습니다.</p>
          )}
        </div>

        {/* ✅ 메시지 입력창 */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
          >
            🚀 전송
          </button>
        </div>

        {/* ✅ 닫기 버튼 */}
        <button
          onClick={closeChat}
          className="absolute top-3 right-3 text-gray-700 hover:text-red-500 text-xl"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
