import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY
});

export { client };



