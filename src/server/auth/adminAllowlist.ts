const parseCsv = (v: string | undefined): string[] => {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
};

export function getAdminEmails(): string[] {
  return parseCsv(process.env.ADMIN_EMAILS);
}

export function isAdminEmail(email: string): boolean {
  const list = getAdminEmails();
  if (list.length === 0) return false;
  return list.includes(email.trim().toLowerCase());
}
