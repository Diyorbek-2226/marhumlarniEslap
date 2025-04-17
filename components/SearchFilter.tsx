'use client'

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
import { Input } from "@/components/ui/input"

interface Cemetery {
  name: string
}

interface SearchCriteria {
  viloyat: string
  tuman: string
  qabrNomi: string
  qabrRaqami?: string
}

interface Region {
  name: string
}

interface District {
  name: string
}

export default function SearchFilters() {
  const qabrRaqamiRef = useRef<HTMLInputElement>(null)

  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedCemetery, setSelectedCemetery] = useState<string>("")

  // Fetch regions
  const { data: regions = [], isLoading: isLoadingRegions } = useQuery<Region[]>({
    queryKey: ["regions"],
    queryFn: async () => {
      const res = await api.get("/address/regions")
      return res.data?.data || []
    }
  })
console.log(regions);

  // Fetch districts
  const { data: districts = [], isLoading: isLoadingDistricts } = useQuery<District[]>({
    queryKey: ["districts", selectedRegion],
    queryFn: async () => {
      if (!selectedRegion) return []
      const res = await api.get(`/address/districts?region=${selectedRegion}`)
      return res.data?.data || []
    },
    enabled: !!selectedRegion
  })

  // Fetch cemeteries
  const { data: cemeteries = [], isLoading: isLoadingCemeteries } = useQuery<Cemetery[]>({
    queryKey: ["cemeteries", selectedRegion, selectedDistrict],
    queryFn: async () => {
      if (!selectedRegion || !selectedDistrict) return []
      const res = await api.get(`/cemeteries/select?region=${selectedRegion}&district=${selectedDistrict}`)
      return res.data?.data || []
    },
    enabled: !!selectedRegion && !!selectedDistrict
  })

  
  
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setSelectedDistrict("")
    setSelectedCemetery("")
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    setSelectedCemetery("")
  }

  const handleCemeteryChange = (value: string) => {
    setSelectedCemetery(value)
  }

  const handleReset = () => {
    setSelectedRegion("")
    setSelectedDistrict("")
    setSelectedCemetery("")
    if (qabrRaqamiRef.current) qabrRaqamiRef.current.value = ""
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRegion || !selectedDistrict || !selectedCemetery) {
      console.error("Viloyat, tuman va qabriston majburiy")
      return
    }

    const searchCriteria: SearchCriteria = {
      viloyat: selectedRegion,
      tuman: selectedDistrict,
      qabrNomi: selectedCemetery,
    }

    const qabrRaqami = qabrRaqamiRef.current?.value?.trim()
    if (qabrRaqami) {
      searchCriteria.qabrRaqami = qabrRaqami
    }

    try {
      const endpoint = qabrRaqami 
        ? "/graves/search"
        : `/graves/cemetery/${selectedCemetery}`
      const res = await api.post(endpoint, searchCriteria)
      console.log("Natijalar:", res.data)
    } catch (err) {
      console.error("Qidiruvda xatolik:", err)
    }
  }

  return (
    <div className="sm:w-4/5 mx-auto py-8">
      <div className="border rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Qidiruv Filtrlari</CardTitle>
          <CardDescription>Ma’lumotlarni topish uchun quyidagi filtrlardan foydalaning</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Viloyat */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Viloyat *</label>
                <Select value={selectedRegion} onValueChange={handleRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Viloyat tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {regions.map((region: Region, index:number) => (
                        <SelectItem key={index} value={region as any}>
                          {region as any}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Tuman */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Tuman *</label>
                <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tuman tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {districts.map((district: District, index: number) => (
                        <SelectItem key={index}  value={district as any} >
                          {district as any}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Qabriston */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Qabriston *</label>
                <Select
                  value={selectedCemetery}
                  onValueChange={handleCemeteryChange}
                  disabled={!selectedRegion || !selectedDistrict}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Qabriston tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cemeteries.map((cemetery: Cemetery ,index:number) => (
                        <SelectItem key={index} value={cemetery as any}>
                          {cemetery as any}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isLoadingCemeteries && (
                  <p className="text-xs text-muted-foreground">Qabristonlar yuklanmoqda...</p>
                )}
                {!isLoadingCemeteries && selectedRegion && selectedDistrict && cemeteries.length === 0 && (
                  <p className="text-xs text-red-500">Tanlangan hududda qabristonlar topilmadi</p>
                )}
              </div>

              {/* Qabr raqami */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Qabr raqami (ixtiyoriy)</label>
                <Input
                  placeholder="Qabr raqami"
                  ref={qabrRaqamiRef}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white "
                disabled={!selectedRegion || !selectedDistrict || !selectedCemetery}
              >
                <Search className="mr-2 h-4 w-4" />
                Qidirish
              </Button>
              <Button type="button" onClick={handleReset} variant="destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Tozalash
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    </div>
  )
}
