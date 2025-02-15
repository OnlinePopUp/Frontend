"use client";

// Posted만 렌더링함

import React from "react";
import Posted from "./Posted/Posted";
import Comment from "./Comment/Comment";

const ReviewsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* 게시글 컴포넌트 */}
      <Posted />
    </div>
  );
};

export default ReviewsPage;
