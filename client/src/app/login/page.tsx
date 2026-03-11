"use client"
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage = () => {
const [email, setEmail] = useState<string>("");
const [loading, setLoading] = useState<boolean>(false);
const router = useRouter()

const handleSubmit = async(e: React.FormEvent<HTMLElement>) : Promise<void>=> {
e.preventDefault();
console.log("Email submitted:", email);
setLoading(true)
try {
    const {data} = await axios.post(`http://localhost:5000/api/v1/login` , {email})
    alert(data.message)
    router.push(`/verify?email=${email}`)
} catch (error:any) {
    alert(error.response.data.message)
} finally{
    setLoading(false)
}
};

return (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
            <Mail size={40} className="text-white" />
          </div>

          <h1 className="text-2xl font-semibold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Enter your email to receive OTP
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  </div>
)}
export default LoginPage;
