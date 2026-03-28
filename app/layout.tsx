import "./globals.css";

export const metadata = {
  title: "Yalla Hala",
  description: "بيتك الجديد من بيتك",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body className="bg-[#f7f8f8] text-[#132033]">
        <header className="w-full border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center text-xl">
                🏠
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-extrabold leading-none">
                  Yalla Hala
                </h1>
                <p className="text-sm text-gray-500 mt-1">بيتك الجديد من بيتك</p>
              </div>
            </div>

            <nav className="flex items-center gap-3">
              <a
                href="/"
                className="px-6 py-3 rounded-full bg-teal-700 text-white hover:bg-teal-800 transition"
              >
                الرئيسية
              </a>

              <a
                href="/add-property"
                className="px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition"
              >
                أضف عقارك
              </a>

              <a
                href="/about"
                className="px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition"
              >
                من نحن
              </a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="border-t border-gray-200 bg-white mt-10">
          <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
            <div className="text-right">
              <h3 className="text-2xl font-bold">Yalla Hala</h3>
              <p className="text-gray-500 mt-1">بيتك الجديد من بيتك</p>
            </div>

            <p className="text-gray-500 text-sm">
              منصة أولية للسكن المؤقت في سوريا، بتجربة واضحة ومريحة وآمنة قدر
              الإمكان للمضيفين.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}