import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function DurationDropdown({
  selectedOption,
  options,
  setOption,
}: {
  selectedOption: string;
  options: string[];
  setOption: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="bg-[#4A0C63] rounded-sm w-[20%]">
      <div
        className={`relative -translate-y-1 -translate-x-1 inline-block text-left w-full bg-white border-2 rounded-sm border-[#3C3C3C] `}
      >
        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={toggleDropdown}
            className="inline-flex justify-between w-full rounded-md shadow-sm px-3 py-2 text-xs font-medium text-[#4A0C63] focus:outline-none "
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
          >
            <p className="font-semibold text-xs">{selectedOption}</p>
            <FontAwesomeIcon
              icon={isOpen ? faChevronUp : faChevronDown}
              className="my-auto ml-2 "
            />
          </button>
        </div>

        {isOpen && (
          <div
            className={`absolute left-0 bottom-8 w-full  shadow-lg `}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div
              className="border border-t-[3px] border-x-[3px] rounded-t-sm border-[#4A0C63] flex flex-col"
              role="none"
            >
              {options.map((option: string, index: number) => (
                <a
                  href="#"
                  key={index}
                  onClick={() => {
                    setIsOpen(false);
                    setOption(option);
                  }}
                  className={`block px-3 py-2 text-xs text-white font-semibold bg-[#8A08BF] hover:text-gray-900 ${
                    index == 0 && "rounded-t-xs"
                  }`}
                  role="menuitem"
                >
                  {option}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
