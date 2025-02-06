import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
    Home,
    LayoutDashboard,
    Wallet2,
    Bell,
    Bookmark,
    MessageSquare,
    Radio,
    CreditCard,
    BarChart2,
    Settings,
    Menu,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

const sidebarLinks = [
    { icon: Home, label: "sidebar.home", href: "/" },
    { icon: LayoutDashboard, label: "sidebar.quest", href: "/quest" },
    { icon: Wallet2, label: "sidebar.wallet", href: "/wallet" },
    { icon: Bell, label: "sidebar.notification", href: "/notifications" },
    { icon: Bookmark, label: "sidebar.bookmarks", href: "/bookmarks" },
    { icon: MessageSquare, label: "sidebar.hi", href: "/messages" },
    { icon: Radio, label: "sidebar.channel", href: "/channel" },
    { icon: CreditCard, label: "sidebar.credit", href: "/credit" },
    { icon: BarChart2, label: "sidebar.xp", href: "/xp" },
    { icon: Settings, label: "sidebar.more", href: "/settings" },
]

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const { t } = useTranslation()

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-16 flex items-center px-4 border-b">
                {!collapsed && (
                    <Link to="/" className="text-xl font-bold text-emerald-600">
                        DApp
                    </Link>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {sidebarLinks.map((link) => (
                    <Link
                        key={link.href}
                        to={link.href}
                        className={`
              flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100
              transition-colors group
              ${location.pathname === link.href ? "bg-emerald-50 text-emerald-600" : ""}
            `}
                    >
                        <link.icon
                            className={`h-5 w-5 ${location.pathname === link.href ? "text-emerald-600" : "text-gray-500"} group-hover:text-emerald-600`}
                        />
                        {!collapsed && <span className="ml-3 text-sm font-medium">{t(link.label)}</span>}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
                <button
                    className={`
          w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 
          rounded-lg hover:bg-emerald-700 transition-colors
        `}
                >
                    {collapsed ? "+" : t("sidebar.newPost")}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={`
        hidden md:block fixed left-0 top-0 h-screen bg-white border-r transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
            >
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            <Sheet onOpenChange={(isOpen) => setCollapsed(isOpen)}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        </>
    )
}

