import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function getPollsByCreator(req: {
  creator: string;
}): Promise<{ message: string; response: any }> {
  const { creator } = req;
  try {
    const { data: fetchedPolls, error: fetchError } = await supabase
      .from("polls_secret")
      .select("*")
      .eq("creator", creator);

    console.log(fetchedPolls);

    if (fetchError || fetchedPolls == null || fetchedPolls.length === 0) {
      return {
        message: "No Polls created yet",
        response: null,
      };
    } else {
      return {
        message: "Success",
        response: fetchedPolls,
      };
    }
  } catch (error) {
    console.error("Error getting polls:", error);
    return { message: "Internal Server Error", response: null };
  }
}
