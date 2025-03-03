"use client";

import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheck, faComment, faComments } from "@fortawesome/free-solid-svg-icons";

const PurchaseAlram = () => {
  const userEmail = localStorage.getItem("userEmail");
  const stompClient = useRef<Client | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<string>("");
// 
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
          let message;
          try {
            message = JSON.parse(response.body);
          } catch (error) {
            console.warn("🚨 JSON 파싱 실패, form-data 형식으로 처리:", response.body);
            message = response.body;
          }
          console.log("🛒 구매 알림 도착:", message);
          setPurchaseMessage(message);
        });
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [userEmail]);

  let printMessage;

  if (purchaseMessage.includes("구매 알림 : ")) {
    printMessage = purchaseMessage.substring(8);
    return (
      <div className="rounded-lg shadow-md p-4 m-2">
        <FontAwesomeIcon icon={faMoneyCheck} fontSize="30%" />
        <h4 className="text-3xl">누군가 등록하신 상품을 구매했습니다! 지금 확인해보세요!</h4>
        <h4 className="text-2xl">{printMessage}</h4>
      </div>
    );
  }

  return null;
};

export default PurchaseAlram;
