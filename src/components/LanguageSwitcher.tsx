'use client';

import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';

const localeNames: Record<Locale, string> = {
  'en-US': '🇺🇸 English',
  'pt-BR': '🇧🇷 Português',
};

interface LanguageSwitcherProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ locale, onChange }: LanguageSwitcherProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={locale}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {i18n.locales.map((loc) => (
          <option key={loc} value={loc} className="bg-slate-800 text-white">
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
