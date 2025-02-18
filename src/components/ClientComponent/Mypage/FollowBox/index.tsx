"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ChatBox from "./ChatBox"; // ✅ ChatBox 컴포넌트 import

const FollowBox = () => {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email");
  const userEmail = localStorage.getItem("userEmail"); // ✅ localStorage에서 userEmail 가져오기
  const accessToken = localStorage.getItem("accessToken");

  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerList, setFollowerList] = useState<string[]>([]); // ✅ 팔로워 리스트 저장

  const [isChatOpen, setIsChatOpen] = useState(false); // ✅ 채팅 팝업 상태 추가

  const [isReportPopupOpen, setIsReportPopupOpen] = useState(false); // ✅ 신고 팝업 상태
  const [reportContent, setReportContent] = useState(""); // ✅ 신고 내용

  useEffect(() => {
    const fetchFollowData = async () => {
      if (!urlEmail) {
        console.warn("🚨 URL에서 email을 찾을 수 없습니다.");
        return;
      }

      try {
        console.log(`🔹 서버에 GET 요청: /user/follow/all?email=${urlEmail}`);
        const response = await axios.get(`http://47.130.76.132:8080/user/follow/all?email=${urlEmail}`);

        console.log("🔹 FollowBox 팔로우 정보 응답 데이터:", response.data);

        if (response.data) {
          setFollowingCount(response.data.flwingCnt || 0);
          setFollowerCount(response.data.flwerCnt || 0);
          setFollowerList(response.data.flwerList || []); // ✅ 팔로워 리스트 저장
        } else {
          console.warn("🚨 응답 데이터가 올바르지 않습니다.", response.data);
        }
      } catch (error: any) {
        console.error("🚨 팔로우 정보 가져오기 실패:", error.response?.data || error.message);
      }
    };

    const fetchPostCount = async () => {
      try {
        console.log(`🔹 서버에 GET 요청: /post/all?size=999&page=0`);
        const response = await axios.get(`http://47.130.76.132:8080/post/all?size=999&page=0`);

        console.log("🔹 게시글 응답 데이터:", response.data);

        if (response.data && Array.isArray(response.data.board)) {
          const userPosts = response.data.board.filter((post: any) => post.email === urlEmail);
          setPostCount(userPosts.length);
        } else {
          console.warn("🚨 응답 데이터가 올바르지 않습니다.", response.data);
        }
      } catch (error: any) {
        console.error("🚨 게시글 가져오기 실패:", error.response?.data || error.message);
      }
    };

    Promise.all([fetchFollowData(), fetchPostCount()]).then(() => setLoading(false));
  }, [urlEmail]);

  // ✅ `userEmail`이 `followerList`에 있는지 확인하여 `isFollowing` 설정
  useEffect(() => {
    if (followerList.includes(userEmail as string)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [followerList, userEmail]);

  // ✅ 팔로우 버튼 클릭 시 실행
  const handleFollow = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setLoading(true);
      console.log(`🔹 서버에 POST 요청: /user/follow (${urlEmail})`);

      const formDataToSend = new FormData();
      formDataToSend.append("flwEmail", urlEmail as string);

      const response = await axios.post(
        "http://47.130.76.132:8080/user/follow",
        formDataToSend,
        {
          headers: {
            Authorization: accessToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message || "팔로우 요청 성공!");
        setIsFollowing(true);
        window.location.reload();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "팔로우 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 언팔로우 버튼 클릭 시 실행
  const handleUnfollow = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setLoading(true);
      console.log(`🔹 서버에 POST 요청: /user/delete/follow (${urlEmail})`);

      const formDataToSend = new FormData();
      formDataToSend.append("flwEmail", urlEmail as string);

      const response = await axios.post(
        "http://47.130.76.132:8080/user/delete/follow",
        formDataToSend,
        {
          headers: {
            Authorization: accessToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message || "언팔로우 성공!");
        setIsFollowing(false);
        window.location.reload();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "언팔로우 요청 실패");
    } finally {
      setLoading(false);
    }
  };


  // ✅ 메시지 전송 버튼 클릭 시 채팅 팝업 열기
  const handleOpenChat = () => {
    if (!userEmail) {
      alert("로그인이 필요합니다.");
      return;
    }
    setIsChatOpen(true);
  };

  // ✅ 신고 제출 함수
  const handleReportSubmit = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!reportContent.trim()) {
      alert("신고 내용을 입력하세요.");
      return;
    }

    try {
      console.log(`🔹 서버에 POST 요청: /user/report`);
      
      // 🔹 FormData 생성
      const formData = new FormData();
      formData.append("email", urlEmail as string);
      formData.append("content", reportContent);

      // 🔹 서버 요청
      const response = await axios.post("http://47.130.76.132:8080/user/report", formData, {
        headers: {
          Authorization: accessToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("신고가 접수되었습니다.");
        setIsReportPopupOpen(false); // ✅ 팝업 닫기
        setReportContent(""); // ✅ 입력 초기화
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "신고 요청 실패");
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{urlEmail}님의 활동 정보</h3>

      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : (
        <>
          <div className="flex justify-around mb-4">
            <div>
              <p className="text-lg font-semibold">{followingCount}</p>
              <p className="text-sm text-gray-500">팔로잉</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{followerCount}</p>
              <p className="text-sm text-gray-500">팔로워</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{postCount}</p>
              <p className="text-sm text-gray-500">게시글</p>
            </div>
          </div>

          {/* ✅ 팔로우/언팔로우 버튼 */}
          {isFollowing ? (
            <button
              onClick={handleUnfollow}
              className="px-4 py-2 text-sm text-black bg-red-500 rounded-lg hover:bg-blue transition-all"
              disabled={loading}
            >
              언팔로우
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="px-4 py-2 text-sm text-black bg-blue-500 rounded-lg hover:bg-blue transition-all"
              disabled={loading}
            >
              팔로우
            </button> 
          )}

          {/* ✅ 추가된 버튼들 */}
          <div className="flex justify-center gap-2 mt-4">
            {/* ✅ 신고 버튼 */}
            <button
              onClick={() => setIsReportPopupOpen(true)}
              className="px-4 py-2 text-sm text-black bg-yellow-500 rounded-lg hover:bg-blue transition-all"
            >
              🚨 신고
            </button>

            <button
              onClick={handleOpenChat}
              className="px-4 py-2 text-sm text-black bg-green-500 rounded-lg hover:bg-green-600 transition-all"
            >
              💬 메시지 전송
            </button>
          </div>

        </>
      )}

       {/* ✅ ChatBox 팝업 */}
       {isChatOpen && <ChatBox recipientEmail={urlEmail} closeChat={() => setIsChatOpen(false)} />}

        {/* ✅ 신고 팝업 */}
        {isReportPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">🚨 신고하기</h2>
              
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="신고 내용을 입력하세요..."
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={4}
              />

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleReportSubmit}
                  className="px-6 py-3 bg-red-500 text-black rounded-lg hover:bg-red-600 transition-all"
                >
                  🚨 신고 제출
                </button>

                <button
                  onClick={() => setIsReportPopupOpen(false)}
                  className="px-6 py-3 bg-gray-400 text-black rounded-lg hover:bg-gray-500 transition-all"
                >
                  ❌ 닫기
                </button>
              </div>
            </div>
          </div>
        )}
  
    </div>
  );
};

export default FollowBox;
