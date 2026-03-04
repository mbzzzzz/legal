-- Enable pgvector extension
create extension if not exists vector;

-- Create documents table
create table if not exists documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(384) -- all-MiniLM-L6-v2 (local/free) is 384 dimensions
);

-- Note: Claude 3 embeddings via LangChain/Anthropic might differ. 
-- langchain-openai uses 1536. 
-- For Anthropic, often we use OpenAI embeddings or Voyage. 
-- If using Claude 3 Haiku for embeddings, it depends on the provider.
-- I'll assume standard 1536 or allow for generic dimensions.

create index on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Query function for vector similarity search
create or replace function match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  filter jsonb default '{}'
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
    and documents.metadata @> filter
  order by similarity desc
  limit match_count;
end;
$$;
