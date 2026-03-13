"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { ArrowRight, Loader2, Lock } from "lucide-react"
import Cookies from "js-cookie"

const VerifyPage = () => {

  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState<string[]>(["","","","","",""])
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(60)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const router = useRouter()
  const searchParam = useSearchParams()
  const email: string = searchParam.get("email") || ""

  useEffect(()=>{
    if(timer > 0){
      const interval = setInterval(()=>{
        setTimer(prev => prev - 1)
      },1000)

      return () => clearInterval(interval)
    }
  },[timer])


  const handleInputChange = (index:number, value:string):void => {

    if(value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    setError("")

    if(value && index < 5){
      inputRefs.current[index+1]?.focus()
    }
  }


  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }


  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault()

    const pastedData = e.clipboardData.getData("text").trim()

    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.slice(0,6).split("")

    const newOtp = [...otp]

    digits.forEach((digit,index)=>{
      newOtp[index] = digit
    })

    setOtp(newOtp)

    const lastIndex = digits.length - 1
    inputRefs.current[lastIndex]?.focus()
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const enteredOtp = otp.join("")

    if(enteredOtp.length !== 6){
      setError("Please enter the complete OTP")
      return
    }

    try{

      setLoading(true)

      const {data} = await axios.post(
        "http://localhost:8080/api/v1/verify",
        {
          email,
          otp: enteredOtp
        }
      )
      alert(data.message)
      Cookies.set("token" , data.token,{
        expires:15,
        secure:false,
        path:"/"
      })
      // localStorage.setItem("to/ken",data.token)
      setOtp(["","","","","",""])
      inputRefs.current[0]?.focus()
      router.push("/chat")

    }catch(error:any){

      setError(error?.response?.data?.message || "Verification failed")

    }finally{
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">

      <div className="max-w-md w-full">

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">

            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Lock size={40} className="text-white"/>
            </div>

            <h1 className="text-2xl font-semibold text-white mb-2">
              Verify your Email
            </h1>

            <p className="text-gray-400 text-sm">
              We have sent a 6-digit code to
            </p>

            <p className="text-blue-400 font-medium">
              {email}
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">


            <div>

              <label className="block text-gray-300 text-sm mb-4 text-center">
                Enter your 6 digit OTP
              </label>

              <div className="flex justify-center space-x-3">

                {otp.map((digit,index)=>(
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el)=>{inputRefs.current[index] = el}}
                    onChange={(e)=>handleInputChange(index,e.target.value)}
                    onKeyDown={(e)=>handleKeyDown(index,e)}
                    onPaste={index==0?handlePaste:undefined}
                    className="w-12 h-12 text-center text-lg bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
                  />
                ))}

              </div>

              {error && (
                <p className="text-red-400 text-sm text-center mt-3">
                  {error}
                </p>
              )}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >

              {loading ? (

                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin"/>
                  Verifying...
                </div>

              ) : (

                <div className="flex items-center gap-2">
                  <span>Verify</span>
                  <ArrowRight className="w-5 h-5"/>
                </div>

              )}

            </button>

            <p className="text-center text-gray-400 text-sm">
              {timer > 0
                ? `Resend OTP in ${timer}s`
                : "You can request a new OTP"}
            </p>


          </form>

        </div>
      </div>
    </div>
  )
}

export default VerifyPage