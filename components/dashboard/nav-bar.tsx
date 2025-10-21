"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useTranslation } from "@/lib/i18n-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LayoutDashboard, Wallet, Send, Download, ShoppingCart, LogOut, Languages } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { SeesawBrand } from "@/components/ui/logo"

const navItems = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/loan", labelKey: "nav.portfolio", icon: Wallet },
  { href: "/send", labelKey: "nav.send", icon: Send },
  { href: "/receive", labelKey: "nav.receive", icon: Download },
  { href: "/buy", labelKey: "nav.buy", icon: ShoppingCart },
]

export function NavBar() {
  const { logout, user } = usePrivy()
  const { t, language, setLanguage } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ko" : "en")
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const getUserInitials = () => {
    if (!user) return "U"

    // Try to get email from various sources
    const email = user.email?.address || user.google?.email || user.twitter?.username

    if (email && typeof email === "string") {
      const name = email.split("@")[0]
      return name.slice(0, 2).toUpperCase()
    }

    // If no email, try wallet address
    if (user.wallet?.address) {
      return user.wallet.address.slice(2, 4).toUpperCase()
    }

    return "U"
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard">
            <SeesawBrand className="scale-90" />
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn("gap-2", isActive && "bg-accent/10 text-accent")}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
              <Languages className="h-4 w-4" />
              <span className="hidden md:inline">{language.toUpperCase()}</span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">{t("nav.logout")}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
