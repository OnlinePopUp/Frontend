"use client";
import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { useRouter } from "next/navigation";

const FollowSection = () => {
  const [email, setEmail] = useState(""); // 입력된 이메일
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [isAdmin, setIsAdmin] = useState(false); // ✅ ROLE_ADMIN 여부 확인
  const router = useRouter();

  // ✅ 컴포넌트가 마운트될 때 role 값 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      setIsAdmin(role === "ROLE_ADMIN");
    }
  }, []);

  // 이메일 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 팔로우 요청 핸들러
  const handleFollow = async () => {
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      // ✅ FormData 객체 생성
      const formDataToSend = new FormData();
      formDataToSend.append("flwEmail", email); // 🔹 팔로우할 이메일 추가

      const response = await axios.post(
        "/user/follow",
        formDataToSend, //  FormData 전송
        {
          headers: {
            Authorization: accessToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const message =
          response.data && typeof response.data === "object"
            ? response.data.message
            : "팔로우 요청 성공!";
      
        alert(message);
      
        setEmail(""); // 입력 필드 초기화
        window.location.reload(); // 페이지 새로고침
      }
    } catch (error: any) {
      console.error("🚨 팔로우 요청 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-10 p-6 bg-gray shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">팔로우 추가</h2>

      {/* 이메일 입력 폼 + 요청 버튼 */}
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 mb-6">
        <input
          type="email"
          value={email}
          onChange={handleInputChange}
          placeholder="팔로우할 이메일 입력"
          className="w-full p-3 border border-gray-2 rounded-lg focus:ring-2 focus:ring-dark-2 text-dark-DEFAULT"
        />
        <button
          onClick={handleFollow}
          className="w-full md:w-auto px-6 py-3 bg-dark-DEFAULT text-black font-medium rounded-lg hover:bg-blue transition-all duration-200"
          disabled={loading}
        >
          {loading ? "요청 중..." : "follow"}
        </button>
      </div>

      {/* ✅ ROLE_ADMIN인 경우에만 보이도록 조건부 렌더링 */}
      {isAdmin && (
        <div>
          <button
            className="px-4 py-2 bg-gray hover:bg-red text-black rounded-lg mr-2"
            onClick={() => router.push("/admin/join")} // ✅ 버튼 클릭 시 이동
          >
            계정등록
          </button>
                 
          <button
            className="px-4 py-2 bg-gray hover:bg-red text-black rounded-lg mr-2"
            onClick={() => router.push("/admin/report/all ")} // ✅ 버튼 클릭 시 이동
          >
            신고내역
          </button>

        </div>
      )}
    </section>
  );
};

export default FollowSection;
