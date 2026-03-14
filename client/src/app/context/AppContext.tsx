"use client"

import React, { createContext, useContext, useState } from "react"

export const user_service = "http://localhost:8080"
export const chat_service = "http://localhost:8000"

export interface User{
    _id: string
    name: string
    email: string
}

export interface Chat{
    _id: string
    users: string[]
    latestMessage: {
        text:string
        sender:string
    }
    createdAt: string
    updatedAt: string
    unseenCount?: number
}

export interface Chats{
    _id: string
    user: User
    chat: Chat
}

interface AppContextType{
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
        
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
        
    }


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
        </AppContext.Provider>
    )
}

export const useAppContext = () => {

    const context = useContext(AppContext)

    if(!context){
        throw new Error("useAppContext must be used within AppProvider")
    }

    return context
}