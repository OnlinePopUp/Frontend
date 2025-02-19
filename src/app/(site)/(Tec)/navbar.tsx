'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Searchform from "./searchform";
import logo from "/public/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    return (
        <div className="navbar">
            <div className="navbar-home">
                <Link href="/">
                    <Image src={logo} alt="logo" width="170" height="50"/>
                </Link>
            </div>
            <div className="navbar-category" 
                 onMouseEnter={() => setShowCategoryMenu(true)}
                 onMouseLeave={() => setShowCategoryMenu(false)}>
                <Link href="/category">카테고리</Link>
                {showCategoryMenu && (
                    <div className="category-slide">
                        <Link href="/category/it">IT</Link>
                        <Link href="/category/sports">스포츠</Link>
                        <Link href="/category/art">미술</Link>
                        <Link href="/category/music">음악</Link>
                        <Link href="/category/fashion">패션</Link>
                        <Link href="/category/hobby">취미</Link>
                        <Link href="/category/education">학습</Link>
                    </div>
                )}
            </div>
            <div className="navbar-popup">
                <Link href="/popup/all">팝업</Link>
            </div>
            <div className="navbar-popupRegister">
                <Link href="/popup/register">팝업 신청</Link>
            </div>
            
            <div>
                <Searchform/>
            </div>
            <div className="navbar-cart">
                <Link href="/cart"><FontAwesomeIcon icon={faCartShopping} width="30"/></Link>
            </div>
            
            {/* ✅ "후기 게시판" 버튼 추가 */}
            <div className="navbar-reviews">
                <Link href="/reviews" className="review-button">
                    후기 게시판
                </Link>
            </div>
        </div>
    )
}