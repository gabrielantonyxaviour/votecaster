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
    <div className="bg-[#630C0C] rounded-sm w-[20%]">
      <div
        className={`relative -translate-y-1 -translate-x-1 inline-block text-left w-full bg-white border-2 rounded-sm border-[#3C3C3C] `}
      >
        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={toggleDropdown}
            className="inline-flex justify-between w-full rounded-md shadow-sm px-4 py-2  text-md font-medium text-[#4A0C63] focus:outline-none "
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
          >
            <p>{selectedOption}</p>
            <FontAwesomeIcon
              icon={isOpen ? faChevronUp : faChevronDown}
              className="my-auto "
            />
          </button>
        </div>

        {isOpen && (
          <div
            className={`origin-top-left absolute left-0  w-full rounded-b-lg shadow-lg bg-[#1E1A20] ring-1 ring-black ring-opacity-5 `}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              {options.map((option: string, index: number) => (
                <a
                  href="#"
                  key={index}
                  onClick={() => {
                    setIsOpen(false);
                    setOption(option);
                  }}
                  className="block px-4 py-2 text-md text-white hover:bg-[#DCAFFF] hover:text-gray-900"
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
