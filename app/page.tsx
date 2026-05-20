"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const governorates = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "درعا",
  "السويداء",
  "القنيطرة",
  "دير الزور",
  "الرقة",
  "الحسكة",
];

const propertyTypes = [
  "شقة",
  "فيلا",
  "مزرعة",
  "غرفة",
  "شاليه",
];

export default function HomePage() {

  const [properties, setProperties] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedGovernorate, setSelectedGovernorate] =
    useState("");

  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {

    setLoading(true);

    let query = supabase
      .from("properties")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (selectedGovernorate) {
      query = query.eq(
        "governorate",
        selectedGovernorate
      );
    }

    if (selectedType) {
      query = query.eq("type", selectedType);
    }

    const { data, error } = await query;

    if (!error && data) {
      setProperties(data);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5]">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        <div className="text-center">

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold text-[#111827] leading-tight">

            ابحث عن مكان إقامتك

          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#6B7280] leading-8 max-w-2xl mx-auto">

            أماكن إقامة مختارة بعناية
            للإجازات والإقامات القصيرة.

          </p>

        </div>

        <div className="mt-10 sm:mt-14 bg-white/90 backdrop-blur-xl border border-white/40 rounded-[36px] p-5 sm:p-8 shadow-2xl">

          <div className="grid gap-4 md:grid-cols-3">

            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value)
              }
              className="h-16 rounded-2xl border border-[#E5E7EB] bg-white px-5 text-sm sm:text-base outline-none"
            >
              <option value="">
                كل الأنواع
              </option>

              {propertyTypes.map((type) => (
                <option key={type}>
                  {type}
                </option>
              ))}

            </select>

            <select
              value={selectedGovernorate}
              onChange={(e) =>
                setSelectedGovernorate(
                  e.target.value
                )
              }
              className="h-16 rounded-2xl border border-[#E5E7EB] bg-white px-5 text-sm sm:text-base outline-none"
            >
              <option value="">
                كل المحافظات
              </option>

              {governorates.map((gov) => (
                <option key={gov}>
                  {gov}
                </option>
              ))}

            </select>

            <button
              onClick={loadProperties}
              className="h-16 rounded-2xl bg-[#3FAF9B] text-white text-base sm:text-lg font-bold transition hover:bg-[#2F8E7D]"
            >
              بحث
            </button>

          </div>

        </div>

        <div className="mt-14 sm:mt-20">

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-10">

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] text-right">

              أماكن الإقامة

            </h2>

            <p className="text-base sm:text-lg text-[#6B7280] text-right">

              عدد النتائج: {properties.length}

            </p>

          </div>

          {loading ? (

            <div className="text-center py-24 text-xl sm:text-2xl">

              جاري تحميل العقارات...

            </div>

          ) : properties.length === 0 ? (

            <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-10 text-center shadow-sm">

              <h3 className="text-3xl font-extrabold text-[#111827]">

                لا توجد نتائج

              </h3>

              <p className="mt-4 text-[#6B7280]">

                جرّب تغيير خيارات البحث

              </p>

            </div>

          ) : (

            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

              {properties.map((property) => (

                <article
                  key={property.id}
                  className="overflow-hidden rounded-[32px] bg-white shadow-md transition hover:-translate-y-1 hover:shadow-2xl"
                >

                  <img
                    src={
                      property.image ||
                      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={property.title}
                    loading="lazy"
                    className="h-64 sm:h-72 w-full object-cover"
                  />

                  <div className="p-6 text-right">

                    <div className="flex items-center justify-between gap-3 mb-5">

                      <span className="bg-[#ECFDF5] text-[#3FAF9B] px-4 py-2 rounded-full text-xs sm:text-sm font-bold">

                        {property.type}

                      </span>

                      <span className="text-xl sm:text-2xl font-extrabold text-[#111827]">

                        ${property.price}

                      </span>

                    </div>

                    <h3 className="text-2xl font-extrabold text-[#111827] leading-9">

                      {property.title}

                    </h3>

                    <p className="mt-3 text-sm sm:text-base text-[#6B7280]">

                      {property.location}

                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 justify-end">

                      {property.governorate && (
                        <span className="bg-[#F3F4F6] px-3 py-2 rounded-full text-xs sm:text-sm">
                          {property.governorate}
                        </span>
                      )}

                      {property.rooms && (
                        <span className="bg-[#F3F4F6] px-3 py-2 rounded-full text-xs sm:text-sm">
                          {property.rooms} غرف
                        </span>
                      )}

                    </div>

                    {property.description && (

                      <p className="mt-5 leading-8 text-sm sm:text-base text-[#4B5563] line-clamp-3">

                        {property.description}

                      </p>

                    )}

                    <Link
                      href={`/property/${property.id}`}
                      className="mt-7 block w-full rounded-2xl bg-[#3FAF9B] py-4 text-center text-base sm:text-lg font-bold text-white transition hover:bg-[#2F8E7D]"
                    >

                      عرض العقار

                    </Link>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}