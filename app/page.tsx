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
  "غرفة",
  "استوديو",
  "بيت عربي",
  "شاليه",
  "مزرعة",
  "بنتهاوس",
  "مكتب",
  "محل",
  "مستودع",
  "سكن طلاب",
  "غرفة فندقية",
  "جناح مفروش",
];

const sampleProperties = [
  {
    id: 1,
    title: "شقة هادئة وحديثة",
    location: "حمص - عكرمة",
    price: "$35 / ليلة",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    type: "شقة",
  },
  {
    id: 2,
    title: "فيلا عائلية مع حديقة",
    location: "طرطوس - الكورنيش",
    price: "$95 / ليلة",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
    type: "فيلا",
  },
  {
    id: 3,
    title: "استوديو أنيق للإقامة القصيرة",
    location: "دمشق - المزة",
    price: "$28 / ليلة",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    type: "استوديو",
  },
  {
    id: 4,
    title: "غرفة مفروشة ومريحة",
    location: "حلب - الفرقان",
    price: "$18 / ليلة",
    image:
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?q=80&w=1200&auto=format&fit=crop",
    type: "غرفة",
  },
  {
    id: 5,
    title: "بيت عربي بطابع تراثي",
    location: "دمشق - باب توما",
    price: "$70 / ليلة",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    type: "بيت عربي",
  },
  {
    id: 6,
    title: "شاليه مريح بإطلالة جميلة",
    location: "اللاذقية - كسب",
    price: "$85 / ليلة",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    type: "شاليه",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F4EE]" dir="rtl">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-[32px] border border-[#D8D2C8] p-7 shadow-sm">
            <h2 className="text-3xl font-bold text-right mb-6 text-[#2F3A36]">
              ابحث عن العقار المناسب
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-[#7B7B73] mb-2 text-right">
                  نوع العقار
                </label>
                <select className="w-full border border-[#D8D2C8] rounded-2xl px-4 py-3 text-right bg-[#FCFBF8]">
                  {propertyTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#7B7B73] mb-2 text-right">
                  المحافظة
                </label>
                <select className="w-full border border-[#D8D2C8] rounded-2xl px-4 py-3 text-right bg-[#FCFBF8]">
                  {governorates.map((gov) => (
                    <option key={gov}>{gov}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-[#7B7B73] mb-2 text-right">
                  تاريخ الوصول
                </label>
                <input
                  type="date"
                  className="w-full border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#7B7B73] mb-2 text-right">
                  تاريخ المغادرة
                </label>
                <input
                  type="date"
                  className="w-full border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]"
                />
              </div>
            </div>

            <button className="w-full bg-[#7A9E9F] hover:bg-[#6C8F90] text-white py-4 rounded-2xl text-lg transition font-semibold">
              ابحث الآن
            </button>
          </div>

          <div className="text-right">
            <span className="inline-block bg-white border border-[#D8D2C8] rounded-full px-5 py-2 text-sm text-[#7B7B73] mb-6">
              ابحث بسهولة عن مكان إقامة مناسب داخل سوريا
            </span>

            <h1 className="text-5xl md:text-7xl leading-tight font-extrabold text-[#2F3A36]">
              ابحث عن
              <br />
              <span className="text-[#7A9E9F]">شقة أو فيلا أو غرفة</span>
              <br />
              براحة ووضوح
            </h1>

            <p className="text-[#6F6A63] mt-6 leading-8 text-lg">
              اختر نوع العقار والمحافظة وتاريخ الوصول والمغادرة، ثم استعرض
              الخيارات المناسبة لك بسهولة ضمن تجربة بسيطة ومريحة.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-8 text-right">
          <h2 className="text-3xl font-bold text-[#2F3A36] mb-2">
            أمثلة على العقارات
          </h2>
          <p className="text-[#7B7B73]">
            هذه أمثلة شكلية لما سيظهر تحت الفلتر لاحقًا
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {sampleProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-[28px] overflow-hidden border border-[#D8D2C8] shadow-sm hover:shadow-md transition"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-5 text-right">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm px-3 py-1 rounded-full bg-[#EEF3F1] text-[#658283]">
                    {property.type}
                  </span>
                  <span className="text-[#7A9E9F] font-bold">
                    {property.price}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#2F3A36] mb-2">
                  {property.title}
                </h3>
                <p className="text-[#7B7B73] mb-4">{property.location}</p>

                <button className="px-4 py-2 rounded-full bg-[#F3EEE6] hover:bg-[#E8E0D4] text-sm text-[#2F3A36] transition">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}