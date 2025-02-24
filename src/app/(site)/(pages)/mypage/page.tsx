// src/app/mypage/page.tsx
import React, { Suspense } from "react";
import MyPage from "@/components/ClientComponent/Mypage";



const MyPageRoute = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <MyPage />;
    </Suspense>)
};

export default MyPageRoute;


