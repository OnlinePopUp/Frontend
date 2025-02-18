'use client'

import Link from "next/link";
import Image from "next/image";
import Searchform from "./searchform";
import logo from "/public/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar-home">
                <Link href="/">
                    <Image src={logo} alt="logo" width="170" height="50"/>
                </Link>
            </div>
            <div className="navbar-category">
                <Link href="/category">카테고리</Link>
                <div className="category-slide">
                    <ul>
                        <li><Link href="/category/digital"/></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-popup">
                <Link href="/popup">팝업</Link>
            </div>
            <div className="navbar-popupRegister">
                <Link href="/popupRegister">팝업 신청</Link>
            </div>
            <div>
                <Searchform/>
            </div>
            <div className="navbar-cart">
                <Link href="/cart"><FontAwesomeIcon icon={faCartShopping} width="30"/></Link>
            </div>
            <div className="navbar-user">
                <Link href="/my"><FontAwesomeIcon icon={faUser} width="30"/></Link>
            </div>
        </div>
    )
}