import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const FEEDBACKS = [
  {
    id: 1,
    name: "Wilson Dias",
    role: "Backend Developer",
    content: "Lorem ipsum dolor sit amet, adipiscing elit. Donec malesuada justo vitaeeaugue suscipit beautiful vehicula",
    avatar: "https://placehold.co/100x100/e2e8f0/64748b?text=W",
  },
  {
    id: 2,
    name: "John Doe",
    role: "Frontend Developer",
    content: "Lorem ipsum dolor sit amet, adipiscing elit. Donec malesuada justo vitaeeaugue suscipit beautiful vehicula",
    avatar: "https://placehold.co/100x100/e2e8f0/64748b?text=J",
  },
  {
    id: 3,
    name: "Mark smith",
    role: "Full stack Developer",
    content: "Lorem ipsum dolor sit amet, adipiscing elit. Donec malesuada justo vitaeeaugue suscipit beautiful vehicula",
    avatar: "https://placehold.co/100x100/e2e8f0/64748b?text=M",
  },
];

export default function UserFeedbacks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">User Feedbacks</h2>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEEDBACKS.map((feedback) => (
          <div key={feedback.id} className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition">
            <div className="flex gap-1 text-yellow-400 mb-4">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current text-gray-200" />
            </div>
            <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
              {feedback.content}
            </p>
            <div className="flex items-center gap-3">
              <Image 
                src={feedback.avatar} 
                alt={feedback.name} 
                width={40} 
                height={40}
                className="rounded-full"
                unoptimized
              />
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">{feedback.name}</h4>
                <p className="text-xs text-zinc-500">{feedback.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
