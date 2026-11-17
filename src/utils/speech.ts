import { VerbItem } from '../types/game';

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function getPreferredEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  return (
    voices.find((v) => v.lang === 'en-GB' && v.localService) ||
    voices.find((v) => v.lang === 'en-US' && v.localService) ||
    voices.find((v) => v.lang.startsWith('en-GB')) ||
    voices.find((v) => v.lang.startsWith('en-US')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
  );
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

export function speakText(text: string, rate = 0.92): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getPreferredEnglishVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'en-GB';
    }
    utterance.rate = rate;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis errors in restricted environments
  }
}

export function speakVerbTriple(verb: VerbItem): void {
  const pastReadable = verb.past.includes('/') ? verb.past.replace(/\s*\/\s*/g, ' or ') : verb.past;
  speakText(`${verb.base}, ${pastReadable}, ${verb.part}`, 0.88);
}

export function speakCompletedSentence(verb: VerbItem): void {
  const full = verb.sentence.text.replace('___', verb.sentence.answer);
  speakText(full, 0.92);
}
