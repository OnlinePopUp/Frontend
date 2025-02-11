import React from "react";
import Hero from "./Hero";

const heroData = [
  { title: "iPhone 14 Plus", price: "$699", originalPrice: "$999", img: "/images/hero/hero-02.png" },
  { title: "Wireless Headphone", price: "$199", originalPrice: "$299", img: "/images/hero/hero-01.png" },
  { title: "Smart Watch", price: "$299", originalPrice: "$399", img: "/images/hero/hero-03.png" },
  { title: "Gaming Console", price: "$499", originalPrice: "$599", img: "/images/hero/hero-04.png" }
];

const Home = () => {
  return (
    <main>
      {heroData.map((item, index) => (
        <Hero key={index} data={item} />
      ))}
    </main>
  );
};

export default Home;
