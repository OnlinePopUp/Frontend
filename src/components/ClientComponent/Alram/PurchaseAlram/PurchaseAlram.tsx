"use client";
import React, { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";



const PurchaseAlram = () => {
  const userEmail = localStorage.getItem("userEmail");
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    if (!userEmail) return;

    const socket = new SockJS("http://13.213.242.176:8081/chat/ws");

    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공! (PurchaseAlram)");

        // ✅ Message 채널을 활용하여 구매 알람 확인
        stompClient.current?.subscribe(`/chat/sub/${userEmail}`, (response) => {
          let purchaseMessage;
          try {
            purchaseMessage = JSON.parse(response.body);
          } catch (error) {
            console.warn("🚨 JSON 파싱 실패, form-data 형식으로 처리:", response.body);
            
            console.log("response.body!!!! 응답메시지:", response.body)
          }
          console.log("🛒 구매 알림 도착:", purchaseMessage);
        });
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [userEmail]);

  return null; // UI 없이 콘솔 확인용
};

export default PurchaseAlram;
