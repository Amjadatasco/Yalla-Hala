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
  "غرفة فندقية",
  "جناح مفروش",
  "سكن طلاب",
  "محل",
  "مكتب",
  "مستودع",
];

export default function AddPropertyPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EE] px-6 py-12" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="text-right mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2F3A36] mb-3">
            أضف عقارك
          </h1>
          <p className="text-[#7B7B73] text-lg leading-8">
            املأ المعلومات التالية بشكل واضح حتى يتمكن الزائر من فهم العقار
            ومعرفة تفاصيله بسهولة قبل إرسال طلب الحجز.
          </p>
        </div>

        <div className="bg-white border border-[#D8D2C8] rounded-[32px] p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-5">
            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="اسم صاحب العقار" />
            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="رقم الهاتف" />

            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="البريد الإلكتروني" />
            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="اسم العقار أو عنوان مختصر له" />

            <select className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]">
              <option>اختر نوع العقار</option>
              {propertyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]">
              <option>اختر المحافظة</option>
              {governorates.map((gov) => (
                <option key={gov}>{gov}</option>
              ))}
            </select>

            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="المدينة أو المنطقة" />
            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="الحي أو الموقع التفصيلي" />

            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="السعر لليلة أو لليوم" />
            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="الحد الأدنى لمدة الإقامة" />

            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="عدد الغرف" />
            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="عدد الأسرّة" />

            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="عدد الحمامات" />
            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="عدد الضيوف المسموح" />

            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="مساحة العقار بالمتر" />
            <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="الطابق" />
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-5">
            <textarea
              className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8] min-h-[140px]"
              placeholder="وصف تفصيلي للعقار"
            />
            <textarea
              className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8] min-h-[140px]"
              placeholder="اذكر التجهيزات المتوفرة: مكيف، إنترنت، موقف سيارة، مطبخ، غسالة، تدفئة..."
            />
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-5">
            <textarea
              className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8] min-h-[120px]"
              placeholder="اذكر الشروط أو الملاحظات المهمة للضيف"
            />
            <textarea
              className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8] min-h-[120px]"
              placeholder="ضع روابط الصور أو معلومات إضافية عن الصور"
            />
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold text-[#2F3A36] mb-4 text-right">
              أسئلة توضيحية مهمة
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="هل العقار متاح يوميًا أم في أوقات محددة؟" />
              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="هل يوجد حجز عائلي فقط أو للجميع؟" />

              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="هل يسمح بالحيوانات الأليفة؟" />
              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="هل يوجد كهرباء ومياه بشكل جيد؟" />

              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="هل يوجد مولدة أو طاقة بديلة؟" />
              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="هل يوجد موقف سيارة؟" />

              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="هل يوجد حراسة أو أمان إضافي؟" />
              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="هل يوجد إنترنت؟ وما سرعته؟" />

              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="هل السعر يشمل كل الخدمات؟" />
              <input className="border border-[#D8D2C8] rounded-2xl px-4 py-3 bg-[#FCFBF8]" placeholder="ما أوقات تسجيل الدخول والخروج؟" />
            </div>
          </div>

          <button className="w-full mt-8 bg-[#7A9E9F] hover:bg-[#6C8F90] text-white py-4 rounded-2xl text-lg font-semibold transition">
            إرسال العقار للمراجعة
          </button>
        </div>
      </div>
    </main>
  );
}