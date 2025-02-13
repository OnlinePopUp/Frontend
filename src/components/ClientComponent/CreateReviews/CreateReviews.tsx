"use client";

import React, { useState } from "react";

const CreateReviews: React.FC = () => {
  // 입력 데이터 상태 관리
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("게시글 생성:", formData);

    // 입력값 초기화
    setFormData({
      title: "",
      content: "",
    });

    alert("게시글이 성공적으로 작성되었습니다!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">게시글 작성</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 입력 */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">제목</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* 내용 입력 */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">내용</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
        >
          게시글 작성
        </button>


      </form>
    </div>
  );
};

export default CreateReviews;
