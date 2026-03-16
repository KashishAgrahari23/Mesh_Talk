"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
import axios from "axios"
import toast, {Toaster} from "react-hot-toast"

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
    loading: boolean
    isAuth: boolean
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [isAuth, setIsAuth] = useState<boolean>(false)

    async function fetchUser() {
        try {
            const token = Cookies.get("token")
            const { data } = await axios.get(`${user_service}/api/v1/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(data)
            setIsAuth(true)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }

    async function logoutUser() {
        Cookies.remove("token")
        setUser(null)
        setIsAuth(false)
        toast.success("User logged out successfully")
        
    }

    const [chats , setChats] = useState<Chats[] | null >(null)
    async function fetchChats() {
        const token = Cookies.get("token")
        try {const token = Cookies.get("token")
            const { data } = await axios.get(`${chat_service}/api/v1/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) 
            setChats(data.chats)
        } catch (error) {
            console.log(error)
        }
        
    }

    const [users, setUsers] = useState<User[]| null>(null)

    useEffect(() => {
        fetchUser()
        fetchChats()
    }, [])
    return (
        <AppContext.Provider
            value={{
                user,
                loading,
                isAuth,
                setUser,
                setIsAuth
            }}
        >
            {children}
            <Toaster/>
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