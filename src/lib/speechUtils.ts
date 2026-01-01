// Speech utilities for more natural, human-like voice synthesis

export interface SpeechOptions {
  lang: string;
  rate?: number;      // 0.1 to 10, default 1
  pitch?: number;     // 0 to 2, default 1
  volume?: number;    // 0 to 1, default 1
  voice?: string;     // Preferred voice name
}

// Get the best available voice for a language
export function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Priority: exact match > language match > any voice
  const exactMatch = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase());
  if (exactMatch) return exactMatch;

  const langCode = lang.split('-')[0].toLowerCase();
  const langMatch = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
  if (langMatch) return langMatch;

  // Prefer voices marked as "natural" or "premium"
  const naturalVoice = voices.find(v =>
    v.name.toLowerCase().includes('natural') ||
    v.name.toLowerCase().includes('premium') ||
    v.name.toLowerCase().includes('neural')
  );
  if (naturalVoice) return naturalVoice;

  return voices[0];
}

// Speak with natural pauses and emphasis
export function speakNaturally(
  text: string,
  options: SpeechOptions,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang;
  utterance.rate = options.rate ?? 0.9; // Slightly slower for naturalness
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;

  // Try to get the best voice
  const voice = getBestVoice(options.lang);
  if (voice) {
    utterance.voice = voice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  speechSynthesis.speak(utterance);
}

// Speak a countdown number with dramatic effect
export function speakCountdownNumber(
  num: number,
  lang: string,
  culturalNumber?: string
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  speechSynthesis.cancel();

  const text = culturalNumber || num.toString();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  // Dramatic countdown effect: slower and lower pitch as we approach 1
  // 10 -> normal, 1 -> slow and dramatic
  const intensity = (10 - num) / 10; // 0 at 10, 0.9 at 1

  utterance.rate = 0.8 - (intensity * 0.3); // 0.8 -> 0.5
  utterance.pitch = 1.0 - (intensity * 0.2); // 1.0 -> 0.8
  utterance.volume = 0.8 + (intensity * 0.2); // 0.8 -> 1.0

  const voice = getBestVoice(lang);
  if (voice) {
    utterance.voice = voice;
  }

  speechSynthesis.speak(utterance);
}

// Speak an announcement with appropriate pacing
export function speakAnnouncement(
  text: string,
  lang: string,
  urgency: 'low' | 'medium' | 'high' = 'medium'
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  speechSynthesis.cancel();

  // Add natural pauses by replacing commas and periods
  const processedText = text
    .replace(/\./g, '... ')
    .replace(/!/g, '! ')
    .replace(/,/g, ', ');

  const utterance = new SpeechSynthesisUtterance(processedText);
  utterance.lang = lang;

  // Adjust based on urgency
  switch (urgency) {
    case 'low':
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      break;
    case 'medium':
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      break;
    case 'high':
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      break;
  }

  const voice = getBestVoice(lang);
  if (voice) {
    utterance.voice = voice;
  }

  speechSynthesis.speak(utterance);
}

// Speak Happy New Year with celebration effect
export function speakCelebration(
  text: string,
  lang: string,
  culturalPhrase?: string
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  speechSynthesis.cancel();

  // Main greeting
  const mainUtterance = new SpeechSynthesisUtterance(text);
  mainUtterance.lang = lang;
  mainUtterance.rate = 0.85; // Slower for emphasis
  mainUtterance.pitch = 1.15; // Slightly higher for excitement
  mainUtterance.volume = 1.0;

  const voice = getBestVoice(lang);
  if (voice) {
    mainUtterance.voice = voice;
  }

  // If there's a cultural phrase, speak it after a pause
  if (culturalPhrase) {
    mainUtterance.onend = () => {
      setTimeout(() => {
        const phraseUtterance = new SpeechSynthesisUtterance(culturalPhrase);
        phraseUtterance.lang = lang;
        phraseUtterance.rate = 0.9;
        phraseUtterance.pitch = 1.1;
        if (voice) {
          phraseUtterance.voice = voice;
        }
        speechSynthesis.speak(phraseUtterance);
      }, 500); // 500ms pause between phrases
    };
  }

  speechSynthesis.speak(mainUtterance);
}

// Initialize voices (needed for some browsers)
export function initVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Wait for voices to load
    speechSynthesis.onvoiceschanged = () => {
      resolve(speechSynthesis.getVoices());
    };

    // Timeout fallback
    setTimeout(() => {
      resolve(speechSynthesis.getVoices());
    }, 1000);
  });
}
