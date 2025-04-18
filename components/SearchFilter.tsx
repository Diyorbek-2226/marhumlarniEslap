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
import { useRouter } from "next/navigation";

type RegionType = string;
type DistrictType = string;

interface CemeteryType {
  name: string;
  id: number;
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
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedCemetery, setSelectedCemetery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Object>({});

  // Viloyatlar
  const { data: regions = [], isLoading: isLoadingRegions } = useQuery<RegionType[]>({
    queryKey: ["regions"],
    queryFn: async () => {
      try {
        const res = await api.get("/address/regions");
        return res.data?.data || [];
      } catch {
        toast({
          title: "Xatolik",
          description: "Viloyatlar ma'lumotlarini olishda xatolik yuz berdi.",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  // Tumanlar
  const { data: districts = [], isLoading: isLoadingDistricts } = useQuery<DistrictType[]>({
    queryKey: ["districts", selectedRegion],
    queryFn: async () => {
      if (!selectedRegion) return [];
      try {
        const res = await api.get(`/address/districts?region=${selectedRegion}`);
        return res.data?.data || [];
      } catch {
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

  // Qabristonlar
  const { data: cemeteries = [], isLoading: isLoadingCemeteries } = useQuery<CemeteryType[]>({
    queryKey: ["cemeteries", selectedRegion, selectedDistrict],
    queryFn: async () => {
      if (!selectedRegion || !selectedDistrict) return [];
      try {
        const res = await api.get(`/cemeteries/select?region=${selectedRegion}&district=${selectedDistrict}`);
        return res.data?.data || [];
      } catch {
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

  const handleReset = () => {
    setSelectedRegion("");
    setSelectedDistrict("");
    setSelectedCemetery("");
    setSearchResult({});
    if (qabrRaqamiRef.current) qabrRaqamiRef.current.value = "";
    // Reset URL path query parameters
    router.push("/search"); // Reset the URL to the default search page
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
      // Update URL with the selected region and district
      const queryParams = new URLSearchParams();
queryParams.set("viloyat", selectedRegion);
queryParams.set("tuman", selectedDistrict);
queryParams.set("qabrNomi", selectedCemetery);

if (qabrRaqami) {
  queryParams.set("qabrRaqami", qabrRaqami);
}

router.push(`/posts?${queryParams.toString()}`);
 // Update URL with search criteria

      toast({
        title: "Qidiruv tugallandi",
        description: "Ma'lumotlar muvaffiyatli olindi",
      });

      // Make an API call with the selected criteria (optional, depending on the requirement)
      // const res = await api.get("/search", { params: searchCriteria });
      // setSearchResult(res.data);

    } catch (err) {
      toast({
        title: "Qidiruv xatoligi",
        description: "Ma'lumotlarni olishda xatolik yuz berdi.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
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
                <div>
                  <label>Viloyat <span className="text-red-500">*</span></label>
                  <Select value={selectedRegion} onValueChange={value => {
                    setSelectedRegion(value);
                    setSelectedDistrict("");
                    setSelectedCemetery("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Viloyat tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {isLoadingRegions ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : regions.map((region, index) => (
                          <SelectItem key={index} value={region}>{region}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tuman */}
                <div>
                  <label>Tuman <span className="text-red-500">*</span></label>
                  <Select value={selectedDistrict} onValueChange={value => {
                    setSelectedDistrict(value);
                    setSelectedCemetery("");
                  }} disabled={!selectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tuman tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {isLoadingDistricts ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : districts.map((district, index) => (
                          <SelectItem key={index} value={district}>{district}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Qabriston */}
                <div>
                  <label>Qabriston <span className="text-red-500">*</span></label>
                  <Select value={selectedCemetery} onValueChange={setSelectedCemetery} disabled={!selectedDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Qabriston tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {isLoadingCemeteries ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : cemeteries.length > 0 ? (
                          cemeteries.map((cemetery, index) => (
                            <SelectItem key={index} value={cemetery.name}>
                              {cemetery.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">Qabriston mavjud emas</div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Qabr raqami */}
                <div>
                  <label>Qabr raqami (ixtiyoriy)</label>
                  <Input placeholder="Qabr raqami" ref={qabrRaqamiRef} />
                </div>
              </div>

              {/* Tugmalar */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!selectedRegion || !selectedDistrict}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Qidirish
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Tozalash
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </div>
    </>
  );
}
