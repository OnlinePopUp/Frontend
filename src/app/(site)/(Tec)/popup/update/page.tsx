"use client"
import React, { useState, useEffect } from 'react';

interface FormData {
    email: string;
    title: string;
    content: string;
    start: string;
    exp: string;
    offline: string;
    address: string;
    category: string;
    image: File | null;
};
  
interface EditFormProps {
    initialData: FormData;
    onSubmit: (data: FormData) => void;
};

export default function EditForm({ initialData, onSubmit }: EditFormProps) {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
        ...prevState,
        [name]: value
        }));
    };

    const handleImageChange = (e: any) => {
        setFormData(prevState => ({
        ...prevState,
        image: e.target.files[0]
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <h4 className="text-3xl font-bold mb-8 text-center text-gray-800">팝업 수정하기</h4>
            <br/>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="이메일"
                        className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="제목"
                        className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>
            <br/>
            <div className="mb-6">
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="내용"
                    className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline h-40"
                />
            </div>
            <br/>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <input
                        type="datetime-local"
                        name="start"
                        value={formData.start}
                        onChange={handleChange}
                        className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <input
                        type="datetime-local"
                        name="exp"
                        value={formData.exp}
                        onChange={handleChange}
                        className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>
            <br/>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <select
                        name="offline"
                        value={formData.offline}
                        onChange={handleChange}
                        className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">온라인/오프라인 선택</option>
                        <option value="online">온라인</option>
                        <option value="offline">병행</option>
                    </select>
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="주소"
                        className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>
            <br/>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="카테고리"
                        className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>
            <br/>
            <div className="flex items-center justify-center">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg focus:outline-none focus:shadow-outline">
                수정 완료
                </button>
            </div>
        </form>
    );
}