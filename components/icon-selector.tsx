"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Briefcase,
  BookOpen,
  Lightbulb,
  FolderOpen,
  ShoppingCart,
  Plane,
  Heart,
  Home,
  Star,
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
  Battery as Butterfly,
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
  StepBack as Stopwatch,
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
  Circle,
  Square,
  Triangle,
  Hexagon,
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  Settings,
  Search,
  Filter,
  Archive,
  Trash,
  Edit,
  Copy,
  Share,
  Download,
  Upload,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Inbox,
  FileText,
  File,
  Folder,
  Film,
  Mic,
  Play,
  Pause,
  Radio,
  Tv,
  Book,
  Pen,
  PenTool,
  Eraser,
  Highlighter,
  Navigation,
  Route,
  Building,
  Building2,
  Store,
  Warehouse,
  Factory,
  School,
  Hospital,
  Church,
  Castle,
} from "lucide-react"

// Available icons organized by categories
const ICON_CATEGORIES = {
  "People & Body": [
    { name: "User", icon: User },
    { name: "Heart", icon: Heart },
    { name: "Star", icon: Star },
    { name: "Crown", icon: Crown },
    { name: "Gem", icon: Gem },
    { name: "Diamond", icon: Diamond },
    { name: "Gift", icon: Gift },
    { name: "ThumbsUp", icon: ThumbsUp },
    { name: "ThumbsDown", icon: ThumbsDown },
  ],
  "Work & Office": [
    { name: "Briefcase", icon: Briefcase },
    { name: "FolderOpen", icon: FolderOpen },
    { name: "FileText", icon: FileText },
    { name: "File", icon: File },
    { name: "Folder", icon: Folder },
    { name: "Calculator", icon: Calculator },
    { name: "Monitor", icon: Monitor },
    { name: "Laptop", icon: Laptop },
    { name: "Keyboard", icon: Keyboard },
    { name: "Mouse", icon: Mouse },
  ],
  Education: [
    { name: "BookOpen", icon: BookOpen },
    { name: "Book", icon: Book },
    { name: "Lightbulb", icon: Lightbulb },
    { name: "Pen", icon: Pen },
    { name: "PenTool", icon: PenTool },
    { name: "Eraser", icon: Eraser },
    { name: "Highlighter", icon: Highlighter },
    { name: "Ruler", icon: Ruler },
    { name: "Compass", icon: Compass },
    { name: "Microscope", icon: Microscope },
    { name: "Telescope", icon: Telescope },
  ],
  "Shopping & Commerce": [
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "Store", icon: Store },
    { name: "Tag", icon: Tag },
    { name: "Gift", icon: Gift },
    { name: "Key", icon: Key },
    { name: "Lock", icon: Lock },
    { name: "Shield", icon: Shield },
  ],
  "Travel & Places": [
    { name: "Plane", icon: Plane },
    { name: "Car", icon: Car },
    { name: "Bike", icon: Bike },
    { name: "Train", icon: Train },
    { name: "Bus", icon: Bus },
    { name: "Ship", icon: Ship },
    { name: "Rocket", icon: Rocket },
    { name: "MapPin", icon: MapPin },
    { name: "Map", icon: Map },
    { name: "Globe", icon: Globe },
    { name: "Navigation", icon: Navigation },
    { name: "Route", icon: Route },
  ],
  "Food & Drinks": [
    { name: "Apple", icon: Apple },
    { name: "Coffee", icon: Coffee },
    { name: "Utensils", icon: Utensils },
    { name: "Pizza", icon: Pizza },
    { name: "IceCream", icon: IceCream },
    { name: "Cookie", icon: Cookie },
    { name: "Cake", icon: Cake },
  ],
  "Nature & Weather": [
    { name: "Sun", icon: Sun },
    { name: "Moon", icon: Moon },
    { name: "Cloud", icon: Cloud },
    { name: "CloudRain", icon: CloudRain },
    { name: "Snowflake", icon: Snowflake },
    { name: "TreePine", icon: TreePine },
    { name: "Flower", icon: Flower },
    { name: "Leaf", icon: Leaf },
    { name: "Mountain", icon: Mountain },
    { name: "Waves", icon: Waves },
    { name: "Flame", icon: Flame },
  ],
  Animals: [
    { name: "Cat", icon: Cat },
    { name: "Dog", icon: Dog },
    { name: "Bird", icon: Bird },
    { name: "Fish", icon: Fish },
    { name: "Bug", icon: Bug },
    { name: "Butterfly", icon: Butterfly },
    { name: "Rabbit", icon: Rabbit },
    { name: "Turtle", icon: Turtle },
  ],
  Technology: [
    { name: "Smartphone", icon: Smartphone },
    { name: "Headphones", icon: Headphones },
    { name: "Speaker", icon: Speaker },
    { name: "Wifi", icon: Wifi },
    { name: "Battery", icon: Battery },
    { name: "Zap", icon: Zap },
    { name: "Camera", icon: Camera },
    { name: "Video", icon: Video },
    { name: "Mic", icon: Mic },
  ],
  Entertainment: [
    { name: "Music", icon: Music },
    { name: "Gamepad2", icon: Gamepad2 },
    { name: "Tv", icon: Tv },
    { name: "Film", icon: Film },
    { name: "Play", icon: Play },
    { name: "Pause", icon: Pause },
    { name: "Radio", icon: Radio },
  ],
  "Time & Calendar": [
    { name: "Calendar", icon: Calendar },
    { name: "Clock", icon: Clock },
    { name: "AlarmClock", icon: AlarmClock },
    { name: "Timer", icon: Timer },
    { name: "Stopwatch", icon: Stopwatch },
  ],
  Communication: [
    { name: "Phone", icon: Phone },
    { name: "Mail", icon: Mail },
    { name: "MessageCircle", icon: MessageCircle },
    { name: "Send", icon: Send },
    { name: "Inbox", icon: Inbox },
    { name: "Bell", icon: Bell },
  ],
  "Shapes & Symbols": [
    { name: "Circle", icon: Circle },
    { name: "Square", icon: Square },
    { name: "Triangle", icon: Triangle },
    { name: "Hexagon", icon: Hexagon },
    { name: "Star", icon: Star },
    { name: "Plus", icon: Plus },
    { name: "Minus", icon: Minus },
    { name: "Check", icon: Check },
    { name: "X", icon: X },
    { name: "AlertTriangle", icon: AlertTriangle },
    { name: "Info", icon: Info },
    { name: "HelpCircle", icon: HelpCircle },
  ],
  Actions: [
    { name: "Settings", icon: Settings },
    { name: "Search", icon: Search },
    { name: "Filter", icon: Filter },
    { name: "Edit", icon: Edit },
    { name: "Copy", icon: Copy },
    { name: "Share", icon: Share },
    { name: "Download", icon: Download },
    { name: "Upload", icon: Upload },
    { name: "Archive", icon: Archive },
    { name: "Trash", icon: Trash },
    { name: "Eye", icon: Eye },
    { name: "EyeOff", icon: EyeOff },
  ],
  Buildings: [
    { name: "Home", icon: Home },
    { name: "Building", icon: Building },
    { name: "Building2", icon: Building2 },
    { name: "Warehouse", icon: Warehouse },
    { name: "Factory", icon: Factory },
    { name: "School", icon: School },
    { name: "Hospital", icon: Hospital },
    { name: "Church", icon: Church },
    { name: "Castle", icon: Castle },
  ],
}

interface IconSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (iconName: string) => void
  selectedIcon?: string
}

export function IconSelector({ isOpen, onClose, onSelect, selectedIcon }: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("People & Body")

  // Get all icons that match search term
  const getFilteredIcons = () => {
    if (!searchTerm) {
      return ICON_CATEGORIES[selectedCategory as keyof typeof ICON_CATEGORIES] || []
    }

    const allIcons = Object.values(ICON_CATEGORIES).flat()
    return allIcons.filter((icon) => icon.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  const filteredIcons = getFilteredIcons()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-4 sm:p-6 pb-0 flex-shrink-0">
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-4 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="mb-4 flex-shrink-0">
            <Label htmlFor="iconSearch">Search Icons</Label>
            <Input
              id="iconSearch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for icons..."
              className="mt-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-1 overflow-hidden">
            {/* Categories Sidebar */}
            {!searchTerm && (
              <div className="w-full sm:w-48 flex-shrink-0">
                <Label className="text-sm font-medium mb-2 block">Categories</Label>
                <ScrollArea className="h-32 sm:h-[400px]">
                  <div className="space-y-1 pr-4">
                    {Object.keys(ICON_CATEGORIES).map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <span className="text-xs flex-1">{category}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {ICON_CATEGORIES[category as keyof typeof ICON_CATEGORIES].length}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Icons Grid */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 flex-shrink-0">
                <Label className="text-sm font-medium">
                  {searchTerm
                    ? `Search Results (${filteredIcons.length})`
                    : `${selectedCategory} (${filteredIcons.length})`}
                </Label>
                {selectedIcon && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Selected:</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {(() => {
                        const IconComponent = Object.values(ICON_CATEGORIES)
                          .flat()
                          .find((icon) => icon.name === selectedIcon)?.icon
                        return IconComponent ? <IconComponent className="h-3 w-3" /> : null
                      })()}
                      {selectedIcon}
                    </Badge>
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1">
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 pb-4 pr-4">
                  {filteredIcons.map(({ name, icon: IconComponent }) => (
                    <Button
                      key={name}
                      variant={selectedIcon === name ? "default" : "ghost"}
                      size="sm"
                      className="h-14 w-14 sm:h-12 sm:w-12 p-0 flex flex-col items-center justify-center group"
                      onClick={() => onSelect(name)}
                      title={name}
                    >
                      <IconComponent className="h-6 w-6 sm:h-5 sm:w-5" />
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={onClose} className="bg-transparent w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={onClose} disabled={!selectedIcon} className="w-full sm:w-auto">
              Select Icon
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
