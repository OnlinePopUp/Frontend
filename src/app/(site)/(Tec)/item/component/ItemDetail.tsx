"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ✅ Item 인터페이스 정의
interface Item {
    itemId: number;
    name: string;
    amount: number;
    price: number;
    des: string;
    email: string;
    itemFiles?: string[]; // 파일이 없을 수도 있으므로 옵셔널 처리
}

interface ItemDetailProps {
    itemId: string;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ itemId }) => {
    const [item, setItem] = useState<Item | null>(null); // ✅ `null` 대신 명확한 타입 지정
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(1); // 초기 수량 설정
    const router = useRouter();

    // ✅ 현재 로그인한 사용자 이메일 가져오기
    const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

    useEffect(() => {
        const fetchItemDetail = async () => {
            try {
                if (!itemId) throw new Error("잘못된 접근입니다.");

                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("토큰을 찾을 수 없습니다.");
                }

                const response = await fetch(`http://47.130.76.132:8080/item/itemDetail/${itemId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP 오류 Status: ${response.status}`);
                }

                const data: Item = await response.json();
                setItem(data);
            } catch (error) {
                setError((error as Error).message); // ✅ 오류 타입 변환
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetail();
    }, [itemId]);

    // ✅ 수량 증가 함수
    const increaseAmount = () => setAmount((prev) => prev + 1);

    // ✅ 수량 감소 함수 (최소 1)
    const decreaseAmount = () => setAmount((prev) => (prev > 1 ? prev - 1 : 1));

    // ✅ 수량 직접 입력 함수
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setAmount(isNaN(value) || value < 1 ? 1 : value);
    };

    // ✅ 아이템 삭제 함수
    const handleDelete = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("토큰을 찾을 수 없습니다.");
            return;
        }

        if (!window.confirm("정말로 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://47.130.76.132:8080/item/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`삭제 실패, 상태 코드: ${response.status}`);
            }

            alert("아이템이 삭제되었습니다.");
            router.push("/item");
        } catch (error) {
            alert(`삭제 중 오류 발생: ${(error as Error).message}`);
        }
    };

    // ✅ 아이템 수정 페이지 이동 함수
    const handleEdit = () => router.push(`/item/edit/${itemId}`);

    // ✅ 장바구니 담기 함수
    const handleAddToCart = async () => {
        if (!item) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("토큰을 찾을 수 없습니다.");
            return;
        }

        if (!window.confirm(`장바구니에 ${amount}개 담으시겠습니까?`)) return;

        try {
            const response = await fetch(`http://47.130.76.132:8080/cart/${item.itemId}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount }),
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
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">아이템 상세 정보</h2>
            {item && (
                <div className="border p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-gray-600">ID: {item.itemId}</p>
                    <p>수량: {item.amount}</p>
                    <p>가격: {item.price.toLocaleString()} 원</p>

                    {/* ✅ 이미지가 있을 때만 표시 */}
                    {item.itemFiles && item.itemFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {item.itemFiles.map((fileUrl, index) => (
                                <Image
                                    key={index}
                                    src={fileUrl}
                                    alt={`${item.name} 이미지 ${index + 1}`}
                                    className="w-40 h-40 object-cover rounded shadow"
                                />
                            ))}
                        </div>
                    )}

                    <p className="text-gray-700 mt-4">{item.des}</p>

                    <div className="mt-4 flex space-x-2">
                        {userEmail && userEmail === item.email ? (
                            <>
                                <button onClick={handleEdit} className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600">
                                    수정하기
                                </button>
                                <button onClick={handleDelete} className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600">
                                    삭제하기
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <button onClick={decreaseAmount} className="bg-gray-300 px-3 py-2 rounded hover:bg-gray-400">➖</button>
                                <input type="number" value={amount} onChange={handleAmountChange} className="w-16 text-center p-2 border rounded" />
                                <button onClick={increaseAmount} className="bg-gray-300 px-3 py-2 rounded hover:bg-gray-400">➕</button>
                                <button onClick={handleAddToCart} className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600">
                                    장바구니 담기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetail;
