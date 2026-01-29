"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface WeeklyPlanProps {
    habits: any[]
    tasks: any[]
}

export function OverallProgress({ habits, tasks }: WeeklyPlanProps) {
    // Calculate completion for the current week based on task status
    // For a more accurate "Weekly" progress, we should ideally filter tasks by date range
    // and habits by logs in that range.
    // For MVP: We calculate percentage of *Task* completion vs Total Tasks

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.isCompleted).length

    const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

    // Donut chart calculations
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
        <Card className="flex-1 shadow-sm border-none bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-center text-white bg-[#65a34e] py-1 px-4 rounded-md mx-auto w-fit text-lg">
                    Overall Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between gap-8 h-[200px]">
                {/* Simplified Bar Chart Placeholder or we can implement real daily breakdown later */}
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                    Weekly analytics coming soon
                </div>

                {/* Donut Chart */}
                <div className="flex flex-col items-center justify-center relative">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                className="stroke-[#e6f4e2]"
                                strokeWidth="12"
                                fill="transparent"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r={radius}
                                className="stroke-[#65a34e]"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-700">{percentage}%</span>
                        </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-600">
                        {completedTasks} / {totalTasks} Tasks
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
