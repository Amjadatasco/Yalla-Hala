"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PropertyPage({ params }: any) {

  const [property, setProperty] = useState<any>(null);

  const [mainImage, setMainImage] = useState("");

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

    if (!error && data) {

      setProperty(data);

      if (data.images?.length > 0) {
        setMainImage(data.images[0]);
      } else {
        setMainImage(data.image);
      }
    }
  }

  async function handleBooking() {

    if (
      !guestName ||
      !guestPhone ||
      !checkIn ||
      !checkOut
    ) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("bookings")
      .insert([
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

      alert("حدث خطأ أثناء الحجز");

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

        <p className="text-2xl">
          جاري تحميل العقار...
        </p>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-10">

      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-10">

          <div>

            <img
              src={
                mainImage ||
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
              }
              alt={property.title}
              className="w-full h-[500px] object-cover rounded-[32px]"
            />

            {property.images?.length > 1 && (

              <div className="grid grid-cols-4 gap-4 mt-5">

                {property.images.map(
                  (image: string, index: number) => (

                    <button
                      key={index}
                      onClick={() => setMainImage(image)}
                      className="overflow-hidden rounded-2xl border-2 border-transparent hover:border-[#3FAF9B]"
                    >

                      <img
                        src={image}
                        className="w-full h-24 object-cover"
                      />

                    </button>
                  )
                )}

              </div>

            )}

          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-8 shadow-sm">

            <div className="flex items-start justify-between gap-5">

              <div className="text-right">

                <h1 className="text-5xl font-extrabold text-[#111827] leading-tight">
                  {property.title}
                </h1>

                <p className="mt-4 text-xl text-[#6B7280]">
                  {property.location}
                </p>

              </div>

              <div className="bg-[#ECFDF5] rounded-2xl px-6 py-4">

                <p className="text-3xl font-extrabold text-[#3FAF9B]">
                  ${property.price}
                </p>

                <p className="text-sm text-center mt-1 text-[#6B7280]">
                  لليلة
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-3 justify-end mt-8">

              {property.type && (
                <span className="bg-[#F3F4F6] px-4 py-2 rounded-full">
                  {property.type}
                </span>
              )}

              {property.governorate && (
                <span className="bg-[#F3F4F6] px-4 py-2 rounded-full">
                  {property.governorate}
                </span>
              )}

              {property.rooms && (
                <span className="bg-[#F3F4F6] px-4 py-2 rounded-full">
                  {property.rooms} غرف
                </span>
              )}

              {property.beds && (
                <span className="bg-[#F3F4F6] px-4 py-2 rounded-full">
                  {property.beds} أسرّة
                </span>
              )}

              {property.bathrooms && (
                <span className="bg-[#F3F4F6] px-4 py-2 rounded-full">
                  {property.bathrooms} حمام
                </span>
              )}

            </div>

            {property.description && (

              <div className="mt-10 text-right">

                <h2 className="text-2xl font-extrabold mb-4">
                  وصف العقار
                </h2>

                <p className="leading-9 text-[#4B5563] text-lg">
                  {property.description}
                </p>

              </div>

            )}

            {property.amenities && (

              <div className="mt-10 text-right">

                <h2 className="text-2xl font-extrabold mb-4">
                  التجهيزات
                </h2>

                <p className="leading-9 text-[#4B5563] text-lg">
                  {property.amenities}
                </p>

              </div>

            )}

          </div>

        </div>

        <div className="mt-12 bg-white border border-[#E5E7EB] rounded-[32px] p-8 shadow-sm">

          <h2 className="text-4xl font-extrabold text-right mb-8">
            إرسال طلب حجز
          </h2>

          <div className="grid gap-5">

            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="الاسم الكامل"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <input
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="رقم الهاتف أو واتساب"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block mb-2 text-right text-sm text-[#6B7280]">
                  تاريخ الوصول
                </label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-2xl border border-[#E5E7EB] px-5 py-4"
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
                  className="w-full rounded-2xl border border-[#E5E7EB] px-5 py-4"
                />

              </div>

            </div>

            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full rounded-2xl bg-[#3FAF9B] py-5 text-xl font-bold text-white hover:bg-[#2F8E7D] disabled:opacity-50"
            >
              {loading
                ? "جاري إرسال الطلب..."
                : "إرسال طلب الحجز"}
            </button>

            <a
              href={`https://wa.me/${property.owner_phone}`}
              target="_blank"
              className="w-full rounded-2xl bg-green-500 py-5 text-xl font-bold text-white text-center hover:bg-green-600"
            >
              التواصل عبر واتساب
            </a>

          </div>

        </div>

      </div>

    </main>
  );
}