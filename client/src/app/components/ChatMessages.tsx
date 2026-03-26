import { Message } from "@/app/chat/page"
import { User } from "@/context/AppContext"
import React, { useEffect, useMemo, useRef } from "react"

interface ChatMessagesProps {
  selectedUser: string | null
  messages: Message[] | null
  loggedInUser: User | null
}

const ChatMessages = ({ selectedUser, messages, loggedInUser }: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const uniqueMessages = useMemo(()=>{
    if(!messages) return []
    const seen = new Set<string>()
    return messages.filter((message)=>{
      if(seen.has(message._id)){
        return false
      }
      seen.add(message._id)
      return true
    })
  },[messages])

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"})
  },[selectedUser , uniqueMessages])
  return (
    <div className="flex-1 overflow-hidden">
  <div className="h-full max-h-[calc(100vh-215px)] overflow-y-auto p-2 space-y-2 custom-scroll">
    
    {!selectedUser ? (
      <p className="text-gray-400 text-center mt-20">
        Please select a user to start chatting
      </p>
    ) : (
      <></>
    )}

  </div>
</div>
  )
}

export default ChatMessages