import { useEffect } from "react"

export default function useWebSocket(onMessage: (data: any) => void) {
  useEffect(() => {
    const socket = new WebSocket("wss://api.yodimdasiz.uz/ws")

    socket.onopen = () => {
      console.log("WebSocket ulanishi o‘rnatildi ✅")

      // Agar kerak bo‘lsa subscribe qilish uchun bu yerda msg yuboriladi
      // socket.send(JSON.stringify({ type: "subscribe", topic: "comments" }))
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    socket.onerror = (error) => {
      console.error("WebSocket xatosi ❌", error)
    }

    socket.onclose = () => {
      console.log("WebSocket yopildi ❌")
    }

    return () => {
      socket.close()
    }
  }, [onMessage])
}
