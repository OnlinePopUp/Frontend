"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FillPoint from "./FillPoint";
import FollowsSection from "./FollowsSearch";
import FollowsSectionList from "./FollowsSectionList";
import DropMember from "./DropMember";
import FollowBox from "./FollowBox"; // ✅ FollowBox 추가
import PaymentList from "./PaymentList";

const MyPage = () => {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email"); // ✅ URL에서 email 가져오기
  const [localEmail, setLocalEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ 로딩 상태 추가

  useEffect(() => {
    // ✅ localStorage에서 userEmail 가져오기
    const storedEmail = localStorage.getItem("userEmail"); // ✅ 변경된 부분
    setLocalEmail(storedEmail);
    setIsLoading(false); // ✅ 데이터 로딩 완료
    console.log("📌 localStorage userEmail:", storedEmail);
    console.log("📌 URL email:", urlEmail);
  }, []);

  // ✅ 데이터 로딩 중이면 화면에 아무것도 렌더링하지 않음
  if (isLoading) return <p className="text-center text-gray-500">로딩 중...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      

      {/* ✅ URL email과 localStorage userEmail이 다른 경우에만 FollowBox 표시 */}
      {urlEmail !== localEmail && (
        <div className="mb-6"> {/* ✅ FollowBox 아래 공백 추가 */}
          <FollowBox />
        </div>
      )}

      {/* ✅ URL email과 localStorage userEmail이 일치하는 경우 */}
      {urlEmail === localEmail ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center">My Page</h1>

          {/* ✅ 포인트 충전 */}
          <div className="mb-6">
            <FillPoint />
          </div>

          {/* ✅ Follows Section */}
          <FollowsSection />
          <FollowsSectionList />

          {/* ✅ Payment List */}
          <PaymentList />
          {/* ✅ 회원 탈퇴 */}
          <div className="mt-10 flex justify-center">
            <DropMember />
          </div>
        </>
      ) : (
        // ✅ 일치하지 않으면 FollowsSectionList만 렌더링
        
        <FollowsSectionList />
      )}
    </div>
  );
};

export default MyPage;
