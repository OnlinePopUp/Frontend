'use client'

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import "./../../globals.css";

export default function Adminpage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nickname: "",
        birth: "",
        phone: "",
        address: "",
        retypePassword: "",
        role: ""
    });
    
    const router = useRouter();
    
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
    
        if (formData.password !== formData.retypePassword) {
          alert("비밀번호가 다릅니다.");
          return;
        }
        else if (formData.email == null) {
            alert("이메일은 필수 입력사항입니다.");
        }
    
        // FormData 객체 생성
        const formDataToSend = new FormData();
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("nickname", formData.nickname);
        formDataToSend.append("birth", formData.birth);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("role", "ROLE_ADMIN")

        try {
            const response = await axios.post(
            "http://47.130.76.132:8080/admin/join",
            formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",  // form-data 형식 명시
                },
            }
        );
    
        console.log("Signup successful:", response.data);
        alert("관리자 계정이 생성되었습니다.");
    
        setFormData({
            email: "",
            password: "",
            nickname: "",
            birth: "",
            phone: "",
            address: "",
            retypePassword: "",
            role: "ROLE_ADMIN"
        });
    
        router.push("/");
        } catch (error: any) {
            console.error("Signup failed:", error.response?.data || error.message);
            alert("관리자 생성에 실패하였습니다. 다시 시도하세요.");
        }
    };
    
    return (
        <div className="h-[90vh] flex justify-center font-NanumHumanTTFBold text-2xl overflow-y-auto">
            <section className="bg-gray-2 pb-20">
                <div className="mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="mx-auto rounded-xl bg-white shadow-1 sm:p-7.5 xl:p-11 mb-10">
                        <div className="text-center mb-11">
                            <h2 className="font-semibold text-3xl sm:text-2xl xl:text-4xl text-dark mb-1.5">
                            관리자 계정 생성
                            </h2>
                        </div>
                        <div className="mt-5.5 h-[calc(100vh-200px)]">
                            <form className="pb-10" onSubmit={handleSubmit}>
                            {/* Email */}
                                <div className="mb-5">
                                    <label htmlFor="email" className="block mb-2.5">
                                        이메일 <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="이메일 주소를 입력하세요."
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                                    />
                                </div>
    
                                {/* Password */}
                                <div className="mb-5">
                                    <label htmlFor="password" className="block mb-2.5">
                                        비밀번호 <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="비밀번호를 입력하세요."
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="on"
                                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                                    />
                                </div>
    
                                {/* Re-type Password */}
                                <div className="mb-5">
                                    <label htmlFor="retypePassword" className="block mb-2.5">
                                        비밀번호 확인 <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="retypePassword"
                                        id="retypePassword"
                                        placeholder="비밀번호를 한 번 더 입력하세요."
                                        value={formData.retypePassword}
                                        onChange={handleChange}
                                        autoComplete="on"
                                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                                    />
                                </div>
    
                                {/* Nickname */}
                                <div className="mb-5">
                                    <label htmlFor="nickname" className="block mb-2.5">
                                        닉네임 <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nickname"
                                        id="nickname"
                                        placeholder="닉네임을 입력하세요."
                                        value={formData.nickname}
                                        onChange={handleChange}
                                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                                    />
                                </div>

                                {/* Birth Date */}
                                    <div className="mb-5">
                                    <label htmlFor="birth" className="block mb-2.5">
                                        생년월일 <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="birth"
                                        id="birth"
                                        value={formData.birth}
                                        onChange={handleChange}
                                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="mb-5">
                                    <label htmlFor="phone" className="block mb-2.5">
                                        전화번호 (형식에 맞춰 입력) <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        placeholder="010-1234-5678"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                                    />
                                </div>
                                {/* Address */}
                                <div className="mb-5">
                                    <label htmlFor="address" className="block mb-2.5">
                                        주소(국가) <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        placeholder="대한민국"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="address" className="block mb-2.5">
                                        구분 <span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="role"
                                        id="role"
                                        placeholder="ROLE_USER"
                                        value="관리자"
                                        disabled
                                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center font-medium text-white bg-blue-500 py-3 px-6 rounded-lg ease-out duration-200 hover:bg-sky mt-7.5"
                                >
                                계정 생성
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}