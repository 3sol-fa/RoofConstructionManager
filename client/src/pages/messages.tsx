import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useWebSocket } from '@/hooks/use-websocket';
import { ChatMessage } from '@/types';

export default function Messages() {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages: liveMessages, sendMessage } = useWebSocket();
  
  // Fetch initial messages
  const { data: initialMessages, isLoading } = useQuery<ChatMessage[]>({
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
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const groupedMessages = groupMessagesByDate(allMessages);
  const sortedDates = Object.keys(groupedMessages).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Messages" />
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
          <Card className="bg-gray-800 border-gray-700 h-full animate-pulse">
            <CardContent className="p-6">
              <div className="h-96 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header title="Messages" />
      
      <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
        <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-lg font-semibold text-white">
              <i className="fas fa-comments mr-2 text-blue-400"></i>
              Team Communications
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {allMessages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <i className="fas fa-comments text-6xl mb-4"></i>
                  <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
                  <p className="text-gray-400">Start a conversation with your team</p>
                </div>
              ) : (
                sortedDates.map(dateKey => {
                  const isToday = dateKey === new Date().toDateString();
                  const isYesterday = dateKey === new Date(Date.now() - 86400000).toDateString();
                  
                  let dateLabel = new Date(dateKey).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  
                  if (isToday) {
                    dateLabel = 'Today';
                  } else if (isYesterday) {
                    dateLabel = 'Yesterday';
                  }
                  
                  return (
                    <div key={dateKey}>
                      {/* Date Separator */}
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                          {dateLabel}
                        </div>
                      </div>
                      
                      {/* Messages for this date */}
                      <div className="space-y-4">
                        {groupedMessages[dateKey].map((msg, index) => {
                          const prevMessage = index > 0 ? groupedMessages[dateKey][index - 1] : null;
                          const showAvatar = !prevMessage || prevMessage.sender.id !== msg.sender.id;
                          
                          return (
                            <div key={msg.id} className={`flex items-start space-x-3 ${!showAvatar ? 'ml-12' : ''}`}>
                              {showAvatar ? (
                                <Avatar className={`w-8 h-8 ${getAvatarColor(msg.sender.role)} flex-shrink-0`}>
                                  <AvatarFallback className="text-white text-xs font-medium">
                                    {getInitials(msg.sender.firstName, msg.sender.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-8 h-8 flex-shrink-0"></div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                {showAvatar && (
                                  <div className="flex items-center space-x-2 mb-1">
                                    <p className="text-sm font-medium text-white">
                                      {msg.sender.firstName} {msg.sender.lastName}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatTime(msg.createdAt)}
                                    </p>
                                  </div>
                                )}
                                <div className="bg-gray-700 rounded-lg p-3 max-w-lg">
                                  <p className="text-sm text-gray-200 break-words">
                                    {msg.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="border-t border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                />
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  disabled={!message.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
