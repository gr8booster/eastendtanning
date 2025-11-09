import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { MessageCircle, X, Send, Loader2, Tag, List as ListIcon, Clipboard, ShoppingCart, Mic, Volume2, VolumeX, PhoneCall } from 'lucide-react';
import { toast } from 'sonner';

export function MaryWellChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [lastDiscount, setLastDiscount] = useState(null);
  const [lotions, setLotions] = useState([]);
  const [lotionsOpen, setLotionsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutType, setCheckoutType] = useState('tanning'); // tanning | lotion
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [tanningSelection, setTanningSelection] = useState({ level: 'level2', type: 'ten_pack' });
  const [selectedLotion, setSelectedLotion] = useState(null);

  const [listening, setListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // global open chat API
    window.openMaryChat = () => setIsOpen(true);
    window.openMaryChatAndListen = () => {
      setIsOpen(true);
      setTimeout(() => {
        if (!sessionId) startChatSession().then(() => startListening());
        else startListening();
      }, 200);
    };
    return () => { delete window.openMaryChat; delete window.openMaryChatAndListen; };
  }, [sessionId]);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const startChatSession = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/chat/start`, { method: 'POST' });
      const data = await response.json();
      setSessionId(data.session_id);
      setMessages([
        { role: 'assistant', content: data.greeting, timestamp: new Date().toISOString() },
        { role: 'assistant', content: 'Quick actions: view pricing, generate a discount (5%/10%/15%), browse packages, checkout, or have Mary call your phone.', timestamp: new Date().toISOString() }
      ]);
    } catch (error) { console.error('Error starting chat:', error); toast.error('Failed to start chat'); }
  };

  const handleOpen = () => { setIsOpen(true); if (!sessionId) startChatSession(); };

  const speak = (text) => {
    try {
      if (!autoSpeak) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) { /* ignore */ }
  };

  const sendMessage = async (overrideText = null) => {
    const outgoing = overrideText ?? inputMessage;
    if (!outgoing || !outgoing.trim() || loading) return;
    const userMessage = outgoing.trim();
    if (!overrideText) setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }]);
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/chat/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: sessionId, message: userMessage }) });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, timestamp: data.timestamp }]);
      speak(data.response || '');
    } catch (error) { console.error('Error sending message:', error); toast.error('Failed to send message'); }
    finally { setLoading(false); }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const startListening = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { toast.error('Voice not supported by this browser'); return; }
      if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
      const recog = new SpeechRecognition();
      recognitionRef.current = recog;
      recog.lang = 'en-US';
      recog.interimResults = true;
      recog.continuous = false;
      let finalTranscript = '';
      setListening(true);
      recog.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += transcript;
          else interim += transcript;
        }
        setInputMessage(finalTranscript || interim);
      };
      recog.onerror = () => { setListening(false); recognitionRef.current = null; };
      recog.onend = () => {
        setListening(false); recognitionRef.current = null;
        const text = (finalTranscript || inputMessage || '').trim();
        if (text) sendMessage(text);
      };
      recog.start();
    } catch (e) { setListening(false); recognitionRef.current = null; }
  };

  const stopListening = () => { try { recognitionRef.current && recognitionRef.current.stop(); } catch (e) { /* ignore */ } setListening(false); };

  const generateDiscount = async (percent) => {
    try {
      const res = await fetch(`${backendUrl}/api/discounts/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ percent_off: percent, session_id: sessionId }) });
      if (!res.ok) throw new Error('Failed to generate code');
      const data = await res.json();
      setLastDiscount(data);
      setMessages(prev => [...prev, { role: 'assistant', content: `Here is your ${data.percent_off}% OFF code: ${data.code}\nIt expires on ${new Date(data.expires_at).toLocaleString()}. Use it at checkout to apply your discount.`, timestamp: new Date().toISOString() }]);
      toast.success(`${percent}% discount code generated`);
    } catch (e) { console.error(e); toast.error('Could not generate discount code'); }
  };

  const showPackages = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/chat/packages`);
      const data = await res.json();
      const lines = [];
      Object.entries(data).forEach(([lvl, info]) => { lines.push(`${info.name}:`); Object.entries(info.packages).forEach(([type, price]) => { lines.push(`• ${type.replace('_',' ')} — $${price}`); }); lines.push(''); });
      setMessages(prev => [...prev, { role: 'assistant', content: `Available packages:\n\n${lines.join('\n')}`, timestamp: new Date().toISOString() }]);
      setPackagesOpen(true);
    } catch (e) { console.error(e); toast.error('Failed to load packages'); }
  };

  const copyDiscount = async () => { if (!lastDiscount?.code) return; try { await navigator.clipboard.writeText(lastDiscount.code); toast.success('Code copied to clipboard'); } catch (e) { toast.error('Failed to copy'); } };

  const fetchLotions = async () => { try { const res = await fetch(`${backendUrl}/api/lotions`); const data = await res.json(); setLotions(Array.isArray(data) ? data : []); setLotionsOpen(true); } catch (e) { console.error(e); toast.error('Failed to load lotions'); } };

  const openCheckoutTanning = () => { setCheckoutType('tanning'); setCheckoutOpen(true); };
  const openCheckoutLotion = (l) => { setSelectedLotion(l); setCheckoutType('lotion'); setCheckoutOpen(true); };

  const createCheckout = async () => {
    try {
      if (!customer.name || !customer.email || !customer.phone) { toast.error('Please fill your name, email, and phone'); return; }
      let payload = { customer_name: customer.name, customer_email: customer.email, customer_phone: customer.phone, origin_url: window.location.origin };
      if (checkoutType === 'tanning') { payload.package_id = `${tanningSelection.level}_${tanningSelection.type}`; if (lastDiscount?.code) payload.discount_code = lastDiscount.code; }
      else if (checkoutType === 'lotion') { if (!selectedLotion) { toast.error('Select a lotion'); return; } payload.lotion_id = selectedLotion.id; payload.quantity = 1; }
      const res = await fetch(`${backendUrl}/api/payments/checkout/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok && data?.url) { window.open(data.url, '_blank'); toast.success('Opening secure checkout'); setCheckoutOpen(false); }
      else if (res.ok && data?.session_id) { toast.success('Checkout session created. Redirecting to Stripe...'); if (data.url) window.open(data.url, '_blank'); }
      else { toast.error(data?.detail || 'Failed to create checkout'); }
    } catch (e) { console.error(e); toast.error('Checkout failed'); }
  };

  const submitCallMe = async () => {
    try {
      if (!customer.name || !customer.phone) { toast.error('Please add your name and phone'); return; }
      const res = await fetch(`${backendUrl}/api/voice/calls/outbound`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: { name: customer.name, phone: customer.phone, email: customer.email || undefined } })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        toast.success('Mary is calling you now');
        setCallDialogOpen(false);
      } else {
        toast.error(data?.detail || 'Unable to start call (provider not configured yet)');
      }
    } catch (e) { console.error(e); toast.error('Call failed'); }
  };

  return (
    <>
      {!isOpen && (
        <Button onClick={handleOpen} className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600 shadow-xl z-50" data-testid="mary-well-button" aria-label="Chat with Mary">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[700px] shadow-2xl z-50 flex flex-col" data-testid="mary-well-chat">
          <div className="bg-gradient-to-r from-amber-500 to-teal-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><MessageCircle className="h-5 w-5" /></div>
              <div><h3 className="font-bold">Mary Well</h3><p className="text-xs text-white/90">AI Assistant</p></div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAutoSpeak(v => !v)} className="text-white hover:bg-white/20" data-testid="toggle-voice-output">
                {autoSpeak ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' ? 'bg-gradient-to-r from-amber-500 to-teal-500 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (<div className="flex justify-start"><div className="bg-white border border-slate-200 rounded-lg p-3"><Loader2 className="h-5 w-5 animate-spin text-teal-500" /></div></div>)}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pt-3 pb-2 border-t border-slate-200 bg-white">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => window.location.assign('/tanning')} variant="outline" size="sm" data-testid="see-pricing-button"><ListIcon className="h-4 w-4 mr-1" /> See Pricing</Button>
              <Button onClick={showPackages} variant="outline" size="sm" data-testid="show-packages-button"><Tag className="h-4 w-4 mr-1" /> Show Packages</Button>
              <Button onClick={() => generateDiscount(15)} size="sm" className="bg-[hsl(var(--primary))] hover:bg-[hsl(42_92%_50%)]" data-testid="chat-action-15">15% Off</Button>
              <Button onClick={() => generateDiscount(10)} size="sm" variant="secondary" data-testid="chat-action-10">10% Off</Button>
              <Button onClick={() => generateDiscount(5)} size="sm" variant="secondary" data-testid="chat-action-5">5% Off</Button>
              <Button onClick={copyDiscount} size="sm" variant="ghost" disabled={!lastDiscount} data-testid="copy-discount-button"><Clipboard className="h-4 w-4 mr-1" /> Copy Code</Button>
              <Button onClick={fetchLotions} size="sm" variant="outline" data-testid="browse-lotions-button"><Tag className="h-4 w-4 mr-1" /> Browse Lotions</Button>
              <Button onClick={openCheckoutTanning} size="sm" className="bg-secondary text-white" data-testid="checkout-tanning-button"><ShoppingCart className="h-4 w-4 mr-1" /> Checkout Tanning</Button>
              {!listening ? (
                <Button onClick={startListening} size="sm" variant="outline" data-testid="talk-to-mary-button"><Mic className="h-4 w-4 mr-1" /> Talk to Mary</Button>
              ) : (
                <Button onClick={stopListening} size="sm" variant="destructive" data-testid="stop-talking-button">Stop</Button>
              )}
              <Button onClick={() => setCallDialogOpen(true)} size="sm" variant="outline" data-testid="have-mary-call-button"><PhoneCall className="h-4 w-4 mr-1" /> Have Mary Call Me</Button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." disabled={loading} className="flex-1" data-testid="chat-input" />
              <Button onClick={() => sendMessage()} disabled={loading || !inputMessage.trim()} className="bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600" data-testid="send-button"><Send className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Available 24/7 • Chat or use your voice</p>
          </div>
        </Card>
      )}

      {/* Have Mary Call Me Dialog */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Have Mary Call Me</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1"><Label>Name</Label><Input value={customer.name} onChange={(e)=>setCustomer({...customer, name:e.target.value})} data-testid="call-name" /></div>
            <div className="sm:col-span-1"><Label>Phone</Label><Input value={customer.phone} onChange={(e)=>setCustomer({...customer, phone:e.target.value})} data-testid="call-phone" /></div>
            <div className="sm:col-span-1"><Label>Email (optional)</Label><Input type="email" value={customer.email} onChange={(e)=>setCustomer({...customer, email:e.target.value})} data-testid="call-email" /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={()=>setCallDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitCallMe} data-testid="call-submit">Call Me Now</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lotions Dialog */}
      <Dialog open={lotionsOpen} onOpenChange={setLotionsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Available Lotions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-80 overflow-auto">
            {lotions.length === 0 && <p className="text-sm text-muted-foreground">No lotions published yet.</p>}
            {lotions.map((l) => (
              <div key={l.id} className="flex items-start justify-between gap-3 border rounded-lg p-3" data-testid={`lotion-${l.id}`}>
                <div>
                  <div className="font-semibold">{l.name} {l.brand ? <span className="text-muted-foreground text-sm">• {l.brand}</span> : null}</div>
                  <div className="text-sm text-muted-foreground">${l.price.toFixed(2)} • {l.tattoo_guard ? 'Tattoo-Guard' : 'Skin Care'}</div>
                  {l.features && l.features.length > 0 && (
                    <ul className="text-xs text-muted-foreground mt-1 list-disc pl-4">
                      {l.features.map((f, idx) => <li key={idx}>{f}</li>)}
                    </ul>
                  )}
                </div>
                <Button size="sm" onClick={() => openCheckoutLotion(l)} data-testid={`buy-lotion-${l.id}`}>Buy</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{checkoutType === 'tanning' ? 'Checkout Tanning Package' : `Checkout ${selectedLotion?.name || 'Lotion'}`}</DialogTitle>
          </DialogHeader>
          {checkoutType === 'tanning' && (
            <div className="grid grid-cols-1 gap-3 mb-3">
              <div>
                <Label className="text-sm">Tanning Level</Label>
                <Select value={tanningSelection.level} onValueChange={(v) => setTanningSelection(s => ({ ...s, level: v }))}>
                  <SelectTrigger data-testid="select-level"><SelectValue placeholder="Choose level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="level1">Level 1</SelectItem>
                    <SelectItem value="level2">Level 2</SelectItem>
                    <SelectItem value="level3">Level 3</SelectItem>
                    <SelectItem value="level4">Level 4</SelectItem>
                    <SelectItem value="matrix">Matrix</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Package Type</Label>
                <Select value={tanningSelection.type} onValueChange={(v) => setTanningSelection(s => ({ ...s, type: v }))}>
                  <SelectTrigger data-testid="select-package"><SelectValue placeholder="Choose package" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="five_pack">5 Pack</SelectItem>
                    <SelectItem value="ten_pack">10 Pack</SelectItem>
                    <SelectItem value="twenty_pack">20 Pack</SelectItem>
                    <SelectItem value="month_unlimited">Month Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1"><Label>Name</Label><Input value={customer.name} onChange={(e)=>setCustomer({...customer, name:e.target.value})} data-testid="checkout-name" /></div>
            <div className="sm:col-span-1"><Label>Email</Label><Input type="email" value={customer.email} onChange={(e)=>setCustomer({...customer, email:e.target.value})} data-testid="checkout-email" /></div>
            <div className="sm:col-span-1"><Label>Phone</Label><Input value={customer.phone} onChange={(e)=>setCustomer({...customer, phone:e.target.value})} data-testid="checkout-phone" /></div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={()=>setCheckoutOpen(false)}>Cancel</Button>
            <Button onClick={createCheckout} data-testid="checkout-submit">Proceed to Payment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
