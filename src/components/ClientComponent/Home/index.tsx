import React from "react";
import LogoutButton from "@/components/ClientComponent/Home/Logout/logout"; // ✅ 로그아웃 컴포넌트 추가


const Home = () => {
  return (
    <main className="relative">
      {/* ✅ 우측 상단에 로그아웃 버튼 추가 */}
      <LogoutButton />      
    </main>
  );
};

export default Home;
