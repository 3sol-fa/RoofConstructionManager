'use client'

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Users, Search, Settings, Phone, Video, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Message } from "@shared/schema";

// Add Google Translate API logic
const GOOGLE_TRANSLATE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

function detectLanguage(text: string) {
  // Simple heuristic: if contains Korean, return 'ko', else 'en'
  if (/[\u3131-\uD79D]/ugi.test(text)) return 'ko';
  return 'en';
}

export default function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [translation, setTranslation] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  // Remove the useWebSocket hook since it's not defined
  // const { sendMessage } = useWebSocket();

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['/api/projects/1/messages'],
    refetchInterval: 1000, // Poll for new messages every second
  });

  // Mock team members data
  const teamMembers = [
    { id: 1, name: "John Smith", role: "Site Manager", initials: "JS", isOnline: true },
    { id: 2, name: "Emily Lee", role: "Worker", initials: "EL", isOnline: true },
    { id: 3, name: "Michael Park", role: "Worker", initials: "MP", isOnline: false },
    { id: 4, name: "Sarah Choi", role: "Safety Manager", initials: "SC", isOnline: true },
  ];

  const currentUserId = 1; // Current user ID (hardcoded for demo)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const doTranslate = async () => {
      if (!newMessage.trim()) {
        setTranslation("");
        return;
      }
      setIsTranslating(true);
      const source = detectLanguage(newMessage);
      const target = source === 'en' ? 'ko' : 'en';
      try {
        const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: newMessage,
            source,
            target,
            format: 'text',
          }),
        });
        const data = await res.json();
        setTranslation(data.data?.translations?.[0]?.translatedText || "");
      } catch (e) {
        setTranslation("");
      } finally {
        setIsTranslating(false);
      }
    };
    doTranslate();
  }, [newMessage]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implement actual message sending
      console.log('Sending message:', newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUserById = (id: number) => {
    return teamMembers.find(member => member.id === id) || {
      id,
      name: "Unknown",
      role: "Unassigned",
      initials: "NA",
      isOnline: false
    };
  };

  const formatMessageTime = (date: string | Date | null) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return format(messageDate, 'HH:mm');
    } else if (diffInDays === 1) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`;
    } else {
      return format(messageDate, 'MM.dd HH:mm');
    }
  };

  const onlineCount = teamMembers.filter(member => member.isOnline).length;

  if (isLoading) {
    return (
      <div className="p-6 h-full">
        <div className="animate-pulse space-y-6 h-full">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="flex h-full gap-6">
            <div className="w-80 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Chat</h1>
        <p className="text-gray-600">Communicate with your project team in real time</p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Team Members Sidebar */}
        <Card className="w-80 flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Team Members</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {onlineCount} online
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {teamMembers
                  .filter(member => 
                    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.role.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary text-white font-medium">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Video className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">General Chat</CardTitle>
                <p className="text-sm text-gray-500">Project team general chat room</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  {teamMembers.length} members
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages?.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm">No messages yet.</p>
                    <p className="text-xs">Send the first message!</p>
                  </div>
                )}
                
                {messages?.map((message) => {
                  const user = getUserById(message.senderId);
                  const isCurrentUser = message.senderId === currentUserId;
                  
                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                        {!isCurrentUser && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-white text-xs">
                              {user.initials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          {!isCurrentUser && (
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-900">{user.name}</span>
                              <span className="text-xs text-gray-500">{user.role}</span>
                            </div>
                          )}
                          <div className={`rounded-lg px-3 py-2 ${
                            isCurrentUser 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="border-t p-4 bg-white">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message... (Shift + Enter for newline)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {newMessage.trim() && (
                <div className="mt-2 text-xs text-gray-500 min-h-[1.5em]">
                  {isTranslating ? 'Translating...' : translation}
                </div>
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Press Enter to send, Shift + Enter for newline</span>
                <span>{onlineCount} online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
