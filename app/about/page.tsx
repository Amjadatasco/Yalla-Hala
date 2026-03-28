export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[32px] border border-[var(--brand-line)] bg-white p-6 shadow-lg md:p-8">
          <p className="text-sm text-[var(--brand-muted)]">من نحن</p>
          <h1 className="mt-2 text-3xl font-extrabold">من نحن</h1>

          <div className="mt-6 space-y-4 text-[15px] leading-8 text-[var(--brand-dark)]">
            <p>
              في سوريا اليوم، الطلب على السكن المؤقت عالي جدًا بينما الخيارات قليلة.
              من هنا جاءت فكرة يلا هلا: منصة بسيطة تمكن كل شخص من الاستفادة من
              عقاراته، سواء كانت شقة كاملة أو غرفة، بطريقة آمنة وموثوقة.
            </p>

            <p>
              نحن لا نقدم مجرد مكان للإقامة، بل تجربة مريحة ومرحب بها تشعرك وكأنك
              في بيتك. مع يلا هلا، تحصل على أماكن إقامة مجهزة بشكل مريح، خدمات
              شخصية، وأجواء دافئة تجعل إقامتك قصيرة أو طويلة تجربة ممتعة ولا تُنسى.
            </p>

            <p>
              هدفنا هو خلق فائدة للجميع: أصحاب العقارات يستفيدون، والمستأجرون يحصلون
              على تجربة إقامة مميزة وسهلة.
            </p>
          </div>
        </section>

        <section className="rounded-[32px] border border-[var(--brand-line)] bg-white p-6 shadow-lg md:p-8">
          <p className="text-sm text-[var(--brand-muted)]">تواصل معنا</p>
          <h2 className="mt-2 text-3xl font-extrabold">تواصل معنا</h2>

          <div className="mt-6 space-y-4 text-[15px] leading-8 text-[var(--brand-dark)]">
            <p>
              يلا هلا هنا لمساعدتك في أي أسئلة أو استفسارات قد تكون لديك. نحن ملتزمون
              بتقديم أفضل تجربة لك خلال إقامتك القصيرة في سوريا. سواء كنت بحاجة
              لمساعدة في الحجز، لديك طلبات خاصة، أو تحتاج لمعلومات إضافية، فنحن على
              بعد رسالة واحدة منك. راحتك هي أولويتنا، ونحن ملتزمون بضمان أن تكون
              إقامتك سلسة وممتعة.
            </p>

            <div className="rounded-2xl bg-[var(--brand-soft)] p-4">
              <p className="font-bold">للاستفسارات العامة ولمزيد من المعلومات</p>
              <p className="mt-2">يمكنكم التواصل معنا عبر البريد الإلكتروني:</p>
              <a
                href="mailto:yalla.hala@outlook.com"
                className="mt-2 inline-block font-bold text-[var(--brand-primary)]"
              >
                yalla.hala@outlook.com
              </a>
            </div>

            <a
              href="https://wa.me/963995688838?text=مرحبًا، لدي استفسار بخصوص Yalla Hala"
              target="_blank"
              className="inline-flex rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-primary-dark)]"
            >
              تواصل عبر واتساب
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}