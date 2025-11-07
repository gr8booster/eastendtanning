import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { MessageCircle, X, Send, Loader2, Tag, List as ListIcon, Clipboard } from 'lucide-react';
import { toast } from 'sonner';

export function MaryWellChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [lastDiscount, setLastDiscount] = useState(null);
  const messagesEndRef = useRef(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChatSession = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/chat/start`, {
        method: 'POST'
      });
      const data = await response.json();
      setSessionId(data.session_id);
      setMessages([{
        role: 'assistant',
        content: data.greeting,
        timestamp: new Date().toISOString()
      }, {
        role: 'assistant',
        content: 'Quick actions: Use the buttons below to view pricing, generate a discount code (5%/10%/15%) or browse packages.',
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!sessionId) {
      startChatSession();
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage
        })
      });

      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateDiscount = async (percent) => {
    try {
      const res = await fetch(`${backendUrl}/api/discounts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percent_off: percent, session_id: sessionId })
      });
      if (!res.ok) throw new Error('Failed to generate code');
      const data = await res.json();
      setLastDiscount(data);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Here is your ${data.percent_off}% OFF code: ${data.code}\nIt expires on ${new Date(data.expires_at).toLocaleString()}. Use it at checkout to apply your discount.`,
        timestamp: new Date().toISOString()
      }]);
      toast.success(`${percent}% discount code generated`);
    } catch (e) {
      console.error(e);
      toast.error('Could not generate discount code');
    }
  };

  const showPackages = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/chat/packages`);
      const data = await res.json();
      const lines = [];
      Object.entries(data).forEach(([lvl, info]) => {
        lines.push(`${info.name}:`);
        Object.entries(info.packages).forEach(([type, price]) => {
          lines.push(`• ${type.replace('_',' ')} — $${price}`);
        });
        lines.push('');
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Available packages:\n\n${lines.join('\n')}`,
        timestamp: new Date().toISOString()
      }]);
      setPackagesOpen(true);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load packages');
    }
  };

  const copyDiscount = async () => {
    if (!lastDiscount?.code) return;
    try {
      await navigator.clipboard.writeText(lastDiscount.code);
      toast.success('Code copied to clipboard');
    } catch (e) {
      toast.error('Failed to copy');
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600 shadow-xl z-50"
          data-testid="mary-well-button"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col" data-testid="mary-well-chat">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-teal-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">Mary Well</h3>
                <p className="text-xs text-white/90">AI Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-teal-500 text-white'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pt-3 pb-2 border-t border-slate-200 bg-white">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => window.location.assign('/tanning')} variant="outline" size="sm" data-testid="see-pricing-button">
                <ListIcon className="h-4 w-4 mr-1" /> See Pricing
              </Button>
              <Button onClick={() => showPackages()} variant="outline" size="sm" data-testid="show-packages-button">
                <Tag className="h-4 w-4 mr-1" /> Show Packages
              </Button>
              <Button onClick={() => generateDiscount(15)} size="sm" className="bg-[hsl(var(--primary))] hover:bg-[hsl(42_92%_50%)]" data-testid="chat-action-15">
                15% Off
              </Button>
              <Button onClick={() => generateDiscount(10)} size="sm" variant="secondary" data-testid="chat-action-10">
                10% Off
              </Button>
              <Button onClick={() => generateDiscount(5)} size="sm" variant="secondary" data-testid="chat-action-5">
                5% Off
              </Button>
              <Button onClick={copyDiscount} size="sm" variant="ghost" disabled={!lastDiscount} data-testid="copy-discount-button">
                <Clipboard className="h-4 w-4 mr-1" /> Copy Code
              </Button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1"
                data-testid="chat-input"
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !inputMessage.trim()}
                className="bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600"
                data-testid="send-button"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Available 24/7 • Powered by AI
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
