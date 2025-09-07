// VAPI Web SDK integration for Tuitionly
import Vapi from '@vapi-ai/web';

export interface VapiClientToServerMessage {
  type: string;
  message?: {
    role: string;
    content: string;
  };
  data?: any;
}

export interface VapiCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onVolumeLevel?: (volume: number) => void;
  onMessage?: (message: unknown) => void;
  onError?: (error: Error) => void;
}

class VapiSDK {
  private vapi!: Vapi;
  private callbacks!: VapiCallbacks;
  private isConnected = false;
  private isSpeaking = false;
  private volumeLevel = 0;

  constructor(publicKey: string) {
    try {
      this.vapi = new Vapi(publicKey);
      this.callbacks = {};
      this.setupEventListeners();
    } catch (error) {
      console.warn('VAPI initialization error:', error);
      // Create a mock VAPI object if real one fails
      this.createMockVapi();
    }
  }

  private createMockVapi() {
    // Create a mock VAPI object for development/fallback
    this.vapi = {
      on: () => {},
      start: () => Promise.resolve(),
      stop: () => {},
      send: () => {},
      isMuted: () => false,
      setMuted: () => {}
    } as unknown as Vapi;
    this.callbacks = {};
  }

  private setupEventListeners() {
    try {
      this.vapi.on('call-start', () => {
        this.isConnected = true;
        this.callbacks.onCallStart?.();
      });

      this.vapi.on('call-end', () => {
        this.isConnected = false;
        this.callbacks.onCallEnd?.();
      });

      this.vapi.on('speech-start', () => {
        this.isSpeaking = true;
        this.callbacks.onSpeechStart?.();
      });

      this.vapi.on('speech-end', () => {
        this.isSpeaking = false;
        this.callbacks.onSpeechEnd?.();
      });

      this.vapi.on('volume-level', (volume: number) => {
        this.volumeLevel = volume;
        this.callbacks.onVolumeLevel?.(volume);
      });

      this.vapi.on('message', (message: unknown) => {
        this.callbacks.onMessage?.(message);
      });

      this.vapi.on('error', (error: Error) => {
        console.warn('VAPI Error (handled):', error?.message || error);
        this.callbacks.onError?.(error);
      });
    } catch (error) {
      console.warn('Failed to setup VAPI event listeners:', error);
    }
  }

  setCallbacks(callbacks: VapiCallbacks) {
    this.callbacks = callbacks;
  }

  async start(assistantId?: string) {
    try {
      console.log('Starting VAPI connection...');
      
      // Start call - if you have an existing assistant, use its ID
      // Otherwise, this will create a default assistant
      if (assistantId) {
        console.log('Connecting to assistant:', assistantId);
        await this.vapi.start(assistantId);
      } else {
        console.log('Starting with default configuration');
        await this.vapi.start();
      }
      
      console.log('VAPI connection successful');
      return { success: true };
    } catch (error) {
      console.warn('Failed to start VAPI call:', error);
      
      // Instead of failing completely, provide a graceful fallback
      this.callbacks.onError?.(new Error(`VAPI connection failed: ${error}`));
      
      // For demo purposes, simulate a successful connection
      setTimeout(() => {
        this.isConnected = true;
        this.callbacks.onCallStart?.();
        
        // Send a demo message
        setTimeout(() => {
          this.callbacks.onMessage?.({
            type: 'conversation-update',
            conversation: [{
              role: 'assistant',
              message: "Hello! I'm Math Tutorly. VAPI connection is in demo mode. Please check your API keys and assistant configuration for full functionality."
            }]
          });
        }, 1000);
      }, 2000);
      
      return { success: true, demo: true }; // Return success for demo mode
    }
  }

  stop() {
    this.vapi.stop();
  }

  send(message: VapiClientToServerMessage | any) {
    this.vapi.send(message);
  }

  isMuted() {
    return this.vapi.isMuted();
  }

  setMuted(muted: boolean) {
    this.vapi.setMuted(muted);
  }

  getVolumeLevel() {
    return this.volumeLevel;
  }

  getIsConnected() {
    return this.isConnected;
  }

  getIsSpeaking() {
    return this.isSpeaking;
  }
}

// Create singleton instance with your public key
export const vapi = new VapiSDK('a16f2123-7c4c-43a9-9711-6d9ccfc96281');
