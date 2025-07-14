import { useEffect, useState, useCallback } from 'react';
import { getWebSocketManager } from '@/lib/websocket';
import { ChatMessage } from '@/types';

export function useWebSocket() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const wsManager = getWebSocketManager();
    
    wsManager.onMessage('authenticated', (data) => {
      setIsConnected(data.success);
    });
    
    wsManager.onMessage('new_message', (data) => {
      setMessages(prev => [...prev, data.message]);
    });
    
    wsManager.onMessage('task_update', (data) => {
      // Handle task updates - could trigger a refetch of tasks
      console.log('Task updated:', data.task);
    });

    return () => {
      wsManager.disconnect();
    };
  }, []);

  const sendMessage = useCallback((content: string, projectId?: number) => {
    const wsManager = getWebSocketManager();
    wsManager.sendMessage(content, projectId);
  }, []);

  return {
    messages,
    isConnected,
    sendMessage
  };
}
