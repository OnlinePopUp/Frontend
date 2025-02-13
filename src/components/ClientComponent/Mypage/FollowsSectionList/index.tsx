"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const FollowsSectionList = () => {
  const [nicknameList, setNicknameList] = useState<string[]>([]); // 닉네임 리스트
  const [emailList, setEmailList] = useState<string[]>([]); // 이메일 리스트
  const [loading, setLoading] = useState(false); // 로딩 상태

  // ✅ localStorage에서 email & accessToken 가져오기
  const userEmail = localStorage.getItem("userEmail");
  const accessToken = localStorage.getItem("accessToken");

  console.log("userEmail: ", userEmail);
  console.log("accessToken: ", accessToken);

  // ✅ 서버에서 팔로우한 닉네임 리스트 가져오기
  const fetchNicknameList = async () => {
    if (!userEmail || !accessToken) {
      console.warn("🚨 로그인 정보가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      console.log(`🔹 서버에 GET 요청: http://47.130.76.132:8080/user/follow/all?email=${userEmail}`);

      const response = await axios.get(`http://47.130.76.132:8080/user/follow/all?email=${userEmail}`, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });

      console.log("🔹 서버 응답:", response.data);

      // ✅ 응답 데이터에서 닉네임과 이메일 리스트를 가져오기
      if (response.data && Array.isArray(response.data.flwingNick) && Array.isArray(response.data.flwingList)) {
        setNicknameList(response.data.flwingNick);
        setEmailList(response.data.flwingList);
      } else {
        console.warn("🚨 응답 데이터가 올바르지 않습니다.", response.data);
      }
    } catch (error: any) {
      console.error("🚨 닉네임 리스트 가져오기 실패:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ "언팔로우" 버튼 클릭 시 요청 보내기
  const handleUnfollow = async (flwEmail: string) => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      console.log(`🔹 언팔로우 요청: ${flwEmail}`);

      const formData = new FormData();
      formData.append("flwEmail", flwEmail);

      const response = await axios.post("http://47.130.76.132:8080/user/delete/follow", formData, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ 언팔로우 성공:", response.data);
      alert("언팔로우 완료!");

      // ✅ 성공적으로 언팔로우하면 리스트에서 제거
      setNicknameList((prev) => prev.filter((_, index) => emailList[index] !== flwEmail));
      setEmailList((prev) => prev.filter((email) => email !== flwEmail));

    } catch (error: any) {
      console.error("🚨 언팔로우 요청 실패:", error.response?.data || error.message);
      alert(error.response?.data?.error || "언팔로우 요청 실패");
    }
  };

  // ✅ 컴포넌트 마운트 시 자동으로 닉네임 리스트 가져오기
  useEffect(() => {
    fetchNicknameList();
  }, []);

  return (
    <section className="mb-10 p-6 bg-gray-100 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">팔로우한 사용자</h2>

      {loading ? (
        <p className="text-gray-500 text-center">로딩 중...</p>
      ) : nicknameList.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {nicknameList.map((nickname, index) => (
            <li key={index} className="flex justify-between items-center p-3 border border-gray-2 rounded-lg bg-white shadow text-dark-DEFAULT">
              <div>
                <p className="text-lg font-medium text-gray-900">{nickname}</p>
                <p className="text-sm text-gray-500">{emailList[index]}</p> {/* ✅ 닉네임 아래 이메일 추가 */}
              </div>
              <button 
                onClick={() => handleUnfollow(emailList[index])} // ✅ 언팔로우 기능 연결
                className="px-4 py-2 text-sm text-black bg-red-500 rounded-lg hover:bg-dark-2 transition-all duration-200"
              >
                언팔로우
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">아직 팔로우한 사용자가 없습니다.</p>
      )}
    </section>
  );
};

export default FollowsSectionList;
