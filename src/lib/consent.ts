// Cookie consent state — gates AdSense loading (see AdUnit.tsx).
export type ConsentChoice = 'accepted' | 'declined';

const KEY = 'cookie-consent';
const EVENT = 'cookie-consent-changed';

export const getConsent = (): ConsentChoice | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'accepted' || v === 'declined' ? v : null;
  } catch {
    return null;
  }
};

export const setConsent = (choice: ConsentChoice) => {
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    // storage unavailable — still notify listeners for this session
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

export const onConsentChange = (cb: () => void): (() => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
