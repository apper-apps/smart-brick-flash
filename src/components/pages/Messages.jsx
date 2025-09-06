import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { formatDateTime } from "@/utils/formatters";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Mock conversations data
      const mockConversations = [
        {
          id: 1,
          name: "Priya Sharma",
          role: "Sub Member",
          lastMessage: "Property inquiry for Villa in Bandra",
          lastMessageTime: "2024-01-15T10:30:00",
          unreadCount: 2,
          avatar: "PS",
          online: true
        },
        {
          id: 2,
          name: "Amit Kumar",
          role: "Team Member",
          lastMessage: "Commission details for last month",
          lastMessageTime: "2024-01-15T09:15:00",
          unreadCount: 0,
          avatar: "AK",
          online: false
        },
        {
          id: 3,
          name: "Neha Patel",
          role: "Sub Member",
          lastMessage: "New property listing in Andheri",
          lastMessageTime: "2024-01-14T16:45:00",
          unreadCount: 1,
          avatar: "NP",
          online: true
        }
      ];

      setConversations(mockConversations);
      
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0]);
        loadConversationMessages(mockConversations[0].id);
      }
    } catch (err) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = (conversationId) => {
    // Mock messages for the selected conversation
    const mockMessages = [
      {
        id: 1,
        senderId: conversationId === 1 ? 1 : 2,
        senderName: conversationId === 1 ? "Priya Sharma" : "Amit Kumar",
        text: "Hi Rajesh, I have a client interested in the Villa in Bandra",
        timestamp: "2024-01-15T09:00:00",
        isOwn: false
      },
      {
        id: 2,
        senderId: "current",
        senderName: "You",
        text: "That's great! Can you share the client details and their budget?",
        timestamp: "2024-01-15T09:15:00",
        isOwn: true
      },
      {
        id: 3,
        senderId: conversationId === 1 ? 1 : 2,
        senderName: conversationId === 1 ? "Priya Sharma" : "Amit Kumar",
        text: "Budget is around 4-4.5 crores. They want to visit this weekend.",
        timestamp: "2024-01-15T10:30:00",
        isOwn: false
      }
    ];

    setMessages(mockMessages);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      senderId: "current",
      senderName: "You",
      text: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage("");
    
    // Update last message in conversation
    const updatedConversations = conversations.map(conv => 
      conv.id === activeConversation.id 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
        : conv
    );
    setConversations(updatedConversations);
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    loadConversationMessages(conversation.id);
    
    // Mark as read
    if (conversation.unreadCount > 0) {
      const updatedConversations = conversations.map(conv =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      );
      setConversations(updatedConversations);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMessages} />;

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="card h-full p-0 flex flex-col">
            <div className="p-4 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <Empty
                  title="No conversations"
                  description="Start a conversation with your team members"
                  icon="MessageSquare"
                  className="py-8"
                />
              ) : (
                <div className="divide-y divide-surface-100">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`w-full p-4 text-left hover:bg-surface-50 transition-colors ${
                        activeConversation?.id === conversation.id ? "bg-primary-50 border-r-2 border-primary-500" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                            conversation.online ? "bg-success-500" : "bg-gray-400"
                          }`}>
                            {conversation.avatar}
                          </div>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">{conversation.name}</p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{conversation.role}</p>
                          <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDateTime(conversation.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {activeConversation ? (
            <div className="card h-full p-0 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-surface-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                      activeConversation.online ? "bg-success-500" : "bg-gray-400"
                    }`}>
                      {activeConversation.avatar}
                    </div>
                    {activeConversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{activeConversation.name}</h3>
                    <p className="text-sm text-gray-600">{activeConversation.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Phone" className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Video" className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="MoreVertical" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isOwn
                        ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
                        : "bg-surface-100 text-gray-900"
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? "text-primary-100" : "text-gray-500"
                      }`}>
                        {formatDateTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-surface-200">
                <form onSubmit={sendMessage} className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="border-0 bg-surface-50 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <Button type="submit" size="sm" className="px-4">
                    <ApperIcon name="Send" className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center">
              <Empty
                title="Select a conversation"
                description="Choose a conversation from the sidebar to start messaging"
                icon="MessageSquare"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;