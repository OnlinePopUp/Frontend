'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import './page.css';
import noImage from '/public/noImage.png';

interface Popup {
    popId: number;
    title: string;
    email: string;  // 이메일이 필수로 들어온다고 가정
    content: string;
    start: string;
    exp: string;
    offline: string;
    address: string;
    category: string;
    image: string;
}

interface Item {
    itemId: number;
    popId: number;
    name: string;
    amount: number;
    price: number;
    des: string;
    image: string;
    isFile: number;
}

export default function PopupPage() {
    const [opacity, setOpacity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [popup, setPopup] = useState<Popup | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [imgSrc, setImgSrc] = useState<string>(noImage.src);
    const router = useRouter();
    const params = useParams();

    // ✅ popupId의 타입 변환 (string | string[] → string)
    const rawPopupId = params?.id;
    const popupId: string | undefined = Array.isArray(rawPopupId) ? rawPopupId[0] : rawPopupId;

    // 로그인한 유저의 이메일을 가져옴
    const userEmail = localStorage.getItem('userEmail') || ''; // null 처리

    // 팝업의 이메일이 현재 유저 이메일과 일치하는지 확인
    const isUserPopupOwner = popup?.email === userEmail;

    const addItemToCart = (popupId: number, itemId: number) => router.push(`/cart/${popupId}/${itemId}`);
    const handlePopupClick = (itemId: number) => router.push(`/item/itemDetail/${itemId}`);

    useEffect(() => {
        if (!popupId) return; // popupId가 없으면 요청하지 않음

        const fetchData = async () => {
            try {
                const api = axios.create({
                    baseURL: 'http://47.130.76.132:8080',
                    withCredentials: true,
                });

                setLoading(true);

                // ✅ API 호출을 async/await으로 변경
                const popupResponse = await api.get<Popup>(`/popup/${popupId}`);
                setPopup(popupResponse.data);
                setImgSrc(popupResponse.data.image || noImage.src); // 기본 이미지 설정

                const itemsResponse = await api.get<Item[]>(`/item/${popupId}`);
                setItems(itemsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [popupId]);

    useEffect(() => {
        const mouseScroll = () => {
            const scrollPosition = window.scrollY;
            const maxScroll = 1000;
            const newOpacity = Math.max(0, 1 - scrollPosition / maxScroll);
            setOpacity(newOpacity);
        };

        window.addEventListener('scroll', mouseScroll);
        return () => {
            window.removeEventListener('scroll', mouseScroll);
        };
    }, []);

    const handleAddToCart = async (item: Item) => {
        if (!item) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("토큰을 찾을 수 없습니다.");
            return;
        }

        if (!window.confirm(`장바구니에 담으시겠습니까?`)) return;

        try {
            const response = await fetch(`http://47.130.76.132:8080/cart/${item.popId}/${item.itemId}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: 1 }),
            });

            if (!response.ok) {
                throw new Error(`장바구니 추가 실패, 상태 코드: ${response.status}`);
            }

            alert("장바구니에 추가되었습니다.");
        } catch (error) {
            alert(`장바구니 추가 중 오류 발생: ${(error as Error).message}`);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="eachPopupPage">
            <Image
                className="popupMainPic"
                style={{ opacity: opacity }}
                src={imgSrc}
                alt="popupMainPic"
                onError={() => setImgSrc(noImage.src)}
                width={100}
                height={50}
            />
            {isUserPopupOwner && (
    <button className="ml-5 text-4xl text-gray-400 text-right"
    onClick={() => router.push('/item/create')}>
        아이템 등록하기
    </button>
)}
            <div className="mt-10">
                {popup && (
                    <>
                        <pre className="ml-5 text-6xl">{popup.title}</pre>
                        <pre className="ml-5 text-4xl text-gray-400 text-right">{popup.email}</pre>
                        <p className="mt-5 mb-5 ml-5 text-4xl">{popup.content}</p>
                    </>
                )}
            </div>
            <div className="products">
                <div className="grid content-center lg:grid-cols-4 gap-5 ml-5 mr-5">
                    {items.map((item) => (
                        <div key={item.itemId} className="relative w-20% border-indigo-500 ml-1 mr-1 mb-7 group">
                            <div className="relative overflow-hidden">
                                <Image
                                    className="rounded-xl transition-opacity duration-300 group-hover:opacity-50"
                                    src={item.image || '/default-image.jpg'}
                                    alt={item.name}
                                    onError={() => setImgSrc('/default-image.jpg')}
                                    width={500}
                                    height={50}
                                />
                                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-700 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <FontAwesomeIcon
                                        icon={faCartPlus}
                                        size="xl"
                                        onClick={() => handleAddToCart(item)}
                                    />
                                </button>
                            </div>
                            <p
                                className="mt-3 ml-3 lg:text-3xl md:text-xl text-center truncate cursor-pointer"
                                onClick={() => handlePopupClick(item.itemId)}
                            >
                                {item.name}
                            </p>
                            <h2 className="mt-1 ml-3 text-lg">{item.des}</h2>
                            <h4 className="mt-1 ml-3 text-3xl font-bold">&#8361; {item.price} </h4>
                            {/* "아이템 등록하기" 버튼은 팝업 이메일이 현재 로그인한 유저의 이메일과 일치할 때만 보이도록 설정 */}
                        
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}