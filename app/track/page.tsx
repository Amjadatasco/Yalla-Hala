"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TrackBookingPage() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      alert("⚠️ يرجى إدخال رقم الهاتف أولاً.");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      // نقوم بجلب الحجوزات مع تفاصيل العقار المرتبط بها
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          guest_name,
          guest_phone,
          check_in,
          check_out,
          status,
          property_id,
          properties (
            title,
            location,
            governorate,
            price
          )
        `)
        .eq("guest_phone", trimmedPhone)
        .order("id", { ascending: false });

      if (error) {
        throw error;
      }

      setBookings(data || []);
    } catch (err) {
      console.error("Search Booking Error:", err);
      alert("حدث خطأ أثناء البحث عن حجوزاتك، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        
        {/* هيدر الصفحة */}
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-[#E6F4F1] px-5 py-2 text-xs font-bold text-[#3FAF9B] mb-4 shadow-xs">
            منصة يلا هلا السياحية
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight">
            تتبع حالة حجزك 🔍
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            أدخل رقم الهاتف الذي استخدمته عند تقديم طلب الحجز للاستعلام عن حالته الحالية.
          </p>
        </div>

        {/* صندوق البحث */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="أدخل رقم هاتفك (مثال: 0984621835)"
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3.5 text-right text-sm outline-none focus:border-[#3FAF9B] focus:ring-1 focus:ring-[#3FAF9B]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#3FAF9B] hover:bg-[#2F8E7D] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition shadow-md disabled:bg-gray-300"
            >
              {loading ? "جاري البحث..." : "بحث عن حجوزاتي"}
            </button>
          </div>
        </div>

        {/* نتائج البحث */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-[#3FAF9B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold text-[#6B7280]">جاري جلب طلبات الحجز الخاصة بك...</p>
          </div>
        ) : searched && bookings.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center shadow-xs">
            <div className="text-4xl mb-3">❓</div>
            <h3 className="text-lg font-bold text-[#111827] mb-1">لم يتم العثور على أي حجز</h3>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
              تأكد من إدخال رقم الهاتف بشكل مطابق للرقم المستخدم عند الحجز.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const property = booking.properties;
              return (
                <article
                  key={booking.id}
                  className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm transition hover:shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 text-right"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 justify-start flex-row-reverse">
                      <span className="text-xs font-bold text-gray-400">رقم مرجع الحجز: #{booking.id}</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">
                      {property?.title || "عقار يلا هلا"}
                    </h3>
                    <p className="text-xs text-gray-500">📍 {property?.location || ""} - {property?.governorate || ""}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4 max-w-sm">
                      <div className="bg-gray-50 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-gray-400 font-bold block mb-0.5">تاريخ الوصول</span>
                        <span className="text-xs font-black text-gray-800">{booking.check_in}</span>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-gray-400 font-bold block mb-0.5">تاريخ المغادرة</span>
                        <span className="text-xs font-black text-gray-800">{booking.check_out}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3 justify-center">
                    {/* شارة حالة الحجز الملونة */}
                    {booking.status === "confirmed" ? (
                      <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        تم تأكيد وتثبيت الحجز ✅
                      </span>
                    ) : booking.status === "rejected" ? (
                      <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-red-50 text-red-700 border border-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        تم رفض الطلب ❌
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        قيد المراجعة والانتظار ⏳
                      </span>
                    )}

                    {/* زر التواصل للدعم */}
                    <a
                      href={`https://wa.me/46790081236?text=${encodeURIComponent(
                        `مرحباً دعم يلا هلا 👋\nأود الاستفسار بخصوص حالة طلبي للحجز رقم #${booking.id} لعقار [ ${property?.title || ""} ]`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center py-2.5 px-5 rounded-xl border border-gray-200 hover:border-emerald-300 text-xs font-bold text-gray-600 hover:text-emerald-600 flex items-center justify-center gap-1.5 transition"
                    >
                      💬 استفسار عبر واتساب
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
