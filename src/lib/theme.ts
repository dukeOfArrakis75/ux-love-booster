export type ProfileTheme = "husband" | "spouse" | null;

/** Traduit une réponse de profil en clé de thème. */
export function themeForProfile(value: unknown): ProfileTheme {
  if (value === "HUSBAND") return "husband";
  if (value === "SPOUSE") return "spouse";
  return null;
}

/** Applique le thème époux / épouse sur <html>. */
export function applyProfileTheme(theme: ProfileTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme) root.dataset["theme"] = theme;
  else delete root.dataset["theme"];
}

export const THEME_LABELS: Record<"husband" | "spouse", string> = {
  husband: "Thème époux",
  spouse: "Thème épouse",
};
