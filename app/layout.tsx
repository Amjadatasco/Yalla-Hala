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

        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur shadow-sm">

          <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">

            {/* Brand */}
            <Link href="/" className="flex items-center gap-5 group">

              {/* Logo */}
              <div className="relative h-16 w-16 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">

                <img
                  src="/logo.jpg"
                  alt="Yalla Hala Logo"
                  className="h-full w-full object-contain p-1"
                />

              </div>

              {/* Brand Text */}
              <div className="text-right leading-tight">

                <h1 className="text-[34px] font-extrabold text-[#111827] tracking-tight group-hover:text-[#2D6A5F] transition">
                  Yalla Hala
                </h1>

                <p className="text-[13px] font-bold text-[#CF9E59] mt-0.5 tracking-wide">
                  بيتك البعيد عن بيتك
                </p>

              </div>

            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-10 font-bold text-sm text-[#374151]">

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

            {/* User Actions */}
            <div className="flex items-center gap-4">

              {user ? (

                <div className="flex items-center gap-2 bg-[#E6F4F1] px-4 py-2 rounded-full border border-emerald-100 shadow-sm">

                  <span className="text-xs font-bold text-[#2D6A5F]">
                    {user.user_metadata?.full_name || "مرحباً بك"}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="text-[11px] bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-full transition"
                  >
                    خروج
                  </button>

                </div>

              ) : (

                <>

                  <Link
                    href="/login"
                    className="text-sm font-bold text-[#2D6A5F] hover:text-[#3FAF9B] transition"
                  >
                    تسجيل الدخول
                  </Link>

                  <Link
                    href="/register"
                    className="bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-sm px-5 py-2.5 rounded-full transition shadow-md"
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

                <p>
                  contact@yallahala.com
                </p>

                <p>
                  +963 11 000 0000
                </p>

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