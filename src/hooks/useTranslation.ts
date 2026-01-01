'use client';

import { useState, useEffect } from 'react';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';

import enUS from '@/dictionaries/en-US.json';
import ptBR from '@/dictionaries/pt-BR.json';

const dictionaries = {
  'en-US': enUS,
  'pt-BR': ptBR,
};

function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return i18n.defaultLocale;

  const browserLang = navigator.language;
  const matched = i18n.locales.find(
    (l) => l.toLowerCase() === browserLang.toLowerCase() ||
           l.startsWith(browserLang.split('-')[0])
  );
  return matched || i18n.defaultLocale;
}

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(i18n.defaultLocale);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored && i18n.locales.includes(stored)) {
      setLocaleState(stored);
    } else {
      const browserLocale = getBrowserLocale();
      setLocaleState(browserLocale);
      localStorage.setItem('locale', browserLocale);
    }
    setIsLoaded(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = dictionaries[locale];

  return { t, locale, setLocale, isLoaded };
}
