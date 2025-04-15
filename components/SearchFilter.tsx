"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Search, XCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

interface Region {
  id: string
  name: string
}

interface District {
  id: string
  name: string
  region_id: string
}

interface SearchCriteria {
  viloyat: string
  tuman: string
  qabrNomi: string
  qabrRaqami: string
}

export function SearchFilters() {
  const viloyatRef = useRef<HTMLSelectElement>(null)
  const tumanRef = useRef<HTMLSelectElement>(null)
  const qabrNomiRef = useRef<HTMLInputElement>(null)
  const qabrRaqamiRef = useRef<HTMLInputElement>(null)

  const [selectedRegion, setSelectedRegion] = useState<string>("")

  const {
    isLoading: isLoadingRegions,
    isError: isErrorRegions,
    data: regions,
  } = useQuery<Region[]>({
    queryKey: ["regions"],
    queryFn: async () => {
      const res = await api.get(`/address/regions`)
      return res.data?.data || []
    },
  })

  const {
    isLoading: isLoadingDistricts,
    isError: isErrorDistricts,
    data: districts,
  } = useQuery<District[]>({
    queryKey: ["districts", selectedRegion],
    queryFn: async () => {
      if (!selectedRegion) return []
      const res = await api.get(`/address/districts?region=${selectedRegion}`)
      return res.data.data || []
    },
    enabled: !!selectedRegion,
  })

  

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionValue = e.target.value
    setSelectedRegion(regionValue)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const searchCriteria: SearchCriteria = {
      viloyat: viloyatRef.current?.value || "",
      tuman: tumanRef.current?.value || "",
      qabrNomi: qabrNomiRef.current?.value || "",
      qabrRaqami: qabrRaqamiRef.current?.value || "",
    }

   
  }

  const handleReset = () => {
    if (viloyatRef.current) viloyatRef.current.value = ""
    if (tumanRef.current) tumanRef.current.value = ""
    if (qabrNomiRef.current) qabrNomiRef.current.value = ""
    if (qabrRaqamiRef.current) qabrRaqamiRef.current.value = ""
    setSelectedRegion("")
  }

  if (isLoadingRegions) {
    return <div className="text-center py-4">Viloyatlar yuklanmoqda...</div>
  }

  if (isErrorRegions) {
    return <div className="text-center py-4 text-red-500">Viloyatlarni yuklashda xatolik yuz berdi</div>
  }

  return (
    <div className="sm:w-4/5 sm:mx-auto">
      <div className="grid gap-6 md:gap-8 py-8">
        <Card className="w-full shadow-lg border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Qidiruv Filtrlari</CardTitle>
            <CardDescription>Maʼlumotlarni topish uchun quyidagi maydonlarni toʻldiring</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Viloyat select */}
                <div className="space-y-2">
                  <label htmlFor="viloyat" className="text-sm font-medium">
                    Viloyat tanlang
                  </label>
                  <select
                    id="viloyat"
                    name="viloyat"
                    ref={viloyatRef}
                    onChange={handleRegionChange}
                    className="w-full border px-3 py-2 rounded-md bg-background"
                  >
                    <option value="">Viloyat tanlang</option>
                    {regions?.map((region) => (
                      <option >
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tuman select */}
                <div className="space-y-2">
                  <label htmlFor="tuman" className="text-sm font-medium">
                    Tuman tanlang
                  </label>
                  <select
                    id="tuman"
                    name="tuman"
                    ref={tumanRef}
                    disabled={!selectedRegion || isLoadingDistricts}
                    className="w-full border px-3 py-2 rounded-md bg-background"
                  >
                    <option value="">Tuman tanlang</option>
                    {districts?.map((district) => (
                      <option >
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Qabr nomi input */}
                <div className="space-y-2">
                  <label htmlFor="qabrNomi" className="text-sm font-medium">
                    Qabr nomi
                  </label>
                  <input
                    id="qabrNomi"
                    name="qabrNomi"
                    ref={qabrNomiRef}
                    placeholder="Qabr nomi"
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>

                {/* Qabr raqami input */}
                <div className="space-y-2">
                  <label htmlFor="qabrRaqami" className="text-sm font-medium">
                    Qabr raqami
                  </label>
                  <input
                    id="qabrRaqami"
                    name="qabrRaqami"
                    ref={qabrRaqamiRef}
                    placeholder="Qabr raqami"
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                  <Search className="mr-2 h-4 w-4" />
                  Qidirish
                </Button>
                <Button type="button" onClick={handleReset} variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Filtrlarni tozalash
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}