import React, { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import {
  SignInButton,
  StatusAPIResponse,
  useProfile,
  useSignIn,
} from "@farcaster/auth-kit";
import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import Image from "next/image";

export default function Landing() {
  const [error, setError] = useState(false);
  const {
    isAuthenticated,
    profile: { username, fid, bio, displayName, pfpUrl },
  } = useProfile();
  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    console.log("username", username);
  }, []);
  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");
    return nonce;
  }, []);

  const handleSuccess = useCallback(
    (res: StatusAPIResponse) => {
      signIn("credentials", {
        message: res.message,
        signature: res.signature,
        name: res.username,
        pfp: res.pfpUrl,
        redirect: false,
      });
    },
    [signIn]
  );
  const hero = "PRIVACY PRESERVED, SYBIL RESISTANT POLLS NOW IN FARCASTER.";
  const content =
    "Cast polls in farcaster where the users can vote without revealing their identity. The sybil resistant polls ensure that the polls are not manipulated by fake votes.";
  return (
    <div className="w-full rounded-xl bg-[#FBF6FF] text-[#450C63] px-20 pt-20   mt-4 ">
      <div className="flex">
        <div className="flex flex-col space-y-4 justify-between w-[50%] ">
          <p className="w-[90%] text-5xl font-semibold">{hero}</p>
          <p className="text-xl">{content}</p>
          <SignInButton
            nonce={getNonce}
            onSuccess={handleSuccess}
            onError={() => setError(true)}
            onSignOut={() => signOut()}
          />
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
      <p className="text-md text-center my-2 font-normal text-[#9508BF] my-14">
        Built with 💜 by gabrielaxy.eth
      </p>
    </div>
  );
}
