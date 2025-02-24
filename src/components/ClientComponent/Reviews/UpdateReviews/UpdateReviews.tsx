"use client";
import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { useSearchParams, useRouter } from "next/navigation"; // ✅ URL 파라미터 가져오기 + 페이지 이동

const UpdateReviews = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const boardId = searchParams.get("boardId"); // ✅ URL에서 boardId 가져오기
  const accessToken = searchParams.get("accessToken"); // ✅ URL에서 accessToken 가져오기

  const [content, setContent] = useState(""); // ✅ 수정할 content 상태

  useEffect(() => {
    if (!boardId || !accessToken) {
      alert("잘못된 접근입니다.");
      router.push("/reviews"); // ✅ 필수 파라미터 없으면 리뷰 목록으로 리디렉트
    }
  }, [boardId, accessToken,router]);

  // ✅ 게시글 수정 요청 (FormData 방식)
  const handleUpdate = async () => {
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      console.log(`🔹 서버에 POST 요청 (FormData): /post/update/${boardId}`);

      // ✅ FormData 객체 생성
      const formData = new FormData();
      formData.append("content", content);

      const response = await axios.post(
        `/post/update/${boardId}`,
        formData, // ✅ 요청 본문을 FormData로 설정
        {
          headers: {
            Authorization: `${accessToken}`,
            "Content-Type": "multipart/form-data", // ✅ FormData 전송 설정
          },
        }
      );

      console.log("✅ 게시글 수정 완료:", response.data);
      alert("게시글이 성공적으로 수정되었습니다.");
      router.push(`/reviews`); // ✅ 수정 후 상세 페이지로 이동
    } catch (error: any) {
      console.error("🚨 게시글 수정 실패:", error.response?.data || error.message);
      alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // ✅ 게시글 삭제 요청
  const handleDelete = async () => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      console.log(`🔹 서버에 POST 요청: /post/delete/${boardId}`);
      
      const response = await axios.post(
        `/post/delete/${boardId}`, 
        {}, // ✅ POST 요청이므로 빈 객체 전송
        {
          headers: {
            Authorization: `${accessToken}`, // ✅ 헤더에 accessToken 추가
          },
        }
      );

      console.log("✅ 게시글 삭제 완료:", response.data);
      alert("게시글이 성공적으로 삭제되었습니다.");
      router.push("/reviews"); // ✅ 삭제 후 리뷰 목록으로 이동
    } catch (error: any) {
      console.error("🚨 게시글 삭제 실패:", error.response?.data || error.message);
      alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-yellow-light-2 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">게시글 수정</h2>

      {/* ✅ content 입력 필드 */}
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
        rows={6}
        placeholder="수정할 내용을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* ✅ 수정 완료 버튼 */}
      <button
        onClick={handleUpdate}
        className="mt-4 px-6 py-3 bg-yellow-light-1 text-black rounded-lg hover:bg-blue-light-2 transition-all"
      >
        수정 완료 ✅
      </button>

      {/* ✅ 글 삭제 버튼 (업데이트된 UI) */}
      <button
        onClick={handleDelete}
        className="mt-4 ml-4 px-6 py-3 bg-yellow-light-1 text-black rounded-lg hover:bg-blue-light-2 transition-all"
      >
        🗑️ 글 삭제
      </button>
    </section>
  );
};

export default UpdateReviews;
