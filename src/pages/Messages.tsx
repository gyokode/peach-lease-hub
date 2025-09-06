import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface Conversation {
  id: string;
  participant_one_id: string;
  participant_two_id: string;
  housing_ad_id?: string;
  last_message_at: string;
  other_user: {
    id: string;
    display_name: string;
    email: string;
    university: string;
  };
  housing_ad?: {
    id: string;
    title: string;
  };
}

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  content: string;
  created_at: string;
  read_at?: string;
  from_user: {
    display_name: string;
    email: string;
  };
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_one:profiles!conversations_participant_one_id_fkey(*),
          participant_two:profiles!conversations_participant_two_id_fkey(*),
          housing_ad:housing_ads(id, title)
        `)
        .or(`participant_one_id.eq.${user?.id},participant_two_id.eq.${user?.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const formattedConversations = data?.map((conv: any) => ({
        ...conv,
        other_user: conv.participant_one_id === user?.id ? conv.participant_two : conv.participant_one
      })) || [];

      setConversations(formattedConversations);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      // First get the conversation to find the other participant
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(from_user_id.eq.${user?.id},to_user_id.eq.${conversation.other_user.id}),and(from_user_id.eq.${conversation.other_user.id},to_user_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Add from_user info manually
      const messagesWithUser = (data || []).map(msg => ({
        ...msg,
        from_user: {
          display_name: msg.from_user_id === user?.id ? 'You' : conversation.other_user.display_name,
          email: msg.from_user_id === user?.id ? user?.email || '' : conversation.other_user.email
        }
      }));
      
      setMessages(messagesWithUser);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('housing_ad_id', conversationId)
        .eq('to_user_id', user?.id)
        .is('read_at', null);
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const toUserId = conversation.other_user.id;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          from_user_id: user.id,
          to_user_id: toUserId,
          housing_ad_id: conversation.housing_ad_id,
          content: newMessage.trim()
        });

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation);

      setNewMessage("");
      fetchMessages(selectedConversation);
      fetchConversations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You need to be signed in to view messages.</p>
            <Button asChild variant="hero">
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Connect with other students about housing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Start by browsing ads and contacting property owners</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-smooth ${
                        selectedConversation === conversation.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {conversation.other_user.display_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">
                              {conversation.other_user.display_name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(conversation.last_message_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.other_user.university}
                          </p>
                          {conversation.housing_ad && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {conversation.housing_ad.title}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader>
                  <CardTitle>
                    {conversations.find(c => c.id === selectedConversation)?.other_user.display_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-[500px]">
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.from_user_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.from_user_id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="icon" variant="hero">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[500px]">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;