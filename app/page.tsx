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

const propertyTypes = ["شقة", "فيلا", "مزرعة", "غرفة", "شاليه"];

const sampleProperties = [
  {
    id: 1,
    title: "شقة حديثة ومريحة",
    location: "حمص - عكرمة",
    price: "$35 / ليلة",
    type: "شقة",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "فيلا عائلية مع حديقة",
    location: "طرطوس - الكورنيش",
    price: "$95 / ليلة",
    type: "فيلا",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "مزرعة هادئة للإجازات",
    location: "ريف دمشق - الزبداني",
    price: "$110 / ليلة",
    type: "مزرعة",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "غرفة مفروشة بإقامة مريحة",
    location: "دمشق - المزة",
    price: "$20 / ليلة",
    type: "غرفة",
    image:
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "شاليه بإطلالة جميلة",
    location: "اللاذقية - كسب",
    price: "$85 / ليلة",
    type: "شاليه",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "شقة قريبة من الخدمات",
    location: "حلب - الفرقان",
    price: "$40 / ليلة",
    type: "شقة",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="text-right">
            <span className="inline-block rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-sm text-[#6B7280]">
              ابحث بسهولة عن مكان إقامة مناسب داخل سوريا
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-[#111827] md:text-6xl">
              ابحث عن
              <br />
              <span className="text-[#3FAF9B]">شقة أو فيلا أو مزرعة</span>
              <br />
              أو غرفة أو شاليه
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6B7280]">
              تصفح خيارات إقامة متنوعة داخل سوريا بطريقة مريحة وواضحة، ثم أرسل
              طلب الحجز مباشرة لصاحب العقار.
            </p>

            <div className="mt-6 rounded-2xl border border-[#D1FAE5] bg-[#F0FDF4] px-4 py-3 text-sm leading-7 text-[#166534]">
              إضافة العقارات مجانية حاليًا لفترة الإطلاق، ويتم التواصل والدفع
              مباشرة بين الضيف وصاحب العقار.
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-right text-2xl font-bold text-[#111827] md:text-3xl">
              ابحث عن العقار المناسب
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-right text-sm text-[#6B7280]">
                  نوع العقار
                </label>
                <select className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-right outline-none transition focus:border-[#3FAF9B]">
                  {propertyTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-right text-sm text-[#6B7280]">
                  المحافظة
                </label>
                <select className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-right outline-none transition focus:border-[#3FAF9B]">
                  {governorates.map((gov) => (
                    <option key={gov}>{gov}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-right text-sm text-[#6B7280]">
                  تاريخ الوصول
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
                />
              </div>

              <div>
                <label className="mb-2 block text-right text-sm text-[#6B7280]">
                  تاريخ المغادرة
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none transition focus:border-[#2E#3FAF9B7D6B]"
                />
              </div>
            </div>

            <button className="mt-5 w-full rounded-2xl bg-[#3FAF9B] py-4 text-lg font-semibold text-white transition hover:bg-[#25695A]">
              ابحث الآن
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8 text-right">
          <h2 className="text-3xl font-bold text-[#111827]">عقارات مقترحة</h2>
          <p className="mt-2 text-[#6B7280]">
            أمثلة شكلية لكيفية ظهور العقارات في الصفحة الرئيسية
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {sampleProperties.map((property) => (
            <article
              key={property.id}
              className="overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={property.image}
                alt={property.title}
                className="h-64 w-full object-cover"
              />

              <div className="p-5 text-right">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-sm font-medium text-[#3FAF9B]">
                    {property.type}
                  </span>
                  <span className="font-bold text-[#111827]">
                    {property.price}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#111827]">
                  {property.title}
                </h3>
                <p className="mt-2 text-[#6B7280]">{property.location}</p>

                <button className="mt-4 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#1F2937] transition hover:bg-[#F9FAFB]">
                  إرسال طلب حجز
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}