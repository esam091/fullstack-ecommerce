import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import fs from "fs";
import { pipeline as pipelineCallback } from "stream";
import { promisify } from "util";
import { auth } from "@clerk/nextjs";

const pipeline = promisify(pipelineCallback);

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  if (!auth().userId) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 400,
    });
  }

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

  if (!imageType.startsWith("image/")) {
    return new Response(
      JSON.stringify({ error: "Uploaded file is not an image" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  const fileName = crypto.randomUUID();
  const tempPath = `/tmp/${fileName}.webp`;
  const newImageStream = fs.createWriteStream(tempPath);

  const transform = sharp().resize(1024).webp();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await pipeline(imageFile.stream() as any, transform, newImageStream);
  newImageStream.close();

  const { error } = await supabase.storage
    .from("hc-images")
    .upload(fileName, fs.createReadStream(tempPath), {
      duplex: "half",
      contentType: "image/webp",
    });

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ id: fileName }), {
    headers: { "Content-Type": "application/json" },
  });
}
