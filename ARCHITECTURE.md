# LegalEase AI - System Architecture

This document outlines the architecture and data flow of the LegalEase AI platform. It emphasizes our secure, local-embedding strategy and the Retrieval-Augmented Generation (RAG) pipeline utilizing Supabase and Claude 3.

## Data Flow Diagram

```mermaid
graph TD
    %% Entities
    User([User / Lawyer])
    
    %% Frontend
    subgraph Frontend [Client-Side Next.js]
        UI[Glassmorphism UI Dashboard]
    end

    %% Backend Serverless
    subgraph Backend [Server-Side Next.js Edge / API]
        API[POST /api/analyze Route]
        Parser[Document Parsers: pdf-parse & mammoth]
        Embeddings[Local Vector Embeddings: all-MiniLM-L6-v2]
        Langchain[LangChain / LlamaIndex Orchestration]
    end

    %% External Services
    subgraph External [External Services & Databases]
        Supabase[(Supabase pgvector Database)]
        Claude[Anthropic Claude 3 Haiku LLM]
    end

    %% Data Flow
    User -.->|1. Drag & Drop PDF / DOCX| UI
    UI -->|2. Form Data Upload| API
    
    API -->|3. Extract Raw Text| Parser
    Parser -->|4. Return Extracted Text| API
    
    API -->|5. Chunk Text & Embed| Embeddings
    Embeddings -->|6. Return 384-dim Vectors| API
    
    API -->|7. Store & Search Similarity| Supabase
    Supabase -->|8. Return Top K Matches| API
    
    API -->|9. Build RAG Prompt| Langchain
    Langchain -->|10. Execute Prompt + Context| Claude
    Claude -->|11. Return JSON Risk Analysis| Langchain
    Langchain -->|12. Return Formatted Data| API
    
    API -->|13. Respond with Analysis| UI
    UI -.->|14. Render Interactive Risk Cards| User

    %% Styling
    classDef frontend fill:#1e1e2d,stroke:#833cf6,stroke-width:2px,color:#fff;
    classDef backend fill:#1e1e2d,stroke:#00d4ff,stroke-width:2px,color:#fff;
    classDef external fill:#1e1e2d,stroke:#f59e0b,stroke-width:2px,color:#fff;
    
    class UI frontend;
    class API,Parser,Embeddings,Langchain backend;
    class Supabase,Claude external;
```

## Component Roles

1. **Frontend UI**: Handles drag-and-drop mechanics exclusively. Validates document types natively before passing a secure FormData object buffer to the API layer.
2. **API Layer (`/api/analyze`)**: Acts as the central security and orchestration junction. Keys are securely read on the server side ensuring no exposure. 
3. **Document Parsers**: Convert unstructured buffer data into structured Raw Strings.
4. **Local Embeddings**: Converts string content into heavy 384-dimensional mathematical arrays without incurring OpenAI or remote-call latencies or costs via Transformers.js.
5. **Supabase Database**: Uses Postgres Vector indexing (`pgvector`) to rapidly calculate Nearest Neighbor distance, effectively cross-referencing global context.
6. **Claude 3 Haiku**: Examines the document chunks alongside standard precedent clauses to produce high-fidelity, highly precise JSON responses classifying risk logic.
