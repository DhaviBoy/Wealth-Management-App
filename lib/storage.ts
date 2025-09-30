// Local storage utilities for the wealth management app

export interface IncomeItem {
  id: string
  source: string
  amount: number
  frequency: "monthly" | "weekly" | "yearly" | "one-time"
  category: "salary" | "freelance" | "investment" | "business" | "other"
  dateAdded: string
  description?: string
}

export interface AssetItem {
  id: string
  name: string
  value: number
  category: "real-estate" | "stocks" | "bonds" | "crypto" | "cash" | "other"
  interestRate?: number
  dateAdded: string
  description?: string
}

export interface LiabilityItem {
  id: string
  name: string
  amount: number
  interestRate: number
  category: "mortgage" | "auto-loan" | "student-loan" | "personal-loan" | "business-loan" | "other"
  monthlyPayment: number
  dateAdded: string
  description?: string
}

export interface CreditCardItem {
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

export interface Recommendation {
  id: string
  title: string
  description: string
  category: "debt-reduction" | "investment" | "savings"
  status: "new" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  estimatedImpact: string
  dateCreated: string
}

// Storage keys
const STORAGE_KEYS = {
  INCOME: "wealthtracker_income",
  ASSETS: "wealthtracker_assets",
  LIABILITIES: "wealthtracker_liabilities",
  CREDIT_CARDS: "wealthtracker_credit_cards",
  RECOMMENDATIONS: "wealthtracker_recommendations",
  USER_PROFILE: "wealthtracker_user_profile",
}

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error)
    return defaultValue
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error)
  }
}

// Income storage functions
export function getIncomeItems(): IncomeItem[] {
  return getFromStorage(STORAGE_KEYS.INCOME, [])
}

export function saveIncomeItems(items: IncomeItem[]): void {
  saveToStorage(STORAGE_KEYS.INCOME, items)
}

export function addIncomeItem(item: IncomeItem): void {
  const items = getIncomeItems()
  items.unshift(item)
  saveIncomeItems(items)
}

export function deleteIncomeItem(id: string): void {
  const items = getIncomeItems().filter((item) => item.id !== id)
  saveIncomeItems(items)
}

// Asset storage functions
export function getAssetItems(): AssetItem[] {
  return getFromStorage(STORAGE_KEYS.ASSETS, [])
}

export function saveAssetItems(items: AssetItem[]): void {
  saveToStorage(STORAGE_KEYS.ASSETS, items)
}

export function addAssetItem(item: AssetItem): void {
  const items = getAssetItems()
  items.unshift(item)
  saveAssetItems(items)
}

export function deleteAssetItem(id: string): void {
  const items = getAssetItems().filter((item) => item.id !== id)
  saveAssetItems(items)
}

// Liability storage functions
export function getLiabilityItems(): LiabilityItem[] {
  return getFromStorage(STORAGE_KEYS.LIABILITIES, [])
}

export function saveLiabilityItems(items: LiabilityItem[]): void {
  saveToStorage(STORAGE_KEYS.LIABILITIES, items)
}

export function addLiabilityItem(item: LiabilityItem): void {
  const items = getLiabilityItems()
  items.unshift(item)
  saveLiabilityItems(items)
}

export function deleteLiabilityItem(id: string): void {
  const items = getLiabilityItems().filter((item) => item.id !== id)
  saveLiabilityItems(items)
}

// Credit card storage functions
export function getCreditCardItems(): CreditCardItem[] {
  return getFromStorage(STORAGE_KEYS.CREDIT_CARDS, [])
}

export function saveCreditCardItems(items: CreditCardItem[]): void {
  saveToStorage(STORAGE_KEYS.CREDIT_CARDS, items)
}

export function addCreditCardItem(item: CreditCardItem): void {
  const items = getCreditCardItems()
  items.unshift(item)
  saveCreditCardItems(items)
}

export function deleteCreditCardItem(id: string): void {
  const items = getCreditCardItems().filter((item) => item.id !== id)
  saveCreditCardItems(items)
}

// Recommendation storage functions
export function getRecommendations(): Recommendation[] {
  return getFromStorage(STORAGE_KEYS.RECOMMENDATIONS, [])
}

export function saveRecommendations(recommendations: Recommendation[]): void {
  saveToStorage(STORAGE_KEYS.RECOMMENDATIONS, recommendations)
}

export function addRecommendation(recommendation: Recommendation): void {
  const recommendations = getRecommendations()
  recommendations.unshift(recommendation)
  saveRecommendations(recommendations)
}

export function updateRecommendation(id: string, updates: Partial<Recommendation>): void {
  const recommendations = getRecommendations()
  const index = recommendations.findIndex((rec) => rec.id === id)
  if (index !== -1) {
    recommendations[index] = { ...recommendations[index], ...updates }
    saveRecommendations(recommendations)
  }
}

export function deleteRecommendation(id: string): void {
  const recommendations = getRecommendations().filter((rec) => rec.id !== id)
  saveRecommendations(recommendations)
}

// Financial calculations
export function calculateTotalIncome(): number {
  const items = getIncomeItems()
  return items.reduce((total, item) => {
    let monthlyAmount = item.amount
    switch (item.frequency) {
      case "weekly":
        monthlyAmount = item.amount * 4.33
        break
      case "yearly":
        monthlyAmount = item.amount / 12
        break
      case "one-time":
        monthlyAmount = 0
        break
    }
    return total + monthlyAmount
  }, 0)
}

export function calculateTotalAssets(): number {
  const items = getAssetItems()
  return items.reduce((total, item) => total + item.value, 0)
}

export function calculateTotalLiabilities(): number {
  const items = getLiabilityItems()
  return items.reduce((total, item) => total + item.amount, 0)
}

export function calculateTotalCreditCardDebt(): number {
  const items = getCreditCardItems()
  return items.reduce((total, item) => total + item.outstandingBalance, 0)
}

export function calculateNetWorth(): number {
  return calculateTotalAssets() - calculateTotalLiabilities() - calculateTotalCreditCardDebt()
}

// Initialize with sample data if storage is empty
export function initializeSampleData(): void {
  if (getIncomeItems().length === 0) {
    const sampleIncome: IncomeItem[] = [
      {
        id: "1",
        source: "Software Engineer Salary",
        amount: 6000,
        frequency: "monthly",
        category: "salary",
        dateAdded: "2024-01-15",
        description: "Full-time position at Tech Corp",
      },
      {
        id: "2",
        source: "Freelance Web Development",
        amount: 800,
        frequency: "monthly",
        category: "freelance",
        dateAdded: "2024-02-01",
        description: "Side projects and consulting",
      },
    ]
    saveIncomeItems(sampleIncome)
  }

  if (getAssetItems().length === 0) {
    const sampleAssets: AssetItem[] = [
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
    ]
    saveAssetItems(sampleAssets)
  }

  if (getLiabilityItems().length === 0) {
    const sampleLiabilities: LiabilityItem[] = [
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
    ]
    saveLiabilityItems(sampleLiabilities)
  }

  if (getCreditCardItems().length === 0) {
    const sampleCreditCards: CreditCardItem[] = [
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
    ]
    saveCreditCardItems(sampleCreditCards)
  }

  if (getRecommendations().length === 0) {
    const sampleRecommendations: Recommendation[] = [
      {
        id: "1",
        title: "Pay off high-interest credit card debt first",
        description:
          "Focus on paying off your credit card with 24% APR before other debts. This could save you $600 annually in interest.",
        category: "debt-reduction",
        status: "new",
        priority: "high",
        estimatedImpact: "Save $600/year",
        dateCreated: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Increase emergency fund to 6 months expenses",
        description:
          "Build your emergency fund to cover 6 months of expenses. Consider high-yield savings accounts earning 4.5% APY.",
        category: "savings",
        status: "new",
        priority: "high",
        estimatedImpact: "Financial security",
        dateCreated: new Date().toISOString(),
      },
    ]
    saveRecommendations(sampleRecommendations)
  }
}
