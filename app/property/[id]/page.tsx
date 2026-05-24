"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";

export default function PropertyPage({ params }: any) {

  const resolvedParams =
    "then" in params
      ? use(params)
      : params;

  const [property, setProperty] =
    useState<any>(null);

  const [existingBookings, setExistingBookings] =
    useState<any[]>([]);

  const [guestName, setGuestName] =
    useState("");

  const [guestPhone, setGuestPhone] =
    useState("");

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [viewMode, setViewMode] =
    useState<
      "details" | "book"
    >("details");

  const todayStr = new Date()
    .toISOString()
    .split("T")[0];

  const TELEGRAM_BOT_TOKEN =
    "8206662050:AAF1FXV2ZexVyrfJCm7SOOF2M8Un7YxMmlU";

  const TELEGRAM_CHAT_ID =
    "629151535";

  useEffect(() => {

    if (resolvedParams?.id) {
      loadPropertyAndBookings();
    }

  }, [resolvedParams?.id]);

  async function loadPropertyAndBookings() {

    try {

      setPageLoading(true);

      const {
        data: propertyData,
        error: propertyError,
      } = await supabase
        .from("properties")
        .select("*")
        .eq(
          "id",
          resolvedParams.id
        )
        .single();

      if (propertyError) {

        console.error(
          propertyError
        );

        return;
      }

      setProperty(propertyData);

      const {
        data: bookingsData,
        error: bookingsError,
      } = await supabase
        .from("bookings")
        .select(
          "check_in, check_out"
        )
        .eq(
          "property_id",
          resolvedParams.id
        )
        .eq(
          "status",
          "confirmed"
        );

      if (
        !bookingsError &&
        bookingsData
      ) {

        setExistingBookings(
          bookingsData
        );

      }

    } catch (err) {

      console.error(err);

    } finally {

      setPageLoading(false);

    }
  }

  function isDatesOverlapping(
    newIn: string,
    newOut: string
  ) {

    const startNew =
      new Date(newIn).getTime();

    const endNew =
      new Date(newOut).getTime();

    for (const booking of existingBookings) {

      const startExisting =
        new Date(
          booking.check_in
        ).getTime();

      const endExisting =
        new Date(
          booking.check_out
        ).getTime();

      if (
        startNew <
          endExisting &&
        endNew >
          startExisting
      ) {

        return true;

      }
    }

    return false;
  }

  async function sendTelegramNotification(
    name: string,
    phone: string,
    inDate: string,
    outDate: string
  ) {

    try {

      const messageText =
        `🚨 طلب حجز جديد\n\n` +

        `🏠 العقار:\n${
          property?.title || ""
        }\n\n` +

        `📍 الموقع:\n${
          property?.location || ""
        }\n\n` +

        `👤 المستأجر:\n${name}\n\n` +

        `📞 الهاتف:\n${phone}\n\n` +

        `📅 الوصول:\n${inDate}\n\n` +

        `📅 المغادرة:\n${outDate}`;

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

            text: messageText,
          }),
        }
      );

    } catch (err) {

      console.error(err);

    }
  }

  async function handleBooking() {

    if (
      !guestName.trim() ||
      !guestPhone.trim() ||
      !checkIn ||
      !checkOut
    ) {

      alert(
        "يرجى تعبئة جميع البيانات."
      );

      return;
    }

    const checkInDate =
      new Date(checkIn);

    const checkOutDate =
      new Date(checkOut);

    if (
      checkOutDate <=
      checkInDate
    ) {

      alert(
        "تاريخ المغادرة يجب أن يكون بعد الوصول."
      );

      return;
    }

    if (
      isDatesOverlapping(
        checkIn,
        checkOut
      )
    ) {

      alert(
        "هذه التواريخ محجوزة."
      );

      return;
    }

    try {

      setLoading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {

        alert(
          "يجب تسجيل الدخول أولاً."
        );

        setLoading(false);

        return;
      }

      const { error } =
        await supabase
          .from("bookings")
          .insert([
            {
              property_id:
                property.id,

              guest_name:
                guestName.trim(),

              guest_phone:
                guestPhone.trim(),

              check_in:
                checkIn,

              check_out:
                checkOut,

              status:
                "pending",

              user_id:
                user.id,
            },
          ]);

      if (error) {

        alert(
          error.message
        );

        setLoading(false);

        return;
      }

      await sendTelegramNotification(
        guestName.trim(),
        guestPhone.trim(),
        checkIn,
        checkOut
      );

      alert(
        "تم استلام طلب الحجز بنجاح، وسيتم مراجعة الطلب والتواصل معك قريباً."
      );

      setGuestName("");
      setGuestPhone("");
      setCheckIn("");
      setCheckOut("");

      setViewMode("details");

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  }

  if (pageLoading) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        جاري التحميل...

      </div>
    );
  }

  if (!property) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        العقار غير موجود

      </div>
    );
  }

  return (
    <main
      className="bg-[#FAFAFA] min-h-screen px-4 py-10"
      dir="rtl"
    >

      <div className="max-w-5xl mx-auto">

        {/* الصور */}
        <div className="grid gap-4 mb-8">

          {(property.images_list?.length
            ? property.images_list
            : [property.image]
          ).map(
            (
              image: string,
              index: number
            ) => (

              <img
                key={index}
                src={image}
                alt={property.title}
                className="w-full rounded-3xl border h-[500px] object-cover"
              />

            )
          )}

        </div>

        {/* الكارد */}
        <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">

          {/* الهيدر */}
          <div className="flex flex-wrap items-start justify-between gap-5 border-b pb-6">

            <div>

              <h1 className="text-3xl font-black">

                {property.title}

              </h1>

              <p className="mt-2 text-sm text-gray-500">

                {property.location}
                {" - "}
                {
                  property.governorate
                }

              </p>

            </div>

            <div className="rounded-2xl bg-[#E6F4F1] px-6 py-4 text-center">

              <p className="text-3xl font-black text-[#2D6A5F]">

                $
                {property.price}

              </p>

              <p className="text-xs mt-1">

                USD / ليلة

              </p>

            </div>

          </div>

          {/* Tabs */}
          <div className="flex mt-6 border-b">

            <button
              onClick={() =>
                setViewMode(
                  "details"
                )
              }
              className={`flex-1 py-4 border-b-2 ${
                viewMode ===
                "details"
                  ? "border-[#3FAF9B] text-[#3FAF9B]"
                  : "border-transparent"
              }`}
            >

              تفاصيل العقار

            </button>

            <button
              onClick={() =>
                setViewMode(
                  "book"
                )
              }
              className={`flex-1 py-4 border-b-2 ${
                viewMode ===
                "book"
                  ? "border-[#3FAF9B] text-[#3FAF9B]"
                  : "border-transparent"
              }`}
            >

              طلب حجز

            </button>

          </div>

          {/* التفاصيل */}
          {viewMode ===
            "details" && (

            <div className="mt-10 space-y-8">

              {/* الوصف */}
              <section>

                <h2 className="text-2xl font-black mb-4">

                  الوصف

                </h2>

                <div className="rounded-3xl bg-[#F9FAFB] p-6">

                  <p className="leading-[2.2] whitespace-pre-line">

                    {property.description ||
                      "لا يوجد وصف"}

                  </p>

                </div>

              </section>

              {/* التجهيزات */}
              <section>

                <h2 className="text-2xl font-black mb-4">

                  التجهيزات والخدمات

                </h2>

                <div className="grid gap-3 sm:grid-cols-2">

                  {property.amenities
                    ?.split(",")
                    .map(
                      (
                        item: string,
                        index: number
                      ) => (

                        <div
                          key={index}
                          className="rounded-2xl border bg-white px-4 py-3"
                        >

                          ✓ {item.trim()}

                        </div>

                      )
                    )}

                </div>

              </section>

              {/* المعلومات */}
              <section>

                <h2 className="text-2xl font-black mb-4">

                  معلومات العقار

                </h2>

                <div className="grid grid-cols-3 gap-4">

                  <div className="rounded-2xl border p-5 text-center">

                    <p className="text-sm text-gray-500">

                      الغرف

                    </p>

                    <h3 className="text-3xl font-black">

                      {
                        property.rooms_count
                      }

                    </h3>

                  </div>

                  <div className="rounded-2xl border p-5 text-center">

                    <p className="text-sm text-gray-500">

                      الأسرة

                    </p>

                    <h3 className="text-3xl font-black">

                      {
                        property.beds_count
                      }

                    </h3>

                  </div>

                  <div className="rounded-2xl border p-5 text-center">

                    <p className="text-sm text-gray-500">

                      الحمامات

                    </p>

                    <h3 className="text-3xl font-black">

                      {
                        property.bathrooms_count
                      }

                    </h3>

                  </div>

                </div>

              </section>

            </div>
          )}

          {/* الحجز */}
          {viewMode ===
            "book" && (

            <div className="mt-8 grid gap-4">

              <input
                type="text"
                placeholder="اسم المستأجر"
                value={guestName}
                onChange={(e) =>
                  setGuestName(
                    e.target.value
                  )
                }
                className="rounded-2xl border px-4 py-4"
              />

              <input
                type="text"
                placeholder="رقم الهاتف"
                value={guestPhone}
                onChange={(e) =>
                  setGuestPhone(
                    e.target.value
                  )
                }
                className="rounded-2xl border px-4 py-4"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="date"
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) =>
                    setCheckIn(
                      e.target.value
                    )
                  }
                  className="rounded-2xl border px-4 py-4"
                />

                <input
                  type="date"
                  min={
                    checkIn ||
                    todayStr
                  }
                  value={checkOut}
                  onChange={(e) =>
                    setCheckOut(
                      e.target.value
                    )
                  }
                  className="rounded-2xl border px-4 py-4"
                />

              </div>

              <button
                onClick={
                  handleBooking
                }
                disabled={loading}
                className="w-full rounded-2xl bg-[#3FAF9B] py-4 text-white font-black"
              >

                {loading
                  ? "جاري الإرسال..."
                  : "إرسال طلب الحجز"}

              </button>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}