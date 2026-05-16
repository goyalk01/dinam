"use client";

import { MailIcon } from "@/components/animated-icons/mail-icon";
import { FileTextIcon } from "@/components/animated-icons/file-text-icon";
import { CalendarIcon } from "@/components/animated-icons/calendar-icon";
import { SquareTerminalIcon } from "@/components/animated-icons/square-terminal-icon";
import { FolderIcon } from "@/components/animated-icons/folder-icon";
import { MusicIcon } from "@/components/animated-icons/music-icon";
import { CameraIcon } from "@/components/animated-icons/camera-icon";
import { ScanSearchIcon } from "@/components/animated-icons/scan-search-icon";
import { SunIcon } from "@/components/animated-icons/sun-icon";
import { MoonIcon } from "@/components/animated-icons/moon-icon";

import { type QuickLaunchItem } from "@/data/dashboard-mock";
import { cn } from "@/lib/utils";

export function QuickLaunchIcon({ item }: { item: QuickLaunchItem }) {
    const common = cn(
        "size-6 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-foreground",
    );

    switch (item.icon) {
        case "mail":
            return <MailIcon size={24} className={common} />;
        case "file":
            return <FileTextIcon size={24} className={common} />;
        case "calendar":
            return <CalendarIcon size={24} className={common} />;
        case "terminal":
            return <SquareTerminalIcon size={24} className={common} />;
        case "folder":
            return <FolderIcon size={24} className={common} />;
        case "music":
            return <MusicIcon size={24} className={common} />;
        case "camera":
            return <CameraIcon size={24} className={common} />;
        case "scan":
            return <ScanSearchIcon size={24} className={common} />;
        case "sun":
        case "brightness":
            return <SunIcon size={24} className={common} />;
        case "moon":
        case "dark":
            return <MoonIcon size={24} className={common} />;
        default: {
            const _exhaustive: never = item.icon;
            return _exhaustive;
        }
    }
}