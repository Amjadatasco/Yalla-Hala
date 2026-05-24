"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>
          منصة يلا هلا | حجوزات الشاليهات والعقارات السياحية في سوريا
        </title>

        <meta
          name="description"
          content="بيتك البعيد عن بيتك. تصفح واحجز أفضل الشاليهات، الفلل، والمزارع للإقامات قصيرة الأجل في سوريا بكل سهولة وأمان ونظام إشعارات فوري."
        />

        <meta
          name="keywords"
          content="يلا هلا, حجز شاليهات سوريا, شاليهات اللاذقية, شاليهات طرطوس, فلل حمص, مزارع دمشق, عقارات سياحية سوريا, إقامة قصيرة الأجل"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body className="bg-[#FAFAFA] text-[#1F2937] overflow-x-hidden antialiased">

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-V5QW92L6J0"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">

              <div className="relative h-12 w-12 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 transition-transform duration-300 group-hover:scale-105">

                <img
                  src="/logo.jpg"
                  alt="Yalla Hala Logo"
                  className="h-full w-full object-contain p-0.5"
                />

              </div>

              <div className="text-right flex flex-col justify-center">

                <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight group-hover:text-[#2D6A5F] transition duration-200 leading-none">
                  Yalla Hala
                </h1>

                <p className="text-[10px] sm:text-xs font-bold text-[#CF9E59] mt-1 tracking-wide leading-none">
                  بيتك البعيد عن بيتك
                </p>

              </div>

            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-[#4B5563]">

              <Link
                href="/"
                className="hover:text-[#2D6A5F] transition duration-200"
              >
                الرئيسية
              </Link>

              <Link
                href="/add-property"
                className="hover:text-[#2D6A5F] transition duration-200"
              >
                أضف عقارك
              </Link>

              <Link
                href="/about"
                className="hover:text-[#2D6A5F] transition duration-200"
              >
                من نحن
              </Link>

            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-3 shrink-0">

              {user ? (

                <>
                  <div className="flex items-center gap-2 bg-[#E6F4F1] px-4 py-2 rounded-full border border-emerald-100 shadow-sm">

                    <span className="text-xs font-bold text-[#2D6A5F]">
                      {user.user_metadata?.full_name || "مرحباً بك"}
                    </span>

                  </div>

                  <Link
                    href="/owner-dashboard"
                    className="bg-[#2D6A5F] hover:bg-[#24564d] text-white text-xs font-bold px-4 py-2 rounded-full transition duration-200"
                  >
                    لوحة التحكم
                  </Link>

                  <Link
                    href="/user-dashboard"
                    className="bg-[#CF9E59] hover:bg-[#b58543] text-white text-xs font-bold px-4 py-2 rounded-full transition duration-200"
                  >
                    حجوزاتي
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full transition duration-200"
                  >
                    خروج
                  </button>
                </>

              ) : (

                <>
                  <Link
                    href="/login"
                    className="text-sm font-bold text-[#2D6A5F] hover:text-[#3FAF9B] transition duration-200 px-2 py-1"
                  >
                    تسجيل الدخول
                  </Link>

                  <Link
                    href="/register"
                    className="bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-sm px-5 py-2.5 rounded-full transition duration-200 shadow-sm"
                  >
                    إنشاء حساب
                  </Link>
                </>

              )}

            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-[#2D6A5F] focus:outline-none"
              aria-label="Toggle Menu"
            >

              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >

                {isMenuOpen ? (

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />

                ) : (

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />

                )}

              </svg>

            </button>

          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (

            <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 shadow-inner">

              <nav className="flex flex-col gap-3 font-bold text-sm text-[#4B5563]">

                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#2D6A5F] py-1 transition"
                >
                  الرئيسية
                </Link>

                <Link
                  href="/add-property"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#2D6A5F] py-1 transition"
                >
                  أضف عقارك
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#2D6A5F] py-1 transition"
                >
                  من نحن
                </Link>

              </nav>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">

                {user ? (

                  <>
                    <div className="flex items-center justify-between bg-[#E6F4F1] px-4 py-2 rounded-xl border border-emerald-100">

                      <span className="text-xs font-bold text-[#2D6A5F]">
                        {user.user_metadata?.full_name || "مرحباً بك"}
                      </span>

                    </div>

                    <Link
                      href="/owner-dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center bg-[#2D6A5F] text-white font-bold py-2 rounded-full transition"
                    >
                      لوحة التحكم
                    </Link>

                    <Link
                      href="/user-dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center bg-[#CF9E59] text-white font-bold py-2 rounded-full transition"
                    >
                      حجوزاتي
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-full transition"
                    >
                      خروج
                    </button>
                  </>

                ) : (

                  <div className="flex flex-col gap-2">

                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center text-sm font-bold text-[#2D6A5F] py-2 border border-[#2D6A5F] rounded-full transition"
                    >
                      تسجيل الدخول
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-sm py-2.5 rounded-full transition shadow-sm"
                    >
                      إنشاء حساب
                    </Link>

                  </div>

                )}

              </div>

            </div>

          )}

        </header>

        {/* PAGE CONTENT */}
        <main>
          {children}
        </main>

        {/* FOOTER */}
        <footer className="mt-24 border-t border-[#E5E7EB] bg-[#2D6A5F] text-gray-100">

          <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">

            <div className="text-right">

              <div className="flex items-center gap-4 mb-4">

                <div className="h-12 w-12 bg-white/10 rounded-xl p-1.5">

                  <img
                    src="/logo.jpg"
                    alt="Yalla Hala Logo"
                    className="h-full w-full object-contain brightness-110"
                  />

                </div>

                <h3 className="text-2xl font-extrabold text-white">
                  Yalla Hala
                </h3>

              </div>

              <p className="leading-7 text-sm text-gray-200">
                منصتك السياحية الموثوقة لحجز العقارات وأماكن الإقامة في جميع المحافظات السورية بأسلوب حديث وتجربة سهلة وسريعة.
              </p>

            </div>

            <div className="text-right">

              <h3 className="text-lg font-bold text-white mb-4">
                روابط سريعة
              </h3>

              <div className="flex flex-col gap-3 text-sm text-gray-200">

                <Link href="/" className="hover:text-white transition">
                  تصفح العقارات
                </Link>

                <Link
                  href="/add-property"
                  className="hover:text-white transition"
                >
                  أضف عقارك
                </Link>

                <Link
                  href="/about"
                  className="hover:text-white transition"
                >
                  من نحن
                </Link>

                <Link
                  href="/terms"
                  className="hover:text-white transition"
                >
                  شروط الاستخدام
                </Link>

                <Link
                  href="/privacy"
                  className="hover:text-white transition"
                >
                  سياسة الخصوصية
                </Link>

              </div>

            </div>

            <div className="text-right">

              <h3 className="text-lg font-bold text-white mb-4">
                الدعم والتواصل
              </h3>

              <div className="space-y-3 text-sm text-gray-200 flex flex-col">

                <p className="hover:underline cursor-pointer">
                  contact@yallahala.com
                </p>

                <a
                  href="https://wa.me/46790081236"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white text-emerald-300 transition font-bold mt-1"
                >

                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.944 14.068.92 11.451.92 6.015.92 1.593 5.29 1.59 10.72c-.001 1.684.449 3.323 1.302 4.774l-.979 3.578 3.734-.968z" />
                  </svg>

                  <span>واتساب:</span>

                  <span dir="ltr" className="tracking-wide">
                    +46790081236
                  </span>

                </a>

              </div>

            </div>

          </div>

          <div className="border-t border-[#23534A] py-5 text-center text-xs text-gray-300">
            © 2026 Yalla Hala. All rights reserved.
          </div>

        </footer>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V5QW92L6J0"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-V5QW92L6J0', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Umami Analytics */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="4754c078-41b3-472a-9d24-a04874d18646"
          strategy="afterInteractive"
        />

      </body>
    </html>
  );
}