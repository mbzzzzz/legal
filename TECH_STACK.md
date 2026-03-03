# LegalEase AI - Technology Stack

LegalEase AI is built on a modern, high-performance tech stack designed to handle complex legal document analysis securely, cost-effectively, and rapidly. Below is a breakdown of every core technology used and the rationale behind its selection.

---

## 🎨 Frontend Ecosystem

### 1. Next.js 16 (App Router & Turbopack)
- **What it is:** The React framework for the web.
- **Why it's used:** Provides seamless Server-Side Rendering (SSR) and powerful API Routes (`/api/analyze`) required for securely processing sensitive documents and hiding API keys. We leverage the new App Router for optimal layout nesting and Turbopack for rapid development builds.

### 2. Tailwind CSS v4
- **What it is:** A utility-first CSS framework.
- **Why it's used:** Enables rapid, pixel-perfect implementation of our premium "Obsidian" UI. Tailwind makes complex styling like the deep dark themes (`#030305`), custom drop-shadows, and glassmorphism maintainable without bloating the CSS bundle.

### 3. Framer Motion
- **What it is:** Support library for high-end React animations.
- **Why it's used:** Responsible for the micro-animations, pulsing status indicators, and smooth staggered loading of the "Risk Cards." It elevates the perception of the system into a high-fidelity intelligence layer.

---

## 🧠 Artificial Intelligence & RAG Engine

### 4. Claude 3 Haiku (via Anthropic API)
- **What it is:** Anthropic’s fastest and most cost-effective vision-text model.
- **Why it's used:** Legal texts require high intelligence to understand nuances (loopholes, indemnity clauses). Haiku is incredibly fast, allowing us to perform deep, near-instantaneous cross-referencing and analysis, making the platform feel snappy and responsive.

### 5. Local Embeddings (Transformers.js)
- **What it is:** Machine learning models running locally via `@xenova/transformers`.
- **Why it's used:** Originally, vector embeddings depend on OpenAI's paid APIs. We migrated to a **100% free, local embedding model** (`all-MiniLM-L6-v2`). This runs within your server, completely bypassing embedding API costs and improving data privacy since document chunks are embedded locally.

### 6. LangChain & LlamaIndex
- **What it is:** Advanced frameworks for building context-aware reasoning applications.
- **Why it's used:** We use these orchestration libraries to chunk legal documents, convert them into vector embeddings, and build the context prompts sent to Claude. They simplify the complex RAG (Retrieval-Augmented Generation) pipeline.

---

## 🗄️ Database & Storage

### 7. Supabase Vector (`pgvector`)
- **What it is:** An open-source Firebase alternative powered by PostgreSQL.
- **Why it's used:** We utilize Supabase with the `pgvector` extension to store our 384-dimensional document embeddings. This allows us to perform lightning-fast mathematical similarity searches to find relevant legal clauses instantly.

---

## 🛠️ Data Processing & Utilities

### 8. `pdf-parse` & `mammoth`
- **What it is:** Node.js parsers for document formats.
- **Why it's used:** 
  - `pdf-parse`: Extracts raw text from complex legal PDFs. (Stabilized on version `1.1.1` to ensure compatibility with Next.js ESM modules).
  - `mammoth`: Securely converts `.docx` files to raw text while preserving necessary structural formatting.

### 9. Vercel (Deployment)
- **What it is:** A cloud platform for static and serverless deployment.
- **Why it's used:** Native capability to run Next.js edge functions. We use a custom `vercel.json` to enforce `--legacy-peer-deps` during installation, ensuring seamless building of complex AI dependency trees without conflict.
