"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // حقول استعادة كلمة المرور
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotName, setForgotName] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // تحقق الهاتف
    if (!/^09\d{8}$/.test(phone)) {
      alert("رقم الهاتف غير صالح");
      return;
    }

    // تحقق كلمة المرور
    if (!password.trim()) {
      alert("يرجى إدخال كلمة المرور");
      return;
    }

    setLoading(true);

    // إنشاء إيميل مخفي
    const generatedEmail = `${phone}@yallahala.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email: generatedEmail,
      password: password,
    });

    setLoading(false);

    if (error) {
      alert("خطأ في تسجيل الدخول، يرجى التحقق من الرقم أو كلمة المرور.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  // إرسال طلب استعادة كلمة المرور
  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();

    if (!forgotName.trim() || !forgotPhone.trim()) {
      alert("⚠️ يرجى تعبئة كافة الحقول.");
      return;
    }

    if (!/^09\d{8}$/.test(forgotPhone)) {
      alert("رقم الهاتف غير صالح");
      return;
    }

    setForgotLoading(true);

    try {
      // إرسال إشعار تيليغرام للإدارة فوراً لتسهيل العملية يدوياً
      const TELEGRAM_BOT_TOKEN = "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";
      const TELEGRAM_CHAT_ID = "629151535";
      
      const messageText = 
        `🔑 طلب استعادة كلمة المرور\n\n` +
        `👤 الاسم الكامل: ${forgotName.trim()}\n` +
        `📞 رقم الهاتف: ${forgotPhone.trim()}\n\n` +
        `يرجى التواصل مع العميل أو إعادة تعيين كلمة المرور له.`;

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: messageText,
          }),
        }
      );

      // فتح تطبيق البريد الإلكتروني للمستخدم مع تعبئة المحتوى تلقائياً
      const emailSubject = encodeURIComponent("طلب استعادة كلمة مرور - يلا هلا");
      const emailBody = encodeURIComponent(
        `مرحباً إدارة يلا هلا،\n\nأريد استعادة كلمة المرور الخاصة بحسابي.\n\nالاسم الكامل: ${forgotName.trim()}\nرقم الهاتف: ${forgotPhone.trim()}\n\nيرجى إعادة تعيين كلمة المرور الخاصة بي.`
      );
      
      window.open(`mailto:contact@yallahala.com?subject=${emailSubject}&body=${emailBody}`, "_blank");

      setForgotSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 relative">

      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-xl border border-[#E5E7EB]">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#111827]">
            تسجيل الدخول
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            أهلاً بك مجدداً في يلا هلا
          </p>
        </div>

        <form onSubmit={handleLogin} className="grid gap-5">

          <div>
            <label className="block text-right text-sm font-semibold text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              placeholder="09xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 text-left outline-none focus:border-[#3FAF9B]"
            />
          </div>

          <div>
            <label className="block text-right text-sm font-semibold text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 rounded-2xl border border-[#E5E7EB] px-5 text-left outline-none focus:border-[#3FAF9B]"
            />
            {/* رابط نسيت كلمة المرور */}
            <div className="text-right mt-2.5">
              <button
                type="button"
                onClick={() => {
                  setForgotPhone(phone); // جلب رقم الهاتف لو كان مكتوباً بالفعل
                  setShowForgotModal(true);
                }}
                className="text-xs font-bold text-[#3FAF9B] hover:text-[#2F8E7D] transition hover:underline"
              >
                هل نسيت كلمة المرور؟
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-14 mt-2 rounded-2xl bg-[#3FAF9B] text-white font-bold text-lg hover:bg-[#2F8E7D] transition shadow-md"
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-[#3FAF9B] font-bold hover:underline">
            أنشئ حساباً الآن
          </Link>
        </div>

      </div>

      {/* مودال نسيت كلمة المرور */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
          <div className="w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-gray-100 relative transition-all animate-in fade-in zoom-in-95 duration-200">
            
            {/* زر الإغلاق */}
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            {!forgotSubmitted ? (
              <form onSubmit={handleForgotPassword} className="space-y-5 text-right">
                <div className="pb-2">
                  <h3 className="text-2xl font-black text-[#111827]">استعادة كلمة المرور</h3>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                    يرجى كتابة اسمك ورقم هاتفك لنتمكن من مطابقة حسابك وتعديل كلمة مرورك لك.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={forgotName}
                    onChange={(e) => setForgotName(e.target.value)}
                    placeholder="اكتب اسمك الكامل هنا"
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#3FAF9B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">رقم الهاتف</label>
                  <input
                    type="tel"
                    required
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="09xxxxxxxx"
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 text-left outline-none focus:border-[#3FAF9B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full h-12 rounded-xl bg-[#3FAF9B] text-white font-bold text-sm hover:bg-[#2F8E7D] transition disabled:bg-gray-300 shadow-sm"
                >
                  {forgotLoading ? "جاري التقديم..." : "تقديم طلب الاستعادة"}
                </button>

                <p className="text-[10px] text-center text-gray-400">
                  سيتم فتح تطبيق البريد الخاص بك لإرسال رسالة مباشرة إلى <span className="font-semibold text-gray-500">contact@yallahala.com</span>
                </p>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4 text-right">
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 text-3xl font-bold mb-2">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center">تم تقديم طلبك بنجاح</h3>
                <p className="text-xs text-gray-600 leading-relaxed text-center">
                  تم إرسال طلب استعادة حسابك للإدارة. سنقوم بالتواصل معك قريباً جداً لإعادة تعيين كلمة مرورك.
                </p>
                <div className="bg-[#F8FFFD] border border-[#E8FDF9] p-4 rounded-2xl mt-2 text-center">
                  <p className="text-[11px] text-gray-500 mb-1">البريد الإلكتروني المباشر للإدارة:</p>
                  <a href="mailto:contact@yallahala.com" className="text-base font-black text-[#3FAF9B] block hover:underline select-all">
                    contact@yallahala.com
                  </a>
                </div>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                    setForgotName("");
                    setForgotPhone("");
                  }}
                  className="w-full h-12 mt-4 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition"
                >
                  إغلاق النافذة
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
}