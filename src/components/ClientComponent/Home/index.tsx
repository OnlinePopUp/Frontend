import React from "react";
import LogoutButton from "@/components/ClientComponent/Home/Logout/logout"; // ✅ 로그아웃 컴포넌트 추가

const heroData = [
  { title: "iPhone 14 Plus", price: "$699", originalPrice: "$999", img: "/images/hero/hero-02.png" },
  { title: "Wireless Headphone", price: "$199", originalPrice: "$299", img: "/images/hero/hero-01.png" },
  { title: "Smart Watch", price: "$299", originalPrice: "$399", img: "/images/hero/hero-03.png" },
  { title: "Gaming Console", price: "$499", originalPrice: "$599", img: "/images/hero/hero-04.png" }
];

const Home = () => {
  return (
    <main className="relative">
      {/* ✅ 우측 상단에 로그아웃 버튼 추가 */}
      <LogoutButton />

      
    </main>
  );
};

export default Home;
