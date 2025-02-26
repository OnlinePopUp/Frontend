"use client";
import React, { useEffect, useState, Suspense } from "react";
import MessageAlram from "@/components/ClientComponent/Alram/MessageAlram/MessageAlram";

export default function AlramLayout({ children }: { children: React.ReactNode }) {

  const [authUpdated, setAuthUpdated] = useState(false);

  useEffect(() => {
    // ✅ localStorage 변경 감지 -> 알람 자동 새로고침
    const handleStorageChange = () => {
      console.log("🔄 로그인 정보 변경 감지됨, 알람 업데이트");
      setAuthUpdated((prev) => !prev); // 상태 변경 트리거
    };

    // "storage" 이벤트 리스너 등록
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange); // 클린업
    };
  }, []);

  return (
    <div>
      {/* ✅ authUpdated가 변경될 때마다 Suspense 내부 컴포넌트가 리렌더링됨 */}
      <Suspense fallback={<div>Loading...</div>}>
         {/* ✅ 상태 변경 시 리렌더링 */}
         <MessageAlram key={Number(authUpdated)} />  ``
      </Suspense>`
      {children}
    </div>
  );
}
