
import { Navbar } from "@/components/layout/Navbar"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Calendar, TrendingUp } from "lucide-react"

import { auth } from "@/auth"

export default async function LandingPage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fdf4] border border-[#65a34e]/20 text-[#65a34e] text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-[#65a34e] animate-pulse" />
          v1.0 Now Live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
          Master Your Week.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#65a34e] to-[#8bc34a]">
            Crush Your Habits.
          </span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          The minimalist weekly planner designed for high performers.
          Track habits, organize tasks, and visualize your progress using the <span className="font-semibold text-gray-700">Banana/Nano method</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {session ? (
            <Link href="/dashboard" className="flex items-center gap-2 bg-[#65a34e] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#65a34e]/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link href="/signup" className="flex items-center gap-2 bg-[#65a34e] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#65a34e]/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Start Planning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="px-8 py-4 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Existing User?
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Weekly Focus</h3>
              <p className="text-gray-500">
                Plan your week effectively with a clean, 7-day view that keeps you focused on what matters now.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Habit Tracking</h3>
              <p className="text-gray-500">
                Build consistency with our integrated habit tracker. Visual streaks keep you motivated.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Progress Analytics</h3>
              <p className="text-gray-500">
                See your wins at a glance. Visual charts show your completion rates and productivity trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100">
        © 2025 Weekly Planner. Built with Next.js 16.
      </footer>
    </div>
  )
}
