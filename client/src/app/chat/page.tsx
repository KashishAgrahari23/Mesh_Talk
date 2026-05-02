"use client"

import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie"
import { chat_service, useAppContext, User } from '../context/AppContext'
import { useRouter } from 'next/navigation'
import Loading from '../components/Loading'
import ChatSideBar from '../components/ChatSideBar'
import axios from 'axios'
import toast from 'react-hot-toast'
import ChatHeader from '../components/ChatHeader'
import ChatMessages from '../components/ChatMessages'
import MessageInput from '../components/MessageInput'
import { useSocket } from '../context/SocketContext'

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
  const { loading, isAuth, logoutUser, chats, user: loggedInUser, users, fetchChats } = useAppContext()
  const { socket, onlineUsers } = useSocket()

  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [sideBar, setSideBar] = useState(false)
  const [showAllUser, setShowAllUser] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  const router = useRouter()

  // auth check
  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login")
    }
  }, [isAuth, loading])

  // 🔥 join room
  useEffect(() => {
    if (socket && selectedUser) {
      socket.emit("joinChat", selectedUser)
    }

    return () => {
      if (socket && selectedUser) {
        socket.emit("leaveChat", selectedUser)
      }
    }
  }, [socket, selectedUser])

  // 🔥 listen typing
  useEffect(() => {
    if (!socket) return

    socket.on("userTyping", (data) => {
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(true)
      }
    })

    socket.on("userStoppedTyping", (data) => {
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(false)
      }
    })

    return () => {
      socket.off("userTyping")
      socket.off("userStoppedTyping")
    }
  }, [socket, selectedUser, loggedInUser?._id])

  // fetch chat
  async function fetchChat() {
    const token = Cookies.get("token")

    try {
      const { data } = await axios.get(`${chat_service}/api/v1/message/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setMessages(data.messages)
      setUser(data.user)
      await fetchChats()
    } catch {
      toast.error("Failed to load messages")
    }
  }

  useEffect(() => {
    if (selectedUser) fetchChat()
  }, [selectedUser])

  // send message
  const handleMsjSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault()
    if (!message.trim() && !imageFile) return

    socket?.emit("stopTyping", {
      chatId: selectedUser,
      userId: loggedInUser?._id
    })

    const token = Cookies.get("token")

    const formData = new FormData()
    formData.append("chatId", selectedUser!)
    if (message.trim()) formData.append("text", message)
    if (imageFile) formData.append("image", imageFile)

    try {
      const { data } = await axios.post(`${chat_service}/api/v1/message`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })

      setMessages(prev => [...(prev || []), data.message])
      setMessage("")
    } catch {
      toast.error("Message failed")
    }
  }

  // 🔥 typing emit
  const handleTyping = (value: string) => {
    setMessage(value)

    if (!socket || !selectedUser) return

    socket.emit("typing", {
      chatId: selectedUser,
      userId: loggedInUser?._id
    })

    if (typingTimeout) clearTimeout(typingTimeout)

    const timeout = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedUser,
        userId: loggedInUser?._id
      })
    }, 1500)

    setTypingTimeout(timeout)
  }

  if (loading) return <Loading />

  return (
    <div className='min-h-screen flex bg-gray-900 text-white'>
      <ChatSideBar
        sidebarOpen={sideBar}
        setSidebarOpen={setSideBar}
        showAllUser={showAllUser}
        setShowAllUser={setShowAllUser}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={logoutUser}
        createChat={() => {}}
        onlineUsers={onlineUsers}
      />

      <div className="flex-1 flex flex-col justify-between p-4 bg-white/5">
        <ChatHeader user={user} setSidebarOpen={setSideBar} isTyping={isTyping} />

        <ChatMessages
          selectedUser={selectedUser}
          messages={messages}
          loggedInUser={loggedInUser}
        />

        <MessageInput
          selectedUser={selectedUser}
          message={message}
          setMessage={handleTyping}
          handleMessageSend={handleMsjSend}
        />
      </div>
    </div>
  )
}

export default ChatApp