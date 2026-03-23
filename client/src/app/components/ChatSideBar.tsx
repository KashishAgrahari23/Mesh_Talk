import React, { useState } from "react"
import { User, Chats } from "../context/AppContext"
import { MessageCircle, Plus, Search, UserCircle, X } from "lucide-react"

interface ChatSideBarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  showAllUsers: boolean
  setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void
  users: User[] | null
  loggedInUser: User | null
  chats: Chats[] | null
  selectedUser: string | null
  setSelectedUser: (userId: string | null) => void
  handleLogout: () => void
}

const ChatSideBar = ({
  sidebarOpen,
  setSidebarOpen,
  showAllUsers,
  setShowAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  setSelectedUser,
  handleLogout,
}: ChatSideBarProps) => {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="sm:hidden flex justify-end mb-2">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {showAllUsers ? "New Chat" : "Messages"}
            </h2>
          </div>

          <button
            className={`p-2.5 rounded-lg transition-colors ${
              showAllUsers
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            onClick={() => setShowAllUsers((prev) => !prev)}
          >
            {showAllUsers ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-2">
        {showAllUsers ? (
          <div className="space-y-4 h-full">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search Users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg outline-none"
              />
            </div>

            {/* Users */}
            <div className="overflow-y-auto h-[calc(100%-60px)] pb-4 space-y-2">
              {users
                ?.filter((u) =>
                  u.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((u) => (
                  <div
                    key={u._id}
                    onClick={() => setSelectedUser(u._id)}
                    className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
                      selectedUser === u._id
                        ? "bg-blue-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    <UserCircle className="w-5 h-5 text-gray-300 shrink-0" />
                    <span className="text-white">{u.name}</span>
                  </div>
                ))}
            </div>
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="space-y-2 overflow-y-auto h-full pb-4">
            {chats.map((chat) => {
              const latestMessage = chat.chat.latestMessage
              const isSelected = selectedUser === chat.chat._id
              const isSentByMe =
                latestMessage?.sender === loggedInUser?._id
              const unseenCount = chat.chat.unseenCount || 0

              return (
                <button
                  key={chat.chat._id}
                  onClick={() => setSelectedUser(chat.chat._id)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-medium">
                      {chat.user.name}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {isSentByMe ? "You: " : ""}
                      {latestMessage?.text || "No messages yet"}
                    </span>
                  </div>

                  {unseenCount > 0 && (
                    <span className="ml-2 bg-green-500 text-xs px-2 py-1 rounded-full">
                      {unseenCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </aside>
  )
}

export default ChatSideBar