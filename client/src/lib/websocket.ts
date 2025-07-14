import { ChatMessage } from "@/types";

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private isAuthenticated = false;

  constructor() {
    this.connect();
  }

  private connect() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.authenticate();
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const handler = this.messageHandlers.get(data.type);
        if (handler) {
          handler(data);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...');
      this.isAuthenticated = false;
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private authenticate() {
    const token = localStorage.getItem('auth_token');
    if (token && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'authenticate',
        token,
        projectId: null // Can be set based on current context
      }));
    }
  }

  public onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  public sendMessage(content: string, projectId?: number) {
    if (this.ws?.readyState === WebSocket.OPEN && this.isAuthenticated) {
      this.ws.send(JSON.stringify({
        type: 'chat_message',
        content,
        projectId
      }));
    }
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.ws?.close();
  }
}

let wsManager: WebSocketManager | null = null;

export function getWebSocketManager(): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager();
  }
  return wsManager;
}
