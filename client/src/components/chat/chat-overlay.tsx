import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useWebSocket } from '@/hooks/use-websocket';
import { useQuery } from '@tanstack/react-query';
import { ChatMessage } from '@/types';

export function ChatOverlay() {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages: liveMessages, sendMessage } = useWebSocket();
  
  // Fetch initial messages
  const { data: initialMessages } = useQuery<ChatMessage[]>({
    queryKey: ['/api/messages'],
  });

  // Combine initial messages with live messages
  const allMessages = [...(initialMessages || []), ...liveMessages];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-green-500';
      case 'worker':
        return 'bg-blue-500';
      case 'inspector':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0"
        >
          <i className="fas fa-comments text-lg"></i>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-gray-800 border-gray-700 shadow-lg max-h-96 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-700">
          <h4 className="text-sm font-semibold text-white">
            <i className="fas fa-comments mr-2 text-blue-400"></i>
            Team Chat
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <i className="fas fa-minus"></i>
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
            {allMessages.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <i className="fas fa-comments text-2xl mb-2"></i>
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start a conversation with your team</p>
              </div>
            ) : (
              allMessages.map((msg) => (
                <div key={msg.id} className="flex items-start space-x-2">
                  <Avatar className={`w-6 h-6 ${getAvatarColor(msg.sender.role)}`}>
                    <AvatarFallback className="text-white text-xs font-medium">
                      {getInitials(msg.sender.firstName, msg.sender.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-medium text-white">
                        {msg.sender.firstName} {msg.sender.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-300 mt-1 break-words">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 border-gray-600 text-white text-sm focus:border-blue-500"
              />
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                disabled={!message.trim()}
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
