"use client";
import React from "react";
import Link from "next/link";

// 섹션 컴포넌트 불러오기
import FillPoint from "./FillPoint"; // ✅ 포인트 충전 컴포넌트 추가
import FollowsSection from "./FollowsSection";
import FollowsSectionList from "./FollowsSectionList";
import DropMember from "./DropMember"; // ✅ 회원 탈퇴 컴포넌트 추가

const MyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Page</h1>

      {/* ✅ 포인트 충전 기능 (최상단 배치) */}
      <div className="mb-6">
        <FillPoint />
      </div>

      {/* Navigation Tabs */}
      <nav className="flex justify-center space-x-4 mb-8">
        <Link href="#follows" className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
          Follows
        </Link>
      </nav>

      {/* Follows Section */}
      <FollowsSection />
      <FollowsSectionList />

      {/* ✅ 회원 탈퇴 버튼 추가 */}
      <div className="mt-10 flex justify-center">
        <DropMember />
      </div>

    </div>
  );
};

export default MyPage;
