import { Poll } from "@/utils/types";

export default function PollCreatedPage({
  pollId,
  poll,
  setStep,
}: {
  pollId: string;
  poll: Poll;
  setStep: (step: number) => void;
}) {
  return <div className=""></div>;
}
