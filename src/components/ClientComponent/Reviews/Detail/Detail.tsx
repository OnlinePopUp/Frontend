"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import Comment from "../Comment/Comment"; // ✅ Comment 컴포넌트 import

const Detail = () => {
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState(false); // ✅ 게시글 좋아요 상태
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false); // ✅ 댓글 팝업 상태
  const [editingComment, setEditingComment] = useState<{ cmtId: number, content: string } | null>(null); // ✅ 수정할 댓글 저장
  const [isEditing, setIsEditing] = useState(false); // ✅ 댓글 작성/수정 플래그
  const searchParams = useSearchParams();
  const boardId = searchParams.get("boardId");
  const router = useRouter(); // ✅ Next.js 라우터 추가

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

  // ✅ 게시물 좋아요 요청
  const handleLike = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      console.log(`🔹 서버에 POST 요청: /post/like/${boardId}`);
      await axios.post(`http://47.130.76.132:8080/post/like/${boardId}`, {}, {
        headers: { Authorization: `${accessToken}` },
      });

      setLiked(true);
      
      alert("게시글을 좋아요 했습니다! ❤️");

      // ✅ 좋아요 수 증가
      setPost((prevPost: any) => ({
        ...prevPost,
        board: { ...prevPost.board, heart: prevPost.board.heart + 1 },
      }));
    } catch (error: any) {
      alert("이미 좋아요 누른 게시물입니다.");
    }
  };

  // ✅ 게시물 좋아요 취소 요청
  const handleUnlike = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      console.log(`🔹 서버에 POST 요청: /post/delete/like/${boardId}`);
      await axios.post(`http://47.130.76.132:8080/post/delete/like/${boardId}`, {}, {
        headers: { Authorization: `${accessToken}` },
      });

      setLiked(false);
      alert("게시글 좋아요를 취소했습니다. 💔");

      // ✅ 좋아요 수 감소
      setPost((prevPost: any) => ({
        ...prevPost,
        board: { ...prevPost.board, heart: Math.max(prevPost.board.heart - 1, 0) },
      }));
      
    } catch (error: any) {
      alert("좋아요 하지 않은 게시물입니다.");
    }
  };

  // ✅ 댓글 좋아요 요청
  const handleLikeComment = async (cmtId: number) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      console.log(`🔹 서버에 POST 요청: /comment/like/${cmtId}`);
      await axios.post(`http://47.130.76.132:8080/comment/like/${cmtId}`, {}, {
        headers: { Authorization: `${accessToken}` },
      });

      // ✅ 좋아요 카운트 증가
      setPost((prevPost: any) => {
        const updatedComments = prevPost.comment.map((c: any) =>
          c.cmtId === cmtId ? { ...c, heart: c.heart + 1 } : c
        );
        return { ...prevPost, comment: updatedComments };
      });

      alert("댓글을 좋아요 했습니다! ❤️");
    } catch (error: any) {
      alert("이미 좋아요 누른 댓글입니다.");
    }
  };

  // ✅ 댓글 좋아요 취소 요청
  const handleUnlikeComment = async (cmtId: number) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }

    
    console.log(`🔹 서버에 POST 요청: /comment/delete/like/${cmtId}`);
    console.log(accessToken);
    try {
      console.log(`🔹 서버에 POST 요청: /comment/delete/like/${cmtId}`);
      await axios.post(`http://47.130.76.132:8080/comment/delete/like/${cmtId}`, {}, {
        headers: { Authorization: `${accessToken}` },
      });

      // ✅ 좋아요 카운트 감소
      setPost((prevPost: any) => {
        const updatedComments = prevPost.comment.map((c: any) =>
          c.cmtId === cmtId ? { ...c, heart: Math.max(0, c.heart - 1) } : c
        );
        return { ...prevPost, comment: updatedComments };
      });

      alert("댓글 좋아요를 취소했습니다. 💔");
    } catch (error: any) {
      alert("좋아요 하지 않은 댓글입니다.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-yellow-light-2 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-dark-DEFAULT text-center">게시글 상세 보기</h2>

      {post ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-dark-2">{post.board.name}</h3>
          <p className="text-sm text-meta-4 mt-2">{post.board.content}</p>

          {/* ✅ 작성자 버튼 (email 파라미터 포함) */}
          <button
            className="text-xs text-blue-500 mt-4 hover:underline"
            onClick={() => router.push(`http://localhost:3000/mypage?email=${post.board.email}`)}
          >
            작성자: {post.boardNickname || "알 수 없음"}
          </button>

          <p className="text-xs text-meta-3">게시 날짜: {post.board.created || "날짜 없음"}</p>
          <p className="text-xs text-meta-3">조회수: {post.board.cnt}</p>

          {/* ✅ 좋아요 & 좋아요 취소 버튼 */}
          <div className="flex gap-4 mt-4">
          <button
            onClick={handleLike}
            className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-light-2 transition-all"
          >
            ❤️ 좋아요 ({post.board.heart})
          </button>

            <button onClick={handleUnlike} className="px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-blue-light-2 transition-all">
              💔 unlikes
            </button>
          </div>

          {/* ✅ 댓글 작성 버튼 */}
          <div className="mt-6">
            <button
              onClick={() => {
                setIsCommentPopupOpen(true);
                setIsEditing(false); // ✅ 작성 모드
                setEditingComment(null);
              }}
              className="mt-4 px-6 py-3 bg-blue-500 text-black rounded-lg hover:bg-blue-light-2 transition-all"
            >
              ✍️ 댓글 작성
            </button>

            {/* ✅ 댓글 리스트 */}
            {post.comment?.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {post.comment.map((comment: any, index: number) => (
                  <li key={index} className="p-3 bg-gray-DEFAULT rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-900">{comment.content || "내용 없음"}</p>
                      <p className="text-xs text-meta-5">작성자: {post.commentNickname?.[index] || "알 수 없음"}</p>
                    </div>

                    {/* ✅ 댓글 좋아요, 좋아요 취소, 수정 버튼 */}
                    <div className="flex gap-2">
                    <button 
                      onClick={() => handleLikeComment(comment.cmtId)} 
                      className="px-3 py-2 bg-blue-500 text-black text-sm rounded-lg hover:bg-blue-light-2 transition-all"
                    >
                      ❤️ 좋아요 ({comment.heart})
                    </button>
                    
                      <button onClick={() => handleUnlikeComment(comment.cmtId)} className="px-3 py-2 bg-red-500 text-black text-sm rounded-lg">
                        💔 좋아요 취소
                      </button>

                      <button
                        className="px-3 py-2 bg-yellow-500 text-black text-sm rounded-lg hover:bg-blue-light-2 transition-all"
                        onClick={() => {
                          setIsCommentPopupOpen(true);
                          setIsEditing(true); // ✅ 수정 모드
                          setEditingComment({ cmtId: comment.cmtId, content: comment.content }); // ✅ 수정할 댓글 정보 저장
                        }}
                      >
                        ✏️ 수정
                      </button>
                    </div>
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

      {/* ✅ 댓글 작성/수정 팝업 */}
      {isCommentPopupOpen && (
        <Comment
          boardId={boardId}
          closePopup={() => setIsCommentPopupOpen(false)}
          initialContent={editingComment?.content}
          cmtId={editingComment?.cmtId}
          isEditing={isEditing} // ✅ 작성/수정 플래그 전달
          setPost={setPost} // ✅ 추가 (에러 해결)
        />
      )}
    </section>
  );
};

export default Detail;
