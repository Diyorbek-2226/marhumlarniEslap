"use client";

import { useState } from "react";
import { Search, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchCriteria {
  viloyat: string;
  tuman: string;
  qabrNomi: string;
  qabrRaqami: string;
}

export function SearchFilters() {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    viloyat: "",
    tuman: "",
    qabrNomi: "",
    qabrRaqami: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search criteria:", searchCriteria);
    // Bu yerda API chaqirishingiz mumkin
  };

  const handleReset = () => {
    setSearchCriteria({
      viloyat: "",
      tuman: "",
      qabrNomi: "",
      qabrRaqami: "",
    });
  };

  return (
  <div className=" sm:w-4/5 sm:mx-auto">
      <div className="grid gap-6 md:gap-8 py-8">
      <Card className="w-full shadow-lg border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Qidiruv Filtrlari</CardTitle>
          <CardDescription>
            Maʼlumotlarni topish uchun quyidagi maydonlarni toʻldiring
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="viloyat" className="text-sm font-medium">
                  Viloyat tanlang
                </label>
                <Input
                  id="viloyat"
                  name="viloyat"
                  value={searchCriteria.viloyat}
                  onChange={handleChange}
                  placeholder="Viloyat nomi"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tuman" className="text-sm font-medium">
                  Tuman tanlang
                </label>
                <Input
                  id="tuman"
                  name="tuman"
                  value={searchCriteria.tuman}
                  onChange={handleChange}
                  placeholder="Tuman nomi"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="qabrNomi" className="text-sm font-medium">
                  Qabr nomi
                </label>
                <Input
                  id="qabrNomi"
                  name="qabrNomi"
                  value={searchCriteria.qabrNomi}
                  onChange={handleChange}
                  placeholder="Qabr nomi"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="qabrRaqami" className="text-sm font-medium">
                  Qabr raqami
                </label>
                <Input
                  id="qabrRaqami"
                  name="qabrRaqami"
                  value={searchCriteria.qabrRaqami}
                  onChange={handleChange}
                  placeholder="Qabr raqami"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                <Search className="mr-2 h-4 w-4" />
                Qidirish
              </Button>
              <Button
                type="button"
                onClick={handleReset}
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Filtrlarni tozalash
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}
