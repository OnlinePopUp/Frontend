"use client";
import React, { useState } from "react";
import axios from "axios";

const FillPoint = () => {
  const [isVisible, setIsVisible] = useState(false); // ✅ UI 표시 여부 상태
  const [point, setPoint] = useState(""); // ✅ 입력된 포인트 값
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태

  // ✅ 포인트 입력 핸들러
  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoint(e.target.value);
  };

  // ✅ 포인트 충전 API 요청
  const handleChargePoint = async () => {
    if (!point || Number(point) <= 0) {
      alert("충전할 포인트를 올바르게 입력하세요.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      // 🔹 FormData 생성
      const formData = new FormData();
      formData.append("point", point); // ✅ 포인트 값 추가

      // 🔹 서버에 포인트 충전 요청 (`POST /user/fill/point`)
      const response = await axios.post("http://47.130.76.132:8080/user/fill/point", formData, {
        headers: {
          Authorization: `${accessToken}`, // ✅ 헤더에 토큰 포함
        },
      });

      console.log("✅ 포인트 충전 성공:", response.data);
      alert(`포인트 ${point}P 충전이 완료되었습니다.`);
      setPoint(""); // 입력값 초기화

    } catch (error: any) {
      console.error("🚨 포인트 충전 요청 실패:", error.response?.data || error.message);
      alert(error.response?.data?.error || "포인트 충전 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      {/* ✅ 검은색 글씨 버튼 */}
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="w-full text-black font-medium hover:underline"
      >
        포인트 충전
      </button>

      {/* ✅ 입력창 및 충전 버튼 (가로 정렬) */}
      <div className={`mt-4 transition-all duration-300 ${isVisible ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"}`}>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={point}
            onChange={handlePointChange}
            placeholder="충전할 포인트 입력"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleChargePoint}
            className="px-5 py-3 bg-blue-600 text-black font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
            disabled={loading}
          >
            {loading ? "recharging..." : "recharge"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FillPoint;
