'use client'

import { useState } from 'react';
import axios from "axios";
import "./../popup.css";

export default function FormComponent() {
    const userEmail: any = localStorage.getItem("userEmail");
    const [email, setEmail] = useState();
    const [formData, setFormData] = useState({
        email: "",
        title: "",
        content: "",
        start: "",
        exp: "",
        offline: "",
        address: "",
        category: "",
        image: ""
    });

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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");

            const api = axios.create({
                baseURL: "http://47.130.76.132:8080",
                withCredentials: true,
            });

            const response = await fetch('/popup/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${token}`
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                alert('폼이 성공적으로 제출되었습니다!');
                // 폼 리셋 또는 다른 작업 수행
            }
            else {
                alert('폼 제출에 실패했습니다.');
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    return (
        <div className="popupRegisterDiv">
            <form className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <h4 className="text-3xl font-bold mb-8 text-center text-gray-800">팝업 등록하기</h4>
                <br/>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <input
                            type="email"
                            name="email"
                            value={userEmail}
                            onChange={handleChange}
                            placeholder={userEmail}
                            disabled
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
                        <select
                            name="offline"
                            value={formData.offline}
                            onChange={handleChange}
                            className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">카테고리 선택</option>
                            <option value="IT">IT</option>
                            <option value="sports">스포츠</option>
                            <option value="art">미술</option>
                            <option value="music">음악</option>
                            <option value="fashion">패션</option>
                            <option value="hobby">취미</option>
                            <option value="learning">학습</option>
                        </select>
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
                    등록
                    </button>
                </div>
            </form>
        </div>
    );
}