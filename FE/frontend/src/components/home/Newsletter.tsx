export default function Newsletter() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 mb-12">
      <div className="bg-blue-600 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="text-white md:w-1/2">
          <h2 className="text-3xl font-bold mb-2">Don't Miss Out Latest Trends & Offers</h2>
          <p className="text-blue-100 text-sm">
            Register to receive news about the latest offers & discount codes
          </p>
        </div>
        
        <div className="w-full md:w-1/2 max-w-md">
          <form className="flex w-full bg-white rounded-md p-1">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 outline-none text-zinc-800 text-sm"
              required
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
