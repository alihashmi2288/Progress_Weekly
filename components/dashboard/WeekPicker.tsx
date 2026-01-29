
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { updateWeeklyPlanDate } from "@/app/actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function WeekPicker({ planId, startDate }: { planId: string, startDate: Date }) {
    const [date, setDate] = useState<Date | undefined>(new Date(startDate))
    const [isSaving, setIsSaving] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = async (newDate: Date | undefined) => {
        if (!newDate) return
        setDate(newDate)
        setIsSaving(true)
        setIsOpen(false)
        try {
            // Ensure we are saving the date correctly without TZ shifts causing day jumps
            // Simple hack: Set hours to 12:00 to avoid edges
            const safeDate = new Date(newDate)
            safeDate.setHours(12, 0, 0, 0)
            await updateWeeklyPlanDate(planId, safeDate)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="bg-white p-0 flex rounded-md overflow-hidden shadow-sm h-12 relative group transition-all hover:ring-1 hover:ring-[#65a34e]">
            <div className="bg-[#65a34e] text-white px-4 flex items-center font-bold text-sm whitespace-nowrap">
                Start of the week
            </div>
            <div className="flex-1 font-bold text-gray-700 bg-white">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"ghost"}
                            className={cn(
                                "w-full h-full justify-start text-left font-bold text-gray-700 hover:bg-transparent hover:text-gray-900 rounded-none",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#65a34e]" />
                            {isSaving ? (
                                <span className="flex items-center gap-2 text-gray-400">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Updating...
                                </span>
                            ) : (
                                date ? format(date, "MM/dd/yyyy") : <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
