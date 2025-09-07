'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Calculator, PenTool, Upload, FileText, Mic, MicOff, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { useTheme, useLogo } from '@/contexts/ThemeContext';
import { vapi } from '@/lib/vapi';

const DemoPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { logoSrc, logoAlt } = useLogo();
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [userAudioLevels, setUserAudioLevels] = useState([4, 4, 4, 4, 4]);
  const [aiAudioLevels, setAiAudioLevels] = useState([4, 4, 4, 4, 4]);
  const [messages, setMessages] = useState<Array<{id: string, sender: 'user' | 'ai', content: string, timestamp: string}>>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'homework'>('live');
  const [homeworkImage, setHomeworkImage] = useState<File | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Whiteboard state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'calculator'>('pen');
  const [drawings, setDrawings] = useState<Array<{x: number, y: number, type: 'start' | 'draw'}>>([]);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Scroll to bottom when new messages arrive (but not on initial load)
  useEffect(() => {
    // Only scroll if there are messages and this isn't the initial load
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!chatInput.trim() || !isConnected) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send to VAPI - the message will be processed by the AI
    try {
      vapi.send({
        type: 'add-message',
        message: {
          role: 'user',
          content: chatInput
        }
      });
    } catch (error) {
      console.error('Failed to send message to VAPI:', error);
    }
    
    setChatInput('');
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawingTool !== 'pen') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDrawings(prev => [...prev, { x, y, type: 'start' }]);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || drawingTool !== 'pen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDrawings(prev => [...prev, { x, y, type: 'draw' }]);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    setDrawings([]);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  
  const submitToTutorly = () => {
    // Simulate sending drawing to AI for analysis
    alert('Drawing submitted to Math Tutorly for analysis!');
  };

  // Render drawings on canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = isDark ? '#60A5FA' : '#3B82F6';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    let currentPath = false;
    drawings.forEach(point => {
      if (point.type === 'start') {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        currentPath = true;
      } else if (point.type === 'draw' && currentPath) {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    });
  }, [drawings, isDark]);


  // VAPI Integration
  useEffect(() => {
    vapi.setCallbacks({
      onCallStart: () => {
        setIsConnected(true);
        setIsConnecting(false);
        setIsMicOn(true);
      },
      onCallEnd: () => {
        setIsConnected(false);
        setIsMicOn(false);
        setIsUserSpeaking(false);
        setIsAISpeaking(false);
      },
      onSpeechStart: () => {
        setIsUserSpeaking(true);
        // Generate user audio levels
        const levels = Array.from({ length: 5 }, () => Math.random() * 60 + 20);
        setUserAudioLevels(levels);
      },
      onSpeechEnd: () => {
        setIsUserSpeaking(false);
        setUserAudioLevels([4, 4, 4, 4, 4]);
      },
      onVolumeLevel: (volume) => {
        if (volume > 30) {
          const levels = Array.from({ length: 5 }, () => Math.random() * volume + 10);
          setUserAudioLevels(levels);
        }
      },
      onMessage: (message: unknown) => {
        console.log('VAPI Message:', message);
        const typedMessage = message as { type: string; transcript?: string; role?: string; conversation?: { role: string; message?: string; content?: string }[] };

        // Handle different message types
        if (typedMessage.type === 'function-call-result' || typedMessage.type === 'transcript') {
          // Handle transcribed user speech
          if (typedMessage.transcript && typedMessage.role === 'user') {
            const newMessage = {
              id: Date.now().toString(),
              sender: 'user' as const,
              content: typedMessage.transcript,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newMessage]);
          }
        } else if (typedMessage.type === 'conversation-update') {
          // Handle AI responses
          if (typedMessage.conversation) {
            const lastMessage = typedMessage.conversation[typedMessage.conversation.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              const content = lastMessage.message || lastMessage.content || '';
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                sender: 'ai',
                content: content,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }]);

              // Simulate AI speaking animation
              setIsAISpeaking(true);
              const duration = content.length * 50;

              const animateAI = () => {
                const levels = Array.from({ length: 5 }, () => Math.random() * 40 + 15);
                setAiAudioLevels(levels);
              };

              const aiInterval = setInterval(animateAI, 150);

              setTimeout(() => {
                clearInterval(aiInterval);
                setIsAISpeaking(false);
                setAiAudioLevels([4, 4, 4, 4, 4]);
              }, duration);
            }
          }
        }
      },
      onError: (error: Error) => {
        console.warn('VAPI Error (handled):', error?.message || error);
        // Don't change connection state for minor errors
        // Only disconnect on critical errors
        if (error?.message?.includes('critical') || error?.message?.includes('auth')) {
          setIsConnecting(false);
          setIsConnected(false);
        }
      }
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const handleConnectionToggle = async () => {
    if (isConnected) {
      vapi.stop();
      setIsConnected(false);
      setIsMicOn(false);
    } else {
      setIsConnecting(true);
      try {
        // Start with your specific Math Tutorly assistant ID from VAPI dashboard
        console.log('Attempting to connect to VAPI...');
        const result = await vapi.start('Math Tutorly'); // Use your assistant ID if you have one
        console.log('VAPI connection result:', result);
        
        if (!result.success) {
          throw new Error('Failed to connect to Math Tutorly assistant');
        }
      } catch (error) {
        console.warn('Connection failed (gracefully handled):', error);
        setIsConnecting(false);
        
        // Don't show error alert for minor issues, just log them
        // The system will fall back to demo mode
        
        // Only show alert for critical errors
        if (error instanceof Error && error.message.includes('critical')) {
          let errorMessage = 'Failed to connect to Math Tutorly.';
          if (error.message.includes('microphone')) {
            errorMessage += ' Please allow microphone access and try again.';
          } else if (error.message.includes('network')) {
            errorMessage += ' Please check your internet connection.';
          } else {
            errorMessage += ` Error: ${error.message}`;
          }
          alert(errorMessage);
        }
      }
    }
  };

  const handleMicToggle = () => {
    if (!isConnected) return;
    
    const newMicState = !isMicOn;
    setIsMicOn(newMicState);
    
    // Toggle mute in VAPI (note: VAPI mute is opposite of mic on)
    vapi.setMuted(!newMicState);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHomeworkImage(file);
    }
  };

  return (
    <main 
      className="min-h-screen transition-all duration-300" 
      style={{ 
        backgroundColor: isDark ? 'var(--dark-bg)' : 'var(--light-bg)'
      }}
    >
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 xl:px-0 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <ArrowLeft size={24} className={`transition-colors ${
              isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
            }`} />
            <span className={`font-semibold ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Back to Home
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={128}
              height={32}
              className="h-8 w-auto"
            />
            <h1 className="text-2xl font-bold text-gradient">
              Interactive Demo
            </h1>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 xl:px-0 pb-12">
        {/* Demo Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className={`flex p-2 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'live'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Live Tutoring
            </button>
            <button
              onClick={() => setActiveTab('homework')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'homework'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Homework Help
            </button>
          </div>
        </div>

        {/* Live Tutoring Demo */}
        {activeTab === 'live' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Main Video Area */}
            <div className="lg:col-span-2">
              <GlassCard className="overflow-hidden">
                <div className="aspect-video bg-gradient-primary relative rounded-t-2xl">
                  {/* Interactive Connection Status */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isConnecting ? (
                      <motion.div
                        className="flex flex-col items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-white font-medium">Connecting to Math Tutorly...</p>
                      </motion.div>
                    ) : isConnected ? (
                      <motion.div
                        className="flex items-center gap-6"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Voice Animations - User and AI */}
                        <div className="flex items-center gap-6">
                          {/* User Voice Animation */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1">
                              {userAudioLevels.map((level, i) => (
                                <motion.div
                                  key={`user-${i}`}
                                  className={`w-1 rounded-full ${
                                    isUserSpeaking ? 'bg-blue-400' : 'bg-white/40'
                                  }`}
                                  style={{
                                    height: `${level}px`,
                                    minHeight: '4px',
                                    maxHeight: '20px'
                                  }}
                                  animate={{
                                    height: isUserSpeaking ? `${level}px` : '4px',
                                    opacity: isUserSpeaking ? 1 : 0.4
                                  }}
                                  transition={{
                                    duration: 0.1,
                                    ease: "easeInOut"
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-white/80">You</span>
                          </div>
                          
                          {/* AI Voice Animation */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1">
                              {aiAudioLevels.map((level, i) => (
                                <motion.div
                                  key={`ai-${i}`}
                                  className={`w-1 rounded-full ${
                                    isAISpeaking ? 'bg-green-400' : 'bg-white/40'
                                  }`}
                                  style={{
                                    height: `${level}px`,
                                    minHeight: '4px',
                                    maxHeight: '20px'
                                  }}
                                  animate={{
                                    height: isAISpeaking ? `${level}px` : '4px',
                                    opacity: isAISpeaking ? 1 : 0.4
                                  }}
                                  transition={{
                                    duration: 0.1,
                                    ease: "easeInOut"
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-white/80">AI</span>
                          </div>
                        </div>
                        
                        {/* Connection Status */}
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-white font-medium">Connected</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex flex-col items-center gap-4 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={handleConnectionToggle}
                      >
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                          <Mic size={32} className="text-white" />
                        </div>
                        <p className="text-white font-medium">Join Live Class</p>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Connection Status Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">CONNECTED</span>
                      </>
                    ) : isConnecting ? (
                      <>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">CONNECTING</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span className="text-white text-sm font-medium">DISCONNECTED</span>
                      </>
                    )}
                  </div>
                  
                  {/* Tutor Info */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <PenTool size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Math Tutorly</p>
                      <p className="text-white/80 text-sm">AI Math Tutor - Explaining Quadratic Equations</p>
                    </div>
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className={`p-4 flex items-center justify-between ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={isConnected ? "secondary" : "primary"}
                      size="sm"
                      onClick={handleConnectionToggle}
                      disabled={isConnecting}
                      className={isConnected ? "text-red-500 hover:bg-red-50" : ""}
                    >
                      {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Join Class'}
                    </Button>
                    
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMicToggle}
                    icon={isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                    className={`transition-all duration-300 ${
                      isMicOn 
                        ? 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                        : 'text-gray-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    } border`}
                    disabled={!isConnected}
                  >
                    {isMicOn ? 'Mic On' : 'Mic Off'}
                  </Button>
                </div>
              </GlassCard>

              {/* Interactive Whiteboard */}
              <GlassCard className="mt-6 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold text-lg ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Interactive Whiteboard
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant={drawingTool === 'pen' ? 'primary' : 'ghost'} 
                      size="sm" 
                      icon={<PenTool size={16} />}
                      onClick={() => setDrawingTool('pen')}
                    >
                      Draw
                    </Button>
                    <Button 
                      variant={drawingTool === 'calculator' ? 'primary' : 'ghost'} 
                      size="sm" 
                      icon={<Calculator size={16} />}
                      onClick={() => setDrawingTool('calculator')}
                    >
                      Calculator
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearCanvas}
                      className="text-red-500 hover:text-red-600"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                <div className={`relative h-64 rounded-xl border-2 ${
                  isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-white'
                } overflow-hidden`}>
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={256}
                    className={`absolute inset-0 w-full h-full cursor-${
                      drawingTool === 'pen' ? 'crosshair' : 'pointer'
                    }`}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  
                  {drawings.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <PenTool size={48} className={`mx-auto mb-4 ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <p className={`${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {drawingTool === 'pen' 
                            ? "Click and drag to draw. Share your work with Math Tutorly!"
                            : "Calculator mode - Click to add math expressions"
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {drawings.length > 0 && (
                  <div className="mt-4 flex gap-2 justify-center">
                    <Button variant="primary" onClick={submitToTutorly}>
                      Ask Tutorly to Help
                    </Button>
                    <Button variant="secondary">
                      Save Drawing
                    </Button>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Chat Sidebar */}
            <div className="lg:col-span-1">
              <GlassCard className="h-[600px] flex flex-col">
                <div className={`p-4 border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Live Chat
                  </h3>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                  {/* Chat messages */}
                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      // Default welcome message when no real conversation
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-semibold">M</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm break-words ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <strong>Math Tutorly:</strong> Hello! I'm Math Tutorly, your AI math tutor. Click "Join Class" above to start a voice conversation, or type your questions here! {/* eslint-disable-line react/no-unescaped-entities */}
                          </p>
                          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Just now
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Real conversation messages
                      messages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.sender === 'ai' ? 'bg-gradient-primary' : 'bg-blue-500'
                          }`}>
                            <span className="text-white text-sm font-semibold">
                              {message.sender === 'ai' ? 'M' : 'Y'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm break-words ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              <strong>{message.sender === 'ai' ? 'Math Tutorly' : 'You'}:</strong> {message.content}
                            </p>
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
                
                <div className={`p-4 border-t ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleChatKeyPress}
                      placeholder="Type your question..."
                      className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                        isDark 
                          ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                      } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      disabled={!isConnected}
                    />
                    <Button 
                      variant="primary" 
                      size="sm" 
                      icon={<MessageSquare size={16} />}
                      onClick={sendMessage}
                      disabled={!chatInput.trim() || !isConnected}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* Homework Help Demo */}
        {activeTab === 'homework' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard className="p-8">
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  AI Homework Assistant
                </h2>
                <p className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Upload your homework and get instant step-by-step solutions
                </p>
              </div>

              {/* Upload Area */}
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-colors ${
                isDark 
                  ? 'border-gray-600 hover:border-gray-500 bg-gray-800/30' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="homework-upload"
                />
                <label htmlFor="homework-upload" className="cursor-pointer">
                  <Upload size={48} className={`mx-auto mb-4 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <p className={`text-lg font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {homeworkImage ? homeworkImage.name : 'Upload your homework'}
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Support for images, PDFs, and handwritten notes
                  </p>
                </label>
              </div>

              {/* Sample Solution */}
              {homeworkImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className={`p-6 rounded-xl ${
                    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
                  }`}>
                    <h3 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      <FileText size={20} />
                      AI Analysis Results
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${
                          isDark ? 'text-green-400' : 'text-green-600'
                        }`}>
                          Problem Identified:
                        </h4>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Quadratic equation: x² - 5x + 6 = 0
                        </p>
                      </div>
                      
                      <div>
                        <h4 className={`font-medium mb-2 ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          Step-by-Step Solution:
                        </h4>
                        <ol className={`list-decimal list-inside space-y-2 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <li>Identify coefficients: a = 1, b = -5, c = 6</li>
                          <li>Use factoring method: (x - 2)(x - 3) = 0</li>
                          <li>Solve for x: x = 2 or x = 3</li>
                          <li>Verify solutions by substitution</li>
                        </ol>
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                        <Button variant="primary" size="sm">
                          Get Detailed Explanation
                        </Button>
                        <Button variant="secondary" size="sm">
                          Practice Similar Problems
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default DemoPage;
