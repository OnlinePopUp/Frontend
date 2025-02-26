"use client";
import React, { useEffect, useState, Suspense } from "react";
import MessageAlram from "@/components/ClientComponent/Alram/MessageAlram/MessageAlram";
import CommentAlram from "@/components/ClientComponent/Alram/CommentAlram/CommentAlram";

export default function AlramLayout({ children }: { children: React.ReactNode }) {
  const [authUpdated, setAuthUpdated] = useState(false);
  const [isClient, setIsClient] = useState(false); // ✅ 클라이언트 여부 상태 추가

  useEffect(() => {
    setIsClient(true); // ✅ 클라이언트에서만 실행되도록 설정

    // ✅ localStorage 변경 감지 -> 알람 자동 새로고침
    const handleStorageChange = () => {
      console.log("🔄 로그인 정보 변경 감지됨, 알람 업데이트");
      setAuthUpdated((prev) => !prev); // 상태 변경 트리거
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      {/* ✅ 서버 사이드에서는 렌더링 안 되도록 체크 */}
      {isClient && (
        <Suspense fallback={<div>Loading...</div>}>
          <MessageAlram key={Number(authUpdated)} />
          <CommentAlram key={Number(authUpdated) + 1} />
        </Suspense>
      )}
      {children}
    </div>
  );
}
