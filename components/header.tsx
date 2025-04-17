"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut, Menu, Upload, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


interface ProfileData {
  email: string
  fullName: string
  id: string
  photo: string | null
}

export default function Header() {
  const pathname = usePathname()
  const isAuth = pathname.startsWith("/auth")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isAuthenticated, setToken } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [savedToken, setSavedToken] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setSavedToken(localStorage.getItem("token"))
  }, [])

  const {
    isLoading,
    isError,
    data: profile,
  } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get(`/users/me`)
      return res.data.data
    },
    enabled: !!savedToken,
  })

  if (isAuth) return null

  const menuItems = [
    { href: "/addpost", label: "Post qo'shish", authRequired: !savedToken },
    { href: "/myposts", label: "Postlarim", authRequired: !savedToken },
    { href: "/posts", label: "Postlar" },
    { href: "/", label: "Qidirish" },
    { href: "/my-posts", label: "Mening postlarim", authRequired: true },
  ]

  const handleLogout = () => {
    localStorage.clear()
    router.push("/search")
    window.location.reload()
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (<>
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
                {menuItems.map(
                  (item) =>
                    (!item.authRequired || (item.authRequired && isAuthenticated)) && (
                      <Link key={item.href} href={item.href}>
                        <Button variant="ghost" className="w-full justify-start">
                          {item.label}
                        </Button>
                      </Link>
                    ),
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
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map(
              (item) =>
                (!item.authRequired || (item.authRequired && isAuthenticated)) && (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost">{item.label}</Button>
                  </Link>
                ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              {/* Search icon joyi bo‘sh */}
            </Button>
            <ModeToggle />

            {savedToken ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      {profile?.photo ? (
                        <AvatarImage src={profile.photo || "/placeholder.svg"} alt={profile?.fullName || "User"} />
                      ) : (
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {profile?.fullName ? getInitials(profile.fullName) : "U"}
                        </AvatarFallback>
                      )}
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="font-medium">{profile?.fullName || "Loading..."}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile?.email || "Loading..."}</p>
                  </div>
                  <DropdownMenuSeparator />
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
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
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
      
    </header>
    </>
  )
}
