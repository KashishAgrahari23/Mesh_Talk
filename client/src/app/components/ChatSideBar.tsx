import React, { useState } from "react"
import { User, Chats } from "../context/AppContext"
import { LogOut, MessageCircle, Plus, Search, UserCircle, X } from "lucide-react"
import Link from "next/link"

interface ChatSideBarProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    showAllUser: boolean
    setShowAllUser: (show: boolean | ((prev: boolean) => boolean)) => void
    users: User[] | null
    loggedInUser: User | null
    chats: Chats[] | null
    selectedUser: string | null
    setSelectedUser: (userId: string | null) => void
    handleLogout: () => void
    createChat: (user: User) => void
    onlineUsers: string[]
}

const ChatSideBar = ({
    sidebarOpen,
    setSidebarOpen,
    showAllUser,
    setShowAllUser,
    users,
    loggedInUser,
    chats,
    selectedUser,
    setSelectedUser,
    handleLogout,
    createChat,
    onlineUsers
}: ChatSideBarProps) => {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <aside
            className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } sm:translate-x-0 transition-transform duration-300 flex flex-col`}
        >
            {/* Header */}
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
                            {showAllUser ? "New Chat" : "Messages"}
                        </h2>
                    </div>

                    <button
                        className={`p-2.5 rounded-lg transition-colors ${showAllUser
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                        onClick={() => setShowAllUser((prev) => !prev)}
                    >
                        {showAllUser ? (
                            <X className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden px-4 py-2">
                {showAllUser ? (
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
                                        onClick={() => {
                                            createChat(u)
                                        }}
                                        className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${selectedUser === u._id
                                            ? "bg-blue-600"
                                            : "bg-gray-800 hover:bg-gray-700"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <UserCircle className="w-6 h-6 text-gray-300" />

                                                {onlineUsers.includes(u._id) && (
                                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-gray-900" />
                                                )}
                                            </div>

                                            <span className="text-white">{u.name}</span>
                                        </div>
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
                                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${isSelected
                                        ? "bg-blue-600"
                                        : "bg-gray-800 hover:bg-gray-700"
                                        }`}
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-white font-medium">
                                            {chat.user.name}
                                        </span>

                                        <span className="text-xs text-gray-400 truncate flex items-center gap-1">
                                            {isSentByMe && (
                                                <span className="text-blue-400 text-xs">You:</span>
                                            )}
                                            {latestMessage?.text || "No messages yet"}
                                        </span>
                                    </div>

                                    {unseenCount > 0 && (
                                        <span className="ml-2 bg-green-500 text-xs px-2 py-1 rounded-full">
                                            {unseenCount > 99 ? "99+" : unseenCount}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="p-4 bg-gray-800 rounded-full mb-4">
                            <MessageCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 font-medium">No conversation yet</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Start a new chat to begin messaging
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 space-y-2">
                <Link
                    href={"/profile"}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <div className="p-1.5 bg-gray-700 rounded-lg">
                        <UserCircle className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="font-medium text-gray-300">Profile</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-red-500 hover:text-white"
                >
                    <div className="p-1.5 bg-red-700 rounded-lg">
                        <LogOut className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    )
}

export default ChatSideBar