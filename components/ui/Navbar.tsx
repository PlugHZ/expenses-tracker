'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, List, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth'

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()

    const links = [
        { href: '/', label: 'รายการ', icon: List },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]

    const handleSignOut = async () => {
        await signOut()
        router.push('/auth')
        router.refresh()
    }

    return (
        <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                <span className="font-bold text-zinc-100">บันทึกรายรับรายจ่าย</span>
                <div className="flex items-center gap-1">
                    {links.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === href
                                    ? 'bg-amber-500/10 text-amber-400'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                                }`}
                        >
                            <Icon size={15} />
                            {label}
                        </Link>
                    ))}

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-all ml-2"
                    >
                        <LogOut size={15} />
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </nav>
    )
}