"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  DollarSign,
  Briefcase,
  CreditCard,
  Building,
  Lightbulb,
  LogOut,
  Menu,
  X,
  Wallet,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Income",
    href: "/income",
    icon: DollarSign,
  },
  {
    title: "Assets",
    href: "/assets",
    icon: Briefcase,
  },
  {
    title: "Credit Cards",
    href: "/credit-cards",
    icon: CreditCard,
  },
  {
    title: "Liabilities",
    href: "/liabilities",
    icon: Building,
  },
  {
    title: "Recommendations",
    href: "/recommendations",
    icon: Lightbulb,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")

    if (authStatus === "true" && email) {
      setIsAuthenticated(true)
      setUserEmail(email)
    } else {
      setIsAuthenticated(false)
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  // Don't show navigation on login/signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null
  }

  // Don't show navigation if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      {/* Decorative gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <div className="mr-6 flex">
          <Link href="/" className="group flex items-center space-x-3 transition-all">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 blur transition-opacity group-hover:opacity-20" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transition-transform group-hover:scale-110">
                <Wallet className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
                Wealth Manager
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-foreground shadow-sm dark:from-blue-500/20 dark:to-purple-500/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm" />
                  )}
                  <Icon className={cn(
                    "relative h-4 w-4 transition-transform group-hover:scale-110",
                    isActive && "text-blue-600 dark:text-blue-400"
                  )} />
                  <span className="relative">{item.title}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 rounded-lg bg-muted/50 px-3 py-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{userEmail}</span>
            </div>
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="group relative overflow-hidden transition-all hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <LogOut className="relative mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              <span className="relative">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="container border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col space-y-2 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "group relative flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-foreground shadow-sm dark:from-blue-500/20 dark:to-purple-500/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    isActive && "text-blue-600 dark:text-blue-400"
                  )} />
                  <span className="flex-1">{item.title}</span>
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                </Link>
              )
            })}
            <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
              <div className="flex items-center space-x-2 rounded-lg bg-muted/50 px-4 py-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{userEmail}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="group w-full justify-start transition-all hover:shadow-md"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}
    </nav>
  )
}
