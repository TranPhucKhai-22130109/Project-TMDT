import HeroSection from "@/components/home/HeroSection";
import CategoryBrowse from "@/components/home/CategoryBrowse";
import NewArrivals from "@/components/home/NewArrivals";
import PromoBanners from "@/components/home/PromoBanners";
import BestSelling from "@/components/home/BestSelling";
import TimerPromo from "@/components/home/TimerPromo";
import UserFeedbacks from "@/components/home/UserFeedbacks";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <CategoryBrowse />
      <NewArrivals />
      <PromoBanners />
      <BestSelling />
      <TimerPromo />
      <UserFeedbacks />
      <Newsletter />
    </div>
  );
}
