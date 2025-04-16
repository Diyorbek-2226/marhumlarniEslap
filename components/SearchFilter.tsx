"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Search, XCircle } from "lucide-react"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Cemetery {
  name: string
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
  const qabrRaqamiRef = useRef<HTMLInputElement>(null)

  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedCemetery, setSelectedCemetery] = useState<string>("")

  // Fetching regions
  const {
    isLoading: isLoadingRegions,
    data: regions,
  } = useQuery<string[]>({
    queryKey: ["regions"],
    queryFn: async () => {
      const res = await api.get("/address/regions")
      return res.data?.data || []
    },
  })

  // Fetching districts based on selected region
  const {
    isLoading: isLoadingDistricts,
    data: districts,
  } = useQuery<string[]>({
    queryKey: ["districts", selectedRegion],
    queryFn: async () => {
      if (!selectedRegion) return []
      const res = await api.get(`/address/districts?region=${selectedRegion}`)
      return res.data.data || []
    },
    enabled: !!selectedRegion,
  })

  // Fetching cemeteries based on selected region and district
  const { data: cemeteries, isLoading: isLoadingCemeteries } = useQuery<Cemetery[]>({
    queryKey: ["qabristonlar", selectedRegion, selectedDistrict],
    queryFn: async () => {
      if (!selectedRegion || !selectedDistrict) return []
      const response = await api.get(`/cemeteries/select?region=${selectedRegion}&district=${selectedDistrict}`)
      return response.data?.data || []
    },
    enabled: !!selectedRegion && !!selectedDistrict,
  })

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setSelectedDistrict("") // Reset district when region changes
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
  }

  const handleCemeteryChange = (value: string) => {
    setSelectedCemetery(value)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const searchCriteria: SearchCriteria = {
      viloyat: viloyatRef.current?.value || "",
      tuman: tumanRef.current?.value || "",
      qabrNomi: selectedCemetery,  // Using the selected cemetery state for qabrNomi
      qabrRaqami: qabrRaqamiRef.current?.value || "",
    }

    console.log("Searching with criteria:", searchCriteria)
    // Example: onSearch(searchCriteria);
  }

  const handleReset = () => {
    if (viloyatRef.current) viloyatRef.current.value = ""
    if (tumanRef.current) tumanRef.current.value = ""
    if (qabrRaqamiRef.current) qabrRaqamiRef.current.value = ""
    setSelectedRegion("")
    setSelectedDistrict("")
    setSelectedCemetery("")
  }

  // Custom select styles
  const selectStyles =
    "w-full border px-3 py-2 rounded-md bg-background transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

  return (
    <div className="sm:w-4/5 sm:mx-auto text-gray-100">
      <div className="grid gap-6 md:gap-8 py-8">
        <div className="w-full shadow-lg border rounded-lg">
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
                  <Select value={selectedRegion} onValueChange={handleRegionChange}>
                    <SelectTrigger className="max-w-full">
                      <SelectValue placeholder="Viloyatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {regions?.map((regionName) => (
                          <SelectItem key={regionName} value={regionName}>
                            {regionName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tuman select */}
                <div className="space-y-2">
                  <label htmlFor="tuman" className="text-sm font-medium">
                    Tuman tanlang
                  </label>
                  <Select
                    value={selectedDistrict}
                    onValueChange={handleDistrictChange}
                    disabled={!selectedRegion || isLoadingDistricts}
                  >
                    <SelectTrigger className="max-w-full">
                      <SelectValue placeholder="Tuman tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {districts?.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Qabriston select */}
                <div className="space-y-2">
                  <label htmlFor="qabriston" className="text-sm font-medium">
                    Qabriston tanlang
                  </label>
                  <Select
                    value={selectedCemetery}
                    onValueChange={handleCemeteryChange}
                    disabled={!selectedRegion || !selectedDistrict || isLoadingCemeteries}
                  >
                    <SelectTrigger className="max-w-full">
                      <SelectValue placeholder="Qabriston tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {cemeteries?.map((cemetery) => (
                          <SelectItem key={cemetery.name} value={cemetery.name}>
                            {cemetery.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isLoadingCemeteries && <p className="text-xs text-muted-foreground">Qabristonlar yuklanmoqda...</p>}
                  {!isLoadingCemeteries && selectedRegion && selectedDistrict && cemeteries?.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Tanlangan viloyat va tumanda qabristonlar topilmadi</p>
                  )}
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
                    className={selectStyles}
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
        </div>
      </div>
    </div>
  )
}
