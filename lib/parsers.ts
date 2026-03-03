const pdf = require("pdf-parse/lib/pdf-parse.js");
import mammoth from "mammoth";

/**
 * Extracts text from a legal document.
 * @param buffer The document content in buffer form.
 * @param fileExtension The original file extension (pdf, docx, txt).
 * @returns The raw text from the document.
 */
export async function extractText(buffer: Buffer, fileExtension: string): Promise<string> {
    switch (fileExtension.toLowerCase()) {
        case "pdf":
            const pdfData = await pdf(buffer);
            return pdfData.text;
        case "docx":
            const docxData = await mammoth.extractRawText({ buffer });
            return docxData.value;
        case "txt":
            return buffer.toString("utf8");
        default:
            throw new Error(`Unsupported file extension: ${fileExtension}`);
    }
}

/**
 * Splits text into chunks for vector storage, keeping meaningful context.
 * In legal documents, this might be based on clauses or sections.
 * For now, using a standard character-based split for simplicity.
 */
export function splitText(text: string, chunkSize: number = 1000, chunkOverlap: number = 200): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
        let endIndex = startIndex + chunkSize;
        chunks.push(text.substring(startIndex, Math.min(endIndex, text.length)));
        startIndex = endIndex - chunkOverlap;
    }

    return chunks;
}
