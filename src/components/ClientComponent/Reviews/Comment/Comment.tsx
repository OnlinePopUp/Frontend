"use client";

import React from "react";

const Comment: React.FC = () => {
  // 하드코딩된 더미 댓글 데이터
  const comments = [
    {
      id: 1,
      author: "Alice",
      content: "정말 좋은 게시글이네요! 많은 도움이 되었습니다.",
      createdAt: "2025-02-13 10:45",
    },
    {
      id: 2,
      author: "Bob",
      content: "Next.js에 대한 설명이 정말 깔끔하네요. 감사합니다!",
      createdAt: "2025-02-13 11:30",
    },
    {
      id: 3,
      author: "Charlie",
      content: "React와 Next.js의 차이점을 이해하는 데 도움이 됐어요!",
      createdAt: "2025-02-13 12:15",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">댓글 ({comments.length})</h2>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-700">{comment.author}</p>
              <span className="text-sm text-gray-500">{comment.createdAt}</span>
            </div>
            <p className="mt-2 text-gray-600">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
