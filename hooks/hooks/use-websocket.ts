import { useEffect, useRef } from "react";
import { wsManager } from "@/lib/websocket";
import { useQueryClient } from "@tanstack/react-query";

export function useWebSocket() {
  const queryClient = useQueryClient();
  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current) {
      // Connect with current user (hardcoded for demo)
      wsManager.connect(1, 1);
      
      // Handle new messages
      wsManager.onMessage('new_message', (data) => {
        // Invalidate messages query to refresh the list
        queryClient.invalidateQueries({
          queryKey: ['/api/projects/1/messages']
        });
      });

      isConnected.current = true;
    }

    return () => {
      wsManager.disconnect();
      isConnected.current = false;
    };
  }, [queryClient]);

  const sendMessage = (data: any) => {
    wsManager.send(data);
  };

  return {
    sendMessage
  };
}
