import "./globals.css";

export const metadata = {
  title: "Yalla Hala",
  description: "بيتك بعيداً عن بيتك",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#F7F4EE] text-[#2F3A36]">
        <header className="w-full border-b border-[#D8D2C8] bg-[#F7F4EE]">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-3">
                <a
                  href="/"
                  className="px-6 py-3 rounded-full bg-[#7A9E9F] text-white hover:bg-[#6C8F90] transition text-base font-medium"
                >
                  الرئيسية
                </a>

                <a
                  href="/add-property"
                  className="px-6 py-3 rounded-full border border-[#CFC7BB] bg-white text-[#2F3A36] hover:bg-[#F1ECE3] transition text-base font-medium"
                >
                  أضف عقارك
                </a>

                <a
                  href="/about"
                  className="px-6 py-3 rounded-full border border-[#CFC7BB] bg-white text-[#2F3A36] hover:bg-[#F1ECE3] transition text-base font-medium"
                >
                  من نحن
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#2F3A36]">
                  Yalla Hala
                </h1>
                <p className="text-sm md:text-base text-[#7B7B73] mt-1 font-medium">
                  بيتك بعيداً عن بيتك
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#7A9E9F] text-white flex items-center justify-center text-2xl shadow-sm">
                🏠
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="border-t border-[#D8D2C8] bg-[#F7F4EE] mt-14">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-right">
              <h3 className="text-2xl font-bold text-[#2F3A36]">Yalla Hala</h3>
              <p className="text-[#7B7B73] mt-1">بيتك بعيداً عن بيتك</p>
            </div>

            <p className="text-[#7B7B73] text-sm text-center md:text-left">
              ابحث عن شقة أو غرفة أو فيلا بسهولة ووضوح داخل سوريا.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}