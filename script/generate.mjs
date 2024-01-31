import MistralClient from "@mistralai/mistralai";
import { OpenAI } from "openai";
import z from "zod";

const schema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imagePrompt: z.string(),
});

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const prompt = `
Create a product for an ecommerce app for 'DIY and Hardware Tools' category  with the following data:
name: the product name, 50 characters maximum.
description: 500 characters maximum description of the product.
price: any price between 0.1 and 10000, can have two trailing decimals.
imagePrompt: a detailed description of the image that will be used as a prompt for AI image generator. use vaporwave art style.

output the following data in json format
`;

const chatResponse = await client.chat({
  model: "mistral-tiny",
  messages: [{ role: "user", content: prompt }],
});

const data = schema.parse(JSON.parse(chatResponse.choices[0].message.content));
console.log("Chat:", data);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const image = await openai.images.generate({
  model: "dall-e-3",
  prompt: data.imagePrompt,
  n: 1,
  quality: "standard",
  size: "1024x1024",
});

console.log("image data", image.data[0]);
