export default function Steps({ step }: { step: number }) {
  return (
    <div className="flex h-[7px] w-[80%] mx-auto border-2 border-[#450C63]">
      {Array.from({ length: step }).map((_, index) => (
        <div className={`w-[25%] space-x-2  bg-[#450C63] `}></div>
      ))}
    </div>
  );
}
