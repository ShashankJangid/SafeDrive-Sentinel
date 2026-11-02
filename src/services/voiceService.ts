import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

// SpeechRecognition type declarations for browsers
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export type STTStatus = 'inactive' | 'listening' | 'heard' | 'error' | 'unsupported';

export interface STTCallback {
  onTranscript: (transcript: string) => void;
  onMatchedIntent: (intent: 'yes' | 'no') => void;
  onStatusChange: (status: STTStatus) => void;
}

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isRecognitionActive = false;
  private currentLanguage: LanguageCode = 'en';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setLanguage(lang: LanguageCode) {
    this.currentLanguage = lang;
  }

  public isSTTSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindow;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  // Speak text using Web Speech Synthesis
  public speak(text: string, lang?: LanguageCode, rate: number = 1.0): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }

      this.synth.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = lang || this.currentLanguage;

      const langMap: Record<LanguageCode, string> = {
        en: 'en-US',
        es: 'es-ES',
        hi: 'hi-IN',
        fr: 'fr-FR',
        de: 'de-DE',
        zh: 'zh-CN',
        ar: 'ar-SA',
        pt: 'pt-BR'
      };

      utterance.lang = langMap[targetLang] || 'en-US';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      // Select best matching voice if available
      const voices = this.synth.getVoices();
      const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn("TTS error:", e);
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Start Speech Recognition (STT) for hands-free driver answers
  public startListening(callbacks: STTCallback, lang?: LanguageCode): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      callbacks.onStatusChange('unsupported');
      return false;
    }

    this.stopListening();

    try {
      this.recognition = new SpeechRec();
      const targetLang = lang || this.currentLanguage;

      const langMap: Record<LanguageCode, string> = {
        en: 'en-US',
        es: 'es-ES',
        hi: 'hi-IN',
        fr: 'fr-FR',
        de: 'de-DE',
        zh: 'zh-CN',
        ar: 'ar-SA',
        pt: 'pt-BR'
      };

      this.recognition.lang = langMap[targetLang] || 'en-US';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isRecognitionActive = true;
        callbacks.onStatusChange('listening');
      };

      this.recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript.toLowerCase();
        }

        callbacks.onTranscript(fullTranscript);

        // Check intent against multilingual dictionary
        const currentTranslations = translations[targetLang] || translations.en;
        const yesKeywords = [...currentTranslations.sttKeywordsYes, ...translations.en.sttKeywordsYes];
        const noKeywords = [...currentTranslations.sttKeywordsNo, ...translations.en.sttKeywordsNo];

        const matchedYes = yesKeywords.some(keyword => fullTranscript.includes(keyword.toLowerCase()));
        const matchedNo = noKeywords.some(keyword => fullTranscript.includes(keyword.toLowerCase()));

        if (matchedNo) {
          callbacks.onStatusChange('heard');
          callbacks.onMatchedIntent('no');
        } else if (matchedYes) {
          callbacks.onStatusChange('heard');
          callbacks.onMatchedIntent('yes');
        }
      };

      this.recognition.onerror = (e: any) => {
        console.warn("STT Error:", e.error);
        if (e.error !== 'no-speech') {
          callbacks.onStatusChange('error');
        }
      };

      this.recognition.onend = () => {
        this.isRecognitionActive = false;
      };

      this.recognition.start();
      return true;
    } catch (e) {
      console.warn("Failed to initialize speech recognition:", e);
      callbacks.onStatusChange('error');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isRecognitionActive) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore stop error
      }
      this.isRecognitionActive = false;
    }
  }
}

export const voiceService = new VoiceService();
