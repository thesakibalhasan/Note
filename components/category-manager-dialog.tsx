"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CategoryManager, type CustomCategory } from "@/lib/category-manager"
import { IconSelector } from "./icon-selector"
import {
  User,
  Briefcase,
  BookOpen,
  Lightbulb,
  FolderOpen,
  ShoppingCart,
  Plane,
  Heart,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  Home,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Camera,
  Music,
  Video,
  Coffee,
  Utensils,
  Car,
  Bike,
  Train,
  Bus,
  Ship,
  Rocket,
  Gamepad2,
  Monitor,
  Smartphone,
  Laptop,
  Keyboard,
  Mouse,
  Headphones,
  Speaker,
  Wifi,
  Battery,
  Zap,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  TreePine,
  Flower,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Turtle,
  Apple,
  Pizza,
  IceCream,
  Cookie,
  Cake,
  Gift,
  Crown,
  Diamond,
  Gem,
  Key,
  Lock,
  Shield,
  Tag,
  Bell,
  AlarmClock,
  Timer,
  Calculator,
  Ruler,
  Compass,
  Microscope,
  Telescope,
  Globe,
  Map,
  Mountain,
  Waves,
  Flame,
  Leaf,
  Plus,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Edit2,
  Trash2,
} from "lucide-react"

interface CategoryManagerDialogProps {
  isOpen: boolean
  onClose: () => void
  onCategoriesUpdate: () => void
}

const PRESET_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#f43f5e",
  "#8b5a2b",
  "#6b7280",
  "#1f2937",
]

// Icon mapping function
const getIconComponent = (iconName: string, className = "w-4 h-4") => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    User,
    Briefcase,
    BookOpen,
    Lightbulb,
    FolderOpen,
    ShoppingCart,
    Plane,
    Heart,
    Circle,
    Square,
    Triangle,
    Hexagon,
    Star,
    Home,
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    Camera,
    Music,
    Video,
    Coffee,
    Utensils,
    Car,
    Bike,
    Train,
    Bus,
    Ship,
    Rocket,
    Gamepad2,
    Monitor,
    Smartphone,
    Laptop,
    Keyboard,
    Mouse,
    Headphones,
    Speaker,
    Wifi,
    Battery,
    Zap,
    Sun,
    Moon,
    Cloud,
    CloudRain,
    Snowflake,
    TreePine,
    Flower,
    Bug,
    Fish,
    Bird,
    Cat,
    Dog,
    Rabbit,
    Turtle,
    Apple,
    Pizza,
    IceCream,
    Cookie,
    Cake,
    Gift,
    Crown,
    Diamond,
    Gem,
    Key,
    Lock,
    Shield,
    Tag,
    Bell,
    AlarmClock,
    Timer,
    Calculator,
    Ruler,
    Compass,
    Microscope,
    Telescope,
    Globe,
    Map,
    Mountain,
    Waves,
    Flame,
    Leaf,
  }

  const IconComponent = iconMap[iconName] || Circle
  return <IconComponent className={className} />
}

export function CategoryManagerDialog({ isOpen, onClose, onCategoriesUpdate }: CategoryManagerDialogProps) {
  const [categories, setCategories] = useState<CustomCategory[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState(PRESET_COLORS[0])
  const [newCategoryIcon, setNewCategoryIcon] = useState("Circle")
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")
  const [editIcon, setEditIcon] = useState("")
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [iconSelectorFor, setIconSelectorFor] = useState<"new" | "edit">("new")
  const [customColor, setCustomColor] = useState("")
  const [editCustomColor, setEditCustomColor] = useState("")

  const categoryManager = CategoryManager.getInstance()

  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  const loadCategories = () => {
    setCategories(categoryManager.getAllCategories())
  }

  const handleMoveCategory = (categoryId: string, direction: "up" | "down") => {
    if (direction === "up") {
      categoryManager.moveCategoryUp(categoryId)
    } else {
      categoryManager.moveCategoryDown(categoryId)
    }
    loadCategories()
    onCategoriesUpdate()
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const existingCategory = categoryManager.getCategoryByName(newCategoryName)
    if (existingCategory) {
      alert("Category with this name already exists!")
      return
    }

    const finalColor = customColor || newCategoryColor
    categoryManager.addCategory(newCategoryName, finalColor, newCategoryIcon)
    setNewCategoryName("")
    setNewCategoryColor(PRESET_COLORS[0])
    setNewCategoryIcon("Circle")
    setCustomColor("")
    loadCategories()
    onCategoriesUpdate()
  }

  const handleEditCategory = (category: CustomCategory) => {
    setEditingCategory(category)
    setEditName(category.name)
    setEditColor(category.color)
    setEditIcon(category.icon)
    setEditCustomColor("")
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !editName.trim()) return

    const finalColor = editCustomColor || editColor
    const success = categoryManager.updateCategory(editingCategory.id, {
      name: editName,
      color: finalColor,
      icon: editIcon || editingCategory.icon,
    })

    if (success) {
      setEditingCategory(null)
      setEditName("")
      setEditColor("")
      setEditIcon("")
      setEditCustomColor("")
      loadCategories()
      onCategoriesUpdate()
    } else {
      alert("Cannot edit default categories!")
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const success = categoryManager.deleteCategory(categoryId)
      if (success) {
        loadCategories()
        onCategoriesUpdate()
      } else {
        alert("Cannot delete default categories!")
      }
    }
  }

  const handleIconSelect = (iconName: string) => {
    if (iconSelectorFor === "new") {
      setNewCategoryIcon(iconName)
    } else {
      setEditIcon(iconName)
    }
    setShowIconSelector(false)
  }

  const defaultCategories = categories.filter((cat) => cat.isDefault)
  const customCategories = categories.filter((cat) => !cat.isDefault)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 flex-shrink-0">
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-6">
              {/* Add New Category */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Add New Category</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Icon</Label>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start mt-2 bg-transparent h-12"
                        onClick={() => {
                          setIconSelectorFor("new")
                          setShowIconSelector(true)
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {getIconComponent(newCategoryIcon, "h-5 w-5")}
                          <span className="text-sm">{newCategoryIcon}</span>
                        </div>
                      </Button>
                    </div>

                    <div>
                      <Label>Color</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex flex-wrap gap-2">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-9 h-9 rounded-full border-2 transition-all ${
                                newCategoryColor === color && !customColor
                                  ? "border-gray-800 dark:border-gray-200 scale-110"
                                  : "border-gray-300"
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setNewCategoryColor(color)
                                setCustomColor("")
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={customColor || newCategoryColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-14 h-10 p-1 border rounded cursor-pointer"
                            title="Custom color"
                          />
                          <Input
                            type="text"
                            value={customColor || newCategoryColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            placeholder="#000000"
                            className="flex-1 text-sm h-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {/* Default Categories */}
              <div className="space-y-4">
                <h3 className="font-semibold">Default Categories</h3>
                <div className="space-y-2">
                  {defaultCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div style={{ color: category.color }}>{getIconComponent(category.icon)}</div>
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">Cannot be edited</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Categories */}
              {customCategories.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Custom Categories</h3>
                  <div className="space-y-2">
                    {customCategories.map((category, index) => (
                      <div
                        key={category.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg bg-background gap-3"
                      >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => handleMoveCategory(category.id, "up")}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => handleMoveCategory(category.id, "down")}
                              disabled={index === customCategories.length - 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>

                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />

                          {editingCategory?.id === category.id ? (
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-10 bg-transparent"
                                  onClick={() => {
                                    setIconSelectorFor("edit")
                                    setShowIconSelector(true)
                                  }}
                                >
                                  {getIconComponent(editIcon || category.icon, "h-4 w-4")}
                                </Button>

                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="flex-1 h-10"
                                  onKeyPress={(e) => e.key === "Enter" && handleUpdateCategory()}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <div className="flex gap-1.5">
                                  {PRESET_COLORS.slice(0, 6).map((color) => (
                                    <button
                                      key={color}
                                      type="button"
                                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        editColor === color && !editCustomColor
                                          ? "border-gray-800 dark:border-gray-200 scale-110"
                                          : "border-gray-300"
                                      }`}
                                      style={{ backgroundColor: color }}
                                      onClick={() => {
                                        setEditColor(color)
                                        setEditCustomColor("")
                                      }}
                                    />
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="color"
                                    value={editCustomColor || editColor}
                                    onChange={(e) => setEditCustomColor(e.target.value)}
                                    className="w-10 h-8 p-0 border rounded cursor-pointer"
                                    title="Custom color"
                                  />
                                  <Input
                                    type="text"
                                    value={editCustomColor || editColor}
                                    onChange={(e) => setEditCustomColor(e.target.value)}
                                    placeholder="#000000"
                                    className="flex-1 text-xs h-8"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleUpdateCategory} className="flex-1">
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingCategory(null)}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div style={{ color: category.color }} className="flex-shrink-0">
                                {getIconComponent(category.icon)}
                              </div>
                              <span className="font-medium">{category.name}</span>
                            </>
                          )}
                        </div>
                        {editingCategory?.id !== category.id && (
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCategory(category)}
                              className="flex-1 sm:flex-none"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-destructive hover:text-destructive flex-1 sm:flex-none"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Icon Selector */}
      <IconSelector
        isOpen={showIconSelector}
        onClose={() => setShowIconSelector(false)}
        onSelect={handleIconSelect}
        selectedIcon={iconSelectorFor === "new" ? newCategoryIcon : editIcon}
      />
    </>
  )
}
