'use client'

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Searchform from "../searchform";  // 경로 수정
import logo from "/public/logo.png";

export default function Navbar() {
    return (
        <div className="navbar">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/js/all.min.js" integrity="sha512-b+nQTCdtTBIRIbraqNEwsjB6UvL3UEMkXnhzd8awtCYh0Kcsjl9uEgwVFVbhoj3uu1DO1ZMacNvLoyJJiNfcvg=="></script>
            <div className="navbar-home">
                <Link href="/">
                    <Image src={logo} alt="logo" width="210"/>
                </Link>
            </div>
            <div className="navbar-category">
                <Link href="/category">카테고리</Link>
            </div>
            <div className="navbar-popup">
                <Link href="/list">팝업</Link>
            </div>
            <div>
                <Searchform/>
            </div>
            <div className="navbar-cart">
                <Link href="/my"><FontAwesomeIcon icon={faCartShopping} width="40"/></Link>
            </div>
            <div className="navbar-user">
                <Link href="/my"><FontAwesomeIcon icon={faUser} width="40"/></Link>
            </div>
        </div>
    )
}