// Translations: every text the site shows goes through t(). The language is
// the browser's, until the person picks one; it's remembered on this device.
import en from '../locales/en';
import fr from '../locales/fr';

export type Key = keyof typeof en;

const catalogs = { en, fr } satisfies Record<string, Record<Key, string>>;
export type Locale = keyof typeof catalogs;
export const locales: { code: Locale; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
];

const storageKey = 'overfin-web-locale';

function initial(): Locale {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved && saved in catalogs) return saved as Locale;
  } catch {
    // Storage may be off: the browser's languages decide.
  }
  for (const lang of globalThis.navigator?.languages ?? []) {
    const code = lang.slice(0, 2).toLowerCase();
    if (code in catalogs) return code as Locale;
  }
  return 'en';
}

const first = initial();
let current = $state<Locale>(first);
if (typeof document !== 'undefined') document.documentElement.lang = first;

export const i18n = {
  get locale(): Locale {
    return current;
  },
  set(locale: Locale) {
    current = locale;
    if (typeof document !== 'undefined') document.documentElement.lang = locale;
    try {
      localStorage.setItem(storageKey, locale);
    } catch {
      // Not remembered, then.
    }
  },
};

/** t returns the text for key in the current language, with {values} filled in. */
export function t(key: Key, values: Record<string, string | number> = {}): string {
  const text = catalogs[current][key] ?? en[key];
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
}

/** has reports whether key is a known text, for keys built at runtime. */
export function has(key: string): key is Key {
  return key in en;
}

/** tn picks the singular or plural form: base + ".one" or ".other". */
export function tn(base: 'library.count' | 'discover.episodes', count: number): string {
  const form = new Intl.PluralRules(current).select(count) === 'one' ? 'one' : 'other';
  return t(`${base}.${form}`, { count: count.toLocaleString(current) });
}
