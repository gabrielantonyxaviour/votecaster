import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function getPoll(req: {
  pollId: string;
}): Promise<{ message: string; response: any }> {
  const { pollId } = req;
  try {
    const { data: fetchedPoll, error: fetchError } = await supabase
      .from("polls_secret")
      .select("*")
      .eq("id", pollId);

    console.log(fetchedPoll);

    if (fetchError || fetchedPoll == null || fetchedPoll.length === 0) {
      return {
        message: "Poll does not exist",
        response: null,
      };
    } else {
      return {
        message: "Success",
        response: fetchedPoll[0],
      };
    }
  } catch (error) {
    console.error("Error getting poll:", error);
    return { message: "Internal Server Error", response: null };
  }
}
