import {
    Calendar,
    Camera,
    FileText,
    Folder,
    Mail,
    Music,
    SquareTerminal,
} from "lucide-react"

import { type QuickLaunchItem } from "@/data/dashboard-mock"
import { cn } from "@/lib/utils"

export function QuickLaunchIcon({ item }: { item: QuickLaunchItem }) {
    // 1.removed 'text-primary' so all icons start as muted-foreground
    // 2.added 'transition-colors duration-300' for a smooth fade
    // 3.added 'group-hover:text-[var(--hover-color)]' to trigger the brand color
    const common = cn(
        "size-6 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-[var(--hover-color)]",
    )

    // Helper to render the icon with its specific brand color variable
    const renderIcon = (IconComponent: any, color: string) => (
        <IconComponent 
            className={common} 
            strokeWidth={2} 
            style={{ "--hover-color": color } as React.CSSProperties} 
        />
    )

    switch (item.icon) {
        case "mail":
            return renderIcon(Mail, "#EA4335") // Gmail Red
        case "file":
            return renderIcon(FileText, "#4285F4") // Docs Blue
        case "calendar":
            return renderIcon(Calendar, "#34A853") // Calendar Green
        case "terminal":
            return renderIcon(SquareTerminal, "#24292F") // Terminal Black
        case "folder":
            return renderIcon(Folder, "#FBBC04") // Folder Yellow
        case "music":
            return renderIcon(Music, "#FF0000") // Music/YouTube Red
        case "camera":
            return renderIcon(Camera, "#E1306C") // Camera/Insta Pink
        default: {
            // Keep the exhaustive check for type safety
            const _exhaustive: never = item.icon
            return _exhaustive
        }
    }
}