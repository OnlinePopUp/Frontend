import RootLayout from './RootLayout/layout';
// ✅ 서버 컴포넌트 (AlramLayout 포함)
import AlramLayout from "./Alram/layout";
import TecLayout from './(site)/(Tec)/layout'; // (Tec) 폴더에서 import
import FooterLayout from "@/app/Footer/layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootLayout>
            {/* 헤더 */}
            <TecLayout> 
              <FooterLayout>
                <AlramLayout>          
                {children}
                </AlramLayout>
              </FooterLayout>
            </TecLayout>
        </RootLayout>
      </body>
    </html>
  );
}
