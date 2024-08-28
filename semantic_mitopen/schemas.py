import os

from dotenv import load_dotenv
from pydantic import BaseModel, HttpUrl

load_dotenv()


class query(BaseModel):
    prompt: str
    course: str | None = ""
    temperature: float | None = 0.00
    similarity_threshold: float | None = 0.50
    sentences: str | None = "short"
    results: int | None = 5
    api_key: str | None = os.getenv("OPENAI_API_KEY")
    systemPrompt: str | None = f"Use the following MIT course information to provide a {sentences.upper()} answer to the subsequent question."
    userPrompt: str | None = f"""You answer questions about MIT course content, in the style of a friendly professor."""


class chunk(BaseModel):
    content_title: str
    content_url: HttpUrl
    content: str
    similarity: float
    run_url: str
    run_title: str


class message(BaseModel):
    role: str
    content: str


class search_response(BaseModel):
    sources: list[chunk]


class chat_response(search_response):
    messages: list[message]
