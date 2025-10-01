"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Wealth Manager
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
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
        <div className="container border-t md:hidden">
          <nav className="flex flex-col space-y-3 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/60"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
            <div className="border-t pt-3">
              <div className="px-3 pb-2 text-sm text-muted-foreground">
                {userEmail}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}
    </nav>
  )
}
