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

export interface NotificationSettings {
  enabled: boolean;
  useCulturalVoice: boolean;
  fiveMinutes: boolean;
  oneMinute: boolean;
  thirtySeconds: boolean;
  countdown: boolean;
  customTimes: number[]; // in seconds
}

export const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  useCulturalVoice: false,
  fiveMinutes: true,
  oneMinute: true,
  thirtySeconds: true,
  countdown: true,
  customTimes: [],
};

interface SettingsProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
  newYearType: NewYearType;
  onNewYearTypeChange: (type: NewYearType) => void;
  notificationSettings: NotificationSettings;
  onNotificationSettingsChange: (settings: NotificationSettings) => void;
  translations: {
    settings: {
      title: string;
      language: string;
      timezone: string;
      newYearType: string;
      close: string;
      autoDetect: string;
      types: Record<NewYearType, string>;
      notifications: {
        title: string;
        enabled: string;
        culturalVoice: string;
        culturalVoiceHint: string;
        times: string;
        fiveMinutes: string;
        oneMinute: string;
        thirtySeconds: string;
        countdown: string;
        addCustom: string;
        customTimeLabel: string;
        minutesBefore: string;
        secondsBefore: string;
        remove: string;
      };
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
  notificationSettings,
  onNotificationSettingsChange,
  translations,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const t = translations.settings;
  const tn = t.notifications;

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

  const updateNotification = (key: keyof NotificationSettings, value: boolean | number[]) => {
    onNotificationSettingsChange({
      ...notificationSettings,
      [key]: value,
    });
  };

  const addCustomTime = () => {
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds > 0 && !notificationSettings.customTimes.includes(totalSeconds)) {
      updateNotification('customTimes', [...notificationSettings.customTimes, totalSeconds].sort((a, b) => b - a));
      setCustomMinutes('');
      setCustomSeconds('');
    }
  };

  const removeCustomTime = (seconds: number) => {
    updateNotification('customTimes', notificationSettings.customTimes.filter(t => t !== seconds));
  };

  const formatCustomTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0 && seconds > 0) {
      return `${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes} ${tn.minutesBefore}`;
    } else {
      return `${seconds} ${tn.secondsBefore}`;
    }
  };

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
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/95 backdrop-blur-xl rounded-t-2xl">
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

              {/* Divider */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                  </svg>
                  {tn.title}
                </h3>

                {/* Enable notifications toggle */}
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors mb-3">
                  <span className="text-sm text-gray-300">{tn.enabled}</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notificationSettings.enabled}
                      onChange={(e) => updateNotification('enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                </label>

                {/* Cultural voice toggle */}
                {newYearType !== 'gregorian' && (
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors mb-3">
                    <div>
                      <span className="text-sm text-gray-300 block">{tn.culturalVoice}</span>
                      <span className="text-xs text-gray-500">{tn.culturalVoiceHint}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={notificationSettings.useCulturalVoice}
                        onChange={(e) => updateNotification('useCulturalVoice', e.target.checked)}
                        className="sr-only peer"
                        disabled={!notificationSettings.enabled}
                      />
                      <div className={`w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${!notificationSettings.enabled ? 'opacity-50' : ''}`}></div>
                    </div>
                  </label>
                )}

                {/* Notification times */}
                <div className={`space-y-2 ${!notificationSettings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  <p className="text-sm text-gray-400 mb-2">{tn.times}</p>

                  {/* 5 minutes */}
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.fiveMinutes}
                      onChange={(e) => updateNotification('fiveMinutes', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">{tn.fiveMinutes}</span>
                  </label>

                  {/* 1 minute */}
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.oneMinute}
                      onChange={(e) => updateNotification('oneMinute', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">{tn.oneMinute}</span>
                  </label>

                  {/* 30 seconds */}
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.thirtySeconds}
                      onChange={(e) => updateNotification('thirtySeconds', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">{tn.thirtySeconds}</span>
                  </label>

                  {/* Countdown */}
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.countdown}
                      onChange={(e) => updateNotification('countdown', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">{tn.countdown}</span>
                  </label>

                  {/* Custom times list */}
                  {notificationSettings.customTimes.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {notificationSettings.customTimes.map((seconds) => (
                        <div key={seconds} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-sm text-gray-300">
                            {formatCustomTime(seconds)}
                          </span>
                          <button
                            onClick={() => removeCustomTime(seconds)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                            title={tn.remove}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add custom time */}
                  <div className="mt-4 p-3 bg-white/5 rounded-lg space-y-3">
                    <p className="text-sm text-gray-400">{tn.addCustom}</p>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={customMinutes}
                          onChange={(e) => setCustomMinutes(e.target.value)}
                          placeholder="0"
                          className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">min</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={customSeconds}
                          onChange={(e) => setCustomSeconds(e.target.value)}
                          placeholder="0"
                          className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">sec</span>
                      </div>
                      <button
                        onClick={addCustomTime}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors self-start"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
