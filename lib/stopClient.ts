// import { Client } from "@stomp/stompjs";
// import { useEffect, useState } from "react";
// import SockJS from "sockjs-client";

// interface Config {
//     socketUrl: string;
// }

// const config: Config = {
//     socketUrl: "https://api.yodimdasiz.uz/ws",
// };

// export function useSocket(): Client | null {
//     const [stompClient, setStompClient] = useState<Client | null>(null);

//     useEffect(() => {

//         const socketInstance = new SockJS(config.socketUrl);
//         const client = new Client({
//             webSocketFactory: () => socketInstance,
//             reconnectDelay: 5000,
//             onConnect: () => {
//                 console.log("✅ WebSocket connected!");
//                 setStompClient(client);
//             },
//             onDisconnect: () => {
//                 console.warn("⚠️ WebSocket disconnected!");
//                 setStompClient(null);
//             },
//             onStompError: (frame) => {
//                 console.log('Websocket error', frame);
//             }
//         });

//         client.activate();

//         return () => {
//             client.deactivate();
//         };
//     }, []);


//     return stompClient;
// }
