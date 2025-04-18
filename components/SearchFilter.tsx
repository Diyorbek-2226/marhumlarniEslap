'use client'
import { useRef, useState } from "react";
import { Search, XCircle, Loader2 } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type RegionType = string;
type DistrictType = string;

interface CemeteryType{
  name:string,
id:number
}
interface SearchCriteria {
  viloyat: string;
  tuman: string;
  qabrNomi: string;
  qabrRaqami?: string;
}

export default function SearchFilters() {
  const qabrRaqamiRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedCemetery, setSelectedCemetery] = useState<string>("");

  // Viloyatlarni olish
  const { data: regions = [], isLoading: isLoadingRegions } = useQuery<RegionType[]>({
    queryKey: ["regions"],
    queryFn: async () => {
      try {
        const res = await api.get("/address/regions");
        return res.data?.data || [];
      } catch (error) {
        toast({
          title: "Xatolik",
          description: "Viloyatlar ma'lumotlarini olishda xatolik yuz berdi.",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  // Tumanlarni olish
  const { data: districts = [], isLoading: isLoadingDistricts } = useQuery<DistrictType[]>({
    queryKey: ["districts", selectedRegion],
    queryFn: async () => {
      if (!selectedRegion) return [];
      try {
        const res = await api.get(`/address/districts?region=${selectedRegion}`);
        return res.data?.data || [];
      } catch (error) {
        toast({
          title: "Xatolik",
          description: "Tumanlar ma'lumotlarini olishda xatolik yuz berdi.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!selectedRegion
  });

 
  // Qabristonlarni olish
  const { data: cemeteries = [], isLoading: isLoadingCemeteries } = useQuery<CemeteryType[]>({
    queryKey: ["cemeteries", selectedRegion, selectedDistrict],
    queryFn: async () => {
      if (!selectedRegion || !selectedDistrict) return [];
      try {
        const res = await api.get(`/cemeteries/select?region=${selectedRegion}&district=${selectedDistrict}`);
        return res.data?.data || [];
        console.log(res.data);
        
      } catch (error) {
        toast({
          title: "Xatolik",
          description: "Qabristonlar ma'lumotlarini olishda xatolik yuz berdi.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!selectedRegion && !!selectedDistrict
  });

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedDistrict("");
    setSelectedCemetery("");
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedCemetery("");
  };

  const handleCemeteryChange = (value: string) => {
    setSelectedCemetery(value);
  };

  const handleReset = () => {
    setSelectedRegion("");
    setSelectedDistrict("");
    setSelectedCemetery("");
    if (qabrRaqamiRef.current) qabrRaqamiRef.current.value = "";
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRegion || !selectedDistrict || !selectedCemetery) {
      toast({
        title: "Ma'lumotlar to'liq emas",
        description: "Viloyat, tuman va qabriston majburiy.",
        variant: "destructive",
      });
      return;
    }

    const searchCriteria: SearchCriteria = {
      viloyat: selectedRegion,
      tuman: selectedDistrict,
      qabrNomi: selectedCemetery,
    };

    const qabrRaqami = qabrRaqamiRef.current?.value?.trim();
    if (qabrRaqami) {
      searchCriteria.qabrRaqami = qabrRaqami;
    }

    try {
      const endpoint = qabrRaqami
        ? "/graves/search"
        : `/graves/cemetery/${selectedCemetery}`;
      const res = await api.post(endpoint, searchCriteria);
      console.log("Natijalar:", res.data);
      toast({
        title: "Qidiruv tugallandi",
        description: "Ma'lumotlar muvaffaqiyatli olindi",
      });
    } catch (err) {
      toast({
        title: "Qidiruv xatoligi",
        description: "Ma'lumotlarni olishda xatolik yuz berdi.",
        variant: "destructive",
      });
    }
  };
console.log(selectedCemetery);
  return (
    <div className="sm:w-4/5 mx-auto py-8">
      <div className="border rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Qidiruv Filtrlari</CardTitle>
          <CardDescription>Ma'lumotlarni topish uchun quyidagi filtrlardan foydalaning</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Viloyat */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Viloyat <span className="text-red-500">*</span></label>
                <Select value={selectedRegion} onValueChange={handleRegionChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Viloyat tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {isLoadingRegions ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Yuklanmoqda...</span>
                        </div>
                      ) : regions.length > 0 ? (
                        regions.map((region, index) => (
                          <SelectItem key={index} value={region}>
                            {region}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                          Viloyatlar topilmadi
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Tuman */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Tuman <span className="text-red-500">*</span></label>
                <Select
                  value={selectedDistrict}
                  onValueChange={handleDistrictChange}
                  disabled={!selectedRegion || isLoadingDistricts}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tuman tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {isLoadingDistricts ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Yuklanmoqda...</span>
                        </div>
                      ) : districts.length > 0 ? (
                        districts.map((district, index) => (
                          <SelectItem key={index} value={district}>
                            {district}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                          {selectedRegion ? "Tumanlar topilmadi" : "Avval viloyat tanlang"}
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Qabriston */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Qabriston <span className="text-red-500">*</span></label>
                <Select
                  value={selectedCemetery}
                  onValueChange={handleCemeteryChange}
                  disabled={!selectedDistrict || isLoadingCemeteries}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Qabriston tanlang" />
                    {/* {selectedCemetery} */}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {isLoadingCemeteries ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Yuklanmoqda...</span>
                        </div>
                      ) : cemeteries.length > 0 ? (
                        cemeteries.map((cemetery, index) => (
                          <SelectItem key={index} value={cemetery.name}>
                            {cemetery.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                          {selectedDistrict ? "Qabristonlar topilmadi" : "Avval tuman tanlang"}
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Qabr raqami */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Qabr raqami (ixtiyoriy)</label>
                <Input
                  placeholder="Qabr raqami"
                  ref={qabrRaqamiRef}
                  className="w-full"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!selectedRegion || !selectedDistrict || !selectedCemetery}
              >
                <Search className="mr-2 h-4 w-4" />
                Qidirish
              </Button>
              <Button
                type="button"
                onClick={handleReset}
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Tozalash
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    </div>
  );
}