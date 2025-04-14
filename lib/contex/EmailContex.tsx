// context/EmailContext.tsx
"use client"

import React, { createContext, useState, useContext } from "react"

type EmailContextType = {
  email: string
  setEmail: (email: string) => void
}

const EmailContext = createContext<EmailContextType | undefined>(undefined)

export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState("")

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  )
}

export const useEmail = () => {
  const context = useContext(EmailContext)
  if (!context) throw new Error("useEmail must be used within EmailProvider")
  return context
}
