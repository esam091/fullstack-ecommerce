import { db } from "@/server/db";
import { products } from "@/server/db/schema";

import { createReadStream, createWriteStream } from "fs";
import { promisify } from "util";
// import fetch from "node-fetch";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
import { pipeline as pipelineCallback } from "stream";

const MistralClient = (await import("@mistralai/mistralai")).default;
const { nanoid } = await import("nanoid");
const { OpenAI } = await import("openai");
const z = await import("zod");

const pipeline = promisify(pipelineCallback);

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImageToSupabase({
  imageUrl,
  bucketName,
  id,
}: {
  imageUrl: string;
  bucketName: string;
  id: string;
}) {
  const response = await fetch(imageUrl);
  if (!response.ok)
    throw new Error(`Failed to fetch image: ${response.statusText}`);

  const imageBuffer = await response.arrayBuffer();

  const imageStream = sharp(imageBuffer).resize(1024).webp();
  const tempPath = `/tmp/${id}.webp`;

  await pipeline(imageStream, createWriteStream(tempPath));

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`${id}.webp`, createReadStream(tempPath), {
      cacheControl: "3600",
      duplex: "half",
      contentType: "image/webp",
    });

  if (error) {
    throw new Error(`Failed to upload image to Supabase: ${error.message}`);
  }
}

const schema = z
  .object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    imagePrompt: z.string(),
    condition: z.union([z.literal("new"), z.literal("used")]),
    stock: z.number().int().nullish(),
  })
  .array();

async function main() {
  const apiKey = process.env.MISTRAL_API_KEY;

  const client = new MistralClient(apiKey);

  const artStyle = "forest floor, hyper realistic, relaxing";
  const category = "gardening, seeds, gardening tools, pots";
  const numberOfItems = 8;
  const categoryId = 5;
  const shopId = "DD136FLO3_M6MGPQ2PAOB";

  const prompt = `
Create a product for an ecommerce app for '${category}' category  with the following data:
name: the product name, 50 characters maximum.
description: description of the product. 450 characters maximum, not more.
price: any price between 0.1 and 10000, can have two trailing decimals.
imagePrompt: a detailed description of the image that will be used as a prompt for AI image generator. use ${artStyle} art style.
condition: randomly pick between 'new' and 'used'
stock: can be null or random integer between 3 and 100

I want you to generate ${numberOfItems} data in json array format, and nothing else.
`;

  const chatResponse = await client.chat({
    model: "mistral-tiny",
    messages: [{ role: "user", content: prompt }],
  });
  // console.log("response", chatResponse.choices[0]?.message.content);

  const items = schema.parse(
    JSON.parse(chatResponse.choices[0]?.message.content ?? ""),
  );
  // console.log("Chat:", items);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  for (const data of items) {
    console.log("data", data);

    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: data.imagePrompt,
      n: 1,
      quality: "standard",
      size: "1024x1024",
    });

    const imageResult = image.data[0];

    console.log("image data", imageResult);

    const id = nanoid();

    const bucketName = "kmprod";
    try {
      await uploadImageToSupabase({
        bucketName,
        imageUrl: imageResult?.url ?? "",
        id,
      });
      console.log(`Image uploaded to Supabase with key: ${id}`);
    } catch (error) {
      console.error("Error uploading image to Supabase:", error);
    }

    await db.insert(products).values({
      categoryId,
      id,
      shopId,
      price: data.price,
      image: id,
      condition: data.condition,
      name: data.name,
      description: data.description,
      stock: data.stock,
    });
  }

  process.exit(0);
}

await main();
