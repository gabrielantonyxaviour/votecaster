import Navbar from "@/components/WebPage/Navbar";
import YourPolls from "@/components/WebPage/YourPolls";

export default function PollsPage() {
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <Navbar />
      <YourPolls />
    </div>
  );
}
