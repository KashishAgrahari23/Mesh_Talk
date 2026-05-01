import { Menu, UserCircle } from "lucide-react"
import React from "react"
import { User } from "../context/AppContext"
import { useSocket } from "../context/SocketContext"

interface ChatHeaderProps {
  user: User | null
  setSidebarOpen: (open: boolean) => void
  isTyping?: boolean
}

const ChatHeader = ({ user, setSidebarOpen, isTyping }: ChatHeaderProps) => {
  const { onlineUsers } = useSocket()

  const isOnline = user ? onlineUsers.includes(user._id) : false

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">

      {user ? (
        <div className="flex items-center gap-3">

          <div className="relative">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-900" />
            )}
          </div>

          <div>
            <h2 className="text-white font-semibold">{user.name}</h2>

            {isTyping ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">

                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>

                <span className="italic text-blue-500 font-medium">typing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"
                    }`}
                ></div>

                <span
                  className={`text-sm font-medium ${isOnline ? "text-green-500" : "text-gray-400"
                    }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <UserCircle className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-sm font-medium">
              Select a conversation
            </h2>
            <p className="text-xs text-gray-500">
              Choose a chat to start messaging
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setSidebarOpen(true)}
        className="sm:hidden p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-200" />
      </button>

    </div>
  )
}

export default ChatHeader