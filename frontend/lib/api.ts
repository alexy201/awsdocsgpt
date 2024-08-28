import axios from "axios"
import { CHAT_ENDPOINT, SEARCH_ENDPOINT } from "config/config"

function createRequest(
  textareaValue: string,
  courseTitle: string,
  results: string,
  sentences: string,
  threshold: string,
  api_key: string,
  systemPrompt: string,
  userPrompt: string
) {
  return api_key === "" ? {
    prompt: textareaValue,
    course: courseTitle,
    results: results,
    sentences: sentences,
    similarity_threshold: threshold,
    temperature: "0",
    systemPrompt: systemPrompt,
    userPrompt: userPrompt
  } : {
    prompt: textareaValue,
    course: courseTitle,
    results: results,
    sentences: sentences,
    similarity_threshold: threshold,
    temperature: "0",
    api_key: api_key,
    systemPrompt: systemPrompt,
    userPrompt: userPrompt
  }
}

export async function fetchData(
  textareaValue: string,
  courseTitle: string,
  mode: string,
  results: string,
  sentences: string,
  threshold: string,
  api_key: string,
  systemPrompt: string,
  userPrompt: string
) {
  try {
    const url = mode === "1" ? SEARCH_ENDPOINT : CHAT_ENDPOINT
    console.log("systemPrompt: ", systemPrompt)
    const response = await axios.post(
      url || "",
      createRequest(textareaValue, courseTitle, results, sentences, threshold, api_key, systemPrompt, userPrompt),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    console.log("OpenAI prompt: ", JSON.stringify(response.data.messages))
    return response.data
  } catch (err) {
    console.log(err)
    throw err
  }
}
