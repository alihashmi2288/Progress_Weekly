"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { registerUser } from "@/app/actions"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        try {
            await registerUser(formData)
            // Redirect to login after successful registration
            router.push("/login")
        } catch (error) {
            console.error("Signup failed", error)
            alert("Signup failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#65a34e]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#88a872]/20 rounded-full blur-[80px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50 z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join Weekly Planner today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:ring-2 focus:ring-[#65a34e] focus:border-transparent outline-none transition-all"
                            placeholder="John Doe"
                        />
                    </div>

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
                            minLength={6}
                            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:ring-2 focus:ring-[#65a34e] focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#65a34e] hover:bg-[#538a3f] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Already have an account? <a href="/login" className="text-[#65a34e] font-semibold cursor-pointer">Log in</a></p>
                </div>
            </motion.div>
        </div>
    )
}
