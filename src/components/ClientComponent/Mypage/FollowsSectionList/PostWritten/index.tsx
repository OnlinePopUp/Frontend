"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // ✅ Next.js Link 사용

const PostWritten = () => {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email"); // ✅ URL에서 email 가져오기
  const [posts, setPosts] = useState<{ boardId: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!urlEmail) {
        console.warn("🚨 URL에서 email을 찾을 수 없습니다.");
        return;
      }

      setLoading(true);
      try {
        console.log(`🔹 서버에 GET 요청: /post/all?size=999&page=0`);
        const response = await axios.get(`http://47.130.76.132:8080/post/all?size=999&page=0`);

        console.log("🔹 전체 게시글 응답 데이터:", response.data);

        if (response.data && Array.isArray(response.data.board)) {
          // ✅ 현재 URL email과 일치하는 게시글 필터링
          const userPosts = response.data.board
            .filter((post: any) => post.email === urlEmail)
            .map((post: any) => ({
              boardId: post.boardId, // ✅ 게시물 ID 추가
              name: post.name,
            }));

          setPosts(userPosts);
        } else {
          console.warn("🚨 응답 데이터가 올바르지 않습니다.", response.data);
        }
      } catch (error: any) {
        console.error("🚨 게시글 가져오기 실패:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [urlEmail]);

  return (
    <section className="mb-10 p-6 bg-gray-100 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {urlEmail}님의 작성 게시글
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center">로딩 중...</p>
      ) : posts.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {posts.map((post) => (
            <li
              key={post.boardId}
              className="p-3 border border-gray-2 rounded-lg bg-white shadow text-dark-DEFAULT"
            >
              {/* ✅ 게시물 제목을 클릭하면 상세 페이지로 이동 */}
              <Link href={`/reviews/detail?boardId=${post.boardId}`} className="text-blue-500 hover:underline">
                {post.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center mt-2">작성한 게시글이 없습니다.</p>
      )}
    </section>
  );
};

export default PostWritten;
