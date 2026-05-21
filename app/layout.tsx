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
        {/* Google Tag Manager noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6X6S7FK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* HEADER - تم تعديل الارتفاع والحدود ليكون فائق الأناقة والاحترافية */}
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between">

            {/* Brand - الهوية البصرية المتناسقة */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              {/* Logo - تم ضبط الحجم ليتناسق بدقة */}
              <div className="relative h-12 w-12 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo.jpg"
                  alt="Yalla Hala Logo"
                  className="h-full w-full object-contain p-0.5"
                />
              </div>

              {/* Brand Text - تم تصغير الحجم وإلغاء التضخم المسبب للمشكلة البصرية */}
              <div className="text-right flex flex-col justify-center">
                <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight group-hover:text-[#2D6A5F] transition duration-200 leading-none">
                  Yalla Hala
                </h1>
                <p className="text-[10px] sm:text-xs font-bold text-[#CF9E59] mt-1 tracking-wide leading-none">
                  بيتك البعيد عن بيتك
                </p>
              </div>
            </Link>

            {/* Navigation - توزيع الروابط بشكل متوازن ومريح للعين */}
            <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-[#4B5563]">
              <Link
                href="/"
                className="hover:text-[#2D6A5F] transition duration-200 relative after:absolute after:bottom-[-6px] after:right-0 after:w-0 after:h-[2px] after:bg-[#2D6A5F] hover:after:w-full after:transition-all"
              >
                الرئيسية
              </Link>
              <Link
                href="/add-property"
                className="hover:text-[#2D6A5F] transition duration-200 relative after:absolute after:bottom-[-6px] after:right-0 after:w-0 after:h-[2px] after:bg-[#2D6A5F] hover:after:w-full after:transition-all"
              >
                أضف عقارك
              </Link>
              <Link
                href="/about"
                className="hover:text-[#2D6A5F] transition duration-200 relative after:absolute after:bottom-[-6px] after:right-0 after:w-0 after:h-[2px] after:bg-[#2D6A5F] hover:after:w-full after:transition-all"
              >
                من نحن
              </Link>
            </nav>

            {/* User Actions - الأزرار التفاعلية الجانبية */}
            <div className="flex items-center gap-3 shrink-0">
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
                  <Link
                    href="/login"
                    className="text-xs sm:text-sm font-bold text-[#2D6A5F] hover:text-[#3FAF9B] transition duration-200 px-2 py-1"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    className="bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition duration-200 shadow-sm"
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main>
          {children}
        </main>

        {/* FOOTER */}
        <footer className="mt-24 border-t border-[#E5E7EB] bg-[#2D6A5F] text-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
            
            {/* Brand */}
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
                منصتك السياحية الموثوقة لحجز العقارات وأماكن الإقامة
                في جميع المحافظات السورية بأسلوب حديث وتجربة سهلة وسريعة.
                بيتك البعيد عن بيتك.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-right">
              <h3 className="text-lg font-bold text-white mb-4">
                روابط سريعة
              </h3>
              <div className="flex flex-col gap-3 text-sm text-gray-200">
                <Link href="/" className="hover:text-white transition">
                  تصفح العقارات
                </Link>
                <Link href="/add-property" className="hover:text-white transition">
                  أضف عقارك
                </Link>
                <Link href="/about" className="hover:text-white transition">
                  من نحن
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="text-right">
              <h3 className="text-lg font-bold text-white mb-4">
                الدعم والتواصل
              </h3>
              <div className="space-y-3 text-sm text-gray-200">
                <p>contact@yallahala.com</p>
                <p>+963 11 000 0000</p>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className="border-t border-[#23534A] py-5 text-center text-xs text-gray-300">
            © 2026 Yalla Hala. All rights reserved.
          </div>
        </footer>

      </body>
    </html>
  );
}