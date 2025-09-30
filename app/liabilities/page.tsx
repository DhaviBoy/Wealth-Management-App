"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, TrendingDown } from "lucide-react"
import Link from "next/link"

interface LiabilityItem {
  id: string
  name: string
  amount: number
  interestRate: number
  category: "mortgage" | "auto-loan" | "student-loan" | "personal-loan" | "business-loan" | "other"
  monthlyPayment: number
  dateAdded: string
  description?: string
}

const mockLiabilityItems: LiabilityItem[] = [
  {
    id: "1",
    name: "Home Mortgage",
    amount: 320000,
    interestRate: 3.5,
    category: "mortgage",
    monthlyPayment: 1800,
    dateAdded: "2023-06-15",
    description: "30-year fixed rate mortgage",
  },
  {
    id: "2",
    name: "Car Loan",
    amount: 28000,
    interestRate: 4.2,
    category: "auto-loan",
    monthlyPayment: 520,
    dateAdded: "2023-08-10",
    description: "2023 Honda Accord financing",
  },
  {
    id: "3",
    name: "Student Loan",
    amount: 45000,
    interestRate: 5.8,
    category: "student-loan",
    monthlyPayment: 350,
    dateAdded: "2020-09-01",
    description: "Graduate school education loan",
  },
]

export default function LiabilitiesPage() {
  const [liabilityItems, setLiabilityItems] = useState<LiabilityItem[]>(mockLiabilityItems)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    interestRate: "",
    category: "personal-loan",
    monthlyPayment: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: LiabilityItem = {
      id: Date.now().toString(),
      name: formData.name,
      amount: Number.parseFloat(formData.amount),
      interestRate: Number.parseFloat(formData.interestRate),
      category: formData.category as LiabilityItem["category"],
      monthlyPayment: Number.parseFloat(formData.monthlyPayment),
      dateAdded: new Date().toISOString().split("T")[0],
      description: formData.description,
    }

    setLiabilityItems((prev) => [newItem, ...prev])
    setFormData({
      name: "",
      amount: "",
      interestRate: "",
      category: "personal-loan",
      monthlyPayment: "",
      description: "",
    })
    setShowForm(false)
  }

  const deleteItem = (id: string) => {
    setLiabilityItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mortgage":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "auto-loan":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "student-loan":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "personal-loan":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "business-loan":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const totalLiabilities = liabilityItems.reduce((total, item) => total + item.amount, 0)
  const totalMonthlyPayments = liabilityItems.reduce((total, item) => total + item.monthlyPayment, 0)
  const averageInterestRate = liabilityItems.reduce((sum, item, _, arr) => sum + item.interestRate / arr.length, 0)

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
                <h1 className="text-2xl font-bold text-foreground">Liability Management</h1>
                <p className="text-muted-foreground">Track and manage your debts and liabilities</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Liability
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Liability Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Liabilities</p>
                <p className="text-2xl font-bold text-red-600">${totalLiabilities.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payments</p>
                <p className="text-2xl font-bold text-orange-600">${totalMonthlyPayments.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Interest Rate</p>
                <p className="text-2xl font-bold text-foreground">{averageInterestRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Number of Debts</p>
                <p className="text-2xl font-bold text-foreground">{liabilityItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Liability Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Liability</CardTitle>
              <CardDescription>Enter details about your debt or liability</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Liability Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Home Mortgage"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Outstanding Amount ($)</Label>
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
                    <Label htmlFor="interestRate">Interest Rate (% per year)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, interestRate: e.target.value }))}
                      placeholder="e.g., 3.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyPayment">Monthly Payment ($)</Label>
                    <Input
                      id="monthlyPayment"
                      type="number"
                      step="0.01"
                      value={formData.monthlyPayment}
                      onChange={(e) => setFormData((prev) => ({ ...prev, monthlyPayment: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mortgage">Mortgage</SelectItem>
                        <SelectItem value="auto-loan">Auto Loan</SelectItem>
                        <SelectItem value="student-loan">Student Loan</SelectItem>
                        <SelectItem value="personal-loan">Personal Loan</SelectItem>
                        <SelectItem value="business-loan">Business Loan</SelectItem>
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
                    placeholder="Additional details about this liability"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Liability</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Liability Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Liabilities</CardTitle>
            <CardDescription>All your tracked debts and liabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Liability Name</TableHead>
                  <TableHead>Outstanding Amount</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Monthly Payment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liabilityItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-red-600">${item.amount.toLocaleString()}</TableCell>
                    <TableCell>{item.interestRate}%</TableCell>
                    <TableCell className="font-medium">${item.monthlyPayment.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(item.category)}>{item.category.replace("-", " ")}</Badge>
                    </TableCell>
                    <TableCell>{new Date(item.dateAdded).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
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
