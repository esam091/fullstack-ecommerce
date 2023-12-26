import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  const file = await request.formData();
  const imageFile = file.get("image");

  if (!imageFile || typeof imageFile !== "object") {
    return new Response(
      JSON.stringify({ error: "No image file found in the request" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  const { error } = await supabase.storage
    .from("hc-images")
    .upload(imageFile.name, imageFile);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Image uploaded successfully" }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
