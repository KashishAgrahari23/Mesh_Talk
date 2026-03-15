"use client"
import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { useRouter } from 'next/navigation'
import Loading from '../components/Loading'

const ChatApp = () => {
  const {loading , isAuth} = useAppContext()
  const router = useRouter()

  useEffect(()=>{
    if(!isAuth && !loading){
      router.push("/login")
    }
  },[isAuth , loading , router])
  if(loading) return <Loading/>
  return (
    <div>
chat app 
    </div>
  )
}

export default ChatApp
