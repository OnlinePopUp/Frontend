"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const Detail = () => {
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState(false); // ✅ 좋아요 상태 추가
  const searchParams = useSearchParams();
  const boardId = searchParams.get("boardId");

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!boardId) {
        console.warn("🚨 boardId가 없습니다.");
        return;
      }

      try {
        console.log(`🔹 서버에 GET 요청: /post/${boardId}`);
        const response = await axios.get(`http://47.130.76.132:8080/post/${boardId}`);

        console.log("🔹 게시글 상세 정보 응답 데이터:", response.data);

        if (response.data) {
          setPost(response.data);
          setLiked(response.data.liked || false); // ✅ 좋아요 상태 저장
        } else {
          console.warn("🚨 응답 데이터가 없습니다.");
        }
      } catch (error: any) {
        console.error("🚨 게시글 상세 정보 가져오기 실패:", error.response?.data || error.message);
      }
    };

    fetchPostDetail();
  }, [boardId]);

  // ✅ 좋아요 요청 함수
  const handleLike = async () => {
    const accessToken = localStorage.getItem("accessToken"); // ✅ accessToken 가져오기
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      console.log(`🔹 서버에 POST 요청: /post/like/${boardId}`);
      await axios.post(
        `http://47.130.76.132:8080/post/like/${boardId}`,
        {}, // ✅ 요청 본문 없이 전송
        {
          headers: {
            Authorization: `${accessToken}`, 
          },
        }
      );
      
      setLiked(true); // ✅ 좋아요 상태 변경
      alert("게시글을 좋아요 했습니다! ❤️");
    } catch (error: any) {
      console.error("🚨 좋아요 실패:", error.response?.data || error.message);
      alert("좋아요에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // ✅ 좋아요 취소 요청 함수
  const handleUnlike = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      console.log(`🔹 서버에 POST 요청: /post/unlike/${boardId}`);
      await axios.post(
        `http://47.130.76.132:8080/post/unlike/${boardId}`,
        {},
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );
      
      setLiked(false); // ✅ 좋아요 취소 상태 변경
      alert("게시글 좋아요를 취소했습니다. 💔");
    } catch (error: any) {
      console.error("🚨 좋아요 취소 실패:", error.response?.data || error.message);
      alert("좋아요 취소에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-yellow-light-2 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-dark-DEFAULT text-center">게시글 상세 보기</h2>

      {post ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-dark-2">{post.board.name}</h3>
          <p className="text-sm text-meta-4 mt-2">{post.board.content}</p>
          <p className="text-xs text-meta-3 mt-4">작성자: {post.boardNickname || "알 수 없음"}</p>
          <p className="text-xs text-meta-3">게시 날짜: {post.board.created || "날짜 없음"}</p>
          <p className="text-xs text-meta-3">조회수: {post.board.cnt}</p>

          {/* ✅ 좋아요 & 좋아요 취소 버튼 */}
          <div className="flex gap-4 mt-4">
          <button
            onClick={handleLike}
            className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-light-2 transition-all"
          >
            ❤️ likes
          </button>

          <button
            onClick={handleUnlike}
            className="px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-blue-light-2 transition-all"
          >
            💔 unlikes
          </button>
          </div>


          {post.boardFile?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-dark-3">첨부 파일</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {post.boardFile.map((fileUrl: string, index: number) => (
                  <img key={index} src={fileUrl} alt={`첨부 이미지 ${index + 1}`} className="w-full h-auto rounded-lg shadow" />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-dark-3">댓글</h4>
            {post.comment?.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {post.comment.map((comment: string, index: number) => (
                  <li key={index} className="p-3 bg-gray-DEFAULT rounded-lg">
                    <p className="text-sm text-gray-900">{comment}</p>
                    <p className="text-xs text-meta-5">작성자: {post.commentNickname[index] || "알 수 없음"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-meta-5 mt-2">댓글이 없습니다.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">게시글 정보를 불러오는 중...</p>
      )}
    </section>
  );
};

export default Detail;
