import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function getVoted(req: {
  pollId: string;
  nullifier: string;
  fid: string;
}): Promise<{ message: string; response: any }> {
  const { pollId, nullifier, fid } = req;

  try {
    const { data: fetchedVoteByNullifer, error: fetchErrorByNullifer } =
      await supabase
        .from("votes")
        .select("*")
        .eq("poll_id", pollId)
        .eq("nullifier", nullifier);

    const { data: fetchedVoteByFid, error: fetchErrorByFid } = await supabase
      .from("votes")
      .select("*")
      .eq("poll_id", pollId)
      .eq("fid", fid);

    if (fetchedVoteByNullifer != null && fetchedVoteByNullifer.length > 0) {
      return {
        message: "Already voted",
        response: true,
      };
    } else if (fetchedVoteByFid != null && fetchedVoteByFid.length > 0) {
      return {
        message: "Already voted",
        response: true,
      };
    } else {
      return {
        message: "Not Voted",
        response: false,
      };
    }
  } catch (error) {
    console.error("Error voting:", error);
    return { message: "Internal Server Error", response: null };
  }
}
