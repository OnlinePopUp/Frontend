"use client"
import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client"; // ✅ SockJS 추가
import { Client } from "@stomp/stompjs"; // ✅ STOMP 클라이언트 추가
import Hero from "./Hero/index";
import LogoutButton from "@/components/ClientComponent/Home/Logout/logout";

const heroData = [
  { title: "iPhone 14 Plus", price: "$699", originalPrice: "$999", img: "/images/hero/hero-02.png" },
  { title: "Wireless Headphone", price: "$199", originalPrice: "$299", img: "/images/hero/hero-01.png" },
  { title: "Smart Watch", price: "$299", originalPrice: "$399", img: "/images/hero/hero-03.png" },
  { title: "Gaming Console", price: "$499", originalPrice: "$599", img: "/images/hero/hero-04.png" }
];

const Home = () => {
  const wsClient = useRef<Client | null>(null); // ✅ WebSocket 클라이언트 저장
  const [messages, setMessages] = useState<any[]>([]); // ✅ 수신 메시지 저장
  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null; // ✅ localStorage에서 유저 이메일 가져오기

  useEffect(() => {
    if (userEmail) {
      console.log("✅ WebSocket 연결을 시작합니다...");

      // ✅ SockJS로 WebSocket 연결 생성
      const socket = new SockJS("http://13.213.242.176:8081/chat/ws"); // auth 서버 사용

      // ✅ STOMP 클라이언트 설정
      wsClient.current = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000, // ✅ 5초 후 자동 재연결
        onConnect: () => {
          console.log("✅ WebSocket 연결 성공!");

          // ✅ Step 2: 클라이언트가 채널을 구독
          console.log("userEmail",userEmail)
          const subscription = wsClient.current?.subscribe(`/chat/sub/${userEmail}`, (response) => {
            const chatMessage = JSON.parse(response.body);
            console.log("📩 수신된 메시지:", chatMessage);
            // ✅ 메시지를 저장하는 로직 (필요하면 필터링 가능)
            setMessages((prevMessages) => [...prevMessages, chatMessage]);
          });
          
          // ✅ 구독 성공 여부 확인
        if (subscription) {
          console.log("🔗 구독 성공! Subscription ID:", subscription.id);
        } else {
          console.error("🚨 구독 실패: subscription 객체가 null입니다.");
        }


        },
        onStompError: (frame) => {
          console.error("🚨 STOMP 오류:", frame.headers["message"]);
        },
      });

      wsClient.current.activate();
    }

    return () => {
      // ✅ 컴포넌트 언마운트 시 WebSocket 연결 해제
      if (wsClient.current) {
        console.log("❌ WebSocket 연결 해제");
        wsClient.current.deactivate();
      }
    };
  }, [userEmail]);

  return (
    <main className="relative">
      {/* ✅ 우측 상단에 로그아웃 버튼 추가 */}
      <LogoutButton />

      {heroData.map((item, index) => (
        <Hero key={index} />
      ))}

      {/* ✅ 수신된 메시지 리스트 (디버깅용) */}
      <div className="p-4 mt-6 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold mb-2">📩 수신된 메시지</h3>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx} className="p-2 border-b">{msg.content}</li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Home;
