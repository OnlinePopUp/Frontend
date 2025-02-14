"use client"

// import Breadcrumb from "@/components/ClientComponent/Common/Breadcrumb";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Signin = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //토큰 없이
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formDataToSend = new FormData();
  //   formDataToSend.append("email", formData.email);
  //   formDataToSend.append("password", formData.password);

  //   try {
  //     const response = await axios.post(
  //       "http://47.130.76.132:8080/auth/login",
  //       formDataToSend,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log("Login successful:", response.data);
  //     alert("Login successful!");

  //     setFormData({
  //       email: "",
  //       password: "",
  //     });

  //     router.push("/");
  //   } catch (error) {
  //     console.error("Login failed:", error.response?.data || error.message);
  //     alert("Login failed. Please try again.");
  //   }

  // };

  //토큰 있을때
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);


    try {

      const response = await axios.post(
          "http://47.130.76.132:8080/auth/login",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true  // 쿠키 및 인증 정보 포함
          }
        );

      // 서버 응답 전체 출력 (디버깅용)
      console.log("Full response:", response);

      // 1. 응답 본문(Body) 출력
      console.log("Response Body:", response.data);

      // 2. 서버 응답 헤더에서 AccessToken 추출 
      const accessToken = response.headers['access-token'];
     
      // 3. 응답 오는 전체 헤더 출력 (디버깅용)
      console.log("Response Headers:", response.headers);

      // 4. 추출한 AccessToken 출력
      console.log("AccessToken:", accessToken);
      
      if (accessToken) {
        // 로컬 스토리지에 AccessToken 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem("userEmail", formData.email); // 이메일 저장 추가
        alert("Login successful!");

        setFormData({
          email: "",
          password: "",
        });

        router.push("/");
      } else {
        throw new Error("AccessToken not received");
      }

    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please try again.");
    }
  };
  
  //토큰 들어왔는지 테스트
  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  
  //   if (token) {
  //     console.log("Token exists in localStorage:", token);
  //   } else {
  //     console.log("No token found in localStorage.");
  //   }
  // }, []);
  
  return (
    <>
      {/* <Breadcrumb title={"Signin"} pages={["Signin"]} /> */}
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Sign In to Your Account
              </h2>
              <p>Enter your detail below</p>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password
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

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                >
                  Sign in to account
                </button>


                <span className="relative z-1 block font-medium text-center mt-4.5">
                  <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3"></span>
                  <span className="inline-block px-3 bg-white">Or</span>
                </span>

                <p className="text-center mt-6">
                  Don&apos;t have an account?
                  <Link
                    href="/signup"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Sign Up Now!
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

export default Signin;
