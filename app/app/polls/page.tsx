import Navbar from "@/components/Navbar";
import YourPolls from "@/components/YourPolls";

export default function PollsPage() {
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <Navbar />
      <YourPolls />
    </div>
  );
}
