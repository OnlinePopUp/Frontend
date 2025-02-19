"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ItemProps {
    onItemClick?: (itemId: number) => void;
}

const Item: React.FC<ItemProps> = ({ onItemClick }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const [imageIndexes, setImageIndexes] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("토큰을 찾을 수 없습니다.");
                }

                const response = await fetch("/item", {
                    method: "GET",
                    headers: {
                        "Authorization": `${token}`,
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP 오류 Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("가져오는 데이터 확인:", JSON.stringify(data[0], null, 2));
                setItems(data);

                // 초기 이미지 인덱스를 0으로 설정
                const initialIndexes = data.reduce((acc, item) => {
                    acc[item.itemId] = 0;
                    return acc;
                }, {});
                setImageIndexes(initialIndexes);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    // 이전 이미지로 변경하는 함수
    const handlePrevImage = (itemId: number, itemFiles: string[]) => {
        setImageIndexes((prevIndexes) => ({
            ...prevIndexes,
            [itemId]: prevIndexes[itemId] > 0 ? prevIndexes[itemId] - 1 : itemFiles.length - 1,
        }));
    };

    // 다음 이미지로 변경하는 함수
    const handleNextImage = (itemId: number, itemFiles: string[]) => {
        setImageIndexes((prevIndexes) => ({
            ...prevIndexes,
            [itemId]: (prevIndexes[itemId] + 1) % itemFiles.length,
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">전체 아이템 조회</h2>
            <button
                    className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => router.push("/item/create")}
                >
                    상품 등록
            </button>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">아이템ID</th>
                        <th className="border border-gray-300 px-4 py-2">팝업ID</th>
                        <th className="border border-gray-300 px-4 py-2">아이템 이름</th>
                        <th className="border border-gray-300 px-4 py-2">수량</th>
                        <th className="border border-gray-300 px-4 py-2">가격</th>
                        <th className="border border-gray-300 px-4 py-2">이미지</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.itemId}
                            className="text-center cursor-pointer hover:bg-gray-200"
                            onClick={() => onItemClick && onItemClick(item.itemId)}
                        >
                            <td className="border border-gray-300 px-4 py-2">{item.itemId}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.popId}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.amount}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.price.toLocaleString()} 원</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <div className="flex items-center justify-center space-x-2">
                                    <button 
                                        className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePrevImage(item.itemId, item.itemFiles);
                                        }}
                                    >
                                        ◀
                                    </button>
                                    <img
                                        src={item.itemFiles?.[imageIndexes[item.itemId]] || ""}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover"
                                    />
                                    <button 
                                        className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNextImage(item.itemId, item.itemFiles);
                                        }}
                                    >
                                        ▶
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Item;
