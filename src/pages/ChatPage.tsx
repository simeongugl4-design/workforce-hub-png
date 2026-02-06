import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useContacts, useConversation, useSendMessage } from "@/hooks/useMessages";

export default function ChatPage() {
  const { user } = useAuth();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: contacts, isLoading: loadingContacts } = useContacts();
  const { data: messages, isLoading: loadingMessages } = useConversation(selectedContactId);
  const sendMessage = useSendMessage();

  const selectedContact = contacts?.find((c: any) => c.id === selectedContactId);

  const filteredContacts = contacts?.filter((c: any) =>
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !selectedContactId) return;

    try {
      await sendMessage.mutateAsync({
        senderId: user.id,
        receiverId: selectedContactId,
        content: message.trim(),
      });
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full flex overflow-hidden">
        {/* Contacts List */}
        <div className={cn(
          "w-full md:w-80 border-r flex flex-col",
          selectedContactId && "hidden md:flex"
        )}>
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-lg">Messages</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search contacts..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1">
            {loadingContacts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No contacts yet. Your supervisor and team members will appear here.
              </div>
            ) : (
              filteredContacts.map((contact: any) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b",
                    selectedContactId === contact.id && "bg-muted"
                  )}
                >
                  <Avatar>
                    <AvatarImage src={contact.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {contact.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{contact.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{contact.position || 'Employee'}</p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedContactId ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedContactId(null)}>
                <ArrowLeft size={20} />
              </Button>
              <Avatar>
                <AvatarImage src={selectedContact?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {selectedContact?.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedContact?.full_name}</p>
                <p className="text-xs text-muted-foreground">{selectedContact?.position}</p>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : messages?.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  messages?.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender_id === user?.id ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] px-4 py-2 rounded-2xl",
                          msg.sender_id === user?.id
                            ? "bg-chat-sent text-chat-sent-foreground rounded-br-md"
                            : "bg-chat-received text-chat-received-foreground rounded-bl-md"
                        )}
                      >
                        <p>{msg.content}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          msg.sender_id === user?.id ? "text-chat-sent-foreground/70" : "text-muted-foreground"
                        )}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSend} className="p-4 border-t">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1" />
                <Button type="submit" size="icon" disabled={sendMessage.isPending}>
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
