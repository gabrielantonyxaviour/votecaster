import React, { useState } from "react";
import Button from "@/components/Button";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Landing() {
  const [error, setError] = useState(false);
  const router = useRouter();
  const hero = "PRIVACY PRESERVED, SYBIL RESISTANT POLLS NOW IN FARCASTER.";
  const content =
    "Cast polls in farcaster where the users can vote without revealing their identity. The sybil resistant polls ensure that the polls are not manipulated by fake votes.";
  return (
    <div className="px-3 h-screen">
      <div className="w-full bg-[#FBF6FF] text-[#450C63] px-10 pt-10 h-full  ">
        <div className="flex flex-col space-y-4 justify-between items-center ">
          <p className="text-2xl text-center font-semibold">{hero}</p>
          <p className="text-xl">{content}</p>
          <div className="flex">
            <Button
              text="Connect Wallet"
              click={() => {
                router.push("/polls");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
