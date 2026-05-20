import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function HomePage() {

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#FAFAFA]">

      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="text-center mb-14">

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#111827] leading-tight">
            ابحث عن مكان إقامتك
            <br />
            داخل سوريا
          </h1>

          <p className="mt-6 text-xl text-[#6B7280] leading-9 max-w-3xl mx-auto">
            منصة متخصصة بالعقارات قصيرة الإقامة داخل سوريا،
            تشمل الشقق والفيلات والمزارع والغرف والشاليهات.
          </p>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {properties?.map((property) => (

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
                    {property.type || "عقار"}
                  </span>

                  <span className="text-xl font-extrabold text-[#111827]">
                    ${property.price}
                  </span>

                </div>

                <h2 className="text-2xl font-bold text-[#111827]">
                  {property.title}
                </h2>

                <p className="mt-3 text-[#6B7280]">
                  {property.location}
                </p>

                {property.description && (
                  <p className="mt-4 text-[#4B5563] leading-8 line-clamp-3">
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

      </section>

    </main>
  );
}