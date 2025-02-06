import {
    DollarSign,
    Home,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import i18n from "@/i18n"


const sidebarItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: DollarSign, label: "Price", href: "/price" },

]

export function Sidebar({ mobile }: { mobile?: boolean }) {

    const location = useLocation()
    const { t } = useTranslation()


    const changeLanguage = (
        lan: string
    ): void => {
        i18n.changeLanguage(
            lan
        )
    };

    return (
        <div className={cn("bg-white border-r", mobile ? "w-full h-full" : "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0")}>
            <div className="flex items-center px-3 py-4 border-b">
                <span className="text-xl font-bold text-emerald-600">DApp</span>
            </div>
            <div className="flex justify-between flex-col space-y-1 overflow-y-auto h-full">
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((link) => (
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
                            {<span className="ml-3 text-sm font-medium">{t(`sidebar.${link.label.toLowerCase()}`)}</span>}

                        </Link>
                    ))}
                </nav>
                <div className="flex flex-col w-full mt-auto">
                    <div className="flex items-center justify-center p-4">
                        <Button
                            onClick={() => changeLanguage("en")}
                            variant="ghost" className={`${i18n.language === "en" ? "bg-emerald-50 text-emerald-600" : "hover:bg-emerald-50 hover:text-emerald-600"
                                } w-full justify-center`}>
                            EN
                        </Button>
                        <Button
                            onClick={() => changeLanguage("ru")}
                            variant="ghost" className={`${i18n.language === "ru" ? "bg-emerald-50 text-emerald-600" : "hover:bg-emerald-50 hover:text-emerald-600"
                                } w-full justify-center`}>
                            RU
                        </Button>
                    </div>
                </div>

            </div>


        </div>
    )
}