import MistralClient from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const prompt = `
Create a product for an ecommerce app with the following data:
name: the product name, 50 characters maximum.
description: 500 characters maximum description of the product.
price: any price between 0.1 and 10000, can have two trailing decimals.
imagePrompt: a detailed description of the image that will be used as a prompt for AI image generator.

output the following data in json format
`;

const chatResponse = await client.chat({
  model: "mistral-tiny",
  messages: [{ role: "user", content: prompt }],
});

console.log("Chat:", chatResponse.choices[0].message.content);
