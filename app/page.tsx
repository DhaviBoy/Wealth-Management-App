"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Plus, TrendingUp, TrendingDown, DollarSign, CreditCard, Building, Lightbulb, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  calculateTotalIncome,
  calculateTotalAssets,
  calculateTotalLiabilities,
  calculateTotalCreditCardDebt,
  calculateNetWorth,
  initializeSampleData,
} from "@/lib/storage"

// Mock data for charts (in a real app, this would come from historical data)
const mockIncomeData = [
  { month: "Jan", amount: 5000 },
  { month: "Feb", amount: 5200 },
  { month: "Mar", amount: 5400 },
  { month: "Apr", amount: 5600 },
  { month: "May", amount: 5800 },
  { month: "Jun", amount: 6000 },
]

const mockAssetData = [
  { month: "Jan", amount: 25000 },
  { month: "Feb", amount: 26500 },
  { month: "Mar", amount: 28000 },
  { month: "Apr", amount: 29800 },
  { month: "May", amount: 31200 },
  { month: "Jun", amount: 33000 },
]

const mockLiabilityData = [
  { month: "Jan", amount: 15000 },
  { month: "Feb", amount: 14500 },
  { month: "Mar", amount: 14000 },
  { month: "Apr", amount: 13400 },
  { month: "May", amount: 12800 },
  { month: "Jun", amount: 12200 },
]

export default function Dashboard() {
  const [currentIncome, setCurrentIncome] = useState(0)
  const [totalAssets, setTotalAssets] = useState(0)
  const [totalLiabilities, setTotalLiabilities] = useState(0)
  const [creditCardDebt, setCreditCardDebt] = useState(0)
  const [netWorth, setNetWorth] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")

    if (authStatus === "true" && email) {
      setIsAuthenticated(true)
      setUserEmail(email)

      // Initialize sample data if needed
      initializeSampleData()

      // Load financial data
      setCurrentIncome(calculateTotalIncome())
      setTotalAssets(calculateTotalAssets())
      setTotalLiabilities(calculateTotalLiabilities())
      setCreditCardDebt(calculateTotalCreditCardDebt())
      setNetWorth(calculateNetWorth())
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const mockPortfolioData = [
    { name: "Assets", value: totalAssets, color: "#10b981" },
    { name: "Liabilities", value: totalLiabilities + creditCardDebt, color: "#ef4444" },
    { name: "Net Worth", value: netWorth, color: "#3b82f6" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">PocketTracker</h1>
              <p className="text-muted-foreground">Welcome back, {userEmail}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/recommendations">
                <Button className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Get Recommendations
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Income</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${currentIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Monthly income
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalAssets.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Asset portfolio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalLiabilities.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 mr-1" />
                Outstanding debt
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Card Debt</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">${creditCardDebt.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 mr-1" />
                Credit balances
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Net Worth Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader>
            <CardTitle className="text-xl">Net Worth</CardTitle>
            <CardDescription>Your total financial position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 mb-2">${netWorth.toLocaleString()}</div>
            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className={
                  netWorth >= 0
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }
              >
                {netWorth >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Positive Net Worth
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Negative Net Worth
                  </>
                )}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {netWorth >= 0
                  ? `Assets exceed liabilities by $${netWorth.toLocaleString()}`
                  : `Liabilities exceed assets by $${Math.abs(netWorth).toLocaleString()}`}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Income Growth</CardTitle>
              <CardDescription>Monthly income trend over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Income"]} />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Assets Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Assets Growth</CardTitle>
              <CardDescription>Asset value progression</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockAssetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Assets"]} />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Liabilities Reduction Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Liabilities Reduction</CardTitle>
              <CardDescription>Debt paydown progress</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockLiabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Liabilities"]} />
                  <Bar dataKey="amount" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Portfolio Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Overview</CardTitle>
              <CardDescription>Financial position breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockPortfolioData.filter((item) => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                  >
                    {mockPortfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your financial data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/income">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <Plus className="h-5 w-5" />
                  Add Income
                </Button>
              </Link>
              <Link href="/assets">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <Plus className="h-5 w-5" />
                  Add Asset
                </Button>
              </Link>
              <Link href="/liabilities">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <Plus className="h-5 w-5" />
                  Add Liability
                </Button>
              </Link>
              <Link href="/credit-cards">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <Plus className="h-5 w-5" />
                  Add Credit Card
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
