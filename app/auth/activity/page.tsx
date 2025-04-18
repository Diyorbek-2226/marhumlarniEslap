"use client";

import React, { useState, useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEmail } from "@/lib/contex/EmailContex";
import api from "@/lib/axios";

const ActivityCode = () => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { email } = useEmail();
  const router = useRouter();

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      focusInput(index + 1);
    }

    const isComplete = newCode.every((val) => val !== "");
    if (isComplete) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();
    if (!/^\d+$/.test(pasted)) return;

    const pastedDigits = pasted.slice(0, 6).split("");
    const newCode = [...code];
    pastedDigits.forEach((digit, idx) => {
      if (idx < 6) newCode[idx] = digit;
    });

    setCode(newCode);

    const nextEmpty = newCode.findIndex((val) => val === "");
    focusInput(nextEmpty !== -1 ? nextEmpty : 5);

    if (pastedDigits.length === 6) {
      handleVerify(pastedDigits.join(""));
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-account", {
        email,
        code: verificationCode,
      });

      if (response.status === 200) {
        setVerified(true);
        toast.success("Email muvaffaqiyatli tasdiqlandi!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error("Noto‘g‘ri kod. Qayta urinib ko‘ring.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Tasdiqlashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    toast.success("Tasdiqlash kodi muvaffaqiyatli qayta yuborildi!");
    // Bu yerda API chaqirishingiz mumkin, agar mavjud bo‘lsa
  };

  const handleVerifyButtonClick = () => {
    const verificationCode = code.join("");
    if (verificationCode.length === 6) {
      handleVerify(verificationCode);
    } else {
      toast.error("Iltimos, 6 xonali kodni to‘liq kiriting");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            {verified ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">Verifikatsiya</CardTitle>
          <CardTitle className="text-xl font-mono">{email}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {verified ? "Ro'yxatdan muvaffaqiyatli o'tdingiz!" : "Emailingizga yuborilgan 6 xonali kodni kiriting"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!verified && (
            <>
              <div className="flex justify-center gap-2 sm:gap-4 pt-4">
                {Array.from({ length: 6 }, (_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={code[index]}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="h-12 w-12 sm:h-14 sm:w-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none transition-all bg-background"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Kodni olmadingizmi?{" "}
                <button
                  onClick={handleResendCode}
                  className="text-primary hover:underline font-medium"
                >
                  Qayta yuborish
                </button>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          <Button className="w-full" disabled={loading || verified} onClick={handleVerifyButtonClick}>
            {loading ? "Tasdiqlanmoqda..." : verified ? "Tasdiqlandi ✓" : "Tasdiqlash"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ActivityCode;
