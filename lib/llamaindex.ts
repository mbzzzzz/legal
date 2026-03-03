import {
    Document,
    VectorStoreIndex,
    Settings
} from "llamaindex";
import { HuggingFaceEmbedding } from "@llamaindex/huggingface";

// Configure LlamaIndex to use free local embeddings (Transformers.js compatible)
Settings.embedModel = new HuggingFaceEmbedding({
    modelType: "Xenova/all-MiniLM-L6-v2",
});

/**
 * LlamaIndex setup for LegalEase AI.
 * Uses local embeddings for cost-effective analysis.
 */
export async function llamaindexAnalysis(text: string) {
    // Create a document for LlamaIndex
    const doc = new Document({ text });

    // Initialize index from the extracted document
    const index = await VectorStoreIndex.fromDocuments([doc]);

    // Custom query engine for specific legal risk detection
    const queryEngine = index.asQueryEngine();
    const response = await queryEngine.query({
        query: "Extract and analyze the most critical legal risks in the following document. Suggest counter-clauses.",
    });

    return response.toString();
}
