"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Searchform() {
    const router = useRouter();
    const { handleSubmit } = useForm();
    
    const [placeholder, setPlaceholder] = useState("오늘 끌리는 팝업은?");

    // 랜덤 Placeholder 설정
    useEffect(() => {
        const placeholders = [
            "오늘 끌리는 팝업은?",
            "지금 바로 팝업 검색!",
            "당신만을 위한 팝업, 팝피플"
        ];
        const randomIndex = Math.floor(Math.random() * placeholders.length);
        setPlaceholder(placeholders[randomIndex]);
    }, []);

    const searchResult = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("검색어 입력:", e.target.value);
    };

    const onSubmit = () => {
        console.log("검색 버튼 클릭!");
    };

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm"
        >
            {/* 검색 입력창 */}
            <input 
                type="text" 
                name="keyword" 
                onChange={searchResult} 
                placeholder={placeholder} 
                className="w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* 검색 버튼 */}
            <button 
                type="submit" 
                className="p-3 bg-gray-100 hover:bg-gray-200 transition duration-200"
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600 text-lg"/>
            </button>
        </form>
    );
}
