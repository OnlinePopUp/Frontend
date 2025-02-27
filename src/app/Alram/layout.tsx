"use client";
import React, { useEffect, useState, Suspense } from "react";
import MessageAlram from "@/components/ClientComponent/Alram/MessageAlram/MessageAlram";
import CommentAlram from "@/components/ClientComponent/Alram/CommentAlram/CommentAlram";

export default function AlramLayout({ children }: { children: React.ReactNode }) {
  const [authUpdated, setAuthUpdated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false); // ✅ accessToken 여부 확인

  useEffect(() => {
    setIsClient(true);
    setHasAccessToken(!!localStorage.getItem("accessToken")); // ✅ accessToken 확인

    const handleStorageChange = () => {
      console.log("🔄 로그인 정보 변경 감지됨, 알람 업데이트");
      setAuthUpdated((prev) => !prev);
      setHasAccessToken(!!localStorage.getItem("accessToken")); // ✅ accessToken 변경 감지
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      {isClient && hasAccessToken && (
        <Suspense fallback={<div>Loading...</div>}>
          <MessageAlram key={Number(authUpdated)} />
          <CommentAlram key={Number(authUpdated) + 1} />
        </Suspense>
      )}
      {children}
    </div>
  );
}
