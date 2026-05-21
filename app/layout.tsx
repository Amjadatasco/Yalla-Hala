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

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D6A5F] to-[#23534A] shadow-md transition-transform group-hover:scale-105">

                <svg
                  className="w-6 h-6 text-[#CF9E59]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  />
                </svg>

                <div className="absolute bottom-2.5 w-3 h-1.5 bg-white rounded-t-sm"></div>
              </div>

              <div className="text-right">
                <h1 className="text-xl font-black text-[#111827] tracking-tight leading-none group-hover:text-[#2D6A5F] transition">
                  Yalla Hala
                </h1>

                <p className="text-[10px] font-bold text-[#CF9E59] mt-1">
                  بيتك البعيد عن بيتك
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6 font-bold text-xs text-[#4B5563]">
              <Link href="/" className="hover:text-[#3FAF9B] transition">
                الرئيسية
              </Link>

              <Link
                href="/add-property"
                className="hover:text-[#3FAF9B] transition"
              >
                أضف عقارك
              </Link>

              <Link
                href="/about"
                className="hover:text-[#3FAF9B] transition"
              >
                من نحن
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2 bg-[#E6F4F1] px-3 py-1.5 rounded-full border border-emerald-100">

                  <span className="text-[11px] font-bold text-[#2D6A5F]">
                    {user.user_metadata?.full_name || "مرحباً بك"}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="text-[10px] bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-0.5 rounded-full transition"
                  >
                    خروج
                  </button>

                </div>
              ) : (
                <>

                  <Link
                    href="/login"
                    className="text-xs font-bold text-[#2D6A5F] hover:text-[#3FAF9B] px-2 py-1 transition"
                  >
                    تسجيل الدخول
                  </Link>

                  <Link
                    href="/register"
                    className="bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-xs px-4 py-2 rounded-full transition shadow-sm"
                  >
                    إنشاء حساب
                  </Link>

                </>
              )}
            </div>

          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="mt-24 border-t border-[#E5E7EB] bg-[#2D6A5F] text-gray-100">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-3">

            <div className="text-right">

              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-6 bg-[#CF9E59] rounded-full"></div>

                <h3 className="text-xl font-black text-white">
                  Yalla Hala | يلا هلا
                </h3>
              </div>

              <p className="leading-6 text-xs text-gray-200">
                منصتك السياحية الموثوقة لحجز العقارات وأماكن الإقامة في جميع المحافظات السورية.
                بيتك البعيد عن بيتك.
              </p>

            </div>

            <div className="text-right">

              <h3 className="text-base font-bold text-white mb-3">
                روابط سريعة
              </h3>

              <div className="flex flex-col gap-2 text-xs text-gray-200">

                <Link href="/" className="hover:underline">
                  تصفح العقارات المتاحة
                </Link>

                <Link href="/add-property" className="hover:underline">
                  أعلن عن عقارك معنا
                </Link>

                <Link href="/about" className="hover:underline">
                  قصتنا ورؤيتنا
                </Link>

              </div>

            </div>

            <div className="text-right">

              <h3 className="text-base font-bold text-white mb-3">
                الدعم والتواصل
              </h3>

              <p className="text-xs text-gray-200">
                البريد الإلكتروني: contact@yallahala.com
              </p>

              <p className="text-xs text-gray-200 mt-1">
                رقم الهاتف: +963 11 000 0000
              </p>

            </div>

          </div>

          <div className="border-t border-[#23534A] py-4 text-center text-[11px] text-gray-300 font-medium">
            © 2026 منصة يلا هلا. جميع الحقوق محفوظة.
          </div>

        </footer>

      </body>
    </html>
  );
}