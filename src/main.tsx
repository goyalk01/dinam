import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardStateProvider } from "@/context/dashboard-state"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DashboardStateProvider>
        <TooltipProvider delayDuration={300}>
          <App />
        </TooltipProvider>
      </DashboardStateProvider>
    </ThemeProvider>
  </StrictMode>
)
