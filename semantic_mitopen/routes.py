import logging
import os

import numpy as np
import openai
from fastapi import APIRouter, Request

import semantic_mitopen.exceptions as exceptions
from semantic_mitopen.schemas import chat_response, message, query, search_response

router = APIRouter()
_logger = logging.getLogger(__name__)


@router.post(
    "/chat",
    response_model=chat_response,
    summary="Get response from OpenAI Chat Completion with prompt string and result count",
    response_description="Answer (string which represents the completion) and sources used",
)
async def chat_handler(request: Request, query: query):
    _logger.info({"message": "Calling Chat Endpoint"})
    rows = await helper(request, query)

    pages = []
    content = (
        query.userPrompt.replace("$LENGTH", query.sentences.upper())
        + f"\n\nQuestion: {query.prompt}"
        + "\n\nMIT course information: \n\n"
    )
    for row in rows:
        dic = dict(row)
        pages.append(dic)
        content += f'"""{dic["content"]}"""\n'
    content += ""

    messages = []
    messages.append(message(role="user", content=content))
    messages.append(message(role="system", content=query.systemPrompt))
    return chat_response(messages=messages, sources=pages)


@router.post(
    "/search",
    response_model=search_response,
    summary="Get chunks from Postgres DB with prompt string and result count",
    response_description="Sources that match the prompt (in a list)",
)
async def search_handler(request: Request, query: query):
    _logger.info({"message": "Calling Search Endpoint"})
    rows = await helper(request, query)
    response = []
    for row in rows:
        response.append(dict(row))

    return search_response(sources=response)


async def helper(request: Request, query: query):
    try:
        _logger.info({"message": "Creating embedding"})
        _logger.info({"api_key": query.api_key})
        embedding = openai.Embedding.create(
            api_key=query.api_key, input=query.prompt, model="text-embedding-ada-002"
        )["data"][0]["embedding"]
        sql = (
            "SELECT * FROM "
            + os.getenv("POSTGRES_SEARCH_FUNCTION")
            + "($1, $2, $3, $4)"
        )
    except:
        _logger.error({"message": "Issue with creating an embedding."})
        raise exceptions.InvalidPromptEmbeddingException

    try:
        _logger.info({"message": "Querying Postgres"})
        res = await request.app.state.db.fetch_rows(
            sql,
            np.array(embedding),
            query.similarity_threshold,
            query.results,
            query.course,
        )
    except Exception as e:
        _logger.error({"message": "Issue with querying Postgres." + str(e)})
        raise exceptions.InvalidPostgresQueryException

    return res
