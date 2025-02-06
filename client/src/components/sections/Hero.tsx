import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, LayoutDashboard, Wallet2, Bell, Bookmark, MessageSquare, Radio, CreditCard, BarChart2, Settings, ChevronLeft } from 'lucide-react'

const sidebarLinks = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: LayoutDashboard, label: 'Quest', href: '/quest' },
    { icon: Wallet2, label: 'L2 Wallet', href: '/wallet' },
    { icon: Bell, label: 'Notification', href: '/notifications' },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
    { icon: MessageSquare, label: 'Hi', href: '/messages' },
    { icon: Radio, label: 'Channel', href: '/channel' },
    { icon: CreditCard, label: 'Credit', href: '/credit' },
    { icon: BarChart2, label: 'XP', href: '/xp' },
    { icon: Settings, label: 'More', href: '/settings' },
]

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className={`
      fixed left-0 top-0 h-screen bg-white border-r transition-all duration-300
      ${collapsed ? 'w-20' : 'w-64'}
    `}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="h-16 flex items-center px-4 border-b">
                    {!collapsed && (
                        <Link to="/" className="text-xl font-bold text-emerald-600">
                            DApp
                        </Link>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`
              p-2 rounded-lg hover:bg-gray-100 transition-colors
              ${collapsed ? 'mx-auto' : 'ml-auto'}
            `}
                    >
                        <ChevronLeft className={`
              h-5 w-5 transition-transform
              ${collapsed ? 'rotate-180' : ''}
            `} />
                    </button>
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
              `}
                        >
                            <link.icon className="h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
                            {!collapsed && (
                                <span className="ml-3 text-sm font-medium">{link.label}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t">
                    <button className={`
            w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 
            rounded-lg hover:bg-emerald-700 transition-colors
          `}>
                        {collapsed ? '+' : 'New Post'}
                    </button>
                </div>
            </div>
        </div>
    )
}
