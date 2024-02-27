import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function getVotes(req: {
  pollId: string;
}): Promise<{ message: string; response: any }> {
  const { pollId } = req;
  try {
    const { data: fetchedVotes, error: fetchError } = await supabase
      .from("votes_secret")
      .select("*")
      .eq("poll_id", pollId);

    console.log(fetchedVotes);

    if (fetchError || fetchedVotes == null || fetchedVotes.length === 0) {
      return {
        message: "Votes does not exist",
        response: null,
      };
    } else {
      const votes = [0, 0, 0, 0];
      let max = 0;
      fetchedVotes.forEach((vote: any) => {
        if (vote.vote === 0) {
          votes[0] = votes[0] + 1;
          if (max < votes[0]) max = votes[0];
        } else if (vote.vote === 1) {
          votes[1] = votes[1] + 1;
          if (max < votes[1]) max = votes[1];
        } else if (vote.vote === 2) {
          votes[2] = votes[2] + 1;
          if (max < votes[2]) max = votes[2];
        } else if (vote.vote === 3) {
          votes[3] = votes[3] + 1;
          if (max < votes[3]) max = votes[3];
        }
      });
      return {
        message: "Success",
        response: {
          votes,
          total: fetchedVotes.length == 0 ? 1 : fetchedVotes.length,
          maxVotes: max,
        },
      };
    }
  } catch (error) {
    console.error("Error getting votes:", error);
    return { message: "Internal Server Error", response: null };
  }
}
