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

const formSchema = z.object({
  email: z.string().email("Email manzil noto'g'ri"),
})

export default function ForgotPasswordPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.post("/auth/forgot-password", values)
      toast.success("Parolni tiklash uchun ko'rsatmalar emailingizga yuborildi")
      router.push("/auth/login")
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
              Parolni tiklash
            </h1>
            <p className="text-sm text-muted-foreground">
              Email manzilingizni kiriting
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@mail.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Parolni tiklash
              </Button>
            </form>
          </Form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Orqaga qaytish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}