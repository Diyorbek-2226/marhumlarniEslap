"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Camera } from "lucide-react"
import api from "@/lib/axios"
import { useRef, useState } from "react"

interface ProfileData {
  id: string
  fullName: string
  email: string
  roles: string[]
  photo: string
}

export default function ProfilePage() {
  const savedToken = localStorage.getItem("token")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const [photo, setPhoto] = useState<string>('')

  const {
    isLoading,
    isError,
    data: profile,
  } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/api/users/me")
      return res.data.data
    },
    enabled: !!savedToken,
  })

  // Avatar upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      
      // Faylni yuklash
      const uploadResponse = await api.post('/files/upload', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      const uploadedFileData = uploadResponse.data.data
      console.log(uploadedFileData.path)

      // Yuklangan faylni rasm sifatida saqlash
      setPhoto(uploadedFileData.path)

      // Endi rasmni serverga yuboramiz
      await api.post('/users/upload-profile-photo', { photo: uploadedFileData.path })
    },
    onSuccess: () => {
      // Profilni yangilash
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadMutation.mutate(file)
    }
  }

  if (isLoading) return <ProfileSkeleton />

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-2">
            <h3 className="text-lg font-medium">Xatolik yuz berdi</h3>
            <p className="text-sm text-muted-foreground">
              Profil ma'lumotlarini yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.
            </p>
            <Button onClick={() => window.location.reload()}>Qayta urinib ko'rish</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-2">
            <h3 className="text-lg font-medium">Profil topilmadi</h3>
            <p className="text-sm text-muted-foreground">Profil ma'lumotlari mavjud emas.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl">Profil ma'lumotlari</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4 relative">
              <Avatar className="h-32 w-32 border-2 border-border cursor-pointer" onClick={handleImageClick}>
                <img
                  src={photo || profile.photo || "/placeholder.svg"}
                  alt={profile.fullName}
                  className="object-cover"
                />
              </Avatar>

              {/* Fayl yuklash inputi (yashirin) */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              <Button
                type="button"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                onClick={handleImageClick}
              >
                <Camera className="h-4 w-4" />
              </Button>

              <div className="text-center">
                {profile.roles?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {profile.roles.map((role, index) => (
                      <Badge key={index} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  To'liq ism
                </p>
                <p className="text-lg font-medium">{profile.fullName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </p>
                <p className="text-lg">{profile.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-0">
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
