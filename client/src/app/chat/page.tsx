"use client"
import React, { useEffect, useState } from 'react'
import { useAppContext, User } from '../context/AppContext'
import { useRouter } from 'next/navigation'
import Loading from '../components/Loading'
import ChatSideBar from '../components/ChatSideBar'

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}


const ChatApp = () => {
  const { loading, isAuth, logoutUser, chats, user: loggedInUser, users, fetchChats, setChats } = useAppContext()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [sideBar, setSideBar] = useState(false)
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showAllUser, setShowAllUser] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(null)


  const router = useRouter()

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login")
    }
  }, [isAuth, loading, router])

  const handleLogout =()=> logoutUser()

  if (loading) return <Loading />

  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
      <ChatSideBar
  sidebarOpen={sideBar}
  setSidebarOpen={setSideBar}
  showAllUsers={showAllUser}
  setShowAllUsers={setShowAllUser}
  users={users}
  loggedInUser={loggedInUser}
  chats={chats}
  selectedUser={selectedUser}
  setSelectedUser={setSelectedUser}
  handleLogout={logoutUser}
/>
    </div>
  )
}

export default ChatApp
