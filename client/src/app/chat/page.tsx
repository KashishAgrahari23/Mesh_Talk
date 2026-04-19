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
import { constants } from 'buffer'

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
  const { loading, isAuth, logoutUser, chats, user: loggedInUser, users, fetchChats, setChats, } = useAppContext()
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

  const handleLogout = () => logoutUser()

  async function fetchChat() {
    const token = Cookies.get("token")
    try {
      const { data } = await axios.get(`${chat_service}/api/v1/message/${selectedUser}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMessages(data.messages)
      setUser(data.user)
      await fetchChats()

    } catch (error) {
      console.log(error)
      toast.error("Failed to load messages")
    }

  }

  async function createChat(u: User) {
    const token = Cookies.get("token")
    if (!token) {
      return
    }
    try {
      const { data } = await axios.post(`${chat_service}/api/v1/chat`, {
        userId: loggedInUser?._id, otherUserId: u._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSelectedUser(data.chatId)
      setShowAllUser(false)
      await fetchChats()
    } catch (error) {
      toast.error("Failed to start chat")
    }

  }

  const handleMsjSend = async(e:any , imageFile ?:File | null)=>{
    e.preventDefault()
    if(!message.trim() && !imageFile && !selectedUser) return
    const token = Cookies.get("token")
    try {
      const formData = new FormData()
      formData.append("chatId" , selectedUser)
      if(message.trim()){
        formData.append("text" , message)

      }
      if(imageFile){
        formData.append("image" , imageFile)
      }
      const {data} = await axios.post(`${chat_service}/api/v1/message` , formData , {
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type" :"multipart/form-data"
        }
      })
      setMessages((prev)=>{
        const currMsj = prev ||  []
        const msjExists = currMsj.some((msj)=> msj._id === data.message._id)
        if(!msjExists) {
          return [...currMsj , data.message]
        }
        return currMsj
      })
      setMessage("")
      const displayText = imageFile ? "📷 Image" : message
    } catch (error:any) {
      toast.error(error.response.data.message)
    } 
  }

  const handletyping = (value:string)=>{
    setMessage(value)
    if(!selectedUser) return
  }

  useEffect(() => {
    if (selectedUser) {
      fetchChat()
    }
  }, [selectedUser])

  if (loading) return <Loading />

  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
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
        createChat={createChat}
      />
      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10">
        <ChatHeader user={user} setSidebarOpen={setSideBar} isTyping={isTyping} />
        <ChatMessages selectedUser={selectedUser} messages={messages} loggedInUser={loggedInUser} />
        <MessageInput selectedUser={selectedUser} message={message} setMessage={setMessage}  handleMessageSend ={handleMsjSend}  />
      </div>
    </div>

  )
}

export default ChatApp
