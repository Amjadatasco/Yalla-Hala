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
    // التحقق من حالة المستخدم الحالية
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // الاستماع لتغييرات حالة تسجيل الدخول
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
        <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
            
            {/* الشعار والهوية المقتبسة من صورتك الفنية */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E5349] shadow-md transition transform hover:rotate-6">
                <span className="text-white font-black text-xl">هلا</span>
              </div>
              <div className="text-right">
                <h1 className="text-xl font-black text-[#111827] leading-none">Yalla Hala</h1>
                <p className="text-[11px] font-bold text-[#CF9E59] mt-1">بيتك البعيد عن بيتك</p>
              </div>
            </Link>

            {/* روابط التنقل السريعة */}
            <nav className="hidden md:flex items-center gap-6 font-bold text-sm text-[#4B5563]">
              <Link href="/" className="hover:text-[#3FAF9B] transition">الرئيسية</Link>
              <Link href="/add-property" className="hover:text-[#3FAF9B] transition">أضف عقارك</Link>
              <Link href="/about" className="hover:text-[#3FAF9B] transition">من نحن</Link>
            </nav>

            {/* أزرار الحسابات والتحكم الاحترافية */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3 bg-[#ECFDF5] px-4 py-2 rounded-full border border-emerald-100">
                  <span className="text-xs font-bold text-[#1E5349]">
                    أهلاً، {user.user_metadata?.full_name || "عزيزنا الزبون"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-full transition"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-[#1E5349] hover:text-[#3FAF9B] px-3 py-2 transition">
                    تسجيل الدخول
                  </Link>
                  <Link href="/register" className="bg-[#CF9E59] hover:bg-[#b58543] text-white font-bold text-sm px-5 py-2.5 rounded-full transition shadow-sm">
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>

          </div>
        </header>

        {children}

        {/* تذييل الصفحة الفاخر */}
        <footer className="mt-24 border-t border-[#E5E7EB] bg-[#111827] text-gray-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-3">
            <div className="text-right">
              <h3 className="text-2xl font-black text-white mb-4">Yalla Hala | يلا هلا</h3>
              <p className="leading-7 text-sm text-gray-400">
                منصتك السياحية الموثوقة لحجز العقارات وأماكن الإقامة في جميع المحافظات السورية. بيتك البعيد عن بيتك.
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-white mb-4">روابط سريعة</h3>
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/" className="hover:text-[#3FAF9B] transition">تصفح العقارات المتاحة</Link>
                <Link href="/add-property" className="hover:text-[#3FAF9B] transition">أعلن عن عقارك معنا</Link>
                <Link href="/about" className="hover:text-[#3FAF9B] transition">قصتنا ورؤيتنا</Link>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-white mb-4">الدعم والتواصل</h3>
              <p className="text-sm text-gray-400">البريد الإلكتروني: contact@yallahala.com</p>
              <p className="text-sm text-gray-400 mt-2">رقم الهاتف: +963 11 000 0000</p>
            </div>
          </div>
          <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500 font-medium">
            &copy; 2026 منصة يلا هلا. جميع الحقوق محفوظة.
          </div>
        </footer>
      </body>
    </html>
  );
}