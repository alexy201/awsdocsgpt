"use client"

import { useRef, useState } from "react"

import { siteConfig } from "@/config/site"
import { OutputComponent } from "@/components/cases"
import { Prompt } from "@/components/prompt"
import { useChat } from 'ai/react'
import { SearchResponse } from "@/types/search"
import { AntimetalComponent } from "@/components/antimetal"
import CourseSelector from "@/components/course-selector";

export default function IndexPage() {
  const [chat, setChat] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState<SearchResponse | null>(null)
  const { messages, setMessages, append } = useChat()
  const [apiKeyListener, setApiLeyListener] = useState(false)

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="font-mono md:text-3xl text-xl leading-tight tracking-tight">
          AI-powered <span className="font-extrabold">Search</span> &{" "}
          <span className="font-extrabold">Chat</span> for{" "}
          <span className="font-extrabold text-antimetal">
            <a href={siteConfig.links.documentation} target="_blank" rel="noopener noreferrer">MIT Open Courseware</a>
          </span>{" "}
        </h1>
        <AntimetalComponent />
      </div>
      <Prompt onChange={setChat} setLoading={setLoading} setData={setData} setApiLeyListener={setApiLeyListener}
              messages={messages} setMessages={setMessages} append={append} />
      <OutputComponent chat={chat} isLoading={isLoading} data={data} messages={messages} apiKeyListener={apiKeyListener} />
    </section>
  )
}
