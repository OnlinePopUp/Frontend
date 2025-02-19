'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import ucl from "/public/ucl.jpg";
import ball from "/public/adidasBall.jpg";
import "./page.css";

export default function PopupPage(props: any) {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const mouseScroll = () => {
            const scrollPosition = window.scrollY;
            const maxScroll = 1000;
            const newOpacity = Math.max(0, 1 - scrollPosition / maxScroll);
            setOpacity(newOpacity);
        };

        window.addEventListener("scroll", mouseScroll);
    return () => {
        window.removeEventListener("scroll", mouseScroll);
    }
    }, []);

    return (
        <div className="eachPopupPage">
            <Image className="popupMainPic" style={{opacity: opacity}} src={ucl} alt="popupMainPic"/>
            <div className="mt-10">
                <pre className="ml-5 text-6xl">해외축구 굿즈 샵!</pre><pre className="ml-5 text-4xl text-gray-400 text-right">위송빠레</pre>
                <p className="mt-5 ml-5 text-4xl">매장은 비싸고, 직구하기엔 배보다 배꼽이 더 커져 부담스럽던 굿즈!</p>
                <p className="mt-2 ml-5 mb-10 text-4xl">이제 편하게 구매하세요!</p>
            </div>
            <div className="products">
                <div className="grid content-center lg:grid-cols-4 gap-5 ml-5 mr-5">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="relative w-20% border-indigo-500 ml-1 mr-1 mb-7 group">
                            <div className="relative overflow-hidden">
                                <Image className="rounded-xl transition-opacity duration-300 group-hover:opacity-50" src={ball} alt="24/25 UCL knockout ball." />
                                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-700 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <FontAwesomeIcon icon={faCartPlus} size="xl"/>
                                </button>
                            </div>
                            <p className="mt-3 ml-3 lg:text-3xl md:text-xl text-center truncate">24/25 UCL 녹아웃 스테이지 볼</p>
                            <h2 className="mt-1 ml-3 text-lg">아디다스</h2>
                            <h4 className="mt-1 ml-3 text-3xl font-bold">&#8361; 180,000 </h4>
                        </div>
                    ))}                    
                </div>
            </div>
        </div>
    )
}