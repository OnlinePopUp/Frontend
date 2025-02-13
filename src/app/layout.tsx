import RootLayout from './RootLayout/layout';
import ServerLayout from './ServerLayout/layout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootLayout>
            <ServerLayout>
            {children}
            </ServerLayout>
        </RootLayout>
      </body>
    </html>
  );
}
