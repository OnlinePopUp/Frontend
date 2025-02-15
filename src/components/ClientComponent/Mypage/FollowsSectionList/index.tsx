"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const FollowsSectionList = () => {
  const [followingNicknames, setFollowingNicknames] = useState<string[]>([]);
  const [followingEmails, setFollowingEmails] = useState<string[]>([]);
  const [followerNicknames, setFollowerNicknames] = useState<string[]>([]);
  const [followerEmails, setFollowerEmails] = useState<string[]>([]);
  const [followingCount, setFollowingCount] = useState(0); // ✅ 팔로잉 수
  const [followerCount, setFollowerCount] = useState(0); // ✅ 팔로워 수
  const [loading, setLoading] = useState(false);

  // ✅ localStorage에서 email & accessToken 가져오기
  const userEmail = localStorage.getItem("userEmail");
  const accessToken = localStorage.getItem("accessToken");

  console.log("userEmail: ", userEmail);
  console.log("accessToken: ", accessToken);

  // ✅ 서버에서 팔로우 & 팔로워 리스트 가져오기
  const fetchFollowData = async () => {
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

      if (response.data) {
        // ✅ 팔로잉 목록 저장
        setFollowingNicknames(response.data.flwingNick || []);
        setFollowingEmails(response.data.flwingList || []);
        setFollowingCount(response.data.flwingCnt || 0); // ✅ 팔로잉 수 저장

        // ✅ 팔로워 목록 저장
        setFollowerNicknames(response.data.flwerNick || []);
        setFollowerEmails(response.data.flwerList || []);
        setFollowerCount(response.data.flwerCnt || 0); // ✅ 팔로워 수 저장
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

      // ✅ 성공적으로 언팔로우하면 리스트에서 제거 & 팔로잉 수 업데이트
      setFollowingNicknames((prev) => prev.filter((_, index) => followingEmails[index] !== flwEmail));
      setFollowingEmails((prev) => prev.filter((email) => email !== flwEmail));
      setFollowingCount((prev) => prev - 1);

    } catch (error: any) {
      console.error("🚨 언팔로우 요청 실패:", error.response?.data || error.message);
      alert(error.response?.data?.error || "언팔로우 요청 실패");
    }
  };

  useEffect(() => {
    fetchFollowData();
  }, []);

  return (
    <section className="mb-10 p-6 bg-gray-100 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">팔로우 & 팔로워 목록</h2>

      {loading ? (
        <p className="text-gray-500 text-center">로딩 중...</p>
      ) : (
        <>
          {/* ✅ 팔로잉 목록 (총 개수 표시) */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700">
              팔로잉 ({followingCount}명)
            </h3>
            {followingNicknames.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {followingNicknames.map((nickname, index) => (
                  <li key={index} className="flex justify-between items-center p-3 border border-gray-2 rounded-lg bg-white shadow text-dark-DEFAULT">
                    <div>
                      <p className="text-lg font-medium text-gray-900">{nickname}</p>
                      <p className="text-sm text-gray-500">{followingEmails[index]}</p>
                    </div>
                    <button 
                      onClick={() => handleUnfollow(followingEmails[index])}
                      className="px-4 py-2 text-sm text-black bg-red-500 rounded-lg hover:bg-dark-2 transition-all duration-200"
                    >
                      언팔로우
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center mt-2">아직 팔로우한 사용자가 없습니다.</p>
            )}
          </div>

          {/* ✅ 팔로워 목록 (총 개수 표시) */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              팔로워 ({followerCount}명)
            </h3>
            {followerNicknames.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {followerNicknames.map((nickname, index) => {
                  const isMutualFollow = followingEmails.includes(followerEmails[index]); // ✅ 맞팔 여부 체크

                  return (
                    <li key={index} className="flex justify-between items-center p-3 border border-gray-2 rounded-lg bg-white shadow text-dark-DEFAULT">
                      <div>
                        <p className="text-lg font-medium text-gray-900">{nickname}</p>
                        <p className="text-sm text-gray-500">{followerEmails[index]}</p>
                      </div>
                      {isMutualFollow && (
                        <span className="text-xs font-medium text-green-600 px-2 py-1 bg-green-200 rounded-lg">
                          맞팔로우 상태 ✅
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 text-center mt-2">아직 팔로워가 없습니다.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default FollowsSectionList;
