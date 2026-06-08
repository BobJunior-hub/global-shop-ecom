const STEPS = [
  {
    number: "01",
    title: "Ko'rish va kashf qilish",
    description: "Kategoriya va narx bo'yicha minglab mahsulotlarni o'rganing — oziq-ovqat, elektronika, maishiy va boshqalar.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Savatga qo'shish",
    description: "Kerakli mahsulot va miqdorni tanlang, so'ng bir tugma bilan savatga qo'shing.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Tez yetkazib berish",
    description: "Buyurtmangizni xavfsiz rasmiylashtiring va mahsulotlaringizni tez va qulay tarzda qabul qiling.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
];

export const HowItWorks = () => {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 py-16 border-t border-zinc-100">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Oddiy jarayon</span>
        <h2 className="mt-2 text-2xl font-bold text-zinc-900">Qanday ishlaydi</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
        {/* Connecting line (desktop) */}
        <div className="hidden sm:block absolute top-10 left-1/6 right-1/6 h-px bg-zinc-200 z-0" />

        {STEPS.map((step) => (
          <div key={step.number} className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 text-white shadow-lg">
              {step.icon}
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-400 tracking-widest">{step.number}</span>
              <h3 className="text-base font-bold text-zinc-900 mt-1">{step.title}</h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
