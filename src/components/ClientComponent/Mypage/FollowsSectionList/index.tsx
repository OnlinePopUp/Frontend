"use client";
import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { useSearchParams } from "next/navigation";
import Follow from "./Follow"; // ✅ Follow 컴포넌트 import
import Follower from "./Follower"; // ✅ Follower 컴포넌트 import
import PostWritten from "./PostWritten"; // ✅ PostWritten 컴포넌트 import
import LikePost from "./LikePost"; // ✅ 좋아요한 게시글 컴포넌트 추가

const FollowsSectionList = () => {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ ROLE_ADMIN 여부 확인
  const [followingNicknames, setFollowingNicknames] = useState<string[]>([]);
  const [followingEmails, setFollowingEmails] = useState<string[]>([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerNicknames, setFollowerNicknames] = useState<string[]>([]);
  const [followerEmails, setFollowerEmails] = useState<string[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"follow" | "follower" | "posts" | "likeposts">("follow"); // ✅ "likeposts" 추가

  // ✅ localStorage에서 사용자 정보 가져오기
  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail"));
    setAccessToken(localStorage.getItem("accessToken"));
    setIsAdmin(localStorage.getItem("role") === "ROLE_ADMIN"); // ✅ 관리자 여부 확인
  }, [userEmail, accessToken,setIsAdmin]); // ✅ 의존성 배열에 추가하여 값 변경 시 실행
  

  // ✅ 서버에서 특정 email의 팔로우 & 팔로워 목록 가져오기
  useEffect(() => {
    const fetchFollowData = async () => {
      const targetEmail = urlEmail || userEmail;

      if (!targetEmail || !accessToken) {
        console.warn("🚨 로그인 정보가 없거나, 잘못된 접근입니다.");
        return;
      }

      setLoading(true);
      try {
        console.log(`🔹 서버에 GET 요청: /user/follow/all?email=${targetEmail}`);

        const response = await axios.get(
          `/user/follow/all?email=${targetEmail}`,
          {
            headers: { Authorization: `${accessToken}` },
          }
        );

        console.log("🔹 서버 응답:", response.data);

        if (response.data) {
          setFollowingNicknames(response.data.flwingNick || []);
          setFollowingEmails(response.data.flwingList || []);
          setFollowingCount(response.data.flwingCnt || 0);

          setFollowerNicknames(response.data.flwerNick || []);
          setFollowerEmails(response.data.flwerList || []);
          setFollowerCount(response.data.flwerCnt || 0);
        } else {
          console.warn("🚨 응답 데이터가 올바르지 않습니다.", response.data);
        }
      } catch (error: any) {
        console.error("🚨 닉네임 리스트 가져오기 실패:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (urlEmail || userEmail) {
      fetchFollowData();
    }
  }, [urlEmail, userEmail, accessToken]);

  // ✅ 언팔로우 기능 (본인 계정일 경우만 가능)
  const handleUnfollow = async (flwEmail: string) => {
    if (!accessToken || userEmail !== urlEmail) {
      alert("언팔로우 권한이 없습니다.");
      return;
    }

    try {
      console.log(`🔹 언팔로우 요청: ${flwEmail}`);

      const formData = new FormData();
      formData.append("flwEmail", flwEmail);

      await axios.post("/user/delete/follow", formData, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("언팔로우 완료!");

      // ✅ 리스트에서 제거 & 팔로잉 수 업데이트
      setFollowingNicknames((prev) => prev.filter((_, index) => followingEmails[index] !== flwEmail));
      setFollowingEmails((prev) => prev.filter((email) => email !== flwEmail));
      setFollowingCount((prev) => prev - 1);
    } catch (error: any) {
      console.error("🚨 언팔로우 요청 실패:", error.response?.data || error.message);
      alert(error.response?.data?.error || "언팔로우 요청 실패");
    }
  };

  return (
    <section className="mb-10 p-6 bg-gray shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {urlEmail === userEmail ? "내 팔로우 & 팔로워 & 게시글 목록" : `${urlEmail}님의 정보`}
      </h2>

    

      {/* ✅ Follow, Follower, PostWritten 탭 버튼 추가 */}
      <div className="flex justify-center gap-4 mb-6">
        {/* ✅ 관리자만 보이는 버튼 */}
        {isAdmin && (
          <button
            className={`px-4 py-2 rounded-lg ${selectedTab === "follow" ? "bg-green-light-2 text-black" : "bg-green-light-4 text-black"}`}
            onClick={() => setSelectedTab("follow")}
          >
            전체 유저(관리자전용) ({followingCount})
          </button>
        )}

        <button
          className={`px-4 py-2 rounded-lg ${selectedTab === "follow" ? "bg-green-light-2 text-black" : "bg-green-light-4 text-black"}`}
          onClick={() => setSelectedTab("follow")}
        >
          팔로잉 ({followingCount})
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${selectedTab === "follower" ? "bg-green-light-2 text-black" : "bg-green-light-4 text-black"}`}
          onClick={() => setSelectedTab("follower")}
        >
          팔로워 ({followerCount})
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${selectedTab === "posts" ? "bg-green-light-2 text-black" : "bg-green-light-4 text-black"}`}
          onClick={() => setSelectedTab("posts")}
        >
          작성한 게시글
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${selectedTab === "likeposts" ? "bg-green-light-2 text-black" : "bg-green-light-4 text-black"}`}
          onClick={() => setSelectedTab("likeposts")}
        >
          좋아요한 게시글
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">로딩 중...</p>
      ) : (
        <>
          {/* ✅ 선택된 탭에 따라 컴포넌트 렌더링 */}
          {selectedTab === "follow" && (
            <Follow
              followingNicknames={followingNicknames}
              followingEmails={followingEmails}
              followingCount={followingCount}
              handleUnfollow={handleUnfollow}
              isMyPage={urlEmail === userEmail}
            />
          )}
          {selectedTab === "follower" && (
            <Follower
              followerNicknames={followerNicknames}
              followerEmails={followerEmails}
              followerCount={followerCount}
              followingEmails={followingEmails}
            />
          )}
          {selectedTab === "posts" && <PostWritten />}
          {selectedTab === "likeposts" && <LikePost />}
        </>
      )}
    </section>
  );
};

export default FollowsSectionList;
