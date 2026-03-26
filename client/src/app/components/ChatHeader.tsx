import { Menu, UserCircle } from "lucide-react"
import React from "react"
import { User } from "../context/AppContext"

interface ChatHeaderProps {
  user: User | null
  setSidebarOpen: (open: boolean) => void
}

const ChatHeader = ({ user, setSidebarOpen }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">

      {/* LEFT SIDE */}
      {user ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-white font-semibold">{user.name}</h2>
            <p className="text-xs text-gray-400">Online</p>
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

      {/* RIGHT SIDE (Mobile Menu) */}
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