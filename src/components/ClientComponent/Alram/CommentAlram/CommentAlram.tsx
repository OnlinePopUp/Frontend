"use client";
import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRouter } from "next/navigation"; // ✅ 게시글 이동을 위한 라우터 추가

// ✅ "댓글 알림 : 98 게시글에 댓글 작성됨"에서 게시글 ID(숫자)만 추출하는 함수
const extractCommentData = (message: string) => {
  console.log("📩 받은 메시지:", message);

  // ✅ "댓글 알림 : 98 게시글에 댓글 작성됨" 형식에서 숫자만 추출
  const match = message.match(/댓글 알림\s*:\s*(\d+)/);

  if (match && match[1]) {
    return { postId: match[1] }; // ✅ 숫자 부분만 반환
  }

  console.warn("🚨 알림 형식이 예상과 다름! 원본 메시지:", message);
  return null;
};

const CommentAlram = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [unreadList, setUnreadList] = useState<{ postId: string; count: number }[]>([]);
  const [isOpen, setIsOpen] = useState(false); // 알림 목록 열기/닫기 상태
  const stompClient = useRef<Client | null>(null);
  const router = useRouter(); // ✅ 게시글 이동을 위한 라우터

  // ✅ WebSocket 연결 및 댓글 알람 구독
  useEffect(() => {
    if (!userEmail) return;

    const socket = new SockJS("http://13.213.242.176:8081/chat/ws");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공! (댓글 알람)");

        // ✅ 같은 경로에서 메시지 & 댓글 수신
        stompClient.current?.subscribe(`/chat/sub/${userEmail}`, (response) => {
          console.log("📩 메시지 도착 (원본):", response.body);

          const receivedData = extractCommentData(response.body); // ✅ 숫자만 추출

          if (!receivedData) return;

          console.log(`💬 [댓글 알람] 게시글 ID: ${receivedData.postId}`);

          // ✅ 알림 목록 업데이트 (게시글 ID 기준)
          setUnreadList((prevList) => {
            const existingPost = prevList.find((item) => item.postId === receivedData.postId);
            if (existingPost) {
              return prevList.map((item) =>
                item.postId === receivedData.postId
                  ? { ...item, count: item.count + 1 }
                  : item
              );
            } else {
              return [...prevList, { postId: receivedData.postId, count: 1 }];
            }
          });
        });

        console.log(`🔔 댓글 알람 구독 성공: /chat/sub/${userEmail}`);
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [userEmail]);

  // ✅ 알림 목록을 클릭하면 닫기
  const toggleNotifications = () => {
    setIsOpen((prev) => !prev);
  };

  // ✅ 특정 게시글로 이동하는 함수
  const goToPost = (postId: string) => {
    router.push(`/reviews/detail?boardId=${postId}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* ✅ 알림 버튼 */}
      <button
        onClick={toggleNotifications}
        className="relative flex items-center justify-center w-14 h-14 bg-gray text-white rounded-full shadow-lg transition-all hover:bg-gray-400 animate-bounce"
      >
        🔔
        {unreadList.length > 0 && (
          <span className="absolute top-0 right-0 bg-yellow text-black text-xs font-bold px-2 py-1 rounded-full">
            {unreadList.reduce((acc, item) => acc + item.count, 0)}
          </span>
        )}
      </button>

      {/* ✅ 알림 목록 (펼쳤을 때) */}
      {isOpen && unreadList.length > 0 && (
        <div className="absolute bottom-16 right-0 w-72 bg-gray shadow-lg rounded-lg p-4 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📜 댓글 알림</h3>
          <ul className="max-h-40 overflow-y-auto">
            {unreadList.map((item, index) => (
              <li
                key={index}
                className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer hover:bg-blue rounded-lg"
                onClick={() => goToPost(item.postId)} // ✅ 클릭 시 `/reviews/detail?boardId={postId}`로 이동
              >
                <div>
                  <p className="text-sm font-bold">📌 게시글 ID: {item.postId}</p>
                </div>
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setUnreadList([])}
            className="w-full mt-2 p-2 text-center bg-gray-400 hover:bg-red rounded-lg text-black font-semibold"
          >
            알림 지우기
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentAlram;
