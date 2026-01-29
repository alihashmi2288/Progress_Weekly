"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { Check, Trophy, Plus, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
// import { toggleHabit, createHabit } from "@/app/actions" // We pass these down or import directly

// We will use optimistic UI in a real polished version, for now we trigger server actions directly
import { toggleHabit, createHabit } from "@/app/actions"
import { useRouter } from "next/navigation"

type HabitLog = {
    id: string
    date: Date
    completed: boolean
}

type Habit = {
    id: string
    title: string
    logs: HabitLog[]
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Helper to check if a log exists for a specific day relative to *current week* (simplified)
// Ideally we pass "weekStartDate" to this component
function isCompleted(habit: Habit, dayIndex: number) {
    // This logic is tricky without knowing the exact "Sunday" date of the view.
    // We will assume the view is "Current Week".
    const today = new Date()
    const currentDayIndex = today.getDay() // 0 = Sun

    // Find the date for the target dayIndex
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() - (currentDayIndex - dayIndex))
    targetDate.setHours(0, 0, 0, 0)

    return habit.logs.some(log => {
        const logDate = new Date(log.date)
        logDate.setHours(0, 0, 0, 0)
        return logDate.getTime() === targetDate.getTime() && log.completed
    })
}

function getHabitDate(dayIndex: number) {
    const today = new Date()
    const currentDayIndex = today.getDay()
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() - (currentDayIndex - dayIndex))
    return targetDate
}

export function HabitTracker({ habits }: { habits: Habit[] }) {
    const router = useRouter()
    const [isAdding, setIsAdding] = React.useState(false)

    const handleToggle = async (habitId: string, dayIndex: number) => {
        const date = getHabitDate(dayIndex)
        await toggleHabit(habitId, date)
    }

    return (
        <Card className="shadow-sm border-none bg-white/50 backdrop-blur-sm overflow-hidden min-h-[300px] flex flex-col">
            <CardHeader className="bg-[#65a34e] py-2 px-4 shadow-[0_2px_10px_rgba(0,0,0,0.1)] z-10 relative flex flex-row justify-between items-center h-14">
                <CardTitle className="text-center text-white text-lg font-bold">Habit Tracker</CardTitle>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-white text-[#65a34e] hover:bg-gray-100 p-1.5 rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center"
                    title="Add New Habit"
                >
                    <Plus className="w-5 h-5 font-bold" strokeWidth={3} />
                </button>
            </CardHeader>

            {/* Quick Add Form */}
            {isAdding && (
                <form action={async (formData) => {
                    await createHabit(formData)
                    setIsAdding(false)
                }} className="p-3 bg-[#e6f4e2] flex gap-2 border-b border-[#65a34e]/20 animate-in slide-in-from-top-2">
                    <input
                        name="name"
                        className="flex-1 px-3 py-2 text-sm border border-[#65a34e]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#65a34e]"
                        placeholder="Ex: Drink Water..."
                        autoFocus
                    />
                    <button type="submit" className="px-4 py-2 bg-[#65a34e] hover:bg-[#538a3f] text-white text-sm font-bold rounded-md shadow-sm transition-colors">
                        Save
                    </button>
                </form>
            )}

            <CardContent className="p-0 flex-1 overflow-x-auto bg-white/40 scrollbar-hide">
                <div className="min-w-[800px] text-sm">
                    {/* Header Row */}
                    <div className="grid grid-cols-[200px_repeat(7,1fr)_100px] border-b border-[#65a34e]/20 bg-[#65a34e]/10 sticky top-0 z-20">
                        <div className="p-3 font-extrabold text-[#65a34e] pl-6 text-sm uppercase tracking-wide">Habit</div>
                        {DAYS.map(day => (
                            <div key={day} className="p-3 text-center text-gray-700 font-bold">{day}</div>
                        ))}
                        <div className="p-3 text-center font-bold text-[#65a34e]">Progress</div>
                    </div>

                    {/* Habit Rows */}
                    {habits.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No habits yet. Click + to add one.</div>
                    ) : habits.map((habit, hIndex) => {
                        // Count completed within this week view
                        let completedCount = 0
                        DAYS.forEach((_, dIndex) => {
                            if (isCompleted(habit, dIndex)) completedCount++
                        })

                        const progress = Math.round((completedCount / 7) * 100)
                        const isPerfect = progress === 100

                        return (
                            <div
                                key={habit.id}
                                className={cn(
                                    "grid grid-cols-[200px_repeat(7,1fr)_100px] items-center border-b border-gray-50 last:border-0 hover:bg-white/60 transition-colors",
                                    hIndex % 2 === 0 ? "bg-white/30" : "bg-transparent"
                                )}
                            >
                                <div className="p-3 pl-6 font-medium text-gray-700 truncate">{habit.title}</div>

                                {DAYS.map((_, dIndex) => {
                                    const checked = isCompleted(habit, dIndex)
                                    return (
                                        <div key={dIndex} className="p-2 flex justify-center">
                                            <button
                                                onClick={() => handleToggle(habit.id, dIndex)}
                                                className={cn(
                                                    "w-6 h-6 rounded flex items-center justify-center border transition-all duration-200",
                                                    checked
                                                        ? "bg-[#65a34e] border-[#65a34e] text-white shadow-sm hover:bg-[#538a3f]"
                                                        : "bg-transparent border-gray-400 hover:border-[#65a34e]"
                                                )}
                                            >
                                                {checked && <Check className="w-4 h-4" strokeWidth={3} />}
                                            </button>
                                        </div>
                                    )
                                })}

                                <div className="p-2 pr-6">
                                    <div className="flex items-center gap-2 justify-end">
                                        {isPerfect ? (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-amber-500"
                                            >
                                                <Trophy className="w-5 h-5 fill-current" />
                                            </motion.div>
                                        ) : (
                                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
                                                <motion.div
                                                    className="h-full bg-[#8bc34a]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}
                                        <span className={cn("text-xs w-8 text-right font-medium", isPerfect ? "text-amber-600" : "text-gray-600")}>
                                            {isPerfect ? "" : `${progress}%`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
