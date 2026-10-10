// Speech Synthesis (Text-to-Speech) and Speech Recognition (Audio Input) helper

export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static recognitionInstance: any = null;

  // Check if browser supports Speech Recognition
  public static isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  // Check if browser supports Speech Synthesis
  public static isSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!window.speechSynthesis;
  }

  // Speak text in Turkish
  public static speak(text: string, onEnd?: () => void, onError?: (err: any) => void): void {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not supported');
      return;
    }

    try {
      this.synth.cancel(); // Stop any currently playing audio

      // Clean up text from special markers if any
      const cleanText = text.replace(/[*_#`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Find Turkish voice if available
      const voices = this.synth.getVoices();
      const turkishVoice = voices.find((v) => v.lang.startsWith('tr') || v.lang.includes('TR'));
      if (turkishVoice) {
        utterance.voice = turkishVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        if (onError) onError(e);
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Could not speak:', err);
      if (onError) onError(err);
    }
  }

  // Stop currently playing speech
  public static stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Start listening to microphone
  public static startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ): { stop: () => void } {
    if (typeof window === 'undefined') {
      onError('Tarayıcı ortamı algılanamadı.');
      return { stop: () => {} };
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Tarayıcınız Web Speech ses tanıma özelliğini desteklemiyor. Chrome veya Edge kullanabilirsiniz.');
      return { stop: () => {} };
    }

    try {
      if (this.recognitionInstance) {
        try {
          this.recognitionInstance.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      this.recognitionInstance = recognition;
      recognition.lang = 'tr-TR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        if (onStart) onStart();
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim()) {
          onResult(finalTranscript.trim(), true);
        } else if (interimTranscript.trim()) {
          onResult(interimTranscript.trim(), false);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Mikrofon erişim izni verilmedi. Lütfen tarayıcı ayarlarından mikrofon iznini etkinleştirin.');
        } else if (event.error !== 'no-speech') {
          onError(`Ses tanıma hatası: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (onEnd) onEnd();
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {
            // ignore
          }
        },
      };
    } catch (err: any) {
      onError(err?.message || 'Mikrofon başlatılamadı.');
      return { stop: () => {} };
    }
  }
}
