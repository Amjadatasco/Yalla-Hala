"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: number;
  property_name?: string;
  check_in: string;
  check_out: string;
  status: string;
};

export default function UserDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // إذا لم يسجل دخول
      if (!user) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false });

      if (error) throw error;

      setBookings((data as Booking[]) || []);
    } catch (error) {
      console.error(error);
      alert("فشل تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(id: number) {
    const confirmed = window.confirm(
      "هل تريد إلغاء هذا الحجز؟"
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setBookings((prev) =>
        prev.filter((booking) => booking.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("فشل حذف الحجز");
    }
  }

  return (
    <main
      className="min-h-screen bg-[#F9FAFB] px-4 py-10"
      dir="rtl"
    >

      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#111827]">
            حجوزاتي
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            جميع الحجوزات الخاصة بك داخل منصة يلا هلا
          </p>
        </div>

        {loading ? (

          <div className="text-center py-24">
            <div className="w-10 h-10 border-4 border-[#2D6A5F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

            <p className="font-bold text-[#2D6A5F]">
              جاري تحميل الحجوزات...
            </p>
          </div>

        ) : bookings.length === 0 ? (

          <div className="bg-white rounded-2xl p-10 border text-center text-gray-400">
            لا توجد حجوزات حالياً.
          </div>

        ) : (

          <div className="grid gap-5">

            {bookings.map((booking) => (

              <div
                key={booking.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  <div className="text-right">

                    <h2 className="text-xl font-black text-[#111827]">
                      {booking.property_name || "عقار محجوز"}
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-3">

                      <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="text-[11px] text-gray-400">
                          الوصول
                        </p>

                        <p className="font-bold">
                          {booking.check_in}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="text-[11px] text-gray-400">
                          المغادرة
                        </p>

                        <p className="font-bold">
                          {booking.check_out}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="text-[11px] text-gray-400">
                          الحالة
                        </p>

                        <p className="font-bold">
                          {booking.status}
                        </p>
                      </div>

                    </div>

                  </div>

                  <div>

                    <button
                      onClick={() =>
                        cancelBooking(booking.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-3 rounded-xl transition"
                    >
                      إلغاء الحجز
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}
