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
    <Link
      href="/"
      className="flex items-center gap-3"
    >

      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#3FAF9B] shadow-sm">

        <svg
          width="26"
          height="26"
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

        <h1 className="text-2xl sm:text-3xl font-extrabold leading-none text-[#1F2937]">
          Yalla Hala
        </h1>

        <p className="mt-1 text-xs sm:text-sm font-medium text-[#6B7280]">
          بيتك البعيد من بيتك
        </p>

      </div>

    </Link>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {

  return (
    <Link
      href={href}
      className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F9FAFB]"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ar" dir="rtl">

      <body className="bg-[#FAFAFA] text-[#1F2937] overflow-x-hidden">

        <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <Logo />

              <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">

                <Link
                  href="/"
                  className="rounded-full bg-[#3FAF9B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#25695A]"
                >
                  الرئيسية
                </Link>

                <NavLink href="/add-property">
                  أضف عقارك
                </NavLink>

                <NavLink href="/about">
                  من نحن
                </NavLink>

              </nav>

            </div>

          </div>

        </header>

        {children}

        <footer className="mt-16 border-t border-[#E5E7EB] bg-white">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

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