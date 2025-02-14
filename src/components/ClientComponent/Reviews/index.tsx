"use client";

import React from "react";
import Posted from "./Posted/Posted";
import Comment from "./Comment/Comment";

const ReviewsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* 게시글 컴포넌트 */}
      <Posted />

      {/* 댓글 컴포넌트
      <Comment /> */}
    </div>
  );
};

export default ReviewsPage;
