"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAppContext, chat_service } from "./AppContext"

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
})

interface ProviderProps {
  children: React.ReactNode
}

export const SocketProvider = ({ children }: ProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user } = useAppContext()

  useEffect(() => {
    if (!user) return

    const newSocket = io(chat_service, {
      transports: ["websocket"],
    })

    setSocket(newSocket)

    newSocket.emit("setup", user._id)

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id)
    })

    return () => {
      newSocket.disconnect()
      console.log("Socket disconnected")
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}