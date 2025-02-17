"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

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
        </>
      )}
    </div>
  );
};

export default FollowBox;
