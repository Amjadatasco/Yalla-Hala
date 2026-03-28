import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Yalla Hala",
  description: "بيتك البعيد من بيتك",
};

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3FAF9B] shadow-sm">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3 10.5L12 3L21 10.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.75 9.75V19.5H17.25V9.75"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 19.5V14.75H14V19.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="text-right">
        <h1 className="text-3xl font-extrabold leading-none text-[#1F2937] md:text-4xl">
          Yalla Hala
        </h1>
        <p className="mt-1 text-sm font-medium text-[#6B7280] md:text-base">
          بيتك البعيد من بيتك
        </p>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-white text-[#1F2937]">
        <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <nav className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-full bg-[#3FAF9B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#25695A] md:px-6 md:text-base"
              >
                الرئيسية
              </Link>

              <Link
                href="/add-property"
                className="rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F9FAFB] md:px-6 md:text-base"
              >
                أضف عقارك
              </Link>

              <Link
                href="/about"
                className="rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F9FAFB] md:px-6 md:text-base"
              >
                من نحن
              </Link>
            </nav>

            <Logo />
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-[#E5E7EB] bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
            <div className="text-right">
              <h3 className="text-2xl font-bold text-[#1F2937]">Yalla Hala</h3>
              <p className="mt-1 text-[#6B7280]">بيتك البعيد من بيتك</p>
            </div>

            <p className="text-center text-sm leading-7 text-[#6B7280] md:text-left">
              منصة لعرض العقارات القصيرة الإقامة داخل سوريا بطريقة واضحة ومريحة.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}