"use client";

import "./css/globals.css";
import { ModalProvider } from "./context/QuickViewModalContext";
import { CartModalProvider } from "./context/CartSidebarModalContext";
import { ReduxProvider } from "@/components/ClientComponent/redux/provider";



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>  {/* <html>과 <body> 대신 <div>로 변경 */}
      <ReduxProvider>
        <ModalProvider>
          <CartModalProvider>
            {children}
          </CartModalProvider>
        </ModalProvider>
      </ReduxProvider>
    </div>
  );
}


