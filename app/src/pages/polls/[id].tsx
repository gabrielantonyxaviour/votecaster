import Button from "@/components/Button";
import SelectableButton from "@/components/SelectableButton";
import { LogInWithAnonAadhaar } from "@anon-aadhaar/react";
import {
  AuthKitProvider,
  SignInButton,
  StatusAPIResponse,
  useProfile,
} from "@farcaster/auth-kit";
import { getCsrfToken, signIn, signOut } from "next-auth/react";
import React, { useCallback, useState } from "react";
const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://example.com/login",
  domain: "example.com",
};
export default function PollPage() {
  const [poll, setPoll] = useState<any>({
    question: "WHICH TEAM IS WINNING LA LIGA?",
    options: ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla"],
    selectedOption: 0,
  });

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
      console.log("Login Success");
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
  return (
    <AuthKitProvider config={config}>
      <div className="max-w-[1200px] mx-auto h-screen py-8">
        <div className="flex justify-between pb-12">
          <p className="text-3xl font-bold ">PRIV.CAST</p>
          <SignInButton
            nonce={getNonce}
            onSuccess={handleSuccess}
            onError={() => {
              console.log("error");
            }}
            onSignOut={() => signOut()}
          />
        </div>
        <div className="flex justify-between h-full">
          <div className="w-[60%] h-full bg-[#FBF6FF]">
            {isAuthenticated ? (
              <div className="flex flex-col h-full p-12">
                <p className="text-[#450C63] font-bold text-5xl">
                  {poll.question}
                </p>
                <div className="flex justify-between space-x-8 pt-12">
                  <div className="flex-1">
                    {poll.options.length > 0 && (
                      <Button text={poll.options[0]} click={() => {}} />
                    )}
                  </div>

                  <div className="flex-1">
                    {poll.options.length > 1 && (
                      <Button text={poll.options[1]} click={() => {}} />
                    )}
                  </div>
                </div>
                <div className="flex justify-between space-x-8 mt-4">
                  <div className="flex-1">
                    {poll.options.length > 2 && (
                      <Button text={poll.options[2]} click={() => {}} />
                    )}
                  </div>

                  <div className="flex-1">
                    {poll.options.length > 3 && (
                      <Button text={poll.options[3]} click={() => {}} />
                    )}
                  </div>
                </div>
                <div className="flex-1 h-full flex flex-col space-y-4 justify-center items-center">
                  <p className="text-xl font-semibold text-[#450C63] pt-12">
                    AADHAR VERIFICATION
                  </p>
                  <div className="pb-12">
                    <LogInWithAnonAadhaar />
                  </div>
                  <SelectableButton
                    text="🗳️ Cast Vote"
                    isSelected={false}
                    disabled={false}
                    click={() => {}}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-[#450C63] font-semibold text-xl">
                  Sign in to farcaster to vote on the poll 🚀
                </p>
              </div>
            )}
          </div>
          <div className="h-[80%]  bg-[#FBF6FF] w-[35%] my-auto p-12">
            <p className="text-[#450C63] font-bold text-3xl text-center">
              LOGS
            </p>
          </div>
        </div>
      </div>
    </AuthKitProvider>
  );
}
