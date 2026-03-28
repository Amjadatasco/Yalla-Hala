const sampleProperties = [
  {
    id: 1,
    title: "شقة حديثة في حمص",
    location: "حمص - عكرمة",
    price: "$35 / ليلة",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "فيلا عائلية مع حديقة",
    location: "حمص - الوعر",
    price: "$90 / ليلة",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "غرفة مفروشة للإقامة القصيرة",
    location: "دمشق - المزة",
    price: "$20 / ليلة",
    image:
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "شقة مريحة قريبة من الخدمات",
    location: "حلب - الفرقان",
    price: "$40 / ليلة",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f8f8]" dir="rtl">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="bg-white rounded-[30px] border border-gray-200 p-6 shadow-sm">
            <h2 className="text-3xl font-bold text-right mb-6">
              ابحث عن العقار المناسب
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2 text-right">
                  نوع العقار
                </label>
                <select className="w-full border rounded-xl px-4 py-3 text-right">
                  <option>فيلا</option>
                  <option>شقة</option>
                  <option>غرفة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2 text-right">
                  المدينة
                </label>
                <select className="w-full border rounded-xl px-4 py-3 text-right">
                  <option>حمص</option>
                  <option>دمشق</option>
                  <option>حلب</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2 text-right">
                  Check-in
                </label>
                <input
                  type="date"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2 text-right">
                  Check-out
                </label>
                <input
                  type="date"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <button className="w-full bg-teal-700 hover:bg-teal-800 text-white py-4 rounded-2xl text-lg transition">
              ابحث الآن
            </button>
          </div>

          <div className="text-right">
            <span className="inline-block bg-white border border-gray-200 rounded-full px-5 py-2 text-sm text-gray-500 mb-6">
              ابحث بسهولة عن مكان إقامة مناسب داخل سوريا
            </span>

            <h1 className="text-5xl md:text-6xl leading-tight font-extrabold text-[#132033]">
              ابحث عن
              <br />
              <span className="text-teal-700">شقة أو فيلا أو غرفة</span>
              <br />
              بشكل واضح وسريع
            </h1>

            <p className="text-gray-500 mt-6 leading-8">
              الصفحة الرئيسية مخصصة فقط للبحث، حتى تكون التجربة أسهل وأوضح
              للزائر. اختر نوع العقار والمدينة وتاريخ الوصول والمغادرة، ثم أرسل
              طلبك.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-6 text-right">
          <h2 className="text-3xl font-bold text-[#132033] mb-2">
            عقارات مقترحة
          </h2>
          <p className="text-gray-500">
            أمثلة شكلية ستظهر هنا لاحقًا تحت الفلتر
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-4 text-right">
                <h3 className="text-xl font-bold text-[#132033] mb-2">
                  {property.title}
                </h3>
                <p className="text-gray-500 mb-3">{property.location}</p>

                <div className="flex items-center justify-between gap-3">
                  <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm">
                    عرض التفاصيل
                  </button>
                  <span className="text-teal-700 font-bold">
                    {property.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}