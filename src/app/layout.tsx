import RootLayout from './RootLayout/layout';
import ServerLayout from './ServerLayout/layout';
import TecLayout from './(site)/(Tec)/layout'; // (Tec) 폴더에서 import

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootLayout>
            {/* 헤더 */}
            <TecLayout> 
               {children}
            </TecLayout>
        </RootLayout>
      </body>
    </html>
  );
}
