// ✅ 클라이언트 컴포넌트로 WebSocket 포함
"use client";
import React, { useState } from "react";
import MessageAlram from "@/components/ClientComponent/Alram/MessageAlram/MessageAlram";

export default function AlramLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* ✅ 왼쪽 사이드바 */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} bg-orange text-black flex flex-col`}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-gray-700 hover:bg-gray-600 w-full"
        >
          {isSidebarOpen ? "⬅" : "➡"}
        </button>
        
        {/* ✅ WebSocket 알람 (사이드바가 열려 있을 때만 표시) */}
        {isSidebarOpen && (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">알람</h2>
            <MessageAlram />
            <div>CommentAlram</div>
            <div>PurchaseAlram</div>
          </div>
        )}
      </div>

      {/* ✅ 메인 콘텐츠 */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
