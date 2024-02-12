import { useRouter } from "next/router";
import Button from "./Button";
import {
  SignInButton,
  StatusAPIResponse,
  useProfile,
} from "@farcaster/auth-kit";
import { useCallback, useEffect, useState } from "react";
import { getCsrfToken, signIn, signOut } from "next-auth/react";

export default function YourPolls() {
  const [error, setError] = useState(false);

  const polls = [];
  const router = useRouter();
  const {
    isAuthenticated,
    profile: { username, fid, bio, displayName, pfpUrl },
  } = useProfile();

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
  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    console.log("username", username);
    // if (!isAuthenticated) router.push("/");
  }, []);
  return (
    <div className="w-full rounded-xl bg-[#FBF6FF] text-[#450C63] px-14 h-full    pt-10   mt-4 ">
      <p className="text-3xl font-bold">My Polls</p>
      {isAuthenticated ? (
        polls.length === 0 ? (
          <div className="flex flex-col justify-center h-full items-center">
            <p className="font-semibold text-lg mb-2">
              You have no polls yet 😈
            </p>
            <Button
              text="Create a poll"
              click={() => {
                router.push("/create");
              }}
            ></Button>
          </div>
        ) : (
          <div>View Polls</div>
        )
      ) : (
        <div className="flex flex-col justify-center h-full items-center">
          <p className="font-semibold text-lg mb-2">
            Login to your farcaster account
          </p>
          <SignInButton
            nonce={getNonce}
            onSuccess={handleSuccess}
            onError={() => true}
            onSignOut={() => signOut()}
          />
        </div>
      )}
    </div>
  );
}
