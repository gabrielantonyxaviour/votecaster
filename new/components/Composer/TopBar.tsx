"use client";
import React from "react";
import Logo from "./Logo";
import FarcasterButton from "../Composer/FarcasterButton";
export default function TopBar() {
  return (
    <div className="flex justify-between w-full">
      <Logo />
      <FarcasterButton />
    </div>
  );
}