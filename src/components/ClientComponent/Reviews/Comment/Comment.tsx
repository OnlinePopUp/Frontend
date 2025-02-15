"use client";
import React, { useState } from "react";
import axios from "axios";

interface CommentProps {
  boardId: string | null;
  closePopup: () => void;
}

const Comment: React.FC<CommentProps> = ({ boardId, closePopup }) => {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요!");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다!");
      return;
    }

    try {
      console.log(`🔹 서버에 POST 요청 (FormData): /comment/write`);

      // ✅ FormData 객체 생성
      const formData = new FormData();
      formData.append("content", comment);
      formData.append("boardId", boardId || ""); // ✅ boardId가 null이면 빈 문자열로 처리

      const response = await axios.post(
        `http://47.130.76.132:8080/comment/write`,
        formData, // ✅ FormData 전송
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "multipart/form-data", // ✅ FormData 전송 설정
          },
        }
      );

      alert("댓글이 성공적으로 작성되었습니다! ✅");
      setComment("");
      closePopup(); // ✅ 팝업 닫기
    } catch (error: any) {
      console.error("🚨 댓글 작성 실패:", error.response?.data || error.message);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-green-light-4 bg-opacity-50 z-50 transition-opacity"
      onClick={closePopup} // ✅ 배경 클릭 시 팝업 닫기
    >
      <div
        className="bg-green-light-6 p-6 rounded-lg shadow-lg max-w-lg w-full transition-transform transform scale-100"
        onClick={(e) => e.stopPropagation()} // ✅ 내부 클릭 시 닫히지 않도록 방지
      >
        <h2 className="text-xl font-semibold mb-4 text-black">✍️ 댓글 작성</h2>

        {/* ✅ 댓글 입력 필드 */}
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
          rows={4}
          placeholder="댓글을 입력하세요..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-between mt-4">
          {/* ✅ 댓글 작성 버튼 */}
          <button
            onClick={handleCommentSubmit}
            className="px-6 py-3 bg-blue-500 text-black rounded-lg hover:bg-green-light-2 transition-all"
          >
            ✅ 작성
          </button>

          {/* ❌ 닫기 버튼 */}
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
