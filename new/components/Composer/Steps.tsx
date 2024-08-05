export default function Steps({ step }: { step: number }) {
  return (
    <div className="flex h-[7px] w-[80%] mx-auto">
      {new Array(3).map((_, i) => (
        <div className="w-[100px] space-x-2 h-[7px] bg-white-500"></div>
      ))}
    </div>
  );
}
