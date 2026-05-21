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
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P6X6S7FK');
          `}
        </Script>
      </head>

      <body className="bg-[#FAFAFA] text-[#1F2937] overflow-x-hidden antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6X6S7FK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between">

            {/* Brand */}
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

            {/* Navigation - للكمبيوتر */}
            <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-[#4B5563]">
              <Link href="/" className="hover:text-[#2D6A5F] transition duration-200">الرئيسية</Link>
              <Link href="/add-property" className="hover:text-[#2D6A5F] transition duration-200">أضف عقارك</Link>
              <Link href="/about" className="hover:text-[#2D6A5F] transition duration-200">من نحن</Link>
            </nav>

            {/* User Actions - للكمبيوتر */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              {user ? (
                <div className="flex items-center gap-2 bg-[#E6F4F1] px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                  <span className="text-xs font-bold text-[#2D6A5F]">
                    {user.user_metadata?.full_name || "مرحباً بك"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-[10px] bg-red-500 hover:bg-red-600 text-white font-bold px-2.5 py-1 rounded-full transition duration-200"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-[#2D6A5F] hover:text-[#3FAF9B] transition duration-200 px-2 py-1">
                    تسجيل الدخول
                  </Link>
                  <Link href="/register" className="bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-sm px-5 py-2.5 rounded-full transition duration-200 shadow-sm">
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>

            {/* زر القائمة للجوال */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-[#2D6A5F] focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>

          {/* قائمة الهاتف المنسدلة */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 shadow-inner">
              <nav className="flex flex-col gap-3 font-bold text-sm text-[#4B5563]">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2D6A5F] py-1 transition">الرئيسية</Link>
                <Link href="/add-property" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2D6A5F] py-1 transition">أضف عقارك</Link>
                <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2D6A5F] py-1 transition">من نحن</Link>
              </nav>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
                {user ? (
                  <div className="flex items-center justify-between bg-[#E6F4F1] px-4 py-2 rounded-xl border border-emerald-100">
                    <span className="text-xs font-bold text-[#2D6A5F]">
                      {user.user_metadata?.full_name || "مرحباً بك"}
                    </span>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="text-[11px] bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-full transition"
                    >
                      خروج
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-center text-sm font-bold text-[#2D6A5F] py-2 border border-[#2D6A5F] rounded-full transition">
                      تسجيل الدخول
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-center bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-sm py-2.5 rounded-full transition shadow-sm">
                      إنشاء حساب
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        {/* PAGE CONTENT */}
        <main>{children}</main>

        {/* FOOTER */}
        <footer className="mt-24 border-t border-[#E5E7EB] bg-[#2D6A5F] text-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
            <div className="text-right">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-white/10 rounded-xl p-1.5">
                  <img src="/logo.jpg" alt="Yalla Hala Logo" className="h-full w-full object-contain brightness-110" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Yalla Hala</h3>
              </div>
              <p className="leading-7 text-sm text-gray-200">
                منصتك السياحية الموثوقة لحجز العقارات وأماكن الإقامة في جميع المحافظات السورية بأسلوب حديث وتجربة سهلة وسريعة.
              </p>
            </div>

            <div className="text-right">
              <h3 className="text-lg font-bold text-white mb-4">روابط سريعة</h3>
              <div className="flex flex-col gap-3 text-sm text-gray-200">
                <Link href="/" className="hover:text-white transition">تصفح العقارات</Link>
                <Link href="/add-property" className="hover:text-white transition">أضف عقارك</Link>
                <Link href="/about" className="hover:text-white transition">من نحن</Link>
              </div>
            </div>

            {/* تم الاكتفاء بالبريد الإلكتروني فقط هنا */}
            <div className="text-right">
              <h3 className="text-lg font-bold text-white mb-4">الدعم والتواصل</h3>
              <div className="space-y-3 text-sm text-gray-200">
                <p className="hover:underline cursor-pointer">contact@yallahala.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#23534A] py-5 text-center text-xs text-gray-300">
            © 2026 Yalla Hala. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}