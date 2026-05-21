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
      alert("يرجى ملء جميع البيانات لإرسال طلبك.");
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
      alert("تعذر إرسال الطلب حالياً.");
    } else {
      alert("تم إرسال طلب حجزك بنجاح!");
      setGuestName("");
      setGuestPhone("");
      setCheckIn("");
      setCheckOut("");
    }
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm font-bold text-[#3FAF9B]">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <main className="bg-[#FAFAFA] min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto">
        
        <div className="rounded-2xl overflow-hidden shadow-sm mb-6">
          <img
            src={property.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"}
            alt={property.title}
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div className="text-right">
              <h1 className="text-2xl font-black text-[#111827]">{property.title}</h1>
              <p className="text-xs text-[#6B7280] mt-1">{property.location} - {property.governorate}</p>
            </div>
            <div className="rounded-xl bg-[#E6F4F1] px-4 py-2 text-center">
              <p className="text-xl font-black text-[#3FAF9B]">${property.price}</p>
              <p className="text-[10px] text-[#6B7280]">ليلة واحدة</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-right text-[#111827] mb-4">بيانات طلب الحجز الإقامة</h2>
            
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="اسم المستأجر"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-sm outline-none focus:border-[#3FAF9B]"
              />
              <input
                type="text"
                placeholder="رقم الهاتف"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-right text-sm outline-none focus:border-[#3FAF9B]"
              />

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block mb-1 text-right text-[11px] text-[#6B7280]">تاريخ الوصول</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-xs outline-none focus:border-[#3FAF9B]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-right text-[11px] text-[#6B7280]">تاريخ المغادرة</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-xs outline-none focus:border-[#3FAF9B]"
                  />
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-[#3FAF9B] py-3.5 text-sm font-bold text-white hover:bg-[#2F8E7D] transition shadow"
              >
                {loading ? "جاري الإرسال..." : "تأكيد الطلب المبدئي"}
              </button>

              {/* تعديل زر الواتساب وتجميده كما طلبت تماماً */}
              <button
                disabled
                className="w-full rounded-xl bg-gray-300 py-3.5 text-sm font-bold text-gray-500 cursor-not-allowed text-center flex items-center justify-center gap-2"
              >
                الواتساب غير متوفر الآن
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}