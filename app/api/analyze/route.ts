import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/parsers";
import { analyzeLegalDocument } from "@/lib/analysis";
import { vectorStore } from "@/lib/ai"; // Supabase Vector store
import { Document } from "@langchain/core/documents";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split(".").pop() || "txt";

        // 1. Extract Text
        const text = await extractText(buffer, fileExtension);

        // 2. Vector Store (Optional but requested)
        // In a real app, you might want to chunk and store for future multi-doc queries
        const doc = new Document({
            pageContent: text,
            metadata: {
                fileName: file.name,
                uploadedAt: new Date().toISOString()
            },
        });

        // Attempting to add to vector store if Supabase is configured
        try {
            if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
                await vectorStore.addDocuments([doc]);
            }
        } catch (ve) {
            console.warn("Vector store update failed (likely missing config):", ve);
        }

        // 3. Analyze with Claude 3 Haiku
        // For single document analysis, we send the content (capped to reasonable length if needed)
        const analysis = await analyzeLegalDocument(text);

        return NextResponse.json({
            fileName: file.name,
            analysis,
        });
    } catch (error: any) {
        console.error("API Analysis Error:", error);
        return NextResponse.json({ error: error.message || "Failed to analyze document" }, { status: 500 });
    }
}
