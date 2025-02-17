"use client";
import React, { useState } from "react";
import axios from "axios";

interface CommentProps {
  boardId: string | null;
  closePopup: () => void;
  initialContent?: string; // ✅ 기존 댓글 내용 (수정 시 사용)
  cmtId?: number; // ✅ 댓글 ID (수정 시 필요)
  isEditing: boolean; // ✅ 작성/수정 플래그
  setPost: (updateFn: (prevPost: any) => any) => void; // ✅ 상태 업데이트 함수 추가
}

const Comment: React.FC<CommentProps> = ({ boardId, closePopup, initialContent = "", cmtId, isEditing, setPost }) => {
  const [comment, setComment] = useState(initialContent);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요!");
      console.log("isE",isEditing)
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }

    
    try {
        if (isEditing == true) {
          console.log("CD",cmtId)
          console.log("AC",accessToken)


          console.log(`🔹 서버에 POST 요청 (FormData): /comment/update/${cmtId}`);

          const formData = new FormData();
          formData.append("content", comment);

          await axios.post(
            `http://47.130.76.132:8080/comment/update/${cmtId}`,
            formData,
            {
              headers: {
                Authorization: `${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          alert("댓글이 성공적으로 수정되었습니다! ✅");

          // ✅ 댓글 목록 업데이트 (새로고침 없이)
          setPost((prevPost: any) => {
            const updatedComments = prevPost.comment.map((c: any) =>
              c.cmtId === cmtId ? { ...c, content: comment } : c
            );
            return { ...prevPost, comment: updatedComments };
          });

        } else {
          console.log(`🔹 서버에 POST 요청 (FormData): /comment/write`);

          const formData = new FormData();
          formData.append("content", comment);
          formData.append("boardId", boardId || "");

          const response = await axios.post(
            `http://47.130.76.132:8080/comment/write`,
            formData,
            {
              headers: {
                Authorization: `${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          alert("댓글이 성공적으로 작성되었습니다! ✅");
          window.location.reload(); // 페이지 새로고침
          
        }

        setComment("");
        closePopup();
        
      } catch (error: any) {
        console.error("🚨 댓글 처리 실패:", error.response?.data || error.message);
        alert("댓글 처리에 실패했습니다. 다시 시도해주세요.");
      }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-green-light-4 bg-opacity-50 z-50 transition-opacity"
      onClick={closePopup} 
    >
      <div
        className="bg-green-light-6 p-6 rounded-lg shadow-lg max-w-lg w-full transition-transform transform scale-100"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-xl font-semibold mb-4 text-black">{isEditing ? "✏️ 댓글 수정" : "✍️ 댓글 작성"}</h2>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
          rows={4}
          placeholder="댓글을 입력하세요..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={handleCommentSubmit}
            className="px-6 py-3 bg-blue-500 text-black rounded-lg hover:bg-green-light-2 transition-all"
          >
            {isEditing ? "✏️ 수정" : "✅ 작성"}
          </button>

          <button
            onClick={closePopup}
            className="px-6 py-3 bg-red-500 text-black rounded-lg hover:bg-red-light-2 transition-all"
          >
            ❌ 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
