"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, DollarSign } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getIncomeItems, addIncomeItem, deleteIncomeItem, calculateTotalIncome, type IncomeItem } from "@/lib/storage"

export default function IncomePage() {
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    frequency: "monthly",
    category: "salary",
    description: "",
  })
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      setIncomeItems(getIncomeItems())
    } else {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: IncomeItem = {
      id: Date.now().toString(),
      source: formData.source,
      amount: Number.parseFloat(formData.amount),
      frequency: formData.frequency as IncomeItem["frequency"],
      category: formData.category as IncomeItem["category"],
      dateAdded: new Date().toISOString().split("T")[0],
      description: formData.description,
    }

    addIncomeItem(newItem)
    setIncomeItems(getIncomeItems())
    setFormData({
      source: "",
      amount: "",
      frequency: "monthly",
      category: "salary",
      description: "",
    })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    deleteIncomeItem(id)
    setIncomeItems(getIncomeItems())
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "salary":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "freelance":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "investment":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "business":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const totalMonthlyIncome = calculateTotalIncome()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Income Management</h1>
                <p className="text-muted-foreground">Track and manage your income sources</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Income Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">${totalMonthlyIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Income Sources</p>
                <p className="text-2xl font-bold text-foreground">{incomeItems.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Projection</p>
                <p className="text-2xl font-bold text-blue-600">${(totalMonthlyIncome * 12).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Income Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Income Source</CardTitle>
              <CardDescription>Enter details about your income source</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source">Income Source</Label>
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g., Software Engineer Salary"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details about this income source"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Income</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Income Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>All your tracked income sources</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.source}</p>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">${item.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.frequency}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                    </TableCell>
                    <TableCell>{new Date(item.dateAdded).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
