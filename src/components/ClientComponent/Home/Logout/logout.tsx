"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ Next.js Router 사용

const LogoutButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); // ✅ 로그인한 사용자 이메일 저장
  const router = useRouter(); // ✅ 페이지 이동을 위한 Next.js Router

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const accessToken = localStorage.getItem("accessToken");

    if (storedEmail && accessToken) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail); // ✅ 사용자 이메일 저장
    } else {
      setIsLoggedIn(false);
      setUserEmail(null);
    }
  }, []);

  // ✅ 로그아웃 기능
  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      // 🔹 서버에 로그아웃 요청 (쿠키에서 refreshToken 삭제)
      await axios.post("http://47.130.76.132:8080/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true, // ✅ 쿠키 포함 (refreshToken 삭제)
      });

      console.log("✅ 로그아웃 요청 성공: 쿠키에서 refreshToken 삭제 완료");
    } catch (error: any) {
      console.error("🚨 로그아웃 요청 실패:", error.response?.data || error.message);
    }

    // 🔹 localStorage 초기화
    localStorage.removeItem("userEmail");
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUserEmail(null);

    alert("로그아웃 되었습니다.");
    window.location.reload(); // 페이지 새로고침
  };

  // ✅ 로그인 페이지 이동
  const handleLogin = () => {
    router.push("/signin"); // ✅ 로그인 페이지로 이동
  };

  // ✅ 마이페이지 이동 (로그인된 경우)
  const handleMyPage = () => {
    if (userEmail) {
      router.push(`/mypage?email=${userEmail}`); // ✅ 이메일을 포함하여 마이페이지 이동
    }
  };

  return (
    <div className="absolute top-5 right-5 flex space-x-4">
      {isLoggedIn ? (
        <>
          {/* ✅ 로그인된 경우 -> 마이페이지 & 로그아웃 버튼 표시 */}
          <button 
            onClick={handleMyPage}
            className="text-black font-medium hover:underline"
          >
            마이페이지
          </button>

          <button 
            onClick={handleLogout}
            className="text-black font-medium hover:underline"
          >
            로그아웃
          </button>
        </>
      ) : (
        // ✅ 로그아웃된 경우 -> 로그인 버튼 표시
        <button 
          onClick={handleLogin}
          className="text-black font-medium hover:underline"
        >
          로그인
        </button>
      )}
    </div>
  );
};

export default LogoutButton;
