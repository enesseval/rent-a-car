export type Locale = (typeof locales)[number];

export const locales = ["en", "tr", "de"] as const;
export const defaultLocale: Locale = "tr";
