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

  const [selectedGovernorate, setSelectedGovernorate] = useState("");

  const [selectedType, setSelectedType] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

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
      query = query.eq("governorate", selectedGovernorate);
    }

    if (selectedType) {
      query = query.eq("type", selectedType);
    }

    if (maxPrice) {
      query = query.lte("price", Number(maxPrice));
    }

    const { data, error } = await query;

    if (!error && data) {
      setProperties(data);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">

      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="text-center">

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#111827] leading-tight">
            ابحث عن مكان إقامتك
            <br />
            داخل سوريا
          </h1>

          <p className="mt-6 text-xl text-[#6B7280] leading-9 max-w-3xl mx-auto">
            شقق، فلل، مزارع، شاليهات وغرف للإقامة القصيرة.
          </p>

        </div>

        <div className="mt-12 bg-white border border-[#E5E7EB] rounded-[32px] p-8 shadow-sm">

          <div className="grid gap-5 md:grid-cols-4">

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
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
                setSelectedGovernorate(e.target.value)
              }
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
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

            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="أقصى سعر"
              className="rounded-2xl border border-[#E5E7EB] px-5 py-4"
            />

            <button
              onClick={loadProperties}
              className="rounded-2xl bg-[#3FAF9B] text-white text-lg font-bold"
            >
              بحث
            </button>

          </div>

        </div>

        <div className="mt-14">

          <div className="flex items-center justify-between mb-8">

            <h2 className="text-4xl font-extrabold text-[#111827]">
              العقارات
            </h2>

            <p className="text-lg text-[#6B7280]">
              عدد النتائج: {properties.length}
            </p>

          </div>

          {loading ? (

            <div className="text-center py-20 text-2xl">
              جاري تحميل العقارات...
            </div>

          ) : properties.length === 0 ? (

            <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-12 text-center">

              <h3 className="text-3xl font-extrabold text-[#111827]">
                لا توجد نتائج
              </h3>

              <p className="mt-4 text-[#6B7280]">
                جرّب تغيير خيارات البحث
              </p>

            </div>

          ) : (

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {properties.map((property) => (

                <article
                  key={property.id}
                  className="overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <img
                    src={
                      property.image ||
                      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={property.title}
                    loading="lazy"
                    className="h-72 w-full object-cover"
                  />

                  <div className="p-6 text-right">

                    <div className="flex items-center justify-between mb-4">

                      <span className="bg-[#ECFDF5] text-[#3FAF9B] px-4 py-2 rounded-full text-sm font-bold">
                        {property.type}
                      </span>

                      <span className="text-2xl font-extrabold text-[#111827]">
                        ${property.price}
                      </span>

                    </div>

                    <h3 className="text-2xl font-extrabold text-[#111827]">
                      {property.title}
                    </h3>

                    <p className="mt-3 text-[#6B7280]">
                      {property.location}
                    </p>

                    <div className="mt-5 flex gap-2 flex-wrap justify-end">

                      <span className="bg-[#F3F4F6] px-3 py-2 rounded-full text-sm">
                        {property.governorate}
                      </span>

                      {property.rooms && (
                        <span className="bg-[#F3F4F6] px-3 py-2 rounded-full text-sm">
                          {property.rooms} غرف
                        </span>
                      )}

                      {property.bathrooms && (
                        <span className="bg-[#F3F4F6] px-3 py-2 rounded-full text-sm">
                          {property.bathrooms} حمام
                        </span>
                      )}

                    </div>

                    {property.description && (

                      <p className="mt-5 leading-8 text-[#4B5563] line-clamp-3">
                        {property.description}
                      </p>

                    )}

                    <Link
                      href={`/property/${property.id}`}
                      className="mt-6 block w-full rounded-2xl bg-[#3FAF9B] py-4 text-center text-lg font-bold text-white transition hover:bg-[#2F8E7D]"
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