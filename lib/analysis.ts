import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export interface AnalysisResult {
    clauseTitle: string;
    originalText: string;
    riskDescription: string;
    riskLevel: "Low" | "Medium" | "High";
    suggestedCounterClause: string;
}

/**
 * Analyzes a legal document or document chunk for risky clauses.
 * @param text The document content.
 * @returns Array of risky clauses identified by Claude 3 Haiku.
 */
export async function analyzeLegalDocument(text: string): Promise<AnalysisResult[]> {
    const model = new ChatAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        modelName: "claude-3-haiku-20240307",
        temperature: 0, // Deterministic for structured analysis
    });

    const systemPrompt = `You are an elite legal AI analyst specializing in commercial and technology law. 
  Your task is to identify "risky" clauses that may harm the user (who is typically the weaker party or the service provider).
  Focus on:
  1. Indemnity
  2. Limitation of Liability
  3. Termination (unfair terms)
  4. Intellectual Property
  5. Governing Law/Dispute Resolution
  6. Non-Solicitation / Non-Compete
  7. Payment / Automatic Renewal

  Return your analysis ONLY in a structured JSON format:
  [
    {
      "clauseTitle": "Title of the Clause",
      "originalText": "The actual text of the clause from the document",
      "riskDescription": "Detailed explanation of why this is risky",
      "riskLevel": "Low | Medium | High",
      "suggestedCounterClause": "A more balanced or protective alternative text for this clause"
    }
  ]
  Analyze the text provided and return ONLY the JSON array. Do not include markdown or explanations.`;

    const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(`Analyze the following legal document text and identify up to 5 of the most critical risks:\n\n${text}`),
    ];

    try {
        const response = await model.invoke(messages);
        const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
        // Find JSON in response (sometimes LLMs might include ```json tags)
        const jsonMatch = content.match(/\[.*\]/s);
        if (!jsonMatch) return [];

        return JSON.parse(jsonMatch[0]) as AnalysisResult[];
    } catch (error) {
        console.error("Legal Analysis Error:", error);
        return [];
    }
}
