"use-client"
import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatProps {
  userEmail: string;
}

interface Message {
  sEmail: string;
  rEmail: string;
  content: string;
}

interface ChatPartner {
  name: string;
  email: string;
}

const ChatPage: React.FC<ChatProps> = ({ userEmail }) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [chatPartners, setChatPartners] = useState<ChatPartner[]>([]);
  const [page, setPage] = useState<number>(0);
  const pageSize = 10; // 한 번에 불러올 사용자 수

  // ✅ 대화 상대 불러오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://47.130.76.132:8080/admin/user/all?size=${pageSize}&page=${page}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setChatPartners(data);
        } else {
          setChatPartners([]);
        }
      } catch (error) {
        console.error("대화 상대 목록을 불러오는 중 오류 발생:", error);
        setChatPartners([]);
      }
    };

    fetchUsers();
  }, [page]);

  // ✅ WebSocket 연결 및 메시지 구독
  useEffect(() => {
    const socket = new SockJS("http://13.213.242.176:8080/chat/ws"); // auth 서버
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("웹소켓 연결됨!");
        client.subscribe(`/chat/sub/${userEmail}`, (response) => {
          const chatMessage: Message = JSON.parse(response.body);
          console.log("수신된 메시지:", chatMessage);

          if (chatMessage.sEmail === recipientEmail || chatMessage.rEmail === recipientEmail) {
            setMessages((prevMessages) => [...prevMessages, chatMessage]);
          }
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [userEmail, recipientEmail]);

  // ✅ 채팅 내역 불러오기
  useEffect(() => {
    if (recipientEmail) {
      fetchChatHistory();
    }
  }, [recipientEmail]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `http://47.130.76.132:8080/chat/history?sEmail=${userEmail}&rEmail=${recipientEmail}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("채팅 기록을 불러오는 중 오류 발생:", error);
    }
  };

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (stompClient && message.trim() && recipientEmail) {
      const chatMessage: Message = {
        sEmail: userEmail,
        rEmail: recipientEmail,
        content: message,
      };

      stompClient.publish({ destination: "/chat/pub/send", body: JSON.stringify(chatMessage) });
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
      setMessage("");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* ✅ 대화 상대 목록 */}
      <div style={{ width: "25%", borderRight: "1px solid #ddd", padding: "10px" }}>
        <h2>대화 상대</h2>
        <ul>
          {chatPartners.map((partner) => (
            <li
              key={partner.email}
              style={{
                cursor: "pointer",
                backgroundColor: recipientEmail === partner.email ? "#f0f0f0" : "transparent",
                padding: "5px",
              }}
              onClick={() => setRecipientEmail(partner.email)}
            >
              {partner.name} ({partner.email})
            </li>
          ))}
        </ul>
        <button onClick={() => setPage((prevPage) => prevPage + 1)}>더 보기</button>
      </div>

      {/* ✅ 채팅창 */}
      <div style={{ width: "75%", padding: "10px" }}>
        <h1>채팅 - {recipientEmail || "대화 상대를 선택하세요"}</h1>
        {recipientEmail && (
          <>
            <div
              style={{
                border: "1px solid #ddd",
                height: "400px",
                overflowY: "scroll",
                padding: "10px",
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: msg.sEmail === userEmail ? "right" : "left",
                    margin: "5px 0",
                  }}
                >
                  <strong>{msg.sEmail}: </strong>
                  {msg.content}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요"
            />
            <button onClick={sendMessage}>Send</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
