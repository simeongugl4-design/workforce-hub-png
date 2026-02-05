import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received' | 'system';
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Michael Chen', role: 'Supervisor', lastMessage: 'Your timesheet has been approved', time: '10:30 AM', unread: 2, online: true },
  { id: '2', name: 'Sarah Williams', role: 'HR Manager', lastMessage: 'Contract renewal reminder', time: 'Yesterday', unread: 0, online: false },
  { id: '3', name: 'System', role: 'Notifications', lastMessage: 'Payslip generated for January', time: 'Jan 1', unread: 1, online: true },
  { id: '4', name: 'David Okoro', role: 'Site Supervisor', lastMessage: 'Meeting at 2pm tomorrow', time: 'Dec 28', unread: 0, online: true },
];

const mockMessages: Message[] = [
  { id: '1', senderId: 'system', content: 'Conversation started', timestamp: '9:00 AM', type: 'system' },
  { id: '2', senderId: '1', content: 'Good morning! Can you submit your timesheet for yesterday?', timestamp: '9:15 AM', type: 'received' },
  { id: '3', senderId: 'me', content: 'Good morning Michael! Sure, I\'ll submit it right away.', timestamp: '9:20 AM', type: 'sent' },
  { id: '4', senderId: 'me', content: 'Done! I\'ve submitted the timesheet.', timestamp: '9:25 AM', type: 'sent' },
  { id: '5', senderId: '1', content: 'Perfect, I see it. I\'ll review and approve shortly.', timestamp: '9:30 AM', type: 'received' },
  { id: '6', senderId: '1', content: 'Your timesheet has been approved ✓', timestamp: '10:30 AM', type: 'received' },
];

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Send message logic
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full flex overflow-hidden">
        {/* Contacts List */}
        <div className={cn(
          "w-full md:w-80 border-r flex flex-col",
          selectedContact && "hidden md:flex"
        )}>
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-lg">Messages</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1">
            {mockContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b",
                  selectedContact?.id === contact.id && "bg-muted"
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-status-online border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setSelectedContact(null)}
                >
                  <ArrowLeft size={20} />
                </Button>
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedContact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedContact.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.type === 'sent' && "justify-end",
                      msg.type === 'system' && "justify-center"
                    )}
                  >
                    {msg.type === 'system' ? (
                      <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {msg.content}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "max-w-[70%] px-4 py-2 rounded-2xl",
                          msg.type === 'sent' 
                            ? "bg-chat-sent text-chat-sent-foreground rounded-br-md" 
                            : "bg-chat-received text-chat-received-foreground rounded-bl-md"
                        )}
                      >
                        <p>{msg.content}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          msg.type === 'sent' ? "text-chat-sent-foreground/70" : "text-muted-foreground"
                        )}>
                          {msg.timestamp}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSend} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send size={18} />
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </Card>
    </div>
  );
}
