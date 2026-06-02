"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PropertyPage({ params }: any) {
  const resolvedParams =
    "then" in params
      ? use(params)
      : params;

  const [property, setProperty] = useState<any>(null);

  const [existingBookings, setExistingBookings] =
    useState<any[]>([]);

  const [guestName, setGuestName] = useState("");

  const [guestPhone, setGuestPhone] = useState("");

  const [checkIn, setCheckIn] = useState<any>("");

  const [checkOut, setCheckOut] = useState<any>("");

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [viewMode, setViewMode] =
    useState<
      "details" | "book"
    >("details");

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

  function getBlockedDates() {
    const blockedDates: Date[] = [];

    existingBookings.forEach((booking) => {
      const start =
        new Date(
          booking.check_in
        );

      const end =
        new Date(
          booking.check_out
        );

      const current =
        new Date(start);

      while (current <= end) {
        blockedDates.push(
          new Date(current)
        );

        current.setDate(
          current.getDate() + 1
        );
      }
    });

    return blockedDates;
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
      const cleanPhone =
        property?.owner_phone
          ?.replace(
            /\D/g,
            ""
          ) || "";

      const whatsappMessage =
        `مرحباً ${property?.owner_name || ""} 👋\n\n` +
        `يوجد طلب حجز جديد على عقارك:\n\n` +
        `🏠 ${property?.title}\n` +
        `📅 من ${inDate} إلى ${outDate}\n\n` +
        `👤 اسم المستأجر: ${name}\n` +
        `📞 رقم المستأجر: ${phone}`;

      const whatsappLink =
        `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          whatsappMessage
        )}`;

      const messageText =
        `🚨 طلب حجز جديد\n\n` +
        `🏠 العقار:\n${property?.title || ""}\n\n` +
        `📍 الموقع:\n${property?.location || ""}\n\n` +
        `👤 المستأجر:\n${name}\n\n` +
        `📞 الهاتف:\n${phone}\n\n` +
        `📅 الوصول:\n${inDate}\n\n` +
        `📅 المغادرة:\n${outDate}\n\n` +
        `📲 رابط مراسلة المؤجر:\n${whatsappLink}`;

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
        "هذه التواريخ محجوزة بالفعل."
      );

      return;
    }

    try {
      setLoading(true);

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
            },
          ]);

      if (error) {
        console.error(error);

        alert(
          `فشل الحجز: ${error.message}`
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
        "تم استلام طلب الحجز بنجاح."
      );

      setGuestName("");
      setGuestPhone("");
      setCheckIn("");
      setCheckOut("");

      setViewMode("details");
    } catch (err) {
      console.error(err);

      alert(
        "حدث خطأ أثناء إرسال الطلب."
      );
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        جاري تحميل العقار...

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

            <div className="mt-8 grid gap-5">

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block mb-2 font-bold">

                    تاريخ الوصول

                  </label>

                  <DatePicker
                    selected={
                      checkIn
                        ? new Date(checkIn)
                        : null
                    }
                    onChange={(date: any) =>
                      setCheckIn(
                        date
                          ?.toISOString()
                          ?.split("T")[0]
                      )
                    }
                    excludeDates={
                      getBlockedDates()
                    }
                    minDate={
                      new Date()
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="اختر تاريخ الوصول"
                    className="w-full rounded-2xl border px-4 py-4"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-bold">

                    تاريخ المغادرة

                  </label>

                  <DatePicker
                    selected={
                      checkOut
                        ? new Date(checkOut)
                        : null
                    }
                    onChange={(date: any) =>
                      setCheckOut(
                        date
                          ?.toISOString()
                          ?.split("T")[0]
                      )
                    }
                    excludeDates={
                      getBlockedDates()
                    }
                    minDate={
                      checkIn
                        ? new Date(checkIn)
                        : new Date()
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="اختر تاريخ المغادرة"
                    className="w-full rounded-2xl border px-4 py-4"
                  />

                </div>

              </div>

              <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">

                الأيام المحجوزة غير قابلة للاختيار.

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
