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
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, Trash2, CreditCard } from "lucide-react"
import Link from "next/link"

interface CreditCardItem {
  id: string
  name: string
  outstandingBalance: number
  creditLimit: number
  interestRate: number
  minimumPayment: number
  category: "rewards" | "cashback" | "travel" | "business" | "secured" | "other"
  dateAdded: string
  description?: string
}

const mockCreditCardItems: CreditCardItem[] = [
  {
    id: "1",
    name: "Chase Sapphire Preferred",
    outstandingBalance: 2500,
    creditLimit: 15000,
    interestRate: 18.99,
    minimumPayment: 75,
    category: "travel",
    dateAdded: "2023-01-15",
    description: "Travel rewards credit card",
  },
  {
    id: "2",
    name: "Capital One Quicksilver",
    outstandingBalance: 800,
    creditLimit: 8000,
    interestRate: 22.99,
    minimumPayment: 25,
    category: "cashback",
    dateAdded: "2023-03-10",
    description: "1.5% cashback on all purchases",
  },
  {
    id: "3",
    name: "American Express Gold",
    outstandingBalance: 1200,
    creditLimit: 12000,
    interestRate: 20.99,
    minimumPayment: 35,
    category: "rewards",
    dateAdded: "2023-05-20",
    description: "Dining and grocery rewards",
  },
]

export default function CreditCardsPage() {
  const [creditCardItems, setCreditCardItems] = useState<CreditCardItem[]>(mockCreditCardItems)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    outstandingBalance: "",
    creditLimit: "",
    interestRate: "",
    minimumPayment: "",
    category: "rewards",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: CreditCardItem = {
      id: Date.now().toString(),
      name: formData.name,
      outstandingBalance: Number.parseFloat(formData.outstandingBalance),
      creditLimit: Number.parseFloat(formData.creditLimit),
      interestRate: Number.parseFloat(formData.interestRate),
      minimumPayment: Number.parseFloat(formData.minimumPayment),
      category: formData.category as CreditCardItem["category"],
      dateAdded: new Date().toISOString().split("T")[0],
      description: formData.description,
    }

    setCreditCardItems((prev) => [newItem, ...prev])
    setFormData({
      name: "",
      outstandingBalance: "",
      creditLimit: "",
      interestRate: "",
      minimumPayment: "",
      category: "rewards",
      description: "",
    })
    setShowForm(false)
  }

  const deleteItem = (id: string) => {
    setCreditCardItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "rewards":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "cashback":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "travel":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "business":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "secured":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return "text-red-600"
    if (utilization >= 50) return "text-orange-600"
    if (utilization >= 30) return "text-yellow-600"
    return "text-green-600"
  }

  const totalOutstanding = creditCardItems.reduce((total, item) => total + item.outstandingBalance, 0)
  const totalCreditLimit = creditCardItems.reduce((total, item) => total + item.creditLimit, 0)
  const totalMinimumPayments = creditCardItems.reduce((total, item) => total + item.minimumPayment, 0)
  const overallUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit) * 100 : 0

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
                <h1 className="text-2xl font-bold text-foreground">Credit Card Management</h1>
                <p className="text-muted-foreground">Track and manage your credit card balances</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Credit Card
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Credit Card Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold text-red-600">${totalOutstanding.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credit Limit</p>
                <p className="text-2xl font-bold text-blue-600">${totalCreditLimit.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credit Utilization</p>
                <p className={`text-2xl font-bold ${getUtilizationColor(overallUtilization)}`}>
                  {overallUtilization.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Min. Payments</p>
                <p className="text-2xl font-bold text-orange-600">${totalMinimumPayments.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Credit Utilization</span>
                <span className={`text-sm font-medium ${getUtilizationColor(overallUtilization)}`}>
                  {overallUtilization.toFixed(1)}%
                </span>
              </div>
              <Progress value={overallUtilization} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Add Credit Card Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Credit Card</CardTitle>
              <CardDescription>Enter details about your credit card</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Card Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Chase Sapphire Preferred"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="outstandingBalance">Outstanding Balance ($)</Label>
                    <Input
                      id="outstandingBalance"
                      type="number"
                      step="0.01"
                      value={formData.outstandingBalance}
                      onChange={(e) => setFormData((prev) => ({ ...prev, outstandingBalance: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditLimit">Credit Limit ($)</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      step="0.01"
                      value={formData.creditLimit}
                      onChange={(e) => setFormData((prev) => ({ ...prev, creditLimit: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (% APR)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      value={formData.interestRate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, interestRate: e.target.value }))}
                      placeholder="e.g., 18.99"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumPayment">Minimum Payment ($)</Label>
                    <Input
                      id="minimumPayment"
                      type="number"
                      step="0.01"
                      value={formData.minimumPayment}
                      onChange={(e) => setFormData((prev) => ({ ...prev, minimumPayment: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
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
                        <SelectItem value="rewards">Rewards</SelectItem>
                        <SelectItem value="cashback">Cashback</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="secured">Secured</SelectItem>
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
                    placeholder="Additional details about this credit card"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Credit Card</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Credit Card Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Credit Cards</CardTitle>
            <CardDescription>All your tracked credit cards</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card Name</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Min. Payment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditCardItems.map((item) => {
                  const utilization = (item.outstandingBalance / item.creditLimit) * 100
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        ${item.outstandingBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-blue-600">${item.creditLimit.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                            {utilization.toFixed(1)}%
                          </span>
                          <Progress value={utilization} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>{item.interestRate}%</TableCell>
                      <TableCell className="font-medium">${item.minimumPayment.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                      </TableCell>
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
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
