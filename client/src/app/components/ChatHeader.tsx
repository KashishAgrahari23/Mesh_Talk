import { Menu } from "lucide-react"
import React from "react"
import { User } from "../context/AppContext"

interface ChatHeaderProps {
  user: User | null
  setSidebarOpen: (open: boolean) => void
}

const ChatHeader = ({ user, setSidebarOpen }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">

      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
          {user?.name?.charAt(0).toUpperCase() || "?"}
        </div>

        <div>
          <h2 className="text-white font-semibold">{user?.name || "Loading...."}</h2>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-200" />
        </button>
      </div>

    </div>
  )
}

export default ChatHeader