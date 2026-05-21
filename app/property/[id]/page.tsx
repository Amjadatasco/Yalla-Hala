"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";

export default function PropertyPage({ params }: any) {
  // فك حزمة params بطريقة متوافقة تماماً مع إصدارات Next.js الحديثة لمنع أي تعليق
  const resolvedParams = "then" in params ? use(params) : params;

  const [property, setProperty] = useState<any>(null);
  const [existingBookings, setExistingBookings] = useState<any[]>([]); // لتخزين الحجوزات السابقة ومنع تكرارها
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  // حالة ذكية لتحديد واجهة العرض (تفاصيل العقار أو استمارة الحجز)
  const [viewMode, setViewMode] = useState<"details" | "book">("details");

  // الحصول على تاريخ اليوم الحالي بصيغة YYYY-MM-DD لمنع الحجز في الماضي
  const todayStr = new Date().toISOString().split("T")[0];

  // 🚀 حسابات بوت تليجرام الخاصة بك لإرسال إشعارات الحجوزات الفورية
  const TELEGRAM_BOT_TOKEN = "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";
  const TELEGRAM_CHAT_ID = "629151535";

  useEffect(() => {
    if (resolvedParams?.id) {
      loadPropertyAndBookings();
    }
  }, [resolvedParams?.id]);

  useEffect(() => {
    // التقاط الإجراء المطلق من أزرار الصفحة الرئيسية (زر احجز الآن يمرر ?action=book)
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("action") === "book") {
        setViewMode("book");
      }
    }
  }, []);

  async function loadPropertyAndBookings() {
    try {
      setPageLoading(true);
      
      // 1. جلب بيانات العقار الأساسية
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();
        
      if (!propertyError && propertyData) {
        setProperty(propertyData);

        // 2. جلب الحجوزات الحالية الخاصة بهذا العقار لمنع تداخل التواريخ للمستأجرين
        // 💡 تم تحويل المعامل إلى نص متوافق مع جدولك
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("check_in, check_out")
          .eq("property_id", String(resolvedParams.id));

        if (!bookingsError && bookingsData) {
          setExistingBookings(bookingsData);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setPageLoading(false);
    }
  }

  // دالة برمجية تفحص إذا كان نطاق التاريخ المختار يتقاطع مع حجز قديم ومؤكد
  function isDatesOverlapping(newIn: string, newOut: string) {
    const startNew = new Date(newIn).getTime();
    const endNew = new Date(newOut).getTime();

    for (const booking of existingBookings) {
      const startExisting = new Date(booking.check_in).getTime();
      const endExisting = new Date(booking.check_out).getTime();

      // معادلة فحص التداخل الزمني القياسية
      if (startNew < endExisting && endNew > startExisting) {
        return true; // يوجد تداخل مباشر مع حجز آخر
      }
    }
    return false; // التواريخ متاحة وصالحة للاستخدام
  }

  // دالة إرسال التقرير المنسق الفاخر لبوت تليجرام الخاص بك
  async function sendTelegramNotification(name: string, phone: string, inDate: string, outDate: string) {
    try {
      const messageText = 
        `🚨 *طلب حجز جديد على منصة يلا هلا!* 🚨\n\n` +
        `🏠 *العقار:* ${property?.title || "غير محدد"}\n` +
        `📍 *الموقع:* ${property?.location || "غير محدد"} - ${property?.governorate || ""}\n` +
        `💰 *السعر:* $${property?.price || "0"} / ليلة\n\n` +
        `👤 *اسم المستأجر:* ${name}\n` +
        `📞 *رقم الهاتف:* [${phone}](tel:${phone})\n\n` +
        `📅 *تاريخ الوصول:* ${inDate}\n` +
        `📅 *تاريخ المغادرة:* ${outDate}\n\n` +
        `✨ _يرجى التواصل مع الزبون لتأكيد الحجز المبدئي._`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: "Markdown"
        })
      });
    } catch (err) {
      console.error("Failed to send Telegram notification:", err);
    }
  }

  async function handleBooking() {
    // 1. التحقق من ملء البيانات
    if (!guestName.trim() || !guestPhone.trim() || !checkIn || !checkOut) {
      alert("يرجى ملء جميع البيانات لإرسال طلب الحجز المبدئي.");
      return;
    }

    // 2. التحقق من منطقية التواريخ
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      alert("خطأ: يجب أن يكون تاريخ المغادرة بعد تاريخ الوصول.");
      return;
    }

    // 3. الفحص الذكي لتداخل التواريخ قبل الإرسال لمنع التكرار
    if (isDatesOverlapping(checkIn, checkOut)) {
      alert("⚠️ عذراً، هذا العقار محجوز بالفعل في التواريخ التي اخترتها. يرجى مراجعة جدول التوفر واختيار أيام أخرى.");
      return;
    }

    setLoading(true);

    // 4. محاولة إدخال الحجز في جدول Supabase
    // 🚀 التعديل الجوهري السحري: String(property.id) لإرسال قيمة نصية تطابق عمود قاعدة بياناتك تماماً وتفك الـ RLS
    const { error } = await supabase.from("bookings").insert([
      {
        property_id: String(property.id),
        guest_name: guestName.trim(),
        guest_phone: guestPhone.trim(),
        check_in: checkIn,
        check_out: checkOut,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("📋 [Supabase Database Error Details]:", {
        Message: error.message,
        Details: error.details,
        Hint: error.hint,
        Code: error.code
      });

      alert(
        `⚠️ تعذر إرسال الطلب لقاعدة البيانات!\n\n` +
        `السبب البرمجي: ${error.message}\n` +
        `تلميح الحل: يرجى التأكد من مطابقة أسماء الأعمدة وصلاحيات الـ RLS في جدول bookings داخل Supabase.`
      );
    } else {
      // 🌟 تشغيل الإشعار الفوري وإرساله لهاتفك مباشرة بعد نجاح التخزين
      await sendTelegramNotification(guestName.trim(), guestPhone.trim(), checkIn, checkOut);

      alert("🎉 تم إرسال طلب حجزك بنجاح وسيتواصل معك المسؤول قريباً!");
      setGuestName("");
      setGuestPhone("");
      setCheckIn("");
      setCheckOut("");
      setViewMode("details"); // إعادة المستخدم لتبويب التفاصيل
      loadPropertyAndBookings(); // إعادة جلب البيانات لتحديث جدول الفترات فوراً
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#3FAF9B] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-[#3FAF9B]">جاري تحميل بيانات العقار وتحديث المفكرة...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-sm font-bold text-red-500">العقار غير موجود أو تم حذفه</p>
        <button onClick={() => window.location.href = "/"} className="text-xs bg-[#3FAF9B] text-white px-4 py-2 rounded-full shadow">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <main className="bg-[#FAFAFA] min-h-screen px-4 py-10" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* صورة العقار الرئيسية */}
        <div className="rounded-2xl overflow-hidden shadow-sm mb-6 bg-gray-100 border border-gray-200">
          <img
            src={property.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"}
            alt={property.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* الكارت الأساسي لمعلومات العقار */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
            <div className="text-right">
              <h1 className="text-2xl font-black text-[#111827]">{property.title}</h1>
              <p className="text-xs text-[#6B7280] mt-1">{property.location} - {property.governorate}</p>
            </div>
            <div className="rounded-xl bg-[#E6F4F1] px-4 py-2 text-center border border-emerald-50">
              <p className="text-xl font-black text-[#3FAF9B]">${property.price}</p>
              <p className="text-[10px] text-[#6B7280] font-bold">ليلة واحدة</p>
            </div>
          </div>

          {/* أزرار التبديل العلوية الاحترافية */}
          <div className="flex border-b border-gray-100 mt-4">
            <button
              onClick={() => setViewMode("details")}
              className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition ${
                viewMode === "details" ? "border-[#3FAF9B] text-[#3FAF9B]" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              تفاصيل ومزايا العقار
            </button>
            <button
              onClick={() => setViewMode("book")}
              className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition ${
                viewMode === "book" ? "border-[#3FAF9B] text-[#3FAF9B]" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              طلب حجز الإقامة الآن
            </button>
          </div>

          {/* العرض الأول: تفاصيل ومواصفات المسكن + جدول الأيام غير المتوفرة */}
          {viewMode === "details" && (
            <div className="mt-6 text-right space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#111827] mb-2">الوصف والمواصفات</h2>
                <p className="text-sm text-gray-600 leading-7 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {property.description || "مرحباً بك في منصة يلا هلا، هذا العقار مجهز بالخدمات الأساسية لضمان إقامة مريحة وسعيدة. للمزيد من الاستفسارات يمكنك التوجه مباشرة لتبويب تأكيد طلب الحجز المبدئي."}
                </p>
              </div>

              {/* واجهة إرشادية تعرض الفترات المحجوزة مسبقاً للمستأجر قبل الحجز */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-amber-800 mb-2">📅 جدول الفترات المحجوزة وغير المتاحة:</h3>
                {existingBookings.length === 0 ? (
                  <p className="text-xs text-amber-700">هذا المسكن متاح بالكامل ومجهز لاستقبالكم في أي وقت!</p>
                ) : (
                  <ul className="space-y-1">
                    {existingBookings.map((b, idx) => (
                      <li key={idx} className="text-xs text-amber-900 font-medium">
                        • تم تأكيد حجز من تاريخ <span className="underline font-bold text-amber-950">{b.check_in}</span> إلى تاريخ <span className="underline font-bold text-amber-950">{b.check_out}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* العرض الثاني: استمارة الحجز بإنقاذ الترتيب الصحيح والنظيف والقيود الزهرية */}
          {viewMode === "book" && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-right text-[#111827] mb-4">بيانات طلب الحجز الإقامة</h2>
              
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="اسم المستأجر الكامل"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-sm outline-none focus:border-[#3FAF9B] transition"
                />
                <input
                  type="text"
                  placeholder="رقم الهاتف أو الجوال (مثال: 09xxxxxxxx)"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-sm outline-none focus:border-[#3FAF9B] transition"
                />

                {/* حقول التواريخ المدعومة بقيود عدم التداخل البرمجي */}
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="block mb-1 text-right text-[11px] text-[#6B7280] font-bold">تاريخ الوصول</label>
                    <input
                      type="date"
                      min={todayStr} // حظر اختيار أي يوم مضى في الماضي
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-xs outline-none focus:border-[#3FAF9B] text-right cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-right text-[11px] text-[#6B7280] font-bold">تاريخ المغادرة</label>
                    <input
                      type="date"
                      min={checkIn || todayStr} // منع المغادرة قبل يوم الوصول حتماً
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-xs outline-none focus:border-[#3FAF9B] text-right cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-[#3FAF9B] py-3.5 text-sm font-bold text-white hover:bg-[#2F8E7D] transition shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "جاري فحص التواريخ وإرسال طلبك..." : "تأكيد الطلب المبدئي"}
                </button>

                <button
                  disabled
                  className="w-full rounded-xl bg-gray-100 py-3.5 text-sm font-bold text-gray-400 cursor-not-allowed text-center flex items-center justify-center gap-2 border border-gray-200"
                >
                  بوابة الدفع الإلكتروني والواتساب قيد التطوير
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}