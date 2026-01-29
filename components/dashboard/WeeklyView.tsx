"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleTask, addTask } from "@/app/actions"

type Task = {
    id: string
    title: string
    isCompleted: boolean
    dayOfWeek: string | null
}

export function WeeklyView({ tasks }: { tasks: Task[] }) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const [addingForDay, setAddingForDay] = React.useState<string | null>(null)

    // Calculate generic daily progress (mocked logic for "DayPlan" progress since we don't have separate day plan tables yet)
    // We filter tasks by dayOfWeek string.

    const getTasksForDay = (day: string) => tasks.filter(t => t.dayOfWeek === day)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2 mt-4 h-full min-h-[500px]">
            {daysOfWeek.map((day) => {
                const dailyTasks = getTasksForDay(day)
                const completed = dailyTasks.filter(t => t.isCompleted).length
                const total = dailyTasks.length
                const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

                // Mock date for visual
                const dateStr = "..."
                const todayIndex = new Date().getDay();
                const isToday = daysOfWeek[todayIndex] === day;

                return (
                    <div key={day} className="flex flex-col h-full bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm overflow-hidden group">
                        {/* Header */}
                        <div className={`p-3 text-center font-bold text-white uppercase tracking-wider text-sm ${isToday ? "bg-[#65a34e] shadow-md z-10 rounded-t-lg ring-2 ring-offset-2 ring-[#65a34e]" : "bg-[#65a34e] opacity-90 rounded-t-lg"
                            }`}>
                            {day}
                            {isToday && <div className="text-[10px] mt-0.5 font-normal">Today</div>}
                        </div>
                        {/* Progress Circle */}
                        <div className="py-4 flex justify-center bg-white/40">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="32" className="stroke-gray-200" strokeWidth="8" fill="transparent" />
                                    <motion.circle
                                        cx="40" cy="40" r="32"
                                        className="stroke-[#9dc183]"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 32}
                                        strokeDashoffset={2 * Math.PI * 32 * (1 - progress / 100)}
                                        strokeLinecap="round"
                                        initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                                        animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - progress / 100) }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-[#65a34e]">
                                    {progress}%
                                </div>
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="bg-[#9dc183] py-1 px-2 text-center text-white text-xs font-semibold uppercase tracking-wider flex justify-between items-center">
                            <span>Tasks</span>
                            <button onClick={() => setAddingForDay(day)} className="hover:bg-white/20 rounded p-0.5">
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white/30">
                            {addingForDay === day && (
                                <form
                                    action={async (formData) => {
                                        await addTask(formData)
                                        setAddingForDay(null)
                                    }}
                                    className="mb-2"
                                >
                                    <input type="hidden" name="day" value={day} />
                                    <input
                                        name="title"
                                        className="w-full text-xs p-1 border rounded"
                                        placeholder="New task..."
                                        autoFocus
                                        onBlur={() => setTimeout(() => setAddingForDay(null), 200)} // delay to allow submit
                                    />
                                    <button type="submit" className="hidden" />
                                </form>
                            )}

                            {dailyTasks.length > 0 ? (
                                dailyTasks.map(task => (
                                    <div key={task.id} className="flex items-start gap-2 group animate-in fade-in slide-in-from-bottom-1 duration-300">
                                        <button
                                            onClick={() => toggleTask(task.id)}
                                            className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.isCompleted ? "bg-[#65a34e] border-[#65a34e] text-white" : "border-gray-400 hover:border-[#65a34e]"
                                                }`}
                                        >
                                            {task.isCompleted && <Check className="w-3 h-3 font-bold" strokeWidth={4} />}
                                        </button>
                                        <span className={`text-sm font-bold text-gray-800 leading-tight ${task.isCompleted ? "line-through text-gray-400 font-normal" : ""}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                !addingForDay && <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs italic opacity-70">
                                    No tasks
                                </div>
                            )}
                        </div>

                        {/* Footer Stats */}
                        <div className="p-2 border-t border-gray-100 bg-[#88a872] text-white text-[10px] flex justify-between px-4">
                            <span>Done {dailyTasks.filter(t => t.isCompleted).length}</span>
                            <span>Left {dailyTasks.filter(t => !t.isCompleted).length}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
