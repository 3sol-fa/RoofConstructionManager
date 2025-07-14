export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectInterval = 1000;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private isConnecting = false;
  private isEnabled = true;

  connect(userId: number, projectId: number) {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_WS === 'false') {
      this.isEnabled = false;
      return;
    }
    if (!this.isEnabled || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    
    try {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//localhost:3001`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
        this.isConnecting = false;
      
      // Join the project room
      this.send({
        type: 'join',
        userId,
        projectId
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const handler = this.messageHandlers.get(data.type);
        if (handler) {
          handler(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        
        // Only attempt reconnect if it wasn't a normal closure
        if (event.code !== 1000) {
      this.attemptReconnect(userId, projectId);
        }
    };

    this.ws.onerror = (error) => {
        console.warn('WebSocket connection failed - real-time features disabled');
        this.isConnecting = false;
        this.isEnabled = false; // Disable future connection attempts
      };

      // Set a timeout to handle connection hanging
      setTimeout(() => {
        if (this.isConnecting) {
          console.warn('WebSocket connection timeout - real-time features disabled');
          this.isConnecting = false;
          this.isEnabled = false;
          if (this.ws) {
            this.ws.close();
            this.ws = null;
          }
        }
      }, 5000);

    } catch (error) {
      console.warn('WebSocket not available - real-time features disabled');
      this.isConnecting = false;
      this.isEnabled = false;
    }
  }

  private attemptReconnect(userId: number, projectId: number) {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.isEnabled) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(userId, projectId);
      }, this.reconnectInterval * this.reconnectAttempts);
    } else {
      console.warn('Max reconnection attempts reached - real-time features disabled');
      this.isEnabled = false;
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      // Silently fail if WebSocket is not available
      if (this.isEnabled) {
        console.warn('WebSocket is not connected - message not sent');
      }
    }
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Normal closure');
      this.ws = null;
    }
    this.messageHandlers.clear();
    this.isConnecting = false;
    this.isEnabled = false;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const wsManager = new WebSocketManager();
