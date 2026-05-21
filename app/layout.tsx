"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#FAFAFA] text-[#1F2937] overflow-x-hidden antialiased">
        
        {/* شريط علوي أنيق ومتناسق التفتيح */}
        <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
            
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2D6A5F] shadow-sm">
                <span className="text-white font-bold text-base">هلا</span>
              </div>
              <div className="text-right">
                <h1 className="text-lg font-black text-[#111827] leading-none">Yalla Hala</h1>
                <p className="text-[10px] font-bold text-[#CF9E59] mt-1">بيتك البعيد عن بيتك</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 font-bold text-xs text-[#4B5563]">
              <Link href="/" className="hover:text-[#3FAF9B] transition">الرئيسية</Link>
              <Link href="/add-property" className="hover:text-[#3FAF9B] transition">أضف عقارك</Link>
              <Link href="/about" className="hover:text-[#3FAF9B] transition">من نحن</Link>
            </nav>

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
                  <Link href="/login" className="text-xs font-bold text-[#2D6A5F] hover:text-[#3FAF9B] px-2 py-1 transition">
                    تسجيل الدخول
                  </Link>
                  <Link href="/register" className="bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-xs px-4 py-2 rounded-full transition shadow-sm">
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>

          </div>
        </header>

        {children}

        {/* تم تغيير لون الفوتر بالكامل ليتناسق مع اللون الزيتي المتوسط المريح */}
        <footer className="mt-24 border-t border-[#E5E7EB] bg-[#2D6A5F] text-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-3">
            <div className="text-right">
              <h3 className="text-xl font-black text-white mb-3">Yalla Hala | يلا هلا</h3>
              <p className="leading-6 text-xs text-gray-200">
                منصتك السياحية الموثوقة لحجز العقارات وأماكن الإقامة في جميع المحافظات السورية. بيتك البعيد عن بيتك.
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-white mb-3">روابط سريعة</h3>
              <div className="flex flex-col gap-2 text-xs text-gray-200">
                <Link href="/" className="hover:underline">تصفح العقارات المتاحة</Link>
                <Link href="/add-property" className="hover:underline">أعلن عن عقارك معنا</Link>
                <Link href="/about" className="hover:underline">قصتنا ورؤيتنا</Link>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-white mb-3">الدعم والتواصل</h3>
              <p className="text-xs text-gray-200">البريد الإلكتروني: contact@yallahala.com</p>
              <p className="text-xs text-gray-200 mt-1">رقم الهاتف: +963 11 000 0000</p>
            </div>
          </div>
          <div className="border-t border-[#23534A] py-4 text-center text-[11px] text-gray-300 font-medium">
            &copy; 2026 منصة يلا هلا. جميع الحقوق محفوظة.
          </div>
        </footer>
      </body>
    </html>
  );
}