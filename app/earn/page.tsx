"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EarnLandingPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول لتخصيص الأزرار
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

  // تحديث السيو ديناميكياً لصفحة الهبوط
  useEffect(() => {
    document.title = "اعرض عقارك السياحي مجاناً وابدأ بالربح | يلا هلا سوريا";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'أجر شاليهك أو مزرعتك في اللاذقية، طرطوس، حمص، أو ريف دمشق. اعرض عقارك مجاناً بدون عمولة على منصة يلا هلا السياحية لآلاف الزوار شهرياً.');

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'إضافة عقار سياحي سوريا, تأجير شاليهات اللاذقية, تأجير مزارع دمشق, عرض شاليه للايجار, يلا هلا للملاك, استثمار عقاري سياحي سوريا');
  }, []);

  // الأسئلة الشائعة للملاك
  const faqs = [
    {
      q: "هل التسجيل وعرض العقار مجاني تماماً؟",
      a: "نعم، التسجيل وعرض عقارك (شاليه، مزرعة، فيلا، شقة) على منصة يلا هلا مجاني بنسبة 100%. ولا توجد أي رسوم تسجيل أو عمولات مخفية تقتطع من أرباحك."
    },
    {
      q: "كيف يتواصل معي المستأجر لإتمام الحجز؟",
      a: "عندما يختار المستأجر حجز عقارك، تفتح له رسالة واتساب جاهزة ومجهزة بكامل معلومات الحجز (التاريخ، السعر، عدد الساعات) ليرسلها مباشرة إلى رقمك الشخصي للتنسيق الفوري."
    },
    {
      q: "كيف أضمن عدم تداخل الحجوزات المزدوجة؟",
      a: "من لوحة التحكم الخاصة بك كمالك، يمكنك إدارة وتحديث حالة الحجوزات. بمجرد تأكيدك لحجز زبون معين، يقوم النظام تلقائياً بتعطيل وحظر تلك التواريخ من الظهور للزوار الآخرين لمنع أي تداخل."
    },
    {
      q: "كيف تصلني إشعارات الحجز؟",
      a: "لقد قمنا بدمج نظام إشعارات ذكي وفوري يرسل لك رسالة تلقائية ومباشرة على حسابك في تيليغرام بمجرد إرسال المستأجر طلباً لحجز عقارك، لضمان ردك السريع وعدم خسارة الزبون."
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-20" dir="rtl">
      {/* قسم البطل (Hero Section) */}
      <section className="bg-gradient-to-br from-[#2D6A5F] to-[#1E4E45] text-white py-20 px-4 text-center relative overflow-hidden">
        {/* خلفية جمالية خفيفة */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CF9E59_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-xs sm:text-sm font-bold text-amber-300 mb-6 border border-white/10">
            💰 انضم إلى أكثر من 300+ مالك عقار في سوريا
          </span>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            حول شاليهك أو مزرعتك الشاغرة <br />
            <span className="text-[#CF9E59]">إلى مصدر دخل ممتاز بالدولار!</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed font-bold">
            اعرض عقارك السياحي اليوم مجاناً أمام آلاف الزوار والباحثين عن إقامات قصيرة الأجل في اللاذقية، طرطوس، ريف دمشق وكافة المحافظات السورية.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            {user ? (
              <Link
                href="/add-property"
                className="w-full sm:w-auto rounded-2xl bg-[#CF9E59] hover:bg-[#b58543] text-white font-black px-8 py-4 text-sm transition shadow-lg text-center"
              >
                ➕ اعرض عقارك الآن
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto rounded-2xl bg-[#CF9E59] hover:bg-[#b58543] text-white font-black px-8 py-4 text-sm transition shadow-lg text-center"
                >
                  🚀 سجل حسابك وابدأ مجاناً
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black px-8 py-4 text-sm transition text-center"
                >
                  🔑 تسجيل الدخول
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* قسم الأرقام والإحصائيات البسيطة لإغراء المالك */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#2D6A5F]">0%</p>
            <p className="text-xs text-gray-400 font-bold mt-1">عمولة على التسجيل</p>
          </div>
          <div className="border-r border-gray-100 pr-2">
            <p className="text-2xl sm:text-3xl font-black text-[#2D6A5F]">+300</p>
            <p className="text-xs text-gray-400 font-bold mt-1">عقار سياحي معتمد</p>
          </div>
          <div className="border-r border-gray-100 pr-2">
            <p className="text-2xl sm:text-3xl font-black text-[#2D6A5F]">100%</p>
            <p className="text-xs text-gray-400 font-bold mt-1">أرباح كاش ومباشرة</p>
          </div>
          <div className="border-r border-gray-100 pr-2">
            <p className="text-2xl sm:text-3xl font-black text-[#2D6A5F]">+10k</p>
            <p className="text-xs text-gray-400 font-bold mt-1">زيارة للموقع شهرياً</p>
          </div>
        </div>
      </section>

      {/* ميزات يلا هلا للملاك (لماذا تعرض معنا؟) */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-right">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            لماذا يختار الملاك منصة يلا هلا؟
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-bold mt-2">
            ميزات صُممت خصيصاً لتناسب ظروف التأجير والإنترنت في سوريا
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition duration-200 flex gap-4 flex-row-reverse items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] text-[#2D6A5F] text-xl flex items-center justify-center shrink-0">
              💸
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900">أرباح بالدولار وبدون وسيط</h3>
              <p className="text-xs text-gray-500 mt-2 leading-5">أجر عقارك وقابل زبائنك مباشرة، استلم أرباحك بالعملة التي تفضلها (دولار أو ليرة سورية) كاش من الزبون بالكامل وبدون أي استقطاعات.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition duration-200 flex gap-4 flex-row-reverse items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#CF9E59] text-xl flex items-center justify-center shrink-0">
              ⚡
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900">تنبيهات فورية على تيليغرام</h3>
              <p className="text-xs text-gray-500 mt-2 leading-5">لا حاجة للبقاء متصلاً بالموقع طوال اليوم. بمجرد وجود زبون مهتم، ستتلقى تنبيهاً فورياً ومفصلاً على حسابك الشخصي في تطبيق تيليغرام.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition duration-200 flex gap-4 flex-row-reverse items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4F1] text-[#2D6A5F] text-xl flex items-center justify-center shrink-0">
              🗓️
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900">إدارة ذكية ومحكمة لحجوزاتك</h3>
              <p className="text-xs text-gray-500 mt-2 leading-5">لوحة تحكم سهلة الاستخدام تمكنك من تعطيل الأيام التي تشغلها بنفسك، أو التي تم حجزها خارج الموقع، لضمان عدم تداخل الأوقات.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition duration-200 flex gap-4 flex-row-reverse items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#CF9E59] text-xl flex items-center justify-center shrink-0">
              🚀
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900">تسويق مجاني وواسع النطاق</h3>
              <p className="text-xs text-gray-500 mt-2 leading-5">نقوم بتمويل حملات إعلانية احترافية للترويج للموقع والوصول لآلاف السياح والمغتربين القادمين لسوريا، لعرض شاليهك أمامهم مجاناً.</p>
            </div>
          </div>
        </div>
      </section>

      {/* خطوات العمل الثلاث (Timeline) */}
      <section className="bg-white border-t border-b border-gray-100 py-16 text-right">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              ابدأ استقبال الحجوزات في 3 خطوات فقط
            </h2>
            <p className="text-xs text-gray-400 font-bold mt-2">
              عملية بسيطة للغاية ولا تتطلب خبرة تقنية
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* الخطوة 1 */}
            <div className="bg-[#F9FAFB] border border-gray-100 p-6 rounded-2xl shadow-2xs relative">
              <span className="w-8 h-8 rounded-full bg-[#2D6A5F] text-white text-xs font-black flex items-center justify-center mb-4">1</span>
              <h3 className="font-black text-sm text-gray-900">أنشئ حسابك المجاني</h3>
              <p className="text-xs text-gray-500 mt-2 leading-5">
                سجل حساباً جديداً برقم هاتفك واسمك في أقل من دقيقة واحدة لتتمكن من إدارة عقاراتك.
              </p>
            </div>

            {/* الخطوة 2 */}
            <div className="bg-[#F9FAFB] border border-gray-100 p-6 rounded-2xl shadow-2xs relative">
              <span className="w-8 h-8 rounded-full bg-[#2D6A5F] text-white text-xs font-black flex items-center justify-center mb-4">2</span>
              <h3 className="font-black text-sm text-gray-900">ارفع صور ومواصفات العقار</h3>
              <p className="text-xs text-gray-500 mt-2 leading-5">
                أدخل تفاصيل عقارك (الأسعار، الموقع، عدد الغرف) وارفع صوراً جذابة له مباشرة من هاتفك المحمول.
              </p>
            </div>

            {/* الخطوة 3 */}
            <div className="bg-[#F9FAFB] border border-gray-100 p-6 rounded-2xl shadow-2xs relative">
              <span className="w-8 h-8 rounded-full bg-[#CF9E59] text-white text-xs font-black flex items-center justify-center mb-4">3</span>
              <h3 className="font-black text-sm text-gray-900">استلم طلبات الحجز المباشرة</h3>
              <p className="text-xs text-gray-500 mt-2 leading-5">
                تلقى إشعارات طلبات الحجز فوراً، ونسق مع الزبائن مباشرة عبر واتساب لتأكيد الموعد واستلام الأرباح.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* الأسئلة الشائعة (FAQ) */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-right">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            الأسئلة الشائعة لأصحاب العقارات
          </h2>
          <p className="text-xs text-gray-400 font-bold mt-2">
            كل ما يدور في ذهنك حول العمل مع منصة يلا هلا السياحية
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-150 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between gap-3 text-right font-black text-sm text-gray-800 hover:bg-gray-50/50 flex-row-reverse"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-[#2D6A5F]">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-500 leading-6 border-t border-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* دعوة أخيرة لاتخاذ إجراء (Footer CTA) */}
      <section className="max-w-5xl mx-auto px-4 text-center mt-8">
        <div className="bg-[#2D6A5F] rounded-[32px] p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]"></div>
          
          <h2 className="text-2xl sm:text-3xl font-black relative z-10">
            لا تترك عقارك شاغراً بعد اليوم!
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-gray-200 max-w-xl mx-auto leading-relaxed relative z-10">
            انضم إلى مئات الملاك والمؤجرين في اللاذقية وطرطوس ومزارع دمشق وابدأ في استقبال الزوار والمصطافين وزيادة دخلك اليوم.
          </p>
          <div className="mt-8 relative z-10">
            {user ? (
              <Link
                href="/add-property"
                className="inline-block rounded-2xl bg-[#CF9E59] hover:bg-[#b58543] text-white font-black px-10 py-4 text-sm transition shadow-lg"
              >
                ➕ أضف عقارك الأول مجاناً
              </Link>
            ) : (
              <Link
                href="/register"
                className="inline-block rounded-2xl bg-[#CF9E59] hover:bg-[#b58543] text-white font-black px-10 py-4 text-sm transition shadow-lg"
              >
                🚀 ابدأ التسجيل المجاني الآن
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
