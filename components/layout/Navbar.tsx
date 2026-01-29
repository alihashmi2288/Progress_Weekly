
import Link from "next/link"
import { auth } from "@/auth"
import { signOut } from "@/auth" // We might need a client component for signout or a server action
import { LogOut, LayoutDashboard, User } from "lucide-react"

async function SignOutButton() {
    "use server"
    await signOut({ redirectTo: "/" })
}

export async function Navbar() {
    const session = await auth()

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 h-16 shadow-sm">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-[#65a34e] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:rotate-3 transition-transform">
                        W
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-800">Progress<span className="text-[#65a34e]">Weekly</span></span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#65a34e] transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>

                            <div className="h-6 w-px bg-gray-200 hidden md:block" />

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#f0fdf4] border border-[#65a34e]/20 flex items-center justify-center text-[#65a34e] font-semibold text-xs">
                                        {session.user?.name?.charAt(0) || "U"}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                        {session.user?.name?.split(" ")[0]}
                                    </span>
                                </div>

                                <form action={SignOutButton}>
                                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all" title="Sign Out">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#65a34e] px-3 py-2">
                                Log in
                            </Link>
                            <Link href="/signup" className="text-sm font-bold text-white bg-[#65a34e] hover:bg-[#538a3f] px-4 py-2 rounded-lg shadow-md transition-all">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
