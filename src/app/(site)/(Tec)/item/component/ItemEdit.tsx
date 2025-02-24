"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Item 인터페이스 정의
interface Item {
    name: string;
    amount: number;
    price: number;
    des: string;
}

interface ItemEditProps {
    itemId: string;
}

const ItemEdit: React.FC<ItemEditProps> = ({ itemId }) => {
    const [item, setItem] = useState<Item | null>(null); // ✅ `null` 대신 명확한 타입 지정
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchItem = async () => {
            try {
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
                setItem({
                    name: data.name,
                    amount: data.amount, // ✅ `string` 변환 제거
                    price: data.price, // ✅ `string` 변환 제거
                    des: data.des,
                });
            } catch (error) {
                setError((error as Error).message); // ✅ 오류 타입 변환
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId]);

    // ✅ 입력 값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setItem((prev) => {
            if (!prev) return prev; // ✅ `prev`가 `null`일 경우 대비
            return {
                ...prev,
                [name]: name === "amount" || name === "price" ? Number(value) : value, // ✅ `number` 변환 유지
            };
        });
    };

    // ✅ 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
        }
    };

    // ✅ 선택한 파일 제거
    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // ✅ 아이템 수정 요청 (PUT)
    const handleSave = async () => {
        if (!item) return;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("토큰을 찾을 수 없습니다.");
                return;
            }

            const formData = new FormData();
            formData.append("name", item.name);
            formData.append("amount", item.amount.toString()); // ✅ `number` → `string` 변환
            formData.append("price", item.price.toString()); // ✅ `number` → `string` 변환
            formData.append("des", item.des);

            // ✅ multipart/form-data 형식으로 전송
            formData.append("itemDto", new Blob([JSON.stringify(item)], { type: "application/json" }));

            // ✅ 새로운 이미지 추가
            selectedFiles.forEach((file) => {
                formData.append("files", file);
            });

            const response = await fetch(`http://47.130.76.132:8080/item/${itemId}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    Accept: "application/json",
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`수정 실패! 상태 코드: ${response.status}`);
            }

            alert("아이템이 수정되었습니다.");
            router.push(`/item/${itemId}`);
        } catch (error) {
            alert(`수정 중 오류 발생: ${(error as Error).message}`);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">아이템 수정</h2>
            <div className="border p-4 rounded-lg shadow-md">
                {item && (
                    <>
                        <label className="block mb-2">
                            <span className="text-gray-700">아이템 이름</span>
                            <input
                                type="text"
                                name="name"
                                value={item.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mt-1"
                            />
                        </label>

                        <label className="block mb-2">
                            <span className="text-gray-700">수량</span>
                            <input
                                type="number"
                                name="amount"
                                value={item.amount}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mt-1"
                            />
                        </label>

                        <label className="block mb-2">
                            <span className="text-gray-700">가격</span>
                            <input
                                type="number"
                                name="price"
                                value={item.price}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mt-1"
                            />
                        </label>

                        <label className="block mb-2">
                            <span className="text-gray-700">설명</span>
                            <textarea
                                name="des"
                                value={item.des}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mt-1"
                            ></textarea>
                        </label>

                        <div className="mt-4 flex space-x-2">
                            <button onClick={handleSave} className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600">
                                저장
                            </button>
                            <button onClick={() => router.back()} className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500">
                                취소
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ItemEdit;
