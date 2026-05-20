import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Yalla Hala | عقارات للإقامة القصيرة في سوريا",

  description:
    "منصة لعرض الشقق والفيلات والمزارع والشاليهات للإقامة القصيرة داخل سوريا.",

  openGraph: {
    title: "Yalla Hala",

    description:
      "منصة للعقارات قصيرة الإقامة داخل سوريا",

    url: "https://yallahala.com",

    siteName: "Yalla Hala",

    locale: "ar_SY",

    type: "website",
  },
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

      <body className="bg-[#FAFAFA] text-[#1F2937]">

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

              <Link
                href="/dashboard"
                className="rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F9FAFB] md:px-6 md:text-base"
              >
                Dashboard
              </Link>

            </nav>

            <Logo />

          </div>

        </header>

        {children}

        <footer className="mt-16 border-t border-[#E5E7EB] bg-white">

          <div className="mx-auto max-w-7xl px-6 py-10">

            <div className="grid gap-10 md:grid-cols-3">

              <div className="text-right">

                <h3 className="text-3xl font-extrabold text-[#111827]">
                  Yalla Hala
                </h3>

                <p className="mt-4 leading-8 text-[#6B7280]">
                  منصة للعقارات قصيرة الإقامة داخل سوريا،
                  تشمل الشقق والفيلات والمزارع والغرف والشاليهات.
                </p>

              </div>

              <div className="text-right">

                <h3 className="text-2xl font-bold text-[#111827]">
                  روابط سريعة
                </h3>

                <div className="mt-5 flex flex-col gap-4">

                  <Link
                    href="/"
                    className="text-[#6B7280] hover:text-[#3FAF9B]"
                  >
                    الرئيسية
                  </Link>

                  <Link
                    href="/add-property"
                    className="text-[#6B7280] hover:text-[#3FAF9B]"
                  >
                    أضف عقارك
                  </Link>

                  <Link
                    href="/about"
                    className="text-[#6B7280] hover:text-[#3FAF9B]"
                  >
                    من نحن
                  </Link>

                </div>

              </div>

              <div className="text-right">

                <h3 className="text-2xl font-bold text-[#111827]">
                  تواصل معنا
                </h3>

                <div className="mt-5 space-y-4 text-[#6B7280]">

                  <p>
                    contact@yallahala.com
                  </p>

                  <p>
                    +963000000000
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-10 border-t border-[#E5E7EB] pt-6 text-center text-sm text-[#6B7280]">

              © 2026 Yalla Hala - جميع الحقوق محفوظة

            </div>

          </div>

        </footer>

      </body>

    </html>
  );
}