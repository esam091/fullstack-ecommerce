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

  const imageType = imageFile.type;
  const imageSize = imageFile.size;

  if (!imageType.startsWith("image/")) {
    return new Response(
      JSON.stringify({ error: "Uploaded file is not an image" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  if (imageSize > 1000000) {
    return new Response(
      JSON.stringify({ error: "Image size should not exceed 1MB" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  const fileName = crypto.randomUUID();

  const { error } = await supabase.storage
    .from("hc-images")
    .upload(fileName, imageFile);

  if (error) {
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ id: fileName }), {
    headers: { "Content-Type": "application/json" },
  });
}
