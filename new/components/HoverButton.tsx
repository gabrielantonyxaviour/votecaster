export default function HoverButton({
  disabled,
  click,
  text,
}: {
  disabled: boolean;
  click: () => void;
  text: string;
}) {
  return (
    <div
      className={`${
        disabled ? "bg-[#828282]" : "bg-[#4A0C63] hover:bg-[#8A08BF] "
      } rounded-sm text-center select-none`}
    >
      <div
        className={`${
          disabled
            ? "bg-[#545454] text-white"
            : "hover:bg-white hover:text-[#450C63] bg-[#8A08BF] text-white"
        } -translate-y-1 -translate-x-1 rounded-sm border-2 ${
          disabled
            ? "border-[#545454]"
            : "border-[#4A0C63] hover:border-[#8A08BF]"
        } cursor-pointer`}
        onClick={() => {
          console.log("clicked");
          click();
        }}
      >
        <p className=" text-xs font-semibold mx-4 my-2">{text}</p>
      </div>
    </div>
  );
}
