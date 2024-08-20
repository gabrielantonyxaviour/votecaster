import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://pfzduyajlzitexjmkofk.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface InsertData {
  question: string;
  fid: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  is_anon: boolean;
  validity: number;
  theme: number;
  farcaster_username: string;
}

export const insertData = async (data: InsertData): Promise<number | null> => {
  try {
    if (supabaseUrl === "" || supabaseKey === "") {
      throw new Error("Supabase URL and Key not set in ENV file");
    }

    const { data: insertedData, error } = await supabase
      .from("polls")
      .insert([data])
      .select();

    if (error) {
      throw error;
    }

    if (insertedData && insertedData.length > 0) {
      const insertedId = insertedData[0].id; // Assuming 'id' is the name of the ID field
      console.log("Data inserted successfully:", insertedId);
      return insertedId;
    } else {
      throw new Error("No data returned after insert");
    }
  } catch (error: any) {
    console.error("Error inserting data:", error.message);
    return null;
  }
};

export type FetchedData = {
  op1: string;
  op2: string;
  op3: string;
  op4: string;
  question: string;
  theme: number;
};
export async function fetchEntryById(id: number): Promise<FetchedData | null> {
  const { data, error } = await supabase
    .from("polls") // Replace 'polls' with your table name
    .select("question, option_a, option_b, option_c, option_d, theme")
    .eq("id", id)
    .single();
  console.log(data);
  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  if (data) {
    return {
      op1: data.option_a,
      op2: data.option_b,
      op3: data.option_c,
      op4: data.option_d,
      question: data.question,
      theme: data.theme, // Add the missing 'theme' property
    };
  }

  return null;
}
