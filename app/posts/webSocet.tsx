import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  private static instance: WebSocketService;
  private client: Client | null = null;
  private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private connect() {
    const token = localStorage.getItem('token');
    
    this.client = new Client({
      webSocketFactory: () => new SockJS('https://api.yodimdasiz.uz/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log('✅ Connected to WebSocket');
      },
      onDisconnect: () => {
        console.log('❌ Disconnected from WebSocket');
      },
      onWebSocketError: (error) => {
        console.error('❌ WebSocket Error:', error);
      },
    });

    this.client.activate();
  }

  subscribeToComments(postId: number, callback: (comment: any) => void) {
    if (!this.client?.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const destination = `/topic/comments/${postId}`;
    if (this.subscriptions.has(destination)) {
      return;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      if (message.body) {
        const comment = JSON.parse(message.body);
        callback(comment);
      }
    });

    this.subscriptions.set(destination, subscription);
  }

  subscribeToCommentSize(postId: number, callback: (size: number) => void) {
    if (!this.client?.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const destination = `/topic/comments/size/${postId}`;
    if (this.subscriptions.has(destination)) {
      return;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      if (message.body) {
        const size = parseInt(message.body, 10);
        callback(size);
      }
    });

    this.subscriptions.set(destination, subscription);
  }

  subscribeToLikes(postId: number, callback: (likes: number) => void) {
    if (!this.client?.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const destination = `/topic/likes/${postId}`;
    if (this.subscriptions.has(destination)) {
      return;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      if (message.body) {
        const likes = parseInt(message.body, 10);
        callback(likes);
      }
    });

    this.subscriptions.set(destination, subscription);
  }

  unsubscribe(postId: number) {
    const commentsDest = `/topic/comments/${postId}`;
    const commentSizeDest = `/topic/comments/size/${postId}`;
    const likesDest = `/topic/likes/${postId}`;

    [commentsDest, commentSizeDest, likesDest].forEach(dest => {
      const subscription = this.subscriptions.get(dest);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(dest);
      }
    });
  }

  disconnect() {
    this.client?.deactivate();
  }
}

export default WebSocketService;