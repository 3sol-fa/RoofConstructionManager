'use client'

import { useState } from "react";
import { MessageCircle, X, Send, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/lib/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Message } from "@shared/schema";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  
  const { sendMessage, connectionStatus, isConnected } = useWebSocket();
  
  const { data: messages } = useQuery<Message[]>({
    queryKey: ['/api/projects/1/messages'],
    enabled: isOpen,
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      if (isConnected) {
      sendMessage({
        type: 'message',
        projectId: 1,
        senderId: 1, // Current user ID
        content: newMessage.trim()
      });
      } else {
        // Fallback: just log the message
        console.log('Message (offline):', newMessage.trim());
      }
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'failed':
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Online';
      case 'connecting':
        return 'Connecting...';
      case 'failed':
      case 'disconnected':
        return 'Offline';
      default:
        return 'No connection';
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-600 flex items-center justify-center relative"
        >
          <MessageCircle className="h-6 w-6" />
          {/* Connection status indicator */}
          <div className="absolute -top-1 -right-1">
            {getConnectionIcon()}
          </div>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96">
          <Card className="w-full h-full shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">Team Chat</CardTitle>
                  <div className="flex items-center space-x-1 text-xs">
                    {getConnectionIcon()}
                    <span className={connectionStatus === 'connected' ? 'text-green-600' : 'text-gray-500'}>
                      {getConnectionText()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full p-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 pb-4">
                  {messages?.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm">No messages yet.</p>
                      <p className="text-xs">Send the first message!</p>
                    </div>
                  )}
                  {messages?.map((message) => (
                    <div key={message.id} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {message.senderId === 1 ? 'Me' : 'Team'}
                          </span>
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                          <p className="text-sm text-gray-900">{message.content}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 ml-10">
                        {message.createdAt ? format(new Date(message.createdAt), 'HH:mm') : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder={isConnected ? "Type a message..." : "Offline mode"}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    disabled={!isConnected}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {!isConnected && (
                  <p className="text-xs text-gray-500 mt-2">
                    No real-time connection. Messages are stored locally.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
