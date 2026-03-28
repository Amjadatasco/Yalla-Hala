export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-right">
          <h1 className="text-4xl font-extrabold text-[#111827] md:text-5xl">
            من نحن
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#6B7280]">
            Yalla Hala منصة تهدف إلى تسهيل العثور على مكان إقامة مناسب داخل
            سوريا بطريقة واضحة ومريحة.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-[28px] border border-[#E5E7EB] bg-white p-7 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#111827]">
              فكرة المنصة
            </h2>
            <p className="leading-8 text-[#4B5563]">
              نعمل على جمع العقارات القصيرة الإقامة في مكان واحد، بحيث يستطيع
              الزائر البحث بسهولة بين الشقق والفيلات والمزارع والغرف والشاليهات،
              ثم إرسال طلب الحجز مباشرة لصاحب العقار.
            </p>
          </section>

          <section className="rounded-[28px] border border-[#E5E7EB] bg-white p-7 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#111827]">
              ماذا نوفر؟
            </h2>
            <ul className="space-y-3 leading-8 text-[#4B5563]">
              <li>• عرض عقارات قصيرة الإقامة بشكل منظم وواضح.</li>
              <li>• تجربة بحث سهلة ومريحة للمستخدم.</li>
              <li>• مساحة لأصحاب العقارات لعرض ممتلكاتهم بشكل احترافي.</li>
              <li>• تواصل مباشر بين الضيف وصاحب العقار.</li>
            </ul>
          </section>

          <section className="rounded-[28px] border border-[#E5E7EB] bg-white p-7 shadow-sm md:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-[#111827]">
              تواصل معنا
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#E5E7EB] p-4">
                <h3 className="mb-2 font-bold text-[#111827]">البريد الإلكتروني</h3>
                <p className="text-[#6B7280]">contact@yallahala.com</p>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] p-4">
                <h3 className="mb-2 font-bold text-[#111827]">واتساب</h3>
                <p className="text-[#6B7280]">أضف رقم الواتساب الخاص بك هنا</p>
              </div>
            </div>

            <p className="mt-5 leading-8 text-[#4B5563]">
              لأي استفسار أو رغبة بإضافة عقار أو التعاون معنا، يمكنك التواصل
              معنا عبر البريد الإلكتروني أو الواتساب.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}