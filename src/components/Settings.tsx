'use client';

import { useState, useEffect } from 'react';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';
import { newYearTypes, type NewYearType } from '@/lib/newYearTypes';

const localeNames: Record<Locale, string> = {
  'en-US': '🇺🇸 English',
  'pt-BR': '🇧🇷 Português',
};

// Common timezones grouped by region
const timezones = [
  { group: 'Americas', zones: [
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
    { value: 'America/Denver', label: 'Denver (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
    { value: 'America/Mexico_City', label: 'Mexico City (CST)' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires (ART)' },
  ]},
  { group: 'Europe', zones: [
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
    { value: 'Europe/Lisbon', label: 'Lisbon (WET/WEST)' },
  ]},
  { group: 'Asia', zones: [
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
    { value: 'Asia/Seoul', label: 'Seoul (KST)' },
    { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
    { value: 'Asia/Tehran', label: 'Tehran (IRST)' },
    { value: 'Asia/Jerusalem', label: 'Jerusalem (IST)' },
  ]},
  { group: 'Pacific', zones: [
    { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
    { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  ]},
  { group: 'Africa', zones: [
    { value: 'Africa/Cairo', label: 'Cairo (EET)' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)' },
    { value: 'Africa/Lagos', label: 'Lagos (WAT)' },
  ]},
];

interface SettingsProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
  newYearType: NewYearType;
  onNewYearTypeChange: (type: NewYearType) => void;
  translations: {
    settings: {
      title: string;
      language: string;
      timezone: string;
      newYearType: string;
      close: string;
      autoDetect: string;
      types: Record<NewYearType, string>;
    };
  };
}

export function Settings({
  locale,
  onLocaleChange,
  timezone,
  onTimezoneChange,
  newYearType,
  onNewYearTypeChange,
  translations,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations.settings;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <>
      {/* Gear button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:rotate-90 group"
        aria-label={t.title}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Modal content */}
          <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-purple-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                {t.title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label={t.close}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Language selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t.language}
                </label>
                <select
                  value={locale}
                  onChange={(e) => onLocaleChange(e.target.value as Locale)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 text-sm cursor-pointer hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {i18n.locales.map((loc) => (
                    <option key={loc} value={loc} className="bg-slate-800 text-white">
                      {localeNames[loc]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timezone selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t.timezone}
                </label>
                <select
                  value={timezone}
                  onChange={(e) => onTimezoneChange(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 text-sm cursor-pointer hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="local" className="bg-slate-800 text-white">
                    {t.autoDetect}
                  </option>
                  {timezones.map((group) => (
                    <optgroup key={group.group} label={group.group} className="bg-slate-800">
                      {group.zones.map((zone) => (
                        <option key={zone.value} value={zone.value} className="bg-slate-800 text-white">
                          {zone.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* New Year type selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t.newYearType}
                </label>
                <select
                  value={newYearType}
                  onChange={(e) => onNewYearTypeChange(e.target.value as NewYearType)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 text-sm cursor-pointer hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {newYearTypes.map((type) => (
                    <option key={type.id} value={type.id} className="bg-slate-800 text-white">
                      {t.types[type.id]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
