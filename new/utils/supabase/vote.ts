import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function vote(req: {
  pollId: string;
  nullifier: string;
  vote: number;
  isAnon: boolean;
  tx: string;
  fid: string;
}): Promise<{ message: string; response: any }> {
  const { pollId, vote, nullifier, isAnon, tx, fid } = req;

  try {
    if (isAnon) {
      const { data: fetchedVote, error: fetchError } = await supabase
        .from("votes")
        .select("*")
        .eq("poll_id", pollId)
        .eq("nullifier", nullifier);

      console.log(fetchedVote);
      if (fetchError || fetchedVote == null || fetchedVote.length === 0) {
        const { data, error } = supabase
          ? await supabase
              .from("votes")
              .insert([
                {
                  poll_id: pollId,
                  nullifier,
                  vote,
                  tx,
                  fid,
                },
              ])
              .select()
          : {
              data: null,
              error: new Error("Supabase client is not initialized"),
            };
        if (error) {
          console.log(error);

          return { message: "Error voting", response: error };
        }
        return {
          message: "Voted",
          response: data != null ? data[0] : "",
        };
      } else {
        return {
          message: "Already voted",
          response: fetchedVote[0],
        };
      }
    } else {
      const { data: fetchedVote, error: fetchError } = await supabase
        .from("votes")
        .select("*")
        .eq("poll_id", pollId);
      if (fetchError || fetchedVote == null || fetchedVote.length === 0) {
        const { data, error } = supabase
          ? await supabase
              .from("votes")
              .insert([
                {
                  poll_id: pollId,
                  nullifier,
                  vote,
                  tx,
                  fid,
                },
              ])
              .select()
          : {
              data: null,
              error: new Error("Supabase client is not initialized"),
            };
        if (error) {
          console.log(error);

          return { message: "Error voting", response: error };
        }
        return {
          message: "Voted",
          response: data != null ? data[0] : "",
        };
      } else {
        return {
          message: "Already voted",
          response: fetchedVote[0],
        };
      }
    }
  } catch (error) {
    console.error("Error voting:", error);
    return { message: "Internal Server Error", response: null };
  }
}
