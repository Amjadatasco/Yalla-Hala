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

export default function AddPropertyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-right">
          <h1 className="text-4xl font-extrabold text-[#111827] md:text-5xl">
            أضف عقارك
          </h1>
          <p className="mt-3 text-lg leading-8 text-[#6B7280]">
            املأ المعلومات التالية بشكل واضح حتى نراجع العقار ونجهزه للعرض داخل
            المنصة.
          </p>
        </div>

        <div className="rounded-[30px] border border-[#E5E7EB] bg-white p-7 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="اسم صاحب العقار"
            />
            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="رقم الهاتف أو واتساب"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="البريد الإلكتروني"
            />
            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="اسم العقار أو عنوان مختصر"
            />

            <select className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-right outline-none transition focus:border-[#3FAF9B]">
              <option>اختر نوع العقار</option>
              {propertyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-right outline-none transition focus:border-[#3FAF9B]">
              <option>اختر المحافظة</option>
              {governorates.map((gov) => (
                <option key={gov}>{gov}</option>
              ))}
            </select>

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="المدينة أو المنطقة"
            />
            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="الحي أو الموقع التقريبي"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="السعر لليلة أو لليوم"
            />
            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="الحد الأدنى لمدة الإقامة"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الغرف"
            />
            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الأسرّة"
            />

            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الحمامات"
            />
            <input
              className="rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="عدد الضيوف المسموح"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <textarea
              className="min-h-[150px] rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="وصف تفصيلي للعقار"
            />
            <textarea
              className="min-h-[150px] rounded-2xl border border-[#E5E7EB] px-4 py-3 outline-none transition focus:border-[#3FAF9B]"
              placeholder="اذكر التجهيزات المتوفرة: مكيف، إنترنت، مطبخ، غسالة، تدفئة، موقف سيارة..."
            />
          </div>

          <div className="mt-6 rounded-[24px] border border-[#E5E7EB] p-5">
            <h2 className="mb-3 text-right text-2xl font-bold text-[#111827]">
              صور العقار
            </h2>
            <p className="mb-4 text-right text-sm leading-7 text-[#6B7280]">
              يمكنك رفع عدة صور مرة واحدة. يفضّل أن تكون الصور واضحة وحديثة
              وتعكس الحالة الحقيقية للعقار.
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              className="block w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 file:ml-4 file:rounded-full file:border-0 file:bg-[#3FAF9B] file:px-4 file:py-2 file:text-white hover:file:bg-[#25695A]"
            />
          </div>

          <div className="mt-6 rounded-[24px] border border-[#E5E7EB] bg-[#F9FAFB] p-6">
            <h2 className="mb-4 text-right text-2xl font-bold text-[#111827]">
              شروط النشر في Yalla Hala
            </h2>

            <ul className="space-y-3 text-right text-[#4B5563] leading-8">
              <li>1. يجب أن تكون معلومات العقار صحيحة وواضحة وغير مضللة.</li>
              <li>2. يجب أن تكون الصور حقيقية وتعبر عن العقار بشكل فعلي.</li>
              <li>3. يتحمل صاحب العقار مسؤولية السعر والمعلومات المعروضة.</li>
              <li>
                4. يحق لإدارة المنصة مراجعة العقار وطلب تعديل أي معلومات قبل
                النشر.
              </li>
              <li>5. يمنع نشر أي عقار وهمي أو مكرر أو غير متاح فعليًا.</li>
              <li>
                6. التواصل والدفع يتم مباشرة بين الضيف وصاحب العقار، والمنصة
                مسؤولة عن عرض العقارات وتسهيل الطلبات فقط.
              </li>
              <li>
                7. إضافة العقارات مجانية حاليًا خلال فترة الإطلاق الأولى للموقع.
              </li>
            </ul>
          </div>

          <button className="mt-8 w-full rounded-2xl bg-[#3FAF9B] py-4 text-lg font-semibold text-white transition hover:bg-[#25695A]">
            إرسال العقار للمراجعة
          </button>
        </div>
      </div>
    </main>
  );
}