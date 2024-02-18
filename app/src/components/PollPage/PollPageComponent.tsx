import ResultComponent from "./ResultComponent";
import VoteComponent from "./VoteComponent";

type PollProps = {
  setUseTestAadhaar: (state: boolean) => void;
  useTestAadhaar: boolean;
  id: string;
  result: boolean;
};

export default function PollPageComponent({
  id,
  result,
  setUseTestAadhaar,
  useTestAadhaar,
}: PollProps) {
  return result ? (
    <ResultComponent pollId={id} />
  ) : (
    <VoteComponent
      id={id}
      setUseTestAadhaar={setUseTestAadhaar}
      useTestAadhaar={useTestAadhaar}
    />
  );
}
