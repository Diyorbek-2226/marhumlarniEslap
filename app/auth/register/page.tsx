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
import { signIn } from "next-auth/react"

const formSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  email: z.string().email("Email manzil noto'g'ri"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
})

export default function RegisterPage() {
  const[email,SetEmail]=useState('')
  const[name,SetName]=useState('')
  const[password,SetPassword]=useState('')
  const[role,SetRole]=useState('')
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      email: email,
      password: password,
      role:role
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

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      toast.error("Google bilan kirish xatoligi")
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
          <Button 
            variant="outline" 
            type="button" 
            onClick={handleGoogleSignIn}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google bilan ro'yxatdan o'tish
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Yoki email bilan
              </span>
            </div>
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
                        field.onChange(e)
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
                        field.onChange(e)
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                     <select 
                       className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                       onChange={(e) => {
                         SetRole(e.target.value)
                       }}
                     >
                      <option value="ADMIN">Admin</option>
                      <option value="USER">User</option>
                      <option value="CEMETERY">Camerety</option>
                     </select>
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