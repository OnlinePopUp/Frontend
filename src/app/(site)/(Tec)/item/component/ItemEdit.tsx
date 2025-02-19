"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ItemEditProps {
    itemId: string;
}

const ItemEdit: React.FC<ItemEditProps> = ({ itemId }) => {
    const [item, setItem] = useState({
        name: "",
        amount: "",
        price: "",
        des: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                        "Authorization": `${token}`,
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP 오류 Status: ${response.status}`);
                }

                const data = await response.json();
                setItem({
                    name: data.name,
                    amount: data.amount.toString(),
                    price: data.price.toString(),
                    des: data.des,
                });

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId]);

    // 입력 값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
        }
    };

    // 선택한 파일 제거
    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // 아이템 수정 요청 (PUT)
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("토큰을 찾을 수 없습니다.");
                return;
            }

            const formData = new FormData();
            formData.append("name", item.name);
            formData.append("amount", item.amount);
            formData.append("price", item.price);
            formData.append("des", item.des);
            
            // multipart/form-data 형식으로 전송을 위함
            formData.append("itemDto", new Blob([JSON.stringify(item)], { type: "application/json" }));

            // 새로운 이미지 추가
            selectedFiles.forEach((file) => {
                formData.append("files", file);
            });

            const response = await fetch(`http://47.130.76.132:8080/item/${itemId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `${token}`,
                    "Accept": "application/json"
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`수정 실패! 상태 코드: ${response.status}`);
            }

            alert("아이템이 수정되었습니다.");
            router.push(`/item/${itemId}`);
        } catch (error) {
            alert(`수정 중 오류 발생: ${error.message}`);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">아이템 수정</h2>
            <div className="border p-4 rounded-lg shadow-md">
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

                {/* 파일 업로드 필드 */}
                <label className="block mb-2">
                    <span className="text-gray-700">파일 업로드</span>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded mt-1"
                    />
                </label>

                {/* 새로 추가된 파일 미리보기 + 삭제 버튼 */}
                {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`새 파일 ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded shadow"
                                />
                                <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4 flex space-x-2">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
                    >
                        저장
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemEdit;
