"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAppContext } from "./AppContext"

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
})

interface ProviderProps {
  children: React.ReactNode
}

export const SocketProvider = ({ children }: ProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user } = useAppContext()

  useEffect(() => {
    if (!user) return

    // 🔥 connect to backend
    const newSocket = io("http://localhost:8000", {
      transports: ["websocket"],
    })

    setSocket(newSocket)

    // optional: send user info to server
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