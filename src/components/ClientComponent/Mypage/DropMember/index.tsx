"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ 페이지 이동을 위한 Next.js Router

const DropMember = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ 회원 탈퇴 기능
  const handleDropMember = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userEmail = localStorage.getItem("userEmail");

    if (!accessToken || !userEmail) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) {
      return;
    }

    setLoading(true);
    try {
      // 🔹 FormData 생성
      const formData = new FormData();
      formData.append("email", userEmail); // ✅ 바디에 email 포함

      // 🔹 서버에 회원 탈퇴 요청
      const response = await axios.post("http://47.130.76.132:8080/user/delete", formData, {
        headers: {
          Authorization: `${accessToken}`, // ✅ 엑세스 토큰 추가
        },
      });

      console.log("✅ 회원 탈퇴 성공:", response.data);
      alert("회원 탈퇴가 완료되었습니다.");

      // 🔹 localStorage 초기화 (로그아웃 처리)
      localStorage.removeItem("userEmail");
      localStorage.removeItem("accessToken");

      // 🔹 로그인 페이지로 이동
      router.push("/signin");

    } catch (error: any) {
      console.error("🚨 회원 탈퇴 요청 실패:", error.response?.data || error.message);
      alert(error.response?.data?.error || "회원 탈퇴 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-6 space-x-4"> {/* ✅ 버튼 간격 추가 */}
      {/* ✅ 회원 탈퇴 버튼 */}
      <button 
        onClick={handleDropMember}
        className="px-6 py-3 bg-red-600 text-black font-medium rounded-lg hover:bg-dark-2 transition-all duration-200"
        disabled={loading}
      >
        {loading ? "탈퇴 진행 중..." : "회원 탈퇴"}
      </button>

      {/* ✅ 개인정보 수정 버튼 */}
      <button
        onClick={() => router.push("/mypage/edit-information")}
        className="px-6 py-3 bg-blue-500 text-black font-medium rounded-lg hover:bg-red transition-all duration-200"
      >
        ✏️ 개인정보 수정
      </button>
    </div>
  );
};

export default DropMember;
