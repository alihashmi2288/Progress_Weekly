"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export function LoginForm() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const email = e.currentTarget.email.value
        const password = e.currentTarget.password.value

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            alert("Invalid email or password")
            setLoading(false)
        } else {
            // Hard redirect to dashboard on success
            window.location.href = "/dashboard"
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#65a34e]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#88a872]/20 rounded-full blur-[80px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50 z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to your Weekly Planner</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:ring-2 focus:ring-[#65a34e] focus:border-transparent outline-none transition-all"
                            placeholder="hello@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:ring-2 focus:ring-[#65a34e] focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#65a34e] hover:bg-[#538a3f] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Don't have an account? <a href="/signup" className="text-[#65a34e] font-semibold cursor-pointer">Sign up</a></p>
                    <p className="mt-2 text-xs">Test Account: user@example.com / 123456</p>
                </div>
            </motion.div>
        </div>
    )
}
