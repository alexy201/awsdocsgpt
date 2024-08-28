"use client"

import * as React from "react"
import { ChangeEvent, useState } from "react"
import Link from "next/link"
import { Icons } from "@/icons/icons"
import { fetchData } from "lib/api"
import { UseChatHelpers } from 'ai/react'

import { SearchResponse } from "@/types/search"
import { getSettings } from "@/lib/settings"
import { Button } from "@/components/ui/button"
import { TextInput } from "@/components/ui/input"
import { useWindowSize } from "usehooks-ts"
import { validAPIKey } from "@/lib/utils"
import CourseSelector from "@/components/course-selector";

export interface PromptProps {
  onChange: (value: React.SetStateAction<number>) => void
  setLoading: (value: boolean) => void
  setApiLeyListener: (value: boolean) => void
  setData: (value: SearchResponse | null) => void
  messages: UseChatHelpers['messages']
  setMessages: UseChatHelpers['setMessages']
  append: UseChatHelpers['append']
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function Prompt({ onChange, setLoading, setData, setApiLeyListener, messages, setMessages, append }: PromptProps) {
  const { width } = useWindowSize()
  const { nanoid } = require('nanoid');
  const cachedSettings = getSettings()
  const [textareaValue, setTextareaValue] = useState("")
  const [disabled, setDisable] = useState(false)
  const [noSubmit, setNoSubmit] = useState(true)
  const [courseTitle, setCourseValue] = useState("")

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNoSubmit(event.target.value.length <= 0)
    setTextareaValue(event.target.value)
  }

  const handleCourseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCourseValue(event.target.value);
    console.log("Course selected: ", event.target.value);
  }

  const clearPrompt = () => {
    setNoSubmit(true)
    setTextareaValue("")
  }

  const callAPI = async () => {
    if (noSubmit) {
      return
    }
    if (!validAPIKey(cachedSettings.api_key)) {
      setApiLeyListener(true)
      return
    }

    try {
      setDisable(true)
      setLoading(true)

      onChange(+cachedSettings.mode)
      if (validAPIKey(cachedSettings.api_key)){
        setApiLeyListener(false)
        await fetchData(
          textareaValue,
          courseTitle,
          cachedSettings.mode,
          cachedSettings.results,
          cachedSettings.sentences,
          cachedSettings.threshold,
          cachedSettings.api_key,
          cachedSettings.systemPrompt,
          cachedSettings.userPrompt
        ).then (async (data) => {
          setData(data)
          const system_prompt = data.messages[0]
          const user_prompt = data.messages[1]
          sleep(500).then(() => {
            setLoading(false)
          })
          if (system_prompt != null) {
            setMessages([{
              id : nanoid(7),
              role : system_prompt.role,
              content : system_prompt.content
            }])
          }
          if (user_prompt != null) {
            await append({
              role : user_prompt.role,
              content : user_prompt.content
            })
          }
        })
      }
    } catch (err) {
      console.log(err)
    }

    setDisable(false)
    setLoading(false)
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      callAPI()
    }
  }

  return (
    <React.Fragment>
      <div className="relative mt-2 flex w-full items-end gap-4">
        <CourseSelector onChange={handleCourseChange} onSelect={handleCourseChange}/>
      </div>
      <div className="relative mt-2 flex w-full items-end gap-4">
        <Icons.search className="absolute left-4 top-7 md:top-10 h-6 w-6 md:h-8 md:w-8 -translate-y-1/2"/>
        {width < 600 &&
          <TextInput
            className="resize-none overflow-hidden pb-4 md:pb-2 pr-20 pt-4 md:pt-6"
            placeholder="What are the laws of thermodynamics?"
            id="prompt"
            disabled={disabled}
            value={textareaValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={1}
            mobile={true}
          />
        }
        {width >= 600 &&
          <TextInput
            className="resize-none overflow-hidden pb-4 md:pb-2 pr-20 pt-4 md:pt-6"
            placeholder="What are the laws of thermodynamics?"
            id="prompt"
            disabled={disabled}
            value={textareaValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={1}
            mobile={false}
          />
        }
        <Button
          disabled={noSubmit || disabled}
          className="absolute right-3 top-7 md:top-10 h-10 w-12 md:h-14 md:w-14 -translate-y-1/2 rounded-lg bg-antimetal hover:bg-antimetal-dark"
          onClick={callAPI}
        >
          <Icons.in/>
        </Button>
      </div>
      <div style={{display: "flex", justifyContent: "flex-end"}}>
        <Link
          href=""
          className="-translate-y-1/3 pr-4 font-semibold text-antimetal text-sm md:text-md"
          onClick={clearPrompt}
        >
          Clear Prompt
        </Link>
      </div>
    </React.Fragment>
  )
}
