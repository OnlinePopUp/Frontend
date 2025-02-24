"use client";
import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { useSearchParams, useRouter } from "next/navigation";
import Comment from "../Comment/Comment"; // ✅ Comment 컴포넌트 import
import Image from "next/image";

const Detail = () => {
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState(false); // ✅ 게시글 좋아요 상태
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false); // ✅ 댓글 팝업 상태
  const [editingComment, setEditingComment] = useState<{ cmtId: number, content: string } | null>(null); // ✅ 수정할 댓글 저장
  const [isEditing, setIsEditing] = useState(false); // ✅ 댓글 작성/수정 플래그
  const searchParams = useSearchParams();
  const boardId = searchParams.get("boardId");
  const router = useRouter(); // ✅ Next.js 라우터 추가
  const userEmail = localStorage.getItem("userEmail"); // ✅ 현재 로그인한 사용자 이메일 가져오기

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!boardId) {
        console.warn("🚨 boardId가 없습니다.");
        return;
      }

      try {
        console.log(`🔹 서버에 GET 요청: /post/${boardId}`);
        const response = await axios.get(`/post/${boardId}`);

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


  const handleLikeToggle = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }
  
    try {
      console.log(`🔹 서버에 POST 요청: /post/like/${boardId}`);
      await axios.post(`/post/like/${boardId}`, {}, {
        headers: { Authorization: `${accessToken}` },
      });
  
      // ✅ 좋아요 요청 성공 → 좋아요 ON
      setLiked(true);
      setPost((prevPost: any) => ({
        ...prevPost,
        board: { ...prevPost.board, heart: prevPost.board.heart + 1 },
      }));
    } catch (error: any) {
      console.warn("🚨 좋아요 실패 → 이미 좋아요 누른 상태, 취소 요청 진행");
  
      try {
        console.log(`🔹 서버에 POST 요청: /post/delete/like/${boardId}`);
        await axios.post(`/post/delete/like/${boardId}`, {}, {
          headers: { Authorization: `${accessToken}` },
        });
  
        // ✅ 좋아요 취소 요청 성공 → 좋아요 OFF
        setLiked(false);
        setPost((prevPost: any) => ({
          ...prevPost,
          board: { ...prevPost.board, heart: Math.max(prevPost.board.heart - 1, 0) },
        }));
      } catch (unlikeError: any) {
        console.error("🚨 좋아요 취소 실패:", unlikeError.response?.data || unlikeError.message);
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };
  
  // ✅ 댓글 좋아요/좋아요 취소 토글 함수
const handleLikeCommentToggle = async (cmtId: number, liked: boolean) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    alert("로그인이 필요합니다!");
    return;
  }

  try {
    console.log(`🔹 서버에 POST 요청: /comment/like/${cmtId}`);
    await axios.post(`/comment/like/${cmtId}`, {}, {
      headers: { Authorization: `${accessToken}` },
    });

    // ✅ 좋아요 요청 성공 → 좋아요 ON
    setPost((prevPost: any) => {
      const updatedComments = prevPost.comment.map((c: any) =>
        c.cmtId === cmtId ? { ...c, heart: c.heart + 1, liked: true } : c
      );
      return { ...prevPost, comment: updatedComments };
    });
  } catch (error: any) {
    console.warn("🚨 좋아요 실패 → 이미 좋아요 누른 상태, 취소 요청 진행");

    try {
      console.log(`🔹 서버에 POST 요청: /comment/delete/like/${cmtId}`);
      await axios.post(`/comment/delete/like/${cmtId}`, {}, {
        headers: { Authorization: `${accessToken}` },
      });

      // ✅ 좋아요 취소 요청 성공 → 좋아요 OFF
      setPost((prevPost: any) => {
        const updatedComments = prevPost.comment.map((c: any) =>
          c.cmtId === cmtId ? { ...c, heart: Math.max(0, c.heart - 1), liked: false } : c
        );
        return { ...prevPost, comment: updatedComments };
      });
    } catch (unlikeError: any) {
      console.error("🚨 댓글 좋아요 취소 실패:", unlikeError.response?.data || unlikeError.message);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  }
};


  // ✅ 댓글 삭제 요청 함수
  const handleDeleteComment = async (cmtId: number) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }

    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      console.log(`🔹 서버에 POST 요청: /comment/delete/${cmtId}`);
      await axios.post(`/comment/delete/${cmtId}`, {}, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });

      alert("댓글이 성공적으로 삭제되었습니다! ❌");

      // ✅ UI 업데이트 (삭제된 댓글 제거)
      setPost((prevPost: any) => {
        const updatedComments = prevPost.comment.filter((c: any) => c.cmtId !== cmtId);
        return { ...prevPost, comment: updatedComments };
      });

    } catch (error: any) {
      console.error("🚨 댓글 삭제 실패:", error.response?.data || error.message);
      alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
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
            onClick={() => router.push(`/mypage?email=${post.board.email}`)}
          >
            작성자: {post.boardNickname || "알 수 없음"}
          </button>

          <p className="text-xs text-meta-3">게시 날짜: {post.board.created || "날짜 없음"}</p>
          <p className="text-xs text-meta-3">조회수: {post.board.cnt}</p>

          {/* ✅ 좋아요 & 좋아요 취소 버튼 */}
          <div className="flex gap-4 mt-4">
          {/* ✅ 좋아요 & 좋아요 취소 버튼 (통합) */}
          <button
            onClick={handleLikeToggle}
            className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-light-2 transition-all"
          >
            {liked ? "💔 좋아요 취소" : "❤️ 좋아요"} ({post.board.heart})
          </button>
          </div>

          {/* ✅ 게시글 이미지 출력 */}
          {post.boardFile?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">📷 게시글 이미지</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.boardFile.map((imageUrl: string, index: number) => (
                  <div key={index} className="relative w-full h-40">
                    <Image
                      src={imageUrl}
                      alt={`게시글 이미지 ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg shadow-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        

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
                    <li 
                      key={index} 
                      className="p-3 bg-gray-DEFAULT rounded-lg flex justify-between items-center cursor-pointer hover:underline transition"
                      onClick={() => router.push(`/mypage?email=${comment.email}`)} // ✅ 댓글 클릭 시 마이페이지 이동
                    >
                      <div>
                        <p className="text-sm text-gray-900">{comment.content || "내용 없음"}</p>
                        <p className="text-xs text-meta-5">작성자: {post.commentNickname?.[index] || "알 수 없음"}</p>
                      </div>

                      {/* ✅ 댓글 좋아요, 좋아요 취소, 수정 버튼 */}
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ 부모 클릭 이벤트 방지 (마이페이지 이동 방지)
                            handleLikeCommentToggle(comment.cmtId, comment.liked);
                          }} 
                          className={`px-3 py-2 text-black text-sm rounded-lg transition-all ${
                            comment.liked ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-light-4"
                          }`}
                        >
                          {comment.liked ? "💔 좋아요 취소" : "❤️ 좋아요"} ({comment.heart})
                        </button>


                        {/* ✅ 현재 로그인한 유저와 댓글 작성자가 일치할 때만 수정 버튼 보이기 */}
                        {/* ✅ 현재 로그인한 유저와 댓글 작성자가 일치할 때만 수정 & 삭제 버튼 보이기 */}
                        {userEmail === comment.email && (
                          <div className="flex gap-2">
                            {/* ✅ 수정 버튼 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // ✅ 부모 클릭 이벤트 방지 (마이페이지 이동 방지)
                                setIsCommentPopupOpen(true);
                                setIsEditing(true); // ✅ 수정 모드 활성화
                                setEditingComment({ cmtId: comment.cmtId, content: comment.content }); // ✅ 수정할 댓글 정보 저장
                              }}
                              className="px-3 py-2 bg-yellow-500 text-black text-sm rounded-lg hover:bg-blue-light-2 transition-all"
                            >
                              ✏️ 수정
                            </button>

                            {/* ✅ 삭제 버튼 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // ✅ 부모 클릭 이벤트 방지 (마이페이지 이동 방지)
                                handleDeleteComment(comment.cmtId); // ✅ 삭제 함수 호출
                              }}
                              className="px-3 py-2 bg-red-500 text-black text-sm rounded-lg hover:bg-blue-light-4 transition-all"
                            >
                              ❌ 삭제
                            </button>
                          </div>
                        )}

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
