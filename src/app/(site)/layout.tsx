"use client";
import { useState, useEffect } from "react";
// import "../css/euclid-circular-a-font.css";
import "../css/globals.css";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";

// import QuickViewModal from "@/components/Common/QuickViewModal";
// import CartSidebarModal from "@/components/Common/CartSidebarModal";
// import { PreviewSliderProvider } from "../context/PreviewSliderContext";
// import PreviewSliderModal from "@/components/Common/PreviewSlider";

// import ScrollToTop from "@/components/Common/ScrollToTop";
// import PreLoader from "@/components/Common/PreLoader";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ModalProvider>
            <CartModalProvider>
              {children}
            </CartModalProvider>
          </ModalProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   return (
//     <html lang="en" suppressHydrationWarning={true}>
//       <body>
//         {loading ? (
//           <PreLoader />
//         ) : (
//           <>
//             <ReduxProvider>
//               <CartModalProvider>
//                 <ModalProvider>
//                   <PreviewSliderProvider>
//                     {children}

//                     <QuickViewModal />
//                     <CartSidebarModal />
//                     <PreviewSliderModal />
//                   </PreviewSliderProvider>
//                 </ModalProvider>
//               </CartModalProvider>
//             </ReduxProvider>
//             <ScrollToTop />
//             <Footer />
//           </>
//         )}
//       </body>
//     </html>
//   );
// }
