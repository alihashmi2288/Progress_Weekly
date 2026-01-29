
import { QuoteBlock } from "@/components/dashboard/QuoteBlock"
import { OverallProgress } from "@/components/dashboard/OverallProgress"
import { HabitTracker } from "@/components/dashboard/HabitTracker"
import { WeeklyView } from "@/components/dashboard/WeeklyView"
import { NotesSection } from "@/components/dashboard/NotesSection"
import { getDashboardData } from "../actions" // Adjusted import path
import { Navbar } from "@/components/layout/Navbar"
import { WeekPicker } from "@/components/dashboard/WeekPicker"

export default async function DashboardPage() {
    // Fetch data server-side
    const { habits, tasks, weeklyPlan, notes } = await getDashboardData()

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <Navbar />
            <main className="flex-1 pt-6 p-4 md:p-8 font-sans text-gray-800 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-6 pb-20"> {/* Added pb-20 for scroll space */}

                    {/* Top Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6"> {/* Removed fixed height constraint */}

                        {/* Left Column: Quote + Date */}
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            {/* Quote Block */}
                            <div className="w-full">
                                <QuoteBlock />
                            </div>

                            {/* Start of Week Block */}
                            <WeekPicker planId={weeklyPlan.id} startDate={weeklyPlan.startDate} />
                        </div>

                        {/* Middle Column: Overall Progress */}
                        <div className="lg:col-span-4">
                            <OverallProgress habits={habits} tasks={tasks} />
                        </div>

                        {/* Right Column: Habit Tracker */}
                        <div className="lg:col-span-5">
                            <HabitTracker habits={habits} />
                        </div>

                    </div>

                    {/* Notes Section - Full Width */}
                    <div className="w-full">
                        <NotesSection notes={notes} />
                    </div>

                    {/* Bottom Section: Weekly View */}
                    <div className="w-full">
                        <WeeklyView tasks={tasks} />
                    </div>

                </div>
            </main>
        </div>
    )
}
