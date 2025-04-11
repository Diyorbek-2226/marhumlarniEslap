"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/axios"
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  email: z.string().email("Email manzil noto'g'ri"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
})

export default function RegisterPage() {
  const[email,SetEmail]=useState('')
  const[name,SetName]=useState('')
  const[password,SetPassword]=useState('')
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      email: email,
      password: password,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.post("/auth/register", values)
      router.push("/auth/login")
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz")
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center space-x-2">
            Yodimdasiz
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Marhumlarni eslash va duolar qilish uchun platforma
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Ro'yxatdan o'ting
            </h1>
            <p className="text-sm text-muted-foreground">
              Ma'lumotlaringizni kiriting
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ism</FormLabel>
                    <FormControl>
                    <Input
  onChange={(e) => {
    SetName(e.target.value)
    field.onChange(e) // react-hook-form bilan sinxron holatda qolishi uchun
  }}
  value={field.value}
  placeholder="Ismingizni kiriting"
/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                     <Input
  onChange={(e) => {
    SetEmail(e.target.value)
    field.onChange(e) 
  }}
  value={field.value}
  placeholder="example@mail.com"
/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parol</FormLabel>
                    <FormControl>
                    <Input
  onChange={(e) => {
    SetPassword(e.target.value)
    field.onChange(e) // react-hook-form bilan sinxron holatda qolishi uchun
  }}
  type="password"
  value={field.value}
  placeholder="Passwordni kiriting"
/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Ro'yxatdan o'tish
              </Button>
            </form>
          </Form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Hisobingiz bormi?{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Kiring
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}