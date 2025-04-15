"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, Search, Upload, User, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"


export default function Header() {
  const pathname = usePathname()
  const isAuth = pathname.startsWith("/auth")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isAuthenticated, setToken } = useAuth()
const navigate=useRouter()
  if (isAuth) return null

  const savedToken = localStorage.getItem("token")
  const menuItems = [
    { href: "/", label: "Asosiy" },
    { href: "/addpost", label: "Post qo'shish", authRequired: !savedToken },
    { href: "/mypost", label: "Postlarim", authRequired: !savedToken },
    { href: "/posts", label: "Postlar",},
    { href: "/", label: "Qidirish",},
    { href: "/my-posts", label: "Mening postlarim", authRequired: true },
    
  ]

  const handleLogout = () => {
    window.location.reload()
    localStorage.clear()
navigate.push('/search')
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container w-4/5 mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader className="border-b pb-4 mb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {menuItems.map((item) =>
                  (!item.authRequired || (item.authRequired && isAuthenticated)) && (
                    <Link key={item.href} href={item.href}>
                      <Button variant="ghost" className="w-full justify-start">
                        {item.label}
                      </Button>
                    </Link>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              <span className="text-green-600">Y</span>odimdasiz
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* <div className="hidden md:flex md:w-80">
            <Input
              placeholder="Qidirish..."
              className="w-full"
              type="search"
              icon={<Search className="h-4 w-4" />}
            />
          </div> */}

          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) =>
              (!item.authRequired || (item.authRequired && isAuthenticated)) && (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost">
                    {item.label}
                  </Button>
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {/* {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )} */}
            </Button>
            <ModeToggle />

            {savedToken ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-posts" className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Mening postlarim
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer"> 
                    Chiqish
                    </DropdownMenuItem> 
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button className="bg-green-600 hover:bg-green-700">Kirish</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* {isSearchOpen && (
        <div className="border-t md:hidden">
          <div className="container px-4 py-4">
            <Input
              placeholder="Qidirish..."
              type="search"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>
      )} */}
    </header>
  )
}
