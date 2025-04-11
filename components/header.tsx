"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Heart, Menu, Search, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const pathname = usePathname()
  const isAuth = pathname.startsWith("/auth")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  if (isAuth) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container sm:w-4/5 mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-2">
                <Link href="/posts">
                  <Button variant="ghost" className="w-full justify-start">
                    Postlar
                  </Button>
                </Link>
                <Link href="/duo">
                  <Button variant="ghost" className="w-full justify-start">
                    Duolar
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            {/* <Heart className="h-6 w-6" /> */}
            <span className="font-bold hidden sm:inline" ><span className="text-green-600 font-bold">Y</span>odimdasiz</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex md:w-80">
            <Input
              placeholder="Qidirish..."
              className="w-full"
              type="search"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <nav className="hidden lg:flex items-center space-x-2">
            <Link href="/posts">
              <Button variant="ghost">Postlar</Button>
            </Link>
            <Link href="/duo">
              <Button variant="ghost">Duolar</Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
            <ModeToggle />
            <Link className="me-4" href="/auth/login">
              <Button >Kirish</Button>
            </Link>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t md:hidden">
          <div className="container px-2 py-4">
            <Input
              placeholder="Qidirish..."
              type="search"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>
      )}
    </header>
  )
}