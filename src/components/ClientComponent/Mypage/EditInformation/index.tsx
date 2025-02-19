"use client";
import React, { useState } from "react";
import axios from "@/utils/axiosConfig";
import { useRouter } from "next/navigation";

const EditInformation = () => {
  const router = useRouter();
  const accessToken = localStorage.getItem("accessToken");
  const userEmail = localStorage.getItem("userEmail"); // ✅ userEmail 가져오기

  const [formData, setFormData] = useState({
    address: "",
    birth: "",
    phone: "",
    nickname: "",
  });

  // ✅ 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 개인정보 수정 요청 (FormData 사용)
  const handleUpdateUserInfo = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("address", formData.address);
    formDataToSend.append("birth", formData.birth);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("nickname", formData.nickname);

    try {
      console.log("🔹 서버에 POST 요청 (FormData): /user/update", formDataToSend);
      const response = await axios.post(
        "/user/update",
        formDataToSend,
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "multipart/form-data", // ✅ FormData 전송 설정
          },
        }
      );

      console.log("✅ 개인정보 수정 성공:", response.data);
      alert("개인정보가 성공적으로 수정되었습니다!");
        // ✅ 수정 후 userEmail을 파라미터로 포함하여 이동
        router.push(`/mypage?email=${userEmail}`);

    } catch (error: any) {
      console.error("🚨 개인정보 수정 실패:", error.response?.data || error.message);
      alert(error.response?.data?.error || "개인정보 수정 실패");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">🔧 개인정보 수정</h2>

      {/* ✅ 입력 필드 */}
      <div className="space-y-4">
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="주소 (선택)"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <input
          type="date"
          name="birth"
          value={formData.birth}
          onChange={handleChange}
          placeholder="생년월일 (YYYY-MM-DD)"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="전화번호 (선택)"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <input
          type="text"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          placeholder="닉네임 (선택)"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* ✅ 버튼 그룹 */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleUpdateUserInfo}
          className="px-6 py-3 bg-blue-500 text-black font-medium rounded-lg hover:bg-blue-600 transition-all"
        >
          ✅ 수정하기
        </button>

        <button
          onClick={() => router.push(`/mypage?email=${userEmail}`)}
          className="px-6 py-3 bg-red-500 text-black font-medium rounded-lg hover:bg-red-600 transition-all"
        >
          ❌ 취소
        </button>
      </div>
    </div>
  );
};

export default EditInformation;
