"use client"
import React, { useRef, FormEvent, useState } from 'react';
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface PersonFormData {
  fullName: string;
  birthDate: string;
  deathDate: string;
  profilePhoto: string;
  definition: string;
  accessType: string;
}

// Sana formatlash funksiyasi (yyyy-mm-dd -> dd.mm.yyyy)
const formatDateToDot = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const PersonForm = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const deathDateRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const navigate = useRouter();


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !nameRef.current ||
      !birthDateRef.current ||
      !deathDateRef.current ||
      !imageRef.current ||
      !descriptionRef.current ||
      !selectRef.current
    ) return;

    const file = imageRef.current.files?.[0];

    if (!file) {
      toast.error("Iltimos, rasm tanlang.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Rasmni yuklash
      const uploadResponse = await api.post('/files/upload', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const imagePath = uploadResponse.data.data.path;

      // Form ma’lumotlari
      const requestData: PersonFormData = {
        fullName: nameRef.current.value,
        birthDate: formatDateToDot(birthDateRef.current.value),
        deathDate: formatDateToDot(deathDateRef.current.value),
        profilePhoto: imagePath,
        definition: descriptionRef.current.value,
        accessType: selectRef.current.value
      };

      // Yuborish
      const response = await api.post("/posts", requestData);
       // response.status'ni olish

      toast.success("Post muvaffaqiyatli qo'shildi!");
navigate.push('/posts')
      // Statusga qarab yo'naltirish
      

    } catch (error) {
      console.error("Xatolik:", error);
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      navigate.push('/addpost')
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Yangi post qo'shish</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">To'liq ismi</label>
            <Input
              id="name"
              ref={nameRef}
              placeholder="Ism familiyani kiriting"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium mb-2">Tug'ilgan sana</label>
              <Input
                id="birthDate"
                type="date"
                ref={birthDateRef}
              />
            </div>

            <div>
              <label htmlFor="deathDate" className="block text-sm font-medium mb-2">Vafot etgan sana</label>
              <Input
                id="deathDate"
                type="date"
                ref={deathDateRef}
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-2">Rasm yuklash</label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              ref={imageRef}
            />
          </div>

          <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium mb-2">Kimlarga ko'rinsin</label>
            <select
              id="accessType"
              name="accessType"
              ref={selectRef}
              className="w-full border px-3 py-2 rounded-md bg-background"
            >
              <option value="PUBLIC">Hammaga</option>
              <option value="RELATIVES">Qarindoshlarim</option>
              <option value="FRIENDS">Do'stlarimga</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Ta'rif</label>
            <Textarea
              id="description"
              placeholder="Batafsil ma'lumot kiriting"
              className="min-h-[150px]"
              ref={descriptionRef}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-sm">
              <Globe2 className="h-4 w-4" />
              <span>Ochiq post</span>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Postni saqlash
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;
