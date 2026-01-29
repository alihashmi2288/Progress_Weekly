"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getSession() {
    const session = await auth()
    return session
}

export async function protectRoute() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }
    return session
}

export async function getDashboardData() {
    const session = await protectRoute()
    const userId = session.user?.id

    if (!userId) {
        throw new Error("User ID not found")
    }

    // Fetch Habits including Logs
    const habits = await prisma.habit.findMany({
        where: { userId },
        include: {
            logs: true
        },
        orderBy: { createdAt: "asc" }
    })

    // Fetch Tasks for the current week (simplified: fetching all for now, can filter by date later)
    const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    })

    // Fetch or Create Weekly Plan for current week
    // For simplicity, we just get the latest one or create a default
    let weeklyPlan = await prisma.weeklyPlan.findFirst({
        where: { userId },
        orderBy: { startDate: "desc" }
    })

    if (!weeklyPlan) {
        // Create a default plan if none exists
        const startOfWeek = new Date(); // Logic to find Sunday needed realistically, but for MVP now:
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        weeklyPlan = await prisma.weeklyPlan.create({
            data: {
                userId,
                startDate: startOfWeek,
                endDate: endOfWeek,
                quote: "Inspiration comes only during work"
            }
        })
    }

    const notes = await prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    })

    return { habits, tasks, weeklyPlan, notes }
}

export async function toggleHabit(habitId: string, date: Date) {
    const session = await protectRoute()

    // Normalize date to remove time component for consistent querying
    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)

    const existingLog = await prisma.habitLog.findFirst({
        where: {
            habitId,
            date: normalizedDate
        }
    })

    if (existingLog) {
        await prisma.habitLog.delete({
            where: { id: existingLog.id }
        })
    } else {
        await prisma.habitLog.create({
            data: {
                habitId,
                date: normalizedDate,
                completed: true
            }
        })
    }

    revalidatePath("/")
}

export async function toggleTask(taskId: string) {
    await protectRoute()

    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task) return;

    await prisma.task.update({
        where: { id: taskId },
        data: { isCompleted: !task.isCompleted }
    })

    revalidatePath("/")
}

export async function addTask(formData: FormData) {
    const session = await protectRoute()
    const userId = session.user?.id

    if (!userId) return;

    const title = formData.get("title") as string
    const day = formData.get("day") as string // e.g. "Monday"

    if (!title) return;

    await prisma.task.create({
        data: {
            userId,
            title,
            dayOfWeek: day,
            isCompleted: false
        }
    })

    revalidatePath("/")
}

export async function createHabit(formData: FormData) {
    const session = await protectRoute()
    const userId = session.user?.id
    if (!userId) return;

    const name = formData.get("name") as string
    if (!name) return;

    await prisma.habit.create({
        data: {
            userId,
            title: name,
            frequency: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] // Default daily
        }
    })
    revalidatePath("/dashboard")
}

export async function updateWeeklyPlanDate(planId: string, newStartDate: Date) {
    await protectRoute()

    const start = new Date(newStartDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    await prisma.weeklyPlan.update({
        where: { id: planId },
        data: {
            startDate: start,
            endDate: end
        }
    })

    revalidatePath("/dashboard")
}

export async function addNote(formData: FormData) {
    const session = await protectRoute()
    const userId = session.user?.id
    if (!userId) return;

    const content = formData.get("content") as string
    if (!content) return;

    // Random rotation for sticky note effect
    // We can just store content for now.

    await prisma.note.create({
        data: {
            userId,
            content,
            color: "bg-yellow-100" // Default
        }
    })
    revalidatePath("/dashboard")
}


export async function deleteNote(noteId: string) {
    await protectRoute()
    try {
        await prisma.note.delete({ where: { id: noteId } })
    } catch (error: any) {
        if (error.code !== 'P2025') throw error
    }
    revalidatePath("/dashboard")
}

import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password || !name) {
        throw new Error("Missing fields")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        throw new Error("User already exists")
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
}

export async function deleteHabit(habitId: string) {
    await protectRoute()
    try {
        await prisma.habit.delete({ where: { id: habitId } })
    } catch (error: any) {
        if (error.code !== 'P2025') throw error
    }
    revalidatePath("/dashboard")
}

export async function updateHabitName(habitId: string, newName: string) {
    await protectRoute()
    await prisma.habit.update({
        where: { id: habitId },
        data: { title: newName }
    })
    revalidatePath("/dashboard")
}

export async function deleteTask(taskId: string) {
    await protectRoute()
    try {
        await prisma.task.delete({ where: { id: taskId } })
    } catch (error: any) {
        if (error.code !== 'P2025') throw error
    }
    revalidatePath("/dashboard")
}

export async function updateTaskTitle(taskId: string, newTitle: string) {
    await protectRoute()
    await prisma.task.update({
        where: { id: taskId },
        data: { title: newTitle }
    })
    revalidatePath("/dashboard")
}
