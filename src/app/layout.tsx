import RootLayout from './RootLayout/layout';
import ServerLayout from './ServerLayout/layout';
import TecLayout from './(site)/(Tec)/layout'; // (Tec) 폴더에서 import


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <ServerLayout> */}
        <RootLayout>
            <TecLayout> 
              {/* <div style={{ minHeight: "1000vh" }}> 최소 높이 설정 */}
               {children}
              {/* </div> */}
            </TecLayout>
        </RootLayout>
        {/* </ServerLayout> */}
      </body>
    </html>
  );
}
