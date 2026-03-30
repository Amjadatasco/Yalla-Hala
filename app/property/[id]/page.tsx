"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const properties = [
  {
    id: "1",
    title: "شقة حديثة ومريحة",
    location: "حمص - الحمرا",
    price: "$35 / ليلة",
    description:
      "شقة مريحة ومناسبة للإقامة القصيرة، قريبة من الخدمات وتحتوي على جميع التجهيزات الأساسية.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
];

export default function PropertyPage({ params }: any) {
  const property = properties.find((p) => p.id === params.id);

  const [booked, setBooked] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);

  if (!property) return <div>العقار غير موجود</div>;

  const handleBooking = async () => {
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
      alert("في مشكلة");
      console.log(error);
    } else {
      alert("تم الحجز 🔥");
      setBooked(true);
    }
  };

  return (
    <main className="bg-white min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <img
          src={property.image}
          className="w-full h-96 object-cover rounded-2xl"
          alt={property.title}
        />

        <h1 className="text-4xl font-bold mt-6 text-right">
          {property.title}
        </h1>

        <p className="text-gray-500 text-right mt-2">
          {property.location}
        </p>

        <p className="text-xl font-bold text-[#3FAF9B] mt-4 text-right">
          {property.price}
        </p>

        <p className="mt-6 text-gray-700 leading-8 text-right">
          {property.description}
        </p>

        {booked && (
          <div className="mt-6 bg-red-100 text-red-600 p-4 rounded-xl text-right font-bold">
            هذا العقار محجوز
          </div>
        )}

        {!booked && (
          <div className="mt-10 border rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-right">
              إرسال طلب حجز
            </h2>

            <div className="grid gap-4">
              <input
                placeholder="الاسم"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="border rounded-xl px-4 py-3"
              />

              <input
                placeholder="رقم الهاتف"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border rounded-xl px-4 py-3"
              />

              <button
                onClick={handleBooking}
                disabled={loading}
                className="bg-[#3FAF9B] text-white py-3 rounded-xl hover:bg-[#349C89] disabled:opacity-50"
              >
                {loading ? "جاري الإرسال..." : "إرسال الطلب"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}