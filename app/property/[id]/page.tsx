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
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.log(error);
    } else {
      setProperty(data);
    }
  }

  async function handleBooking() {
    if (!guestName || !guestPhone || !checkIn || !checkOut) {
      alert("يرجى تعبئة جميع الحقول");
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
      console.log(error);
      alert("حدث خطأ أثناء إرسال الطلب");
    } else {
      alert("تم إرسال طلب الحجز بنجاح");

      setGuestName("");
      setGuestPhone("");
      setCheckIn("");
      setCheckOut("");
    }
  }

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl">جاري تحميل العقار...</p>
      </main>
    );
  }

  return (
    <main className="bg-[#FAFAFA] min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="grid gap-4 md:grid-cols-2">
          {property.images && property.images.length > 0 ? (
            property.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={property.title}
                loading="lazy"
                className="w-full h-80 object-cover rounded-[28px]"
              />
            ))
          ) : (
            <img
              src={
                property.image ||
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
              }
              alt={property.title}
              className="w-full h-[500px] object-cover rounded-[28px]"
            />
          )}
        </div>

        <div className="mt-10 bg-white border border-[#E5E7EB] rounded-[32px] p-8 shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div className="text-right">
              <h1 className="text-5xl font-extrabold text-[#111827]">
                {property.title}
              </h1>

              <p className="mt-3 text-lg text-[#6B7280]">
                {property.location}
              </p>
            </div>

            <div className="rounded-2xl bg-[#ECFDF5] px-6 py-4">
              <p className="text-3xl font-extrabold text-[#3FAF9B]">
                ${property.price}
              </p>

              <p className="text-sm text-[#6B7280] text-center mt-1">
                لليلة الواحدة
              </p>
            </div>
          </div>

          {property.description && (
            <div className="mt-10 text-right">
              <h2 className="text-2xl font-bold text-[#111827] mb-4">
                وصف العقار
              </h2>

              <p className="leading-9 text-lg text-[#4B5563]">
                {property.description}
              </p>
            </div>
          )}

          <div className="mt-12 border-t pt-10">

            <h2 className="text-3xl font-extrabold text-right text-[#111827] mb-8">
              إرسال طلب حجز
            </h2>

            <div className="grid gap-5">

              <input
                placeholder="الاسم الكامل"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="rounded-2xl border border-[#E5E7EB] px-5 py-4 outline-none focus:border-[#3FAF9B]"
              />

              <input
                placeholder="رقم الهاتف أو واتساب"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="rounded-2xl border border-[#E5E7EB] px-5 py-4 outline-none focus:border-[#3FAF9B]"
              />

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="block mb-2 text-right text-sm text-[#6B7280]">
                    تاريخ الوصول
                  </label>

                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-2xl border border-[#E5E7EB] px-5 py-4 outline-none focus:border-[#3FAF9B]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-right text-sm text-[#6B7280]">
                    تاريخ المغادرة
                  </label>

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
                className="mt-3 w-full rounded-2xl bg-[#3FAF9B] py-5 text-xl font-bold text-white transition hover:bg-[#2F8E7D] disabled:opacity-50"
              >
                {loading ? "جاري إرسال الطلب..." : "إرسال طلب الحجز"}
              </button>

              <a
                href="https://wa.me/963000000000"
                target="_blank"
                className="w-full rounded-2xl bg-green-500 py-5 text-xl font-bold text-white text-center transition hover:bg-green-600"
              >
                التواصل عبر واتساب
              </a>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}