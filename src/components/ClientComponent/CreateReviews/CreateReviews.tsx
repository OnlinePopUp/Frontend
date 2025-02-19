"use client";
import React, { useState } from "react";
import axios from "@/utils/axiosConfig";
import {  useRouter } from "next/navigation"; // 페이지 이동

const CreateReviews = () => {
  const [title, setTitle] = useState(""); // ✅ 제목
  const [content, setContent] = useState(""); // ✅ 내용
  const [files, setFiles] = useState<FileList | null>(null); // ✅ 파일 리스트 상태
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태
  const router = useRouter();

  // ✅ 파일 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files); // ✅ 파일 리스트 저장
    }
  };

  // ✅ 후기글 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      // 🔹 FormData 생성
      const formData = new FormData();
      formData.append("name", title); // ✅ 제목 추가
      formData.append("content", content); // ✅ 내용 추가

      // ✅ 파일 여러 개 추가
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }

      // 🔹 서버에 POST 요청 (`/post/write`)
      const response = await axios.post("/post/write", formData, {
        headers: {
          Authorization: `${accessToken}` // ✅ 헤더에 토큰 포함
        },
      });

      console.log("✅ 게시글 작성 성공:", response.data);
      alert("게시글이 성공적으로 작성되었습니다.");

      router.push("/reviews");
      

    } catch (error: any) {
      console.error("🚨 게시글 작성 실패:", error.response?.data || error.message);
      alert(error.response?.data?.error || "게시글 작성 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6 bg-yellow-light-2 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">후기글 작성</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ 제목 입력 */}
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            게시글 제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* ✅ 내용 입력 */}
        <div>
          <label htmlFor="content" className="block font-medium mb-1">
            게시글 내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32"
          ></textarea>
        </div>

        {/* ✅ 파일 업로드 */}
        <div>
          <label htmlFor="file" className="block font-medium mb-1">
            첨부파일 업로드 (여러 개 선택 가능)
          </label>
          <input
            type="file"
            id="file"
            multiple // ✅ 여러 개 선택 가능
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {files && (
            <ul className="text-gray-500 text-sm mt-2">
              {Array.from(files).map((file, index) => (
                <li key={index}>📂 {file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-black font-medium py-3 rounded-lg hover:bg-blue transition-all duration-200"
          disabled={loading}
        >
          {loading ? "작성 중..." : "submit"}
        </button>
      </form>
    </section>
  );
};

export default CreateReviews;
