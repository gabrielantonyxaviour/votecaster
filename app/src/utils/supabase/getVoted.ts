import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function getVoted(req: {
  pollId: string;
  nullifier: string;
}): Promise<{ message: string; response: any }> {
  const { pollId, nullifier } = req;

  try {
    const { data: fetchedVote, error: fetchError } = await supabase
      .from("votes_secret")
      .select("*")
      .eq("poll_id", pollId)
      .eq("nullifier", nullifier);

    console.log(fetchedVote);
    if (fetchError || fetchedVote == null || fetchedVote.length === 0) {
      return {
        message: "Not Voted",
        response: false,
      };
    } else {
      return {
        message: "Already voted",
        response: true,
      };
    }
  } catch (error) {
    console.error("Error voting:", error);
    return { message: "Internal Server Error", response: null };
  }
}
