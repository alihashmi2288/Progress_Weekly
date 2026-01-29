"use client"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { addNote, deleteNote } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function NotesSection({ notes }: { notes: any[] }) {
    const [isAdding, setIsAdding] = useState(false)

    // Colors for sticky notes to cycle through or pick random
    const colors = ["bg-[#e6f4e2]", "bg-yellow-50", "bg-blue-50", "bg-pink-50"]

    return (
        <Card className="shadow-sm border-none bg-white/50 backdrop-blur-sm mt-4">
            <CardHeader className="bg-[#65a34e] py-2 px-4 rounded-t-lg flex flex-row justify-between items-center shadow-md">
                <CardTitle className="text-white text-lg font-bold">Notes</CardTitle>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                    title="Add Note"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </CardHeader>

            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[200px]">
                {isAdding && (
                    <form
                        action={async (formData) => {
                            await addNote(formData)
                            setIsAdding(false)
                        }}
                        className="aspect-square bg-white border-2 border-[#65a34e] border-dashed rounded-lg p-4 flex flex-col gap-2 shadow-sm"
                    >
                        <textarea
                            name="content"
                            className="flex-1 w-full resize-none outline-none text-sm bg-transparent"
                            placeholder="Type your note..."
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                            <button type="submit" className="bg-[#65a34e] text-white px-3 py-1 rounded text-xs font-bold">Save</button>
                        </div>
                    </form>
                )}

                {notes.map((note, index) => (
                    <div
                        key={note.id}
                        className={`aspect-square p-4 rounded-lg shadow-sm border border-black/5 hover:shadow-md transition-shadow relative group flex flex-col ${colors[index % colors.length]}`}
                    >
                        <button
                            onClick={() => deleteNote(note.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <p className="whitespace-pre-wrap text-sm text-gray-700 font-medium font-handwriting">
                            {note.content}
                        </p>
                    </div>
                ))}

                {notes.length === 0 && !isAdding && (
                    <div className="col-span-full flex items-center justify-center text-gray-400 text-sm italic h-32">
                        No notes yet. Click + to add one.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
