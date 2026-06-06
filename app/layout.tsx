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
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">

              <div className="relative h-12 w-12 flex items-center justify-center overflow-hidden rounded-xl bg-white border border-gray-100 transition-transform duration-300 group-hover:scale-105 shadow-sm">

                <img
                  src="/logo.jpg"
                  alt="Yalla Hala Logo"
                  className="h-full w-full object-contain p-0.5"
                />

              </div>

              <div className="flex flex-col justify-center text-right items-start">

                <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight group-hover:text-[#2D6A5F] transition duration-200 leading-none text-right w-full">
                  Yalla Hala
                </h1>

                <p className="text-[10px] sm:text-xs font-bold text-[#CF9E59] mt-1.5 tracking-wide leading-none text-right w-full">
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
                href="/track"
                className="hover:text-[#2D6A5F] transition duration-200"
              >
                تتبع حجزي 🔍
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
                  href="/track"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#2D6A5F] py-1 transition"
                >
                  تتبع حجزي 🔍
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

              {/* شبكات التواصل الاجتماعي */}
              <div className="mt-6 flex items-center gap-3 justify-start">
                <a
                  href="https://www.facebook.com/share/1EbeNX97UR/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  title="تابعنا على فيسبوك"
                >
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/yallahala.sy?igsh=MTZwZWpscG5mZDkwcg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  title="تابعنا على إنستغرام"
                >
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>

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

                <a
                  href="https://www.facebook.com/share/1EbeNX97UR/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white text-gray-200 transition font-bold mt-1"
                >
                  <svg className="w-4 h-4 fill-current text-white/90" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>فيسبوك:</span>
                  <span className="font-normal text-xs text-gray-300">Yalla Hala</span>
                </a>

                <a
                  href="https://www.instagram.com/yallahala.sy?igsh=MTZwZWpscG5mZDkwcg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white text-gray-200 transition font-bold mt-1"
                >
                  <svg className="w-4 h-4 fill-current text-white/90" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span>إنستغرام:</span>
                  <span dir="ltr" className="font-normal text-xs text-gray-300">@yallahala.sy</span>
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

        {/* زر الدعم الفني العائم الواتساب */}
        <a
          href="https://wa.me/46790081236?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%AF%D8%B9%D9%85%20%D9%8A%D9%84%D8%A7%20%D9%87%D9%84%D8%A7%20%F0%9F%91%8B"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20ba5a] transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-bounce"
          style={{ animationDuration: '4s' }}
          title="تواصل مع الدعم الفني"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.451L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.944 14.068.92 11.451.92 6.015.92 1.593 5.29 1.59 10.72c-.001 1.684.449 3.323 1.302 4.774l-.979 3.578 3.734-.968z" />
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:mr-2 transition-all duration-300 ease-out font-bold text-[11px] whitespace-nowrap">
            الدعم الفني
          </span>
        </a>

      </body>
    </html>
  );
}
