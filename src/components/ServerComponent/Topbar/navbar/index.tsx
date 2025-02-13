"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Searchform from "../searchform";  // 경로 수정
import logo from "/public/logo.png";

export default function Navbar() {
    return (
        <nav className="w-full bg-white shadow-md">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                {/* 로고 */}
                <Link href="/">
                    <Image src={logo} alt="logo" width={210} height={50} className="cursor-pointer"/>
                </Link>

                {/* 메뉴 (카테고리 & 팝업) */}
                <div className="hidden md:flex items-center space-x-6 text-gray-800 font-medium">
                    <Link href="/category" className="hover:text-gray-600 transition">카테고리</Link>
                    <Link href="/list" className="hover:text-gray-600 transition">팝업</Link>
                </div>

                {/* 검색창 */}
                <div className="flex-grow hidden md:block">
                    <Searchform />
                </div>

                {/* 사용자 관련 아이콘 */}
                <div className="flex items-center space-x-6">
                    <Link href="/cart" className="text-gray-700 hover:text-gray-500 transition">
                        <FontAwesomeIcon icon={faCartShopping} className="text-2xl" />
                    </Link>
                    <Link href="/my" className="text-gray-700 hover:text-gray-500 transition">
                        <FontAwesomeIcon icon={faUser} className="text-2xl" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
