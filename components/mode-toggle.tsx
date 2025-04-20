"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Toggles between light and dark themes using a dropdown menu interface.
 * @example
 * ModeToggle()
 * Renders a button that toggles theme with a dropdown menu.
 * @returns {JSX.Element} Returns a JSX element representing the mode toggle component.
 * @description
 *   - Utilizes useTheme hook to manage theme state.
 *   - Applies CSS classes for smooth transition effects between icons.
 */
export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Yorug'
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Qorong'u
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}