"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import axios from "@/utils/axiosConfig";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

interface Popup {
  popId: number;
  title: string;
  email: string;
  content: string;
  start: string;
  exp: string;
  offline: string;
  address: string;
  category: string;
  image: string;
}

const categoryBackgrounds: { [key: string]: string } = {
  "IT": "/it.jpg",
  "스포츠": "/sports.jpg",
  "미술": "/arts.jpg",
  "음악": "/music.jpg",
  "패션": "/passion.jpg",
  "취미": "/likes.jpg",
  "학습": "/study.jpg",
};

const Main: React.FC = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [randomPopups, setRandomPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "날짜 미정";
    return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(dateString));
  };

  const shuffleArray = (array: Popup[]) => {
    return array.sort(() => Math.random() - 0.5).slice(0, 3);
  };

  const fetchPopups = useCallback(async () => {
    setLoading(true);
    try {
      console.log("🔹 API 요청 시작...");
      const response = await axios.get(`/popup/all?category=전체&page=0&size=100`);
      console.log("✅ API 응답 데이터:", response.data);

      if (response.data && Array.isArray(response.data)) {
        const shuffled = shuffleArray(response.data);
        setPopups(response.data);
        setRandomPopups(shuffled);
      } else {
        console.warn("🚨 응답 데이터 형식이 올바르지 않습니다.", response.data);
      }
    } catch (error: any) {
      console.error("🚨 API 요청 실패:", error.response?.data || error.message);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {loading ? (
        <p className="text-center text-gray-500 text-lg mt-10">데이터를 불러오는 중...</p>
      ) : error ? (
        <p className="text-center text-red-500 text-lg mt-10">{error}</p>
      ) : (
        randomPopups.map((popup) => (
          <div 
            key={popup.popId} 
            className="relative w-full max-w-4xl mx-auto p-6 mb-10 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0">
              <Image
                src={categoryBackgrounds[popup.category] || "/noImage.png"}
                alt={`${popup.category} 배경`}
                layout="fill"
                objectFit="cover"
                className="opacity-20 blur-md"
              />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-semibold text-blue-600 hover:underline hover:text-blue-800 transition-all cursor-pointer">
                {popup.title}
              </h2>
              <p className="text-lg text-gray-700 mt-2">{popup.content}</p>
              <p className="text-base text-gray-500 mt-2">
                진행 기간: {formatDate(popup.start)} ~ {formatDate(popup.exp)}
              </p>
            </div>

            <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center mt-4">
              <Image
                src={popup.image || "/noImage.png"}
                alt={popup.title || "이미지 없음"}
                width={250}
                height={250}
                className="rounded-lg object-contain"
                quality={90}
              />
              <div className="text-center mt-4">
                <h3 className="text-xl font-bold">{popup.title}</h3>
                <p className="text-lg font-semibold text-blue-600 mt-2">{popup.category}</p>
                <p className="text-base text-gray-700 mt-2">{popup.address || "주소 미정"}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Main;
