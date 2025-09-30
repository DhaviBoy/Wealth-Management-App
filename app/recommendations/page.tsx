"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Play, CheckCircle, Lightbulb, ArrowLeft } from "lucide-react"
import Link from "next/link"

type RecommendationStatus = "new" | "in-progress" | "completed"

interface Recommendation {
  id: string
  title: string
  description: string
  category: "debt-reduction" | "investment" | "savings"
  status: RecommendationStatus
  priority: "high" | "medium" | "low"
  estimatedImpact: string
}

const initialRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Pay off high-interest credit card debt first",
    description:
      "Focus on paying off your credit card with 24% APR before other debts. This could save you $600 annually in interest.",
    category: "debt-reduction",
    status: "new",
    priority: "high",
    estimatedImpact: "Save $600/year",
  },
  {
    id: "2",
    title: "Increase emergency fund to 6 months expenses",
    description:
      "Build your emergency fund to cover 6 months of expenses ($36,000). Consider high-yield savings accounts earning 4.5% APY.",
    category: "savings",
    status: "new",
    priority: "high",
    estimatedImpact: "Financial security",
  },
  {
    id: "3",
    title: "Start investing in low-cost index funds",
    description:
      "Consider investing 15% of your income in diversified index funds. With your current income, that's $900/month.",
    category: "investment",
    status: "in-progress",
    priority: "medium",
    estimatedImpact: "Long-term wealth building",
  },
  {
    id: "4",
    title: "Refinance your mortgage for better rates",
    description: "Current rates are lower than your 6.5% mortgage. Refinancing could reduce monthly payments by $200.",
    category: "debt-reduction",
    status: "new",
    priority: "medium",
    estimatedImpact: "Save $2,400/year",
  },
]

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations)
  const [activeFilter, setActiveFilter] = useState<"all" | RecommendationStatus>("all")

  const generateNewRecommendation = () => {
    const newRecommendations = [
      {
        id: Date.now().toString(),
        title: "Consider a Roth IRA contribution",
        description:
          "You can contribute up to $6,500 to a Roth IRA this year. This provides tax-free growth for retirement.",
        category: "investment" as const,
        status: "new" as const,
        priority: "medium" as const,
        estimatedImpact: "Tax-free retirement growth",
      },
      {
        id: Date.now().toString(),
        title: "Negotiate your insurance premiums",
        description: "Review your auto and home insurance. Shopping around could save you 10-15% on premiums.",
        category: "savings" as const,
        status: "new" as const,
        priority: "low" as const,
        estimatedImpact: "Save $300-500/year",
      },
    ]

    const randomRec = newRecommendations[Math.floor(Math.random() * newRecommendations.length)]
    setRecommendations((prev) => [randomRec, ...prev])
  }

  const updateRecommendationStatus = (id: string, newStatus: RecommendationStatus) => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, status: newStatus } : rec)))
  }

  const deleteRecommendation = (id: string) => {
    setRecommendations((prev) => prev.filter((rec) => rec.id !== id))
  }

  const filteredRecommendations = recommendations.filter((rec) => activeFilter === "all" || rec.status === activeFilter)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusColor = (status: RecommendationStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "in-progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    }
  }

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
                <h1 className="text-2xl font-bold text-foreground">AI Recommendations</h1>
                <p className="text-muted-foreground">Personalized financial advice to improve your wealth</p>
              </div>
            </div>
            <Button onClick={generateNewRecommendation} className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Get New Recommendation
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <Tabs
          value={activeFilter}
          onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({recommendations.length})</TabsTrigger>
            <TabsTrigger value="new">New ({recommendations.filter((r) => r.status === "new").length})</TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({recommendations.filter((r) => r.status === "in-progress").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({recommendations.filter((r) => r.status === "completed").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 text-balance">{recommendation.title}</CardTitle>
                    <div className="flex gap-2 mb-2">
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority} priority
                      </Badge>
                      <Badge className={getStatusColor(recommendation.status)}>{recommendation.status}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRecommendation(recommendation.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-pretty">{recommendation.description}</CardDescription>

                <div className="mb-4">
                  <span className="text-sm font-medium text-foreground">Estimated Impact: </span>
                  <span className="text-sm text-green-600 font-medium">{recommendation.estimatedImpact}</span>
                </div>

                <div className="flex gap-2">
                  {recommendation.status === "new" && (
                    <Button
                      size="sm"
                      onClick={() => updateRecommendationStatus(recommendation.id, "in-progress")}
                      className="gap-2"
                    >
                      <Play className="h-3 w-3" />
                      Start
                    </Button>
                  )}

                  {recommendation.status === "in-progress" && (
                    <Button
                      size="sm"
                      onClick={() => updateRecommendationStatus(recommendation.id, "completed")}
                      className="gap-2"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Complete
                    </Button>
                  )}

                  {recommendation.status === "completed" && (
                    <Badge variant="secondary" className="gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No recommendations found</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilter === "all"
                  ? "Click 'Get New Recommendation' to generate personalized financial advice."
                  : `No recommendations with status "${activeFilter}".`}
              </p>
              {activeFilter === "all" && (
                <Button onClick={generateNewRecommendation} className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Get Your First Recommendation
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
