// Text-to-Speech Helper Utility using Web Speech API

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  lang: "ar" | "en" = "ar",
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech Synthesis API is not supported in this browser.");
    if (onError) onError("Not supported");
    return false;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text from Markdown or HTML tags
  const cleanText = text.replace(/[*_#`~[\]()]/g, "").trim();
  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
  utterance.rate = 0.9; // Slight slowing for crisp clear educational pronunciation
  utterance.pitch = 1.0;

  // Try finding best voice for language
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find(
    (v) => v.lang.startsWith(lang === "ar" ? "ar" : "en")
  );
  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  utterance.onstart = () => {
    currentUtterance = utterance;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    console.error("Speech synthesis error:", e);
    if (onError) onError(e);
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (!("speechSynthesis" in window)) return false;
  return window.speechSynthesis.speaking;
}
