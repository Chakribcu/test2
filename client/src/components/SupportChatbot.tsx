import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  MessageCircle, 
  X, 
  Send, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Smile, 
  Frown, 
  Meh, 
  Volume2,
  PauseCircle,
  HelpCircle,
  UserCircle,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  mood?: 'positive' | 'negative' | 'neutral' | 'confused'; 
}

interface SuggestedQuestion {
  id: string;
  text: string;
}

export function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([
    { id: "q1", text: "How do I find my perfect shoe size?" },
    { id: "q2", text: "What's your return policy?" },
    { id: "q3", text: "Can I exchange my purchase?" },
    { id: "q4", text: "Do you ship internationally?" },
  ]);

  // Generate a welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: `Hi ${user?.firstName || 'there'}! 👋 I'm the KavinoRa virtual assistant. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date(),
        mood: 'positive'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, user]);

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Send message mutation - connects to backend API
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      try {
        const res = await apiRequest("POST", "/api/chat", { message, userId: user?.id });
        return await res.json();
      } catch (error) {
        console.error("Error sending message:", error);
        
        // For demo purposes, simulate bot response with mood detection
        return simulateBotResponse(message);
      }
    },
    onMutate: (message) => {
      // Add user message to chat immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: message,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      
      // Show bot is typing
      setIsTyping(true);
    },
    onSuccess: (data) => {
      // Add bot response after a realistic delay
      setTimeout(() => {
        setIsTyping(false);
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          content: data.response,
          sender: 'bot',
          timestamp: new Date(),
          mood: data.mood || 'neutral'
        };
        setMessages(prev => [...prev, botMessage]);

        // Update suggested questions if available
        if (data.suggestedQuestions) {
          setSuggestedQuestions(data.suggestedQuestions);
        }
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    },
    onError: () => {
      setIsTyping(false);
      // Add error message
      const errorMessage: ChatMessage = {
        id: `bot-error-${Date.now()}`,
        content: "I'm having trouble connecting right now. Please try again later or contact our support team at support@kavinora.com.",
        sender: 'bot',
        timestamp: new Date(),
        mood: 'negative'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim()) {
      sendMessageMutation.mutate(inputValue.trim());
    }
  }, [inputValue, sendMessageMutation]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    sendMessageMutation.mutate(question);
  };

  // Function to detect mood from text (simplified version for demo)
  const detectMood = (text: string): 'positive' | 'negative' | 'neutral' | 'confused' => {
    const positiveWords = ['thanks', 'great', 'awesome', 'good', 'excellent', 'love', 'happy', 'perfect', 'yes'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'poor', 'wrong', 'unhappy', 'disappointed', 'no'];
    const confusedWords = ['confused', 'not sure', 'don\'t understand', 'what', 'how', 'why', 'when', 'where', 'who'];
    
    const lowerText = text.toLowerCase();
    
    let positiveScore = positiveWords.filter(word => lowerText.includes(word)).length;
    let negativeScore = negativeWords.filter(word => lowerText.includes(word)).length;
    let confusedScore = confusedWords.filter(word => lowerText.includes(word)).length;
    
    if (confusedScore > Math.max(positiveScore, negativeScore)) return 'confused';
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  };

  // Simulate bot response for demo purposes
  const simulateBotResponse = (message: string) => {
    const mood = detectMood(message);
    
    // Common product questions and answers
    const faqResponses: {[key: string]: string} = {
      'size': 'We recommend using our foot measuring tool in the app or website for the most accurate size. If you're between sizes, we suggest going up a half size for a more comfortable fit.',
      'return': 'We offer a 30-day satisfaction guarantee. If you're not completely satisfied, you can return unworn shoes in their original packaging for a full refund or exchange.',
      'shipping': 'We offer free standard shipping on all orders over $75. Standard shipping takes 3-5 business days, and expedited options are available at checkout.',
      'material': 'Our wellness shoes are made with sustainable, eco-friendly materials including recycled PET, natural rubber, and organic cotton where possible.',
      'warranty': 'All KavinoRa products come with a 1-year limited warranty against manufacturing defects under normal use.',
      'wash': 'Most of our shoes can be spot cleaned with mild soap and water. For detailed care instructions, please check the product-specific care guide that came with your purchase.',
      'discount': 'We offer a 10% discount for first-time customers when you sign up for our newsletter. We also have seasonal sales and special offers for loyalty program members.',
      'location': 'KavinoRa products are available in our online store and select retail partners nationwide. Use our store locator to find a retailer near you.',
    };
    
    // Check for keywords in the message to determine response
    const lowerMsg = message.toLowerCase();
    let response = "I'm sorry, I don't have specific information about that. Would you like me to connect you with a human representative?";
    
    // Check each keyword group for matches
    for (const [keyword, answer] of Object.entries(faqResponses)) {
      if (lowerMsg.includes(keyword)) {
        response = answer;
        break;
      }
    }
    
    // Handle greetings
    if (lowerMsg.match(/^(hi|hello|hey|greetings)/i)) {
      response = `Hello! How can I help you with KavinoRa products today?`;
    }
    
    // Handle thanks
    if (lowerMsg.match(/thank|thanks|appreciate|grateful/i)) {
      response = `You're welcome! Is there anything else I can help you with today?`;
    }
    
    // Handle goodbyes
    if (lowerMsg.match(/bye|goodbye|see you|talk later/i)) {
      response = `Goodbye! Thanks for chatting with KavinoRa support. Have a great day!`;
    }
    
    // Generate some suggested follow-up questions based on the current topic
    let suggestedQuestions = [];
    if (lowerMsg.includes('size')) {
      suggestedQuestions = [
        { id: "sq1", text: "How do I measure my foot size at home?" },
        { id: "sq2", text: "Do your shoes run small or large?" },
      ];
    } else if (lowerMsg.includes('return')) {
      suggestedQuestions = [
        { id: "sq1", text: "How do I start a return process?" },
        { id: "sq2", text: "Can I exchange instead of returning?" },
      ];
    } else if (lowerMsg.includes('shipping')) {
      suggestedQuestions = [
        { id: "sq1", text: "Do you ship internationally?" },
        { id: "sq2", text: "How can I track my order?" },
      ];
    } else {
      suggestedQuestions = [
        { id: "sq1", text: "Tell me about your materials" },
        { id: "sq2", text: "What's your return policy?" },
        { id: "sq3", text: "How do I care for my shoes?" },
      ];
    }
    
    return {
      response,
      mood,
      suggestedQuestions
    };
  };

  // Get appropriate mood emoji
  const getMoodEmoji = (mood?: 'positive' | 'negative' | 'neutral' | 'confused') => {
    switch (mood) {
      case 'positive':
        return <Smile className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <Frown className="h-4 w-4 text-red-500" />;
      case 'confused':
        return <HelpCircle className="h-4 w-4 text-amber-500" />;
      case 'neutral':
      default:
        return <Meh className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get mood indicator for the bot's response
  const getMoodIndicator = (mood?: 'positive' | 'negative' | 'neutral' | 'confused') => {
    let moodText = '';
    let moodClass = '';
    
    switch (mood) {
      case 'positive':
        moodText = 'Happy';
        moodClass = 'bg-green-100 text-green-800';
        break;
      case 'negative':
        moodText = 'Concerned';
        moodClass = 'bg-red-100 text-red-800';
        break;
      case 'confused':
        moodText = 'Curious';
        moodClass = 'bg-amber-100 text-amber-800';
        break;
      case 'neutral':
      default:
        moodText = 'Neutral';
        moodClass = 'bg-gray-100 text-gray-800';
        break;
    }
    
    return (
      <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${moodClass}`}>
        {getMoodEmoji(mood)}
        <span className="ml-1">{moodText}</span>
      </div>
    );
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary hover:bg-primary/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all"
          aria-label="Customer Support Chat"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 bg-card rounded-xl shadow-xl z-40 overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 160px)' }}
          >
            {/* Chat header */}
            <div className="bg-primary px-4 py-3 text-primary-foreground flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/logo.png" alt="KavinoRa Support" />
                  <AvatarFallback>KR</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">KavinoRa Support</h3>
                  <p className="text-xs opacity-90">We typically reply in a few minutes</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="end" className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">What can I ask the chatbot?</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Product details and recommendations</li>
                        <li>• Sizing and fit information</li>
                        <li>• Order status and shipping questions</li>
                        <li>• Return policy and process</li>
                        <li>• Care instructions for products</li>
                        <li>• Store locations and hours</li>
                      </ul>
                      <p className="text-xs text-muted-foreground pt-2">
                        For more complex issues, I'll help you get connected with a human agent.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-primary-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      <AvatarImage src="/logo.png" alt="KavinoRa Support" />
                      <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[75%] ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    {message.sender === 'bot' && message.mood && (
                      <div className="mt-1 flex justify-end">
                        {getMoodIndicator(message.mood)}
                      </div>
                    )}
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                      <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || 'User'} />
                      <AvatarFallback><UserCircle className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {/* Bot typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                    <AvatarImage src="/logo.png" alt="KavinoRa Support" />
                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-3 max-w-[75%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {suggestedQuestions.length > 0 && (
              <div className="p-2 bg-muted/50 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 px-2">Suggested questions:</p>
                <div className="flex overflow-x-auto gap-2 pb-1 px-1">
                  {suggestedQuestions.map(q => (
                    <button
                      key={q.id}
                      className="flex-shrink-0 border border-border rounded-full px-3 py-1 text-xs hover:bg-secondary transition-colors"
                      onClick={() => handleSuggestedQuestion(q.text)}
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="border-t border-border p-3">
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-muted rounded-l-full px-4 py-2 focus:outline-none"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || sendMessageMutation.isPending}
                  className={`bg-primary text-primary-foreground rounded-r-full px-4 py-2 ${
                    !inputValue.trim() || sendMessageMutation.isPending
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-primary/90'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Powered by AI with mood detection • <button className="text-primary hover:underline">Switch to human agent</button>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}