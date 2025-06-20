import { useEffect, useRef, useState } from "react";
import { wsManager } from "@/lib/websocket";
import { useQueryClient } from "@tanstack/react-query";

export function useWebSocket() {
  const queryClient = useQueryClient();
  const isConnected = useRef(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('disconnected');

  useEffect(() => {
    if (!isConnected.current) {
      setConnectionStatus('connecting');
      
      // Connect with current user (hardcoded for demo)
      wsManager.connect(1, 1);
      
      // Handle new messages
      wsManager.onMessage('new_message', (data) => {
        // Invalidate messages query to refresh the list
        queryClient.invalidateQueries({
          queryKey: ['/api/projects/1/messages']
        });
      });

      // Check connection status after a delay
      const checkConnection = () => {
        if (wsManager.isConnected()) {
          setConnectionStatus('connected');
      isConnected.current = true;
        } else {
          setConnectionStatus('failed');
    }
      };

      // Check after 6 seconds (after WebSocket timeout)
      const timeoutId = setTimeout(checkConnection, 6000);

    return () => {
        clearTimeout(timeoutId);
      wsManager.disconnect();
      isConnected.current = false;
        setConnectionStatus('disconnected');
    };
    }
  }, [queryClient]);

  const sendMessage = (data: any) => {
    if (wsManager.isConnected()) {
    wsManager.send(data);
    } else {
      console.warn('WebSocket not connected - message not sent');
    }
  };

  return {
    sendMessage,
    connectionStatus,
    isConnected: wsManager.isConnected()
  };
}
