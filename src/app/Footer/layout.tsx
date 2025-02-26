import Footer from "@/components/ClientComponent/Footer/Footer";

export default function FooterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ 메인 콘텐츠 */}
      <main className="flex-grow">{children}</main>

      {/* ✅ 푸터 (고정) */}
      <Footer />
    </div>
  );
}
