"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ Next.js Router & URL Params 추가

const LikePost = () => {
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // ✅ URL에서 email 가져오기
  const urlEmail = searchParams.get("email"); // ✅ 현재 URL에 있는 email 값
  const router = useRouter(); // ✅ Next.js 라우터 추가

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!urlEmail) {
        setError("잘못된 접근입니다. URL에 email이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        console.log(`🔹 서버에 GET 요청: /post/likepost?email=${urlEmail}&size=999&page=0`);
        const response = await axios.get(`http://47.130.76.132:8080/post/likepost`, {
          params: {
            email: urlEmail, // ✅ URL의 email 값 사용
            size: 999,
            page: 0,
          },
        });

        console.log("🔹 좋아요한 게시글 응답 데이터:", response.data);
        setLikedPosts(response.data.board || []);
      } catch (error: any) {
        console.error("🚨 좋아요한 게시글 불러오기 실패:", error.response?.data || error.message);
        setError("좋아요한 게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, [urlEmail]);

  if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">❤️ 좋아요한 게시글</h2>

      {likedPosts.length === 0 ? (
        <p className="text-gray-500 text-center">좋아요한 게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {likedPosts.map((post, index) => (
            <li
              key={index}
              className="p-4 border rounded-lg shadow-md hover:bg-gray-100 cursor-pointer transition"
              onClick={() => router.push(`/reviews/detail?boardId=${post.boardId}`)} // ✅ 클릭 시 상세 페이지 이동
            >
              <h3 className="text-lg font-semibold">{post.name}</h3>
              <p className="text-sm text-gray-700">{post.content}</p>
              <p className="text-xs text-gray-500">작성자: {post.nickname || "알 수 없음"}</p>
              <p className="text-xs text-gray-500">게시 날짜: {post.created}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikePost;
