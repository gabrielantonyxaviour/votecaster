import React from "react";

export default function Navbar() {
  return (
    <div className="flex justify-between p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">Farcaster</div>
      <div className="flex space-x-4">
        <a href="#" className="hover:underline">
          Home
        </a>
        <a href="#" className="hover:underline">
          About
        </a>
        <a href="#" className="hover:underline">
          Contact
        </a>
      </div>
    </div>
  );
}
