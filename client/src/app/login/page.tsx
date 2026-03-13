"use client"
import React, { useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        console.log("Email submitted:", email);
        setLoading(true)
        try {
            const { data } = await axios.post(`http://localhost:8080/api/v1/login`, { email })
            alert(data.message)
            router.push(`/verify?email=${email}`)
        } catch (error: any) {
            alert(error?.response?.data?.message || "Server not reachable")
        } finally {
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
                            Welcome To MeshTalk
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Enter your email to continue your journey
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
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending OTP to your mail...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Send Verification Code</span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;
