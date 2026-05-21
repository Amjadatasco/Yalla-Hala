"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PropertyPage({ params }: any) {
  const [property, setProperty] = useState<any>(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperty();
  }, []);

  async function loadProperty() {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", params.id)
        .single();
      if (!error && data) setProperty(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleBooking() {
    if (!guestName || !guestPhone || !checkIn || !checkOut) {
      alert("يرجى ملء جميع بيانات استمارة طلب الحجز.");
      return;
    }
    setLoading(true);

    const { error } = await supabase.from("bookings").insert([
      {
        property_id: property.id,
        guest_name: guestName,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
      },
    ]);

    setLoading(false);
    if (error) {
      alert("للأسف، تعذر إرسال الطلب، حاول مرة أخرى.");
    } else {
      alert("تم إرسال طلب الحجز بنجاح! سيتواصل معك فريقنا قريباً لتأكيد الحجز.");
      setGuestName("");
      setGuestPhone("");
      setCheckIn("");
      setCheckOut("");
    }
  }

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl font-bold text-[#3FAF9B] animate-spin">...</p>
      </main>
    );
  }

  return (
    <main className="bg-[#FAFAFA] min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        
        {/* صور العقار الفاخرة */}
        <div className="rounded-[32px] overflow-hidden shadow-lg mb-8 bg-gray-200">
          <img
            src={property.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"}
            alt={property.title}
            className="w-full h-[500px] object-cover"
          />
        </div>

        {/* تفاصيل العقار */}
        <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="text-right">
              <span className="bg-[#ECFDF5] text-[#3FAF9B] px-4 py-1 rounded-full text-xs font-bold">{property.type}</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-2">{property.title}</h1>
              <p className="mt-2 text-sm text-[#6B7280]">{property.location} - {property.governorate}</p>
            </div>
            <div className="rounded-2xl bg-[#ECFDF5] px-6 py-4 text-center border border-emerald-100">
              <p className="text-3xl font-black text-[#3FAF9B]">${property.price}</p>
              <p className="text-xs text-[#6B7280] mt-1">لكل ليلة واحدة</p>
            </div>
          </div>

          {property.description && (
            <div className="mt-6 text-right">
              <h2 className="text-xl font-bold text-[#111827] mb-3">وصف وتفاصيل العقار</h2>
              <p className="leading-8 text-base text-[#4B5563] bg-gray-50 p-4 rounded-2xl">{property.description}</p>
            </div>
          )}

          {/* استمارة طلب الحجز مع التواريخ */}
          <div className="mt-10 border-t pt-8">
            <h2 className="text-2xl font-extrabold text-right text-[#111827] mb-6">طلب حجز الإقامة</h2>
            
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="اسم المستأجر الكامل"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="rounded-2xl border border-[#E5E7EB] px-5 py-4 text-right outline-none focus:border-[#3FAF9B]"
                />
                <input
                  type="text"
                  placeholder="رقم الهاتف أو الواتساب الجوال"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="rounded-2xl border border-[#E5E7EB] px-5 py-4 text-right outline-none focus:border-[#3FAF9B]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-right text-xs font-bold text-[#6B7280]">تاريخ الوصول المقترح</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-2xl border border-[#E5E7EB] px-5 py-4 outline-none focus:border-[#3FAF9B]"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-right text-xs font-bold text-[#6B7280]">تاريخ المغادرة المقترح</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-2xl border border-[#E5E7EB] px-5 py-4 outline-none focus:border-[#3FAF9B]"
                  />
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading}
                className="mt-4 w-full rounded-2xl bg-[#3FAF9B] py-5 text-lg font-bold text-white transition hover:bg-[#2F8E7D] shadow-md disabled:opacity-50"
              >
                {loading ? "جاري معالجة طلبك..." : "تأكيد طلب الحجز المبدئي"}
              </button>

              <a
                href={`https://wa.me/963900000000?text=مرحباً، أود الاستفسار عن حجز العقار: ${property.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-2xl bg-green-500 py-4 text-lg font-bold text-white text-center transition hover:bg-green-600 shadow-sm flex items-center justify-center gap-2"
              >
                تواصل مباشر عبر الواتساب
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}