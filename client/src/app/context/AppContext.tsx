"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

export const user_service = "http://localhost:8080"
export const chat_service = "http://localhost:8000"

export interface User {
    _id: string
    name: string
    email: string
}

export interface Chat {
    _id: string
    users: string[]
    latestMessage: {
        text: string
        sender: string
    }
    createdAt: string
    updatedAt: string
    unseenCount?: number
}

export interface Chats {
    _id: string
    user: User
    chat: Chat
}

interface AppContextType {
    user: User | null
    chats: Chats[] | null
    users: User[] | null
    loading: boolean
    isAuth: boolean
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    setChats: React.Dispatch<React.SetStateAction<Chats [] | null>>
    fetchUser: () => Promise<void>
    fetchChats: () => Promise<void>
    fetchUsers: () => Promise<void>
    logoutUser: () => void

}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [isAuth, setIsAuth] = useState<boolean>(false)

    async function fetchUser() {
        const token = Cookies.get("token")
        if (!token) {
            setIsAuth(false)
            setLoading(false)
            return
        }
        try {

            const { data } = await axios.get(`${user_service}/api/v1/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(data)
            setIsAuth(true)
        } catch (error) {
            console.log(error)
            setIsAuth(false)
        } finally{
            setLoading(false)
        }

    }

    async function logoutUser() {
        Cookies.remove("token")
        setUser(null)
        setIsAuth(false)
        setChats(null)
        toast.success("User logged out successfully")

    }

    const [chats, setChats] = useState<Chats[] | null>(null)
    async function fetchChats() {
        const token = Cookies.get("token")
        if (!token) return
        try {
            const { data } = await axios.get(`${chat_service}/api/v1/chats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setChats(data.chats)
        } catch (error) {
            console.log(error)
        }

    }

    const [users, setUsers] = useState<User[] | null>(null)

    async function fetchUsers() {
        const token = Cookies.get("token")
        if (!token) return
        try {
            const { data } = await axios.get(`${user_service}/api/v1/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUsers(data.users)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        if (isAuth) {
            fetchChats()
            fetchUsers()
        }
    }, [isAuth])
    return (
        <AppContext.Provider
            value={{
                user,
                chats,
                users,
                loading,
                isAuth,
                setUser,
                setIsAuth,
                fetchUser,
                fetchChats,
                fetchUsers,
                logoutUser,
                setChats
            }}
        >
            {children}
            <Toaster />
        </AppContext.Provider>
    )
}

export const useAppContext = () => {

    const context = useContext(AppContext)

    if (!context) {
        throw new Error("useAppContext must be used within AppProvider")
    }

    return context
}