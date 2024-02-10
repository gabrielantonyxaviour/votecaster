import { useRouter } from "next/router";
import Button from "./Button";
import { useProfile } from "@farcaster/auth-kit";
import { useEffect } from "react";

export default function YourPolls() {
  const polls = [];
  const router = useRouter();
  const {
    isAuthenticated,
    profile: { username, fid, bio, displayName, pfpUrl },
  } = useProfile();
  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    console.log("username", username);
    if (!isAuthenticated) router.push("/");
  }, []);
  return (
    <div className="w-full rounded-xl bg-[#FBF6FF] text-[#450C63] px-14 h-full    pt-10   mt-4 ">
      <p className="text-3xl font-bold">My Polls</p>

      {polls.length === 0 && (
        <div className="flex flex-col justify-center h-full items-center">
          <p className="font-semibold text-lg mb-2">You have no polls yet 😈</p>
          <Button
            text="Create a poll"
            click={() => {
              router.push("/create");
            }}
          ></Button>
        </div>
      )}
    </div>
  );
}
