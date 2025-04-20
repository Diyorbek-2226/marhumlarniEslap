import { useEffect } from "react"

/**
* Establishes a WebSocket connection and handles incoming messages.
* @example
* useWebSocket((data) => { console.log(data) })
* // Console logs parsed data from WebSocket message
* @param {(data: any) => void} onMessage - Callback function to handle data received via WebSocket.
* @returns {void} No return value.
* @description
*   - Initializes a WebSocket connection and automatically closes it when the component is unmounted.
*   - Logs connection status and errors to the console for monitoring purposes.
*   - Allows for optional subscription by sending a message within the onopen handler.
*/
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
