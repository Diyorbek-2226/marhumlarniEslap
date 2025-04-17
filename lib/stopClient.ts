import { Client } from "@stomp/stompjs";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { useUser } from "../../pages/_app";
import { useConnect, useDisConnect } from "../../queries/websocket";

interface Config {
    socketUrl: string;
}

const config: Config = {
    // socketUrl: "http://192.168.68.104:3333/ws",
    // socketUrl: "http://192.168.68.124:3333/ws",
    socketUrl: "https://api.logistx.uz/ws",
};

export function useSocket(): Client | null {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const token = Cookies.get("token");
    const { user } = useUser();

    const connectMutation = useConnect(
        (userId) => console.log(`🟢 User ${userId} marked online`),
        (error) => console.error("Connect error:", error)
    );

    const disconnectMutation = useDisConnect(
        (userId) => console.log(`🔴 User ${userId} marked offline`),
        (error) => console.error("Disconnect error:", error)
    );

    useEffect(() => {
        if (!user || !token) return;

        const socketInstance = new SockJS(config.socketUrl);
        const client = new Client({
            webSocketFactory: () => socketInstance,
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
                userId: user?.data.id,
            },
            onConnect: () => {
                console.log("✅ WebSocket connected!");
                setStompClient(client);
                connectMutation.mutate(user?.data.id);
            },
            onDisconnect: () => {
                console.warn("⚠️ WebSocket disconnected!");
                setStompClient(null);
                disconnectMutation.mutate(user?.data.id);
            },
        });

        client.activate();

        // ⚠️ Handle tab/window close
        const handleTabClose = () => {
            disconnectMutation.mutate(user?.data.id);
            client.deactivate();
        };

        window.addEventListener("beforeunload", handleTabClose);

        return () => {
            window.removeEventListener("beforeunload", handleTabClose);
            client.deactivate();
            disconnectMutation.mutate(user?.data.id);
        };
    }, [user, token]);


    return stompClient;
}
