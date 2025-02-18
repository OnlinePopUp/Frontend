"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ItemCreate: React.FC = () => {
    const [item, setItem] = useState({
        name: "",
        amount: "",
        price: "",
        des: "",
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const router = useRouter();

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

    // 아이템 생성 요청 (POST)
    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("토큰을 찾을 수 없습니다.");
                return;
            }

            const formData = new FormData();
            formData.append("itemDto", new Blob([JSON.stringify(item)], { type: "application/json" }));

            // 새로운 이미지 추가
            selectedFiles.forEach((file) => {
                formData.append("files", file);
            });

            const response = await fetch(`http://47.130.76.132:8080/item`, {
                method: "POST",
                headers: {
                    "Authorization": `${token}`,
                    "Accept": "application/json",
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`생성 실패! 상태 코드: ${response.status}`);
            }

            alert("아이템이 생성되었습니다.");
            router.push("/item"); // 아이템 목록 페이지로 이동
        } catch (error) {
            alert(`생성 중 오류 발생: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">새 상품 등록</h2>
            <div className="border p-4 rounded-lg shadow-md">
                <label className="block mb-2">
                    <span className="text-gray-700">상품 이름</span>
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
                        onClick={handleCreate}
                        className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
                    >
                        등록
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

export default ItemCreate;
