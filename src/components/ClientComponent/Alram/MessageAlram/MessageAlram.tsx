"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "@/utils/axiosConfig";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./popup.css";

// ✅ form-data 형식의 메시지를 객체로 변환하는 함수
const parseFormDataMessage = (str: string) => {
  const regex = /송신자\s*:\s*(\S+)\s+메세지\s*:\s*(.+)/;
  const match = str.match(regex);
  if (match && match[1]) {
    return { sEmail: match[1].trim(), content: match[2].trim() };
  }
  return { sEmail: "알 수 없음", content: str };
};

const MessageAlram = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ 받은 메시지 목록을 접었다/펼치는 상태
  const [isUnreadListOpen, setIsUnreadListOpen] = useState(false);

  // ✅ 새 메시지 보낸 사람 목록을 저장하는 상태
  const [unreadList, setUnreadList] = useState<{ sender: string; count: number }[]>([]);
  
  const stompClient = useRef<Client | null>(null);

  // ✅ WebSocket 연결 및 구독 설정
  useEffect(() => {
    if (!userEmail) return;

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

          if (!chatMessage.sEmail || chatMessage.sEmail === "알 수 없음") {
            console.warn("🚨 송신자 정보가 없음! 원본 데이터:", response.body);
            return;
          }

          console.log(`📩 새 메시지 도착 - 송신자: ${chatMessage.sEmail}, 메시지: ${chatMessage.content}`);

          // ✅ 메시지 보낸 사람을 unreadList에 추가 (같은 사람이라면 count 증가)
          setUnreadList((prevList) => {
            const existingSender = prevList.find((item) => item.sender === chatMessage.sEmail);
            if (existingSender) {
              return prevList.map((item) =>
                item.sender === chatMessage.sEmail ? { ...item, count: item.count + 1 } : item
              );
            } else {
              return [...prevList, { sender: chatMessage.sEmail, count: 1 }];
            }
          });

          setMessages((prevMessages) => [...prevMessages, chatMessage]);
        });
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [userEmail]);

  // ✅ 특정 상대의 채팅창 열기
  const handleOpenChat = async (sender: string) => {
    setLoading(true);
    try {
      console.log(`📥 ${sender}와의 채팅 기록 불러오기...`);
      const response = await axios.get(`/chat/history?sEmail=${userEmail}&rEmail=${sender}`);
      setMessages(response.data);
      
      // ✅ 채팅을 열면 해당 발신자의 안 읽은 메시지 개수를 삭제
      setUnreadList((prevList) => prevList.filter((item) => item.sender !== sender));
    } catch (error) {
      console.error("🚨 채팅 기록 불러오기 실패:", error);
    } finally {
      setLoading(false);
      setIsChatOpen(true);
    }
  };

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (!stompClient.current || !message.trim()) return;

    const chatMessage = {
      sEmail: userEmail,
      rEmail: messages.length > 0 ? messages[0].sEmail : "",
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
    <div className="fixed bottom-4 right-20 z-50">
      {/* ✅ 받은 메시지 목록 버튼 */}
      <button
        onClick={() => setIsUnreadListOpen((prev) => !prev)}
        className="relative flex items-center justify-center w-14 h-14 bg-gray text-white rounded-full shadow-lg transition-all hover:bg-orange animate-bounce"
      >
        📩
        {unreadList.length > 0 && (
          <span className="absolute top-0 right-0 bg-yellow text-black text-xs font-bold px-2 py-1 rounded-full">
            {unreadList.length}
          </span>
        )}
      </button>

      {/* ✅ 받은 메시지 리스트 (펼쳤을 때) */}
      {isUnreadListOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-gray shadow-lg rounded-lg p-4 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📜 받은 메시지</h3>
          {unreadList.length === 0 ? (
            <p className="text-center text-gray-500">새 메시지가 없습니다.</p>
          ) : (
            <ul className="max-h-40 overflow-y-auto">
              {unreadList.map((item) => (
                <li
                  key={item.sender}
                  className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer hover:bg-blue rounded-lg"
                  onClick={() => handleOpenChat(item.sender)}
                >
                  <p className="text-sm font-bold">💬 {item.sender}님</p>
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ✅ 채팅창 */}
      {isChatOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50">
          <div className="w-96 bg-white rounded-lg shadow-lg p-4 relative mt-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">채팅창</h2>

            {/* 채팅 기록 영역 */}
            {loading ? (
              <p className="text-center text-gray-500">로딩 중...</p>
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
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-2 border rounded-lg"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue"
              >
                전송
              </button>
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
