import { NextRequest, NextResponse } from "next/server";
import { vectorStore, model } from "@/lib/ai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, fileName } = body;

        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        const latestMessage = messages[messages.length - 1].content;

        // Retrieve relevant context from Supabase Vector Store
        let contextText = "";
        try {
            if (fileName && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
                // Similarity search based on text, searching within the specific file's embeddings
                const matchingDocs = await vectorStore.similaritySearch(latestMessage, 3, {
                    fileName: fileName
                });
                contextText = matchingDocs.map((doc: any) => doc.pageContent).join("\n\n---\n\n");
            }
        } catch (err) {
            console.warn("Similarity search failed or not configured", err);
        }

        // Construct System Prompt for Claude
        const systemPrompt = `You are a world-class legal assistant answering questions about a specific document.
Focus strictly on the provided context. Give short, precise, and highly structured answers. Do NOT use markdown bolding (**) or asterisks or complex styling. Use simple text styling, indentation, or newlines to structure answers. Do not output anything if the answer is not in the context.

DOCUMENT CONTEXT:
${contextText || "[No document context retrieved. The vector store might not be configured.]"}`;

        const chatResponse = await model.invoke([
            new SystemMessage(systemPrompt),
            ...messages.map((m: any) => new HumanMessage(m.content))
        ]);

        return NextResponse.json({
            response: chatResponse.content
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
    }
}
