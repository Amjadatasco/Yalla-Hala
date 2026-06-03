"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  // البيانات
  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  // تحميل
  const [loading, setLoading] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);

  const getFullNameInputClass = () => {
    const base = "w-full h-14 rounded-2xl border px-5 outline-none transition duration-200 ";
    if (triedSubmit && !fullName.trim()) {
      return base + "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    }
    return base + "border-[#E5E7EB] focus:border-[#3FAF9B]";
  };

  const getPhoneInputClass = () => {
    const base = "w-full h-14 rounded-2xl border px-5 outline-none transition duration-200 ";
    if (triedSubmit && !/^09\d{8}$/.test(phone)) {
      return base + "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    }
    return base + "border-[#E5E7EB] focus:border-[#3FAF9B]";
  };

  const getPasswordInputClass = () => {
    const base = "w-full h-14 rounded-2xl border px-5 outline-none transition duration-200 ";
    if (triedSubmit && password.length < 6) {
      return base + "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    }
    return base + "border-[#E5E7EB] focus:border-[#3FAF9B]";
  };

  // تيليغرام
  const TELEGRAM_BOT_TOKEN =
    "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";

  const TELEGRAM_CHAT_ID =
    "629151535";

  // إشعار تيليغرام
  async function sendTelegramNotification() {
    try {
      const messageText =
        `🆕 تسجيل مستخدم جديد\n\n` +

        `👤 الاسم:\n${fullName}\n\n` +

        `📞 الهاتف:\n${phone}\n\n` +

        `🟢 الحالة:\nتم إنشاء الحساب`;

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            chat_id:
              TELEGRAM_CHAT_ID,

            text:
              messageText,
          }),
        }
      );
    } catch (err) {
      console.error(
        "Telegram Error:",
        err
      );
    }
  }

  // التسجيل
  async function handleRegister(
    e: React.FormEvent
  ) {
    e.preventDefault();
    setTriedSubmit(true);

    // تحقق من الحقول الأساسية وصلاحيتها
    if (
      !fullName.trim() ||
      !/^09\d{8}$/.test(phone) ||
      password.length < 6
    ) {
      alert("⚠️ يرجى تعبئة كافة الحقول بشكل صحيح (رقم الهاتف يجب أن يبدأ بـ 09 ويتكون من 10 أرقام، وكلمة المرور 6 خانات على الأقل).");

      setTimeout(() => {
        const firstInvalid = document.querySelector(".border-red-500");
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
          (firstInvalid as HTMLElement).focus?.();
        }
      }, 100);

      return;
    }

    try {
      setLoading(true);

      // إنشاء إيميل مخفي
      const generatedEmail =
        `${phone}@yallahala.local`;

      // إنشاء الحساب
      const {
        data,
        error,
      } =
        await supabase.auth.signUp({
          email:
            generatedEmail,

          password:
            password,

          options: {
            data: {
              full_name:
                fullName,

              phone:
                phone,

              role:
                "user",
            },
          },
        });

      // خطأ
      if (error) {
        throw error;
      }

      // المستخدم غير موجود
      if (!data.user) {
        throw new Error(
          "فشل إنشاء المستخدم."
        );
      }

      // إشعار تيليغرام
      await sendTelegramNotification();

      // نجاح
      alert(
        "تم إنشاء الحساب بنجاح."
      );

      // تحويل
      router.push(
        "/login"
      );
    } catch (error: any) {
      console.error(
        error
      );

      alert(
        error?.message ||
        "حدث خطأ أثناء إنشاء الحساب."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-12"
      dir="rtl"
    >

      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-xl border border-[#E5E7EB]">

        {/* العنوان */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-black text-[#111827]">

            إنشاء حساب جديد

          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">

            سجل الآن وابدأ باستخدام المنصة

          </p>

        </div>

        {/* الفورم */}
        <form
          onSubmit={
            handleRegister
          }
          className="grid gap-5"
        >

          {/* الاسم */}
          <div>

            <label className="block mb-2 text-sm font-bold text-gray-700">

              الاسم الكامل

            </label>

            <input
              type="text"
              placeholder="الاسم الكامل"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              className={getFullNameInputClass()}
            />

          </div>

          {/* الهاتف */}
          <div>

            <label className="block mb-2 text-sm font-bold text-gray-700">

              رقم الهاتف

            </label>

            <input
              type="tel"
              placeholder="09xxxxxxxx"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className={getPhoneInputClass()}
            />

          </div>

          {/* كلمة المرور */}
          <div>

            <label className="block mb-2 text-sm font-bold text-gray-700">

              كلمة المرور

            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className={getPasswordInputClass()}
            />

          </div>

          {/* الزر */}
          <button
            type="submit"
            disabled={loading}
            className="h-14 rounded-2xl bg-[#3FAF9B] text-white font-black text-lg hover:bg-[#2F8E7D] transition disabled:opacity-50"
          >

            {loading
              ? "جاري إنشاء الحساب..."
              : "إنشاء الحساب"}

          </button>

        </form>

        {/* تسجيل الدخول */}
        <div className="mt-6 text-center text-sm text-gray-600">

          لديك حساب بالفعل؟{" "}

          <Link
            href="/login"
            className="text-[#3FAF9B] font-bold hover:underline"
          >

            تسجيل الدخول

          </Link>

        </div>

      </div>

    </main>
  );
}
