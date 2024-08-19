export default function Steps({ step }: { step: number }) {
  return (
    <div className="flex  justify-between  w-[80%] mx-auto">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className={`w-[30%] h-[8px] ${
            index < step ? "bg-[#450C63]" : "bg-transparent"
          }    border-2 border-[#450C63] rounded-b-lg`}
        ></div>
      ))}
    </div>
  );
}
