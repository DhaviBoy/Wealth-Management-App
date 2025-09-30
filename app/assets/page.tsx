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
import { ArrowLeft, Plus, Trash2, Building } from "lucide-react"
import Link from "next/link"

interface AssetItem {
  id: string
  name: string
  value: number
  category: "real-estate" | "stocks" | "bonds" | "crypto" | "cash" | "other"
  interestRate?: number
  dateAdded: string
  description?: string
}

const mockAssetItems: AssetItem[] = [
  {
    id: "1",
    name: "Primary Residence",
    value: 450000,
    category: "real-estate",
    interestRate: 3.2,
    dateAdded: "2023-06-15",
    description: "3BR/2BA house in downtown area",
  },
  {
    id: "2",
    name: "Stock Portfolio",
    value: 85000,
    category: "stocks",
    interestRate: 8.5,
    dateAdded: "2023-01-10",
    description: "Diversified index funds and individual stocks",
  },
  {
    id: "3",
    name: "Emergency Fund",
    value: 25000,
    category: "cash",
    interestRate: 4.5,
    dateAdded: "2023-01-01",
    description: "High-yield savings account",
  },
  {
    id: "4",
    name: "Cryptocurrency",
    value: 12000,
    category: "crypto",
    dateAdded: "2023-03-20",
    description: "Bitcoin and Ethereum holdings",
  },
]

export default function AssetsPage() {
  const [assetItems, setAssetItems] = useState<AssetItem[]>(mockAssetItems)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    category: "stocks",
    interestRate: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: AssetItem = {
      id: Date.now().toString(),
      name: formData.name,
      value: Number.parseFloat(formData.value),
      category: formData.category as AssetItem["category"],
      interestRate: formData.interestRate ? Number.parseFloat(formData.interestRate) : undefined,
      dateAdded: new Date().toISOString().split("T")[0],
      description: formData.description,
    }

    setAssetItems((prev) => [newItem, ...prev])
    setFormData({
      name: "",
      value: "",
      category: "stocks",
      interestRate: "",
      description: "",
    })
    setShowForm(false)
  }

  const deleteItem = (id: string) => {
    setAssetItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "real-estate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "stocks":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "bonds":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "crypto":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "cash":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const totalAssetValue = assetItems.reduce((total, item) => total + item.value, 0)
  const averageReturn = assetItems
    .filter((item) => item.interestRate)
    .reduce((sum, item, _, arr) => sum + (item.interestRate || 0) / arr.length, 0)

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
                <h1 className="text-2xl font-bold text-foreground">Asset Management</h1>
                <p className="text-muted-foreground">Track and manage your assets</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Asset Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Asset Value</p>
                <p className="text-2xl font-bold text-green-600">${totalAssetValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Number of Assets</p>
                <p className="text-2xl font-bold text-foreground">{assetItems.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Return</p>
                <p className="text-2xl font-bold text-blue-600">{averageReturn.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Asset Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Asset</CardTitle>
              <CardDescription>Enter details about your asset</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Asset Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Primary Residence"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="value">Current Value ($)</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
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
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="stocks">Stocks</SelectItem>
                        <SelectItem value="bonds">Bonds</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="interestRate">Expected Return (% per year)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, interestRate: e.target.value }))}
                      placeholder="e.g., 8.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details about this asset"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Asset</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Asset Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Assets</CardTitle>
            <CardDescription>All your tracked assets</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Expected Return</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">${item.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(item.category)}>{item.category.replace("-", " ")}</Badge>
                    </TableCell>
                    <TableCell>{item.interestRate ? `${item.interestRate}%` : "N/A"}</TableCell>
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
