"use client";

import React from "react";

const Posted: React.FC = () => {
  // 하드코딩된 더미 데이터
  const post = {
    title: "React & Next.js 게시글",
    createdAt: "2025-02-13",
    likes: 42,
    views: 1500,
    content:
      "이 게시글은 React와 Next.js를 사용하여 작성되었습니다. 한 페이지에서 여러 컴포넌트를 렌더링하는 방법을 학습하고 있습니다.",
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* 제목 및 정보 */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500">
        생성일: {post.createdAt} | 좋아요 ❤️ {post.likes} | 조회수 👁 {post.views}
      </p>

      {/* 구분선 */}
      <hr className="my-4 border-gray-300" />

      {/* 내용 */}
      <div className="mt-4 text-gray-700 leading-relaxed">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default Posted;
