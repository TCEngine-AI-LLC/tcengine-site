export function isValidEmail(email: string): boolean {
  const e = email.trim();
  if (!e) return false;
  if (e.length > 254) return false;
  // Very small sanity check. (We don't need a perfect RFC parser.)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export function clampStr(s: string, maxLen: number): string {
  const v = s.trim();
  if (v.length <= maxLen) return v;
  return v.slice(0, maxLen);
}
