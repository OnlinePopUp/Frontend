"use client";

import Breadcrumb from "@/components/ClientComponent/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    birth: "",
    phone: "",
    address: "",
    retypePassword: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.retypePassword) {
      alert("Passwords do not match!");
      return;
    }

    // FormData 객체 생성
    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("nickname", formData.nickname);
    formDataToSend.append("birth", formData.birth);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);

    try {
      const response = await axios.post(
        "http://47.130.76.132:8080/auth/join",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",  // form-data 형식 명시
          },
        }
      );

      console.log("Signup successful:", response.data);
      alert("Account created successfully!");

      setFormData({
        email: "",
        password: "",
        nickname: "",
        birth: "",
        phone: "",
        address: "",
        retypePassword: "",
      });

      router.push("/");
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <>
      <Breadcrumb title={"Signup"} pages={["Signup"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Create an Account
              </h2>
              <p>Enter your details below</p>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email Address <span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                {/* Password */}
                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                {/* Re-type Password */}
                <div className="mb-5">
                  <label htmlFor="retypePassword" className="block mb-2.5">
                    Re-type Password <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="retypePassword"
                    id="retypePassword"
                    placeholder="Re-type your password"
                    value={formData.retypePassword}
                    onChange={handleChange}
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                {/* Nickname */}
                <div className="mb-5">
                  <label htmlFor="nickname" className="block mb-2.5">
                    Nickname <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    id="nickname"
                    placeholder="Enter your nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                {/* Birth Date */}
                <div className="mb-5">
                  <label htmlFor="birth" className="block mb-2.5">
                    Birth Date <span className="text-red">*</span>
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
                    Phone Number <span className="text-red">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                {/* Address */}
                <div className="mb-5">
                  <label htmlFor="address" className="block mb-2.5">
                    Address <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                >
                  Create Account
                </button>

                <p className="text-center mt-6">
                  Already have an account?
                  <Link
                    href="/signin"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Sign in Now
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
