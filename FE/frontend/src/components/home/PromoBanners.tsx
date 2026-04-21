import Image from "next/image";

export default function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col gap-6">
      {/* Top Large Banner */}
      <div className="bg-[#f8fafc] rounded-[24px] p-8 md:p-14 relative overflow-hidden flex flex-col justify-center min-h-[420px] w-[1128px]">
        <div className="z-10 max-w-[55%]">
          <p className="text-slate-600 text-lg font-medium mb-3">
            Apple iPhone 14 Plus
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e293b] mb-4 tracking-tight">
            UP TO 30% OFF
          </h2>
          <p className="text-slate-500 text-base mb-8 leading-relaxed max-w-md">
            iPhone 14 has the same superspeedy chip that's in iPhone 13 Pro, A15
            Bionic, with a 5-core GPU, powers all the latest features.
          </p>
          <button className="bg-[#3b82f6] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition shadow-sm">
            Purchase Now
          </button>
        </div>

        <div className="absolute right-0 bottom-0 h-full w-[45%] flex items-end justify-end">
          <div className="relative w-full h-[110%] bottom-[-5%] right-[5%]">
            <Image
              src="/images/promo/promo-01.png"
              alt="iPhone 14"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom Row Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left small banner */}
        <div className="bg-[#f8fafc] rounded-[24px] p-8 md:p-10 flex items-center justify-between relative overflow-hidden min-h-[280px]">
          <div className="z-10 max-w-[60%]">
            <h3 className="text-base font-medium text-slate-600 mb-2">
              Foldable Motorised Treadmill
            </h3>
            <h2 className="text-3xl font-bold text-[#1e293b] mb-3">
              Workout At Home
            </h2>
            <p className="text-[#3b82f6] font-medium text-base mb-8">
              Flat 20% off
            </p>
            <button className="bg-[#1e293b] text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-slate-700 transition shadow-sm">
              Grab the deal
            </button>
          </div>
          <div className="absolute right-0 bottom-0 h-full w-[45%] flex items-center justify-end">
            <div className="relative w-[120%] h-[90%] right-[10%]">
              <Image
                src="/images/promo/promo-02.png"
                alt="Treadmill"
                fill
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>

        {/* Right small banner */}
        <div className="bg-[#f8fafc] rounded-[24px] p-8 md:p-10 flex items-center justify-between relative overflow-hidden min-h-[280px]">
          <div className="z-10 max-w-[60%]">
            <h3 className="text-base font-medium text-slate-600 mb-2">
              Apple Watch Ultra
            </h3>
            <h2 className="text-3xl font-bold text-[#1e293b] mb-3">
              Up to 40% off
            </h2>
            <p className="text-slate-500 text-sm mb-8 max-w-[220px] leading-relaxed">
              The aerospace-grade titanium case strikes the perfect balance of
              everything.
            </p>
            <button className="bg-[#1e293b] text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-slate-700 transition shadow-sm">
              Grab the deal
            </button>
          </div>
          <div className="absolute right-0 bottom-0 h-full w-[45%] flex items-center justify-end">
            <div className="relative w-[110%] h-[85%] right-[5%]">
              <Image
                src="/images/promo/promo-03.png"
                alt="Apple Watch"
                fill
                className="object-contain object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
