"use client"

import { Card, CardContent } from "@/components/ui/card"

export function QuoteBlock() {
    return (
        <Card className="flex items-center justify-center h-full shadow-sm border-none bg-white/50 backdrop-blur-sm p-0">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-600 leading-tight">
                    Inspiration comes only<br />during work
                </h2>
            </CardContent>
        </Card>
    )
}
