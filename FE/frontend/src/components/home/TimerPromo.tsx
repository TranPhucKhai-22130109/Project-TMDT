import Image from "next/image";

export default function TimerPromo() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="bg-slate-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden min-h-[400px] w-[1128px]">
        <div className="z-10 max-w-md w-full md:w-1/2">
          <p className="text-blue-600 font-medium mb-2 text-sm">Don't Miss!!</p>
          <h2 className="text-4xl font-bold text-zinc-900 mb-4 leading-tight">
            Enhance Your Music Experience
          </h2>
          <p className="text-zinc-600 text-sm mb-8">
            MacBook Air M1 chip, 8/256GB
          </p>

          <div className="flex gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold shadow-sm text-zinc-900">
                06
              </div>
              <span className="text-xs text-zinc-500 mt-2">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold shadow-sm text-zinc-900">
                03
              </div>
              <span className="text-xs text-zinc-500 mt-2">Hours</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold shadow-sm text-zinc-900">
                44
              </div>
              <span className="text-xs text-zinc-500 mt-2">Minutes</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold shadow-sm text-zinc-900">
                00
              </div>
              <span className="text-xs text-zinc-500 mt-2">Seconds</span>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition">
            Check it Out!
          </button>
        </div>

        <div className="mt-8 md:mt-0 w-full md:w-1/2 flex justify-center md:justify-end relative h-64 md:h-[400px]">
          <Image
            src="/images/countdown/speaker.png"
            alt="Speaker Promo"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
