import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Banner */}
      <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
        <div className="z-10 max-w-md">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-5xl font-bold text-blue-600">30%</h2>
            <div className="text-sm font-bold leading-tight">
              SALE
              <br />
              OFF
            </div>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">
            iPhone 16 Pro - 8/128GB
          </h1>
          <p className="text-zinc-600 text-sm mb-8">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the
          </p>
          <button className="bg-zinc-900 text-white px-8 py-3 rounded-md font-medium hover:bg-zinc-800 transition w-fit">
            Shop Now
          </button>
        </div>

        {/* Placeholder for the large image */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 lg:opacity-100 lg:w-[45%] flex items-center justify-end pr-8">
          <Image
            src="/images/products/product-2-bg-1.png"
            alt="Hero"
            width={400}
            height={400}
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Side Banners */}
      <div className="flex flex-col gap-6">
        {/* Top small banner */}
        <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-between flex-1 relative overflow-hidden">
          <div className="z-10 max-w-[60%]">
            <h3 className="font-bold text-lg text-zinc-900 mb-2">
              iPhone 16 Pro & 16 Pro Max
            </h3>
            <p className="text-[10px] font-bold text-zinc-500 mb-1">
              LIMITED TIME OFFER
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">$600</span>
              <span className="text-zinc-400 line-through text-sm">$898</span>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-0 w-[50%] h-[90%]">
            <Image
              src="/images/products/product-2-bg-1.png"
              alt="iPhone"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>

        {/* Bottom small banner */}
        <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-between flex-1 relative overflow-hidden">
          <div className="z-10 max-w-[60%]">
            <h3 className="font-bold text-lg text-zinc-900 mb-2">
              Macbook Pro M4
            </h3>
            <p className="text-[10px] font-bold text-zinc-500 mb-1">
              LIMITED TIME OFFER
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">$600</span>
              <span className="text-zinc-400 line-through text-sm">$699</span>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[10%] w-[55%] h-[80%]">
            <Image
              src="images/products/product-4-bg-1.png"
              alt="Macbook"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
