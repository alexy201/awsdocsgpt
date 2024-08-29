DROP FUNCTION mit_open_gpt_search(vector,float,integer);
create or replace function mit_open_gpt_search (
    query_embedding vector (1536),
    similarity_threshold float,
    match_count int,
    run_identifier text
)
returns table (
    content_title text,
    content_url text,
    content text,
    content_length bigint,
    content_tokens bigint,
    similarity float,
    run_url text,
    run_title text
)
language plpgsql
as $$
begin
    return query
    select
        mit_open_chunks.content_title,
        mit_open_chunks.content_url,
        mit_open_chunks.content,
        mit_open_chunks.content_length,
        mit_open_chunks.content_tokens,
        1 - (mit_open_chunks.embedding <=> query_embedding) as similarity,
        mit_open_chunks.run_url,
        mit_open_chunks.run_title
from mit_open_chunks
where 1 - (mit_open_chunks.embedding <=> query_embedding) > similarity_threshold
and mit_open_chunks.run_key LIKE run_identifier||'%'
order by mit_open_chunks.embedding <=> query_embedding
limit match_count;
end;
$$;
