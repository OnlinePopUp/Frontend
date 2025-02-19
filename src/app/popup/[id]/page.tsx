'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import "./page.css";
import noImage from "/public/noImage.png";

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
};

interface Item {
    itemId: number,
    popId: number,
    name: string,
    amount: number,
    price: number,
    des: string,
    image: string,
    isFile: number;
};

export default function PopupPage() {
    const [opacity, setOpacity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [popup, setPopup] = useState();
    const [items, setItems] = useState([]);
    const router = useRouter();
    const params = useParams();
    const popupId = params.id;

    const addItemToCart = (popupId: number, itemId: number) => router.push(`/cart/${popupId}/${itemId}`);
    const handlePopupClick = (itemId: number) => router.push(`/item/itemDetail/${itemId}`);

    useEffect(() => {
        if (!popupId) return; // popupId가 없으면 요청하지 않음

        const api = axios.create({
            baseURL: "http://47.130.76.132:8080",
            withCredentials: true,
        });

        setLoading(true);
        api.get(`/popup/${popupId}`)
            .then((response) => {
                setPopup(response.data);
                // popup 상태 설정이 필요한 경우 여기에 추가
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching Popup:", error.response || error);
                setError(error);
                setLoading(false);
            });

        api.get(`/item/${popupId}`)
            .then((response) => {
                setItems(response.data);
                // popup 상태 설정이 필요한 경우 여기에 추가
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching items:", error.response || error);
                setError(error);
                setLoading(false);
            });
    }, [popupId]);

    useEffect(() => {
        if (items.length > 0) {
            console.log("Items loaded:", items);
        }
    }, [items]);

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

    const [imgSrc, setImgSrc] = useState(popup?.image);

    return (
        <div className="eachPopupPage">
            <Image className="popupMainPic" style={{opacity: opacity}} src={imgSrc} alt="popupMainPic" onError={() => setImgSrc(noImage)} width={100} height={50}/>
            <div className="mt-10">
                <pre className="ml-5 text-6xl">{popup?.title}</pre><pre className="ml-5 text-4xl text-gray-400 text-right">{popup?.email}</pre>
                <p className="mt-5 mb-5 ml-5 text-4xl">{popup?.content}</p>
            </div>
            <div className="products">
                <div className="grid content-center lg:grid-cols-4 gap-5 ml-5 mr-5">
                    {items.map((item) => (
                        <div key={item.itemId} className="relative w-20% border-indigo-500 ml-1 mr-1 mb-7 group">
                            <div className="relative overflow-hidden">
                                <Image className="rounded-xl transition-opacity duration-300 group-hover:opacity-50" src={item.image} alt={item.name} onError={() => setImgSrc('/default-image.jpg')} width={500} height={50} />
                                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-700 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <FontAwesomeIcon icon={faCartPlus} size="xl" onClick={() => addItemToCart(popup?.popId, item.itemId)}/>
                                </button>
                            </div>
                            <p className="mt-3 ml-3 lg:text-3xl md:text-xl text-center truncate cursor-pointer"
                                onClick={() => handlePopupClick(item.itemId)}
                            >{item.name}</p>
                            <h2 className="mt-1 ml-3 text-lg">{item.des}</h2>
                            <h4 className="mt-1 ml-3 text-3xl font-bold">&#8361; {item.price} </h4>
                        </div>
                    ))}                    
                </div>
            </div>
        </div>
    )
}