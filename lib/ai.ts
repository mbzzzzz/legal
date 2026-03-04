import { ChatAnthropic } from "@langchain/anthropic";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const client = createClient(supabaseUrl, supabaseKey);

// Define the model (Claude 3 Haiku)
export const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  modelName: "claude-3-haiku-20240307",
  temperature: 0.2, // Lower temperature for more consistent legal analysis
});

// Set local cache to /tmp for Vercel serverless compatibility
if (typeof process !== "undefined" && process.env) {
  process.env.TRANSFORMERS_CACHE = '/tmp';
}

// Free, local embeddings using Transformers.js (all-MiniLM-L6-v2)
export const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});

export const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
  queryName: "match_documents",
});
