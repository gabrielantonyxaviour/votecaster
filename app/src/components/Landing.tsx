import React, { useState } from "react";
import Button from "./Button";

import Image from "next/image";
import { useRouter } from "next/router";

export default function Landing() {
  const [error, setError] = useState(false);
  const router = useRouter();
  const hero = "PRIVACY PRESERVED, SYBIL RESISTANT POLLS NOW IN FARCASTER.";
  const content =
    "Cast polls in farcaster where the users can vote without revealing their identity. The sybil resistant polls ensure that the polls are not manipulated by fake votes.";
  return (
    <div className="py-3">
      <div className="w-full rounded-xl bg-[#FDE2C4] text-[#BF080A] px-20 pt-20  ">
        <div className="flex">
          <div className="flex flex-col space-y-4 justify-between w-[50%] ">
            <p className="w-[90%] text-5xl font-semibold">{hero}</p>
            <p className="text-xl">{content}</p>
            <div className="flex ml-2">
              <Button
                text="Get Started"
                click={() => {
                  router.push("/polls");
                }}
              />
            </div>
          </div>
          <div className="w-[50%] flex flex-col justify-between">
            <Image
              src={"/hero.png"}
              width={350}
              height={350}
              alt="hero"
              className="mx-auto my-auto"
            />
          </div>
        </div>
        <p className="text-md text-center my-2 font-normal text-[#BF0808] pt-14 pb-4">
          Built with ❤️ by gabrielaxy.eth
        </p>
      </div>
    </div>
  );
}
