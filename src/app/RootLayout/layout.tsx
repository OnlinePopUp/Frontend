"use client";

import "./css/globals.css";
import { ModalProvider } from "./context/QuickViewModalContext";
import { CartModalProvider } from "./context/CartSidebarModalContext";



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>  {/* <html>과 <body> 대신 <div>로 변경 */}  
        <ModalProvider>
          <CartModalProvider>
            {children}
          </CartModalProvider>
        </ModalProvider>
    </div>
  );
}


