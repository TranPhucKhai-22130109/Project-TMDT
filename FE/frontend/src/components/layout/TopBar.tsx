import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-zinc-800 text-white text-xs py-2 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>Get free delivery on orders over $80</div>
        <div className="flex space-x-4 items-center">
          <Link href="#" className="hover:text-zinc-300">Welcome Back Admin</Link>
          <span className="text-zinc-500">|</span>
          <Link href="#" className="hover:text-zinc-300">Admin</Link>
        </div>
      </div>
    </div>
  );
}
