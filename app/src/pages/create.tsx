import Navbar from "@/components/Navbar";
import React from "react";

export default function CreatePage() {
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <Navbar />
      <div className="flex justify-between h-full w-full">
        <div className="py-3  h-full w-[60%]">
          <div className=" h-full bg-[#FBF6FF] rounded-xl"></div>
        </div>
        <div className="flex flex-col justify-between w-[39%] h-full py-3">
          <div className="h-[65%] w-full bg-[#FBF6FF] rounded-xl"></div>
          <div className="h-[33%] w-full bg-[#FBF6FF] rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
