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
      .from("polls")
      .select("*")
      .eq("poll_id", pollId);

    console.log(fetchedVotes);

    if (fetchError || fetchedVotes == null || fetchedVotes.length === 0) {
      return {
        message: "Votes does not exist",
        response: null,
      };
    } else {
      const votes = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
      };
      fetchedVotes.forEach((vote: any) => {
        if (vote.vote === 0) {
          votes.a++;
        } else if (vote.vote === 1) {
          votes.b++;
        } else if (vote.vote === 2) {
          votes.c++;
        } else if (vote.vote === 3) {
          votes.d++;
        }
      });
      return {
        message: "Success",
        response: votes,
      };
    }
  } catch (error) {
    console.error("Error getting votes:", error);
    return { message: "Internal Server Error", response: null };
  }
}
