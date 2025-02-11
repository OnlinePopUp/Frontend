"use client";
import React from "react";
import Link from "next/link";

// 섹션 컴포넌트 불러오기
import FollowsSection from "./FollowsSection";
import LikesSection from "./LikesSection";
import OrdersSection from "./OrdersSection";


const MyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Page</h1>

      {/* Navigation Tabs */}
      <nav className="flex justify-center space-x-4 mb-8">
        <Link href="#likes" className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
          Likes
        </Link>
        <Link href="#orders" className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
          Orders
        </Link>
        <Link href="#follows" className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
          Follows
        </Link>
      </nav>

      {/* Follows Section */}
      <FollowsSection />

      {/* Likes Section */}
      <LikesSection />

      {/* Orders Section */}
      <OrdersSection />

      
    </div>
  );
};

export default MyPage;
