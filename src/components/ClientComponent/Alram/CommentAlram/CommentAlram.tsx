"use client";
import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// ✅ 댓글 알람 컴포넌트
const CommentAlram = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [unreadList, setUnreadList] = useState<{ sender: string; count: number }[]>([]);
  const stompClient = useRef<Client | null>(null);

  // ✅ WebSocket 연결 및 댓글 알람 구독
  useEffect(() => {
    if (!userEmail) return;

    const socket = new SockJS("http://13.213.242.176:8081/chat/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공! (댓글 알람)");

        stompClient.current?.subscribe(`/comment/sub/${userEmail}`, (response) => {
          const commentData = JSON.parse(response.body);

          if (!commentData.sender) return;
          console.log(`📩 새 댓글 도착 - 작성자: ${commentData.sender}, 내용: ${commentData.content}`);

          // ✅ 알림 목록 업데이트 (같은 사람이 댓글을 달면 count 증가)
          setUnreadList((prevList) => {
            const existingSender = prevList.find((item) => item.sender === commentData.sender);
            if (existingSender) {
              return prevList.map((item) =>
                item.sender === commentData.sender ? { ...item, count: item.count + 1 } : item
              );
            } else {
              return [...prevList, { sender: commentData.sender, count: 1 }];
            }
          });
        });
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [userEmail]);

  return null; // UI 없이 백그라운드에서 동작
};

export default CommentAlram;
