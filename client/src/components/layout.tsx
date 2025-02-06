import type { ReactNode } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface LayoutProps {
    children: ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden lg:ml-[16rem]">
                    <Header />
                    <main className="flex-1 overflow-y-auto">{children}</main>
                </div>
            </div>
        </div>
    )
}

