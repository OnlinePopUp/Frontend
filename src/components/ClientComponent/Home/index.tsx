import React from "react";
import LogoutButton from "@/components/ClientComponent/Home/Logout/logout"; // ✅ 로그아웃 컴포넌트 추가
import Main from "@/components/ClientComponent/Home/Main/main"; // ✅ `Main` import 경로 확인


const Home = () => {
  return (
    <div className="relative">
      <Main />
      {/* ✅ 우측 상단에 로그아웃 버튼 추가 */}
      <LogoutButton />      
    </div>
  );
};

export default Home;
