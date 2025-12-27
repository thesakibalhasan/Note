export interface CustomCategory {
  id: string
  name: string
  color: string
  icon: string
  position: number
  isDefault: boolean
  createdAt: Date
}

export const DEFAULT_CATEGORIES: CustomCategory[] = [
  {
    id: "personal",
    name: "Personal",
    color: "#3b82f6",
    icon: "User",
    position: 0,
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: "work",
    name: "Work",
    color: "#ef4444",
    icon: "Briefcase",
    position: 1,
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: "study",
    name: "Study",
    color: "#10b981",
    icon: "BookOpen",
    position: 2,
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: "ideas",
    name: "Ideas",
    color: "#f59e0b",
    icon: "Lightbulb",
    position: 3,
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: "projects",
    name: "Projects",
    color: "#8b5cf6",
    icon: "FolderOpen",
    position: 4,
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: "shopping",
    name: "Shopping",
    color: "#ec4899",
    icon: "ShoppingCart",
    position: 5,
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: "travel",
    name: "Travel",
    color: "#06b6d4",
    icon: "Plane",
    position: 6,
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: "health",
    name: "Health",
    color: "#84cc16",
    icon: "Heart",
    position: 7,
    isDefault: true,
    createdAt: new Date(),
  },
]

export class CategoryManager {
  private static instance: CategoryManager
  private categories: CustomCategory[] = []

  private constructor() {
    this.loadCategories()
  }

  static getInstance(): CategoryManager {
    if (!CategoryManager.instance) {
      CategoryManager.instance = new CategoryManager()
    }
    return CategoryManager.instance
  }

  private loadCategories(): void {
    const stored = localStorage.getItem("custom-categories")
    const customCategories = stored ? JSON.parse(stored) : []

    // Merge default and custom categories
    this.categories = [
      ...DEFAULT_CATEGORIES,
      ...customCategories.map((cat: any) => ({
        ...cat,
        createdAt: new Date(cat.createdAt),
      })),
    ].sort((a, b) => a.position - b.position)
  }

  private saveCustomCategories(): void {
    const customCategories = this.categories.filter((cat) => !cat.isDefault)
    localStorage.setItem("custom-categories", JSON.stringify(customCategories))
  }

  getAllCategories(): CustomCategory[] {
    return [...this.categories].sort((a, b) => a.position - b.position)
  }

  getCustomCategories(): CustomCategory[] {
    return this.categories.filter((cat) => !cat.isDefault)
  }

  addCategory(name: string, color: string, icon: string): CustomCategory {
    const maxPosition = Math.max(...this.categories.map((cat) => cat.position))
    const newCategory: CustomCategory = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      color,
      icon,
      position: maxPosition + 1,
      isDefault: false,
      createdAt: new Date(),
    }

    this.categories.push(newCategory)
    this.saveCustomCategories()
    return newCategory
  }

  updateCategory(id: string, updates: Partial<Pick<CustomCategory, "name" | "color" | "icon">>): boolean {
    const category = this.categories.find((cat) => cat.id === id)
    if (!category || category.isDefault) {
      return false // Cannot edit default categories
    }

    if (updates.name) category.name = updates.name.trim()
    if (updates.color) category.color = updates.color
    if (updates.icon) category.icon = updates.icon

    this.saveCustomCategories()
    return true
  }

  deleteCategory(id: string): boolean {
    const category = this.categories.find((cat) => cat.id === id)
    if (!category || category.isDefault) {
      return false // Cannot delete default categories
    }

    this.categories = this.categories.filter((cat) => cat.id !== id)
    this.saveCustomCategories()
    return true
  }

  reorderCategories(customCategoryIds: string[]): void {
    // Only reorder custom categories, keep default categories in their positions
    const defaultCategories = this.categories.filter((cat) => cat.isDefault)
    const customCategories = this.categories.filter((cat) => !cat.isDefault)

    // Update positions for custom categories
    customCategoryIds.forEach((id, index) => {
      const category = customCategories.find((cat) => cat.id === id)
      if (category) {
        category.position = DEFAULT_CATEGORIES.length + index
      }
    })

    this.categories = [...defaultCategories, ...customCategories]
    this.saveCustomCategories()
  }

  moveCategoryUp(id: string): boolean {
    const category = this.categories.find((cat) => cat.id === id)
    if (!category || category.isDefault) return false

    const customCategories = this.categories.filter((cat) => !cat.isDefault).sort((a, b) => a.position - b.position)
    const currentIndex = customCategories.findIndex((cat) => cat.id === id)

    if (currentIndex > 0) {
      const prevCategory = customCategories[currentIndex - 1]
      const tempPosition = category.position
      category.position = prevCategory.position
      prevCategory.position = tempPosition

      this.saveCustomCategories()
      return true
    }
    return false
  }

  moveCategoryDown(id: string): boolean {
    const category = this.categories.find((cat) => cat.id === id)
    if (!category || category.isDefault) return false

    const customCategories = this.categories.filter((cat) => !cat.isDefault).sort((a, b) => a.position - b.position)
    const currentIndex = customCategories.findIndex((cat) => cat.id === id)

    if (currentIndex < customCategories.length - 1) {
      const nextCategory = customCategories[currentIndex + 1]
      const tempPosition = category.position
      category.position = nextCategory.position
      nextCategory.position = tempPosition

      this.saveCustomCategories()
      return true
    }
    return false
  }

  getCategoryById(id: string): CustomCategory | undefined {
    return this.categories.find((cat) => cat.id === id)
  }

  getCategoryByName(name: string): CustomCategory | undefined {
    return this.categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase())
  }
}
