'use client'
import { useEffect, useState, useRef, useCallback } from "react";
import { Fireworks } from '@fireworks-js/react'
import { useTranslation } from "@/hooks/useTranslation";
import { Settings, defaultNotificationSettings, type NotificationSettings } from "@/components/Settings";
import { getNewYearType, type NewYearType } from "@/lib/newYearTypes";
import { getCulturalMessages, getSpeechLanguage } from "@/lib/culturalNotifications";
import {
  speakNaturally,
  speakCountdownNumber,
  speakAnnouncement,
  speakCelebration,
  initVoices,
} from "@/lib/speechUtils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Home() {
  const { t, locale, setLocale, isLoaded } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isNewYear, setIsNewYear] = useState(false);
  const [targetYear, setTargetYear] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState<string>('local');
  const [newYearType, setNewYearType] = useState<NewYearType>('gregorian');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);

  // Track which notifications have been spoken
  const spokenNotifications = useRef<Set<string>>(new Set());
  const lastSpokenSecond = useRef<number>(-1);
  const localeRef = useRef(locale);
  const newYearTypeRef = useRef(newYearType);
  const notificationSettingsRef = useRef(notificationSettings);

  // Keep refs in sync
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    newYearTypeRef.current = newYearType;
  }, [newYearType]);

  useEffect(() => {
    notificationSettingsRef.current = notificationSettings;
  }, [notificationSettings]);

  // Update document title dynamically
  useEffect(() => {
    if (!isLoaded || !targetYear) return;

    const typeName = newYearType !== 'gregorian' ? ` - ${t.settings?.types?.[newYearType] || ''}` : '';

    if (isNewYear) {
      document.title = `🎆 ${t.newYear.message} ${targetYear}${typeName}`;
    } else {
      document.title = `${t.countdown.heading} ${targetYear}${typeName}`;
    }
  }, [isLoaded, targetYear, isNewYear, newYearType, t]);

  // Load saved preferences
  useEffect(() => {
    const savedTimezone = localStorage.getItem('timezone');
    const savedNewYearType = localStorage.getItem('newYearType') as NewYearType | null;
    const savedNotifications = localStorage.getItem('notificationSettings');

    if (savedTimezone) setTimezone(savedTimezone);
    if (savedNewYearType) setNewYearType(savedNewYearType);
    if (savedNotifications) {
      try {
        setNotificationSettings(JSON.parse(savedNotifications));
      } catch {
        // Use defaults
      }
    }
  }, []);

  // Calculate target date when settings change
  const calculateTargetDate = useCallback(() => {
    const typeInfo = getNewYearType(newYearType);
    if (!typeInfo) return;

    let now = new Date();

    // Apply timezone if not local
    if (timezone !== 'local') {
      try {
        const tzString = now.toLocaleString('en-US', { timeZone: timezone });
        now = new Date(tzString);
      } catch {
        // Fallback to local time
      }
    }

    const nextNewYear = typeInfo.getNextNewYear(now);
    const yearLabel = typeInfo.getYearLabel(nextNewYear);

    setTargetDate(nextNewYear);
    setTargetYear(yearLabel);
    setIsNewYear(false);
    setShowFireworks(false);
    spokenNotifications.current.clear();
    lastSpokenSecond.current = -1;
  }, [newYearType, timezone]);

  useEffect(() => {
    calculateTargetDate();
  }, [calculateTargetDate]);

  // Save preferences
  const handleTimezoneChange = (tz: string) => {
    setTimezone(tz);
    localStorage.setItem('timezone', tz);
  };

  const handleNewYearTypeChange = (type: NewYearType) => {
    setNewYearType(type);
    localStorage.setItem('newYearType', type);
  };

  const handleNotificationSettingsChange = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  };

  // Initialize voices on mount
  useEffect(() => {
    initVoices();
  }, []);

  // Get the appropriate language for speech
  const getSpeechLang = useCallback(() => {
    if (notificationSettingsRef.current.useCulturalVoice) {
      return getSpeechLanguage(newYearTypeRef.current, localeRef.current);
    }
    return localeRef.current;
  }, []);

  // Main countdown effect
  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = (): TimeLeft | null => {
      let now = new Date();

      if (timezone !== 'local') {
        try {
          const tzString = now.toLocaleString('en-US', { timeZone: timezone });
          now = new Date(tzString);
        } catch {
          // Fallback
        }
      }

      const distance = targetDate.getTime() - now.getTime();

      if (distance <= 0) {
        return null;
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    const interval = setInterval(() => {
      let now = new Date();

      if (timezone !== 'local') {
        try {
          const tzString = now.toLocaleString('en-US', { timeZone: timezone });
          now = new Date(tzString);
        } catch {
          // Fallback
        }
      }

      const distance = targetDate.getTime() - now.getTime();
      const settings = notificationSettingsRef.current;
      const messages = getCulturalMessages(newYearTypeRef.current, localeRef.current);
      const lang = getSpeechLang();

      if (distance <= 0) {
        clearInterval(interval);
        setShowFireworks(true);
        setIsNewYear(true);
        setTimeLeft(null);

        // Speak Happy New Year with celebration effect
        if (settings.enabled) {
          speakCelebration(messages.happyNewYear, lang, messages.culturalPhrase);
        }
        return;
      }

      const secondsLeft = Math.floor(distance / 1000);

      // Handle notifications
      if (settings.enabled) {
        // 5 minutes - low urgency, calm announcement
        if (settings.fiveMinutes && secondsLeft === 300 && !spokenNotifications.current.has('5min')) {
          spokenNotifications.current.add('5min');
          speakAnnouncement(messages.timeRemaining(5, 0), lang, 'low');
        }

        // 1 minute - medium urgency
        if (settings.oneMinute && secondsLeft === 60 && !spokenNotifications.current.has('1min')) {
          spokenNotifications.current.add('1min');
          speakAnnouncement(messages.oneMinute, lang, 'medium');
        }

        // 30 seconds - higher urgency
        if (settings.thirtySeconds && secondsLeft === 30 && !spokenNotifications.current.has('30sec')) {
          spokenNotifications.current.add('30sec');
          speakAnnouncement(messages.thirtySeconds, lang, 'high');
        }

        // 10 seconds - announce if not counting down
        if (secondsLeft === 10 && !spokenNotifications.current.has('10sec')) {
          spokenNotifications.current.add('10sec');
          if (!settings.countdown) {
            speakAnnouncement(messages.tenSeconds, lang, 'high');
          }
        }

        // Custom times
        for (const customSeconds of settings.customTimes) {
          const key = `custom-${customSeconds}`;
          if (secondsLeft === customSeconds && !spokenNotifications.current.has(key)) {
            spokenNotifications.current.add(key);
            const minutes = Math.floor(customSeconds / 60);
            const secs = customSeconds % 60;
            // Urgency based on time remaining
            const urgency = customSeconds <= 30 ? 'high' : customSeconds <= 120 ? 'medium' : 'low';
            speakAnnouncement(messages.timeRemaining(minutes, secs), lang, urgency);
          }
        }

        // Countdown 10...1 with dramatic effect
        if (settings.countdown && secondsLeft <= 10 && secondsLeft > 0 && secondsLeft !== lastSpokenSecond.current) {
          lastSpokenSecond.current = secondsLeft;
          speakCountdownNumber(secondsLeft, lang, messages.countdownNumber(secondsLeft));
        }
      }

      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, [targetDate, timezone, getSpeechLang]);

  if (!isLoaded || targetYear === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const typeInfo = getNewYearType(newYearType);
  const typeName = t.settings?.types?.[newYearType] || typeInfo?.nameKey || '';

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Settings
        locale={locale}
        onLocaleChange={setLocale}
        timezone={timezone}
        onTimezoneChange={handleTimezoneChange}
        newYearType={newYearType}
        onNewYearTypeChange={handleNewYearTypeChange}
        notificationSettings={notificationSettings}
        onNotificationSettingsChange={handleNotificationSettingsChange}
        translations={t}
      />

      {showFireworks && (
        <div className="fixed inset-0 z-0">
          <Fireworks
            options={{
              rocketsPoint: { min: 0, max: 100 },
              hue: { min: 0, max: 360 },
              delay: { min: 15, max: 30 },
              acceleration: 1.05,
              friction: 0.97,
              gravity: 1.5,
              particles: 90,
              explosion: 5,
            }}
            style={{
              width: '100%',
              height: '100%',
              position: 'fixed',
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-white">
        {isNewYear ? (
          <div className="text-center animate-pulse">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-bounce">
              {t.newYear.message}
            </h1>
            <p className="text-4xl md:text-6xl font-bold text-yellow-300">
              {targetYear}
            </p>
            {newYearType !== 'gregorian' && (
              <p className="text-lg mt-4 text-purple-300">
                {typeName}
              </p>
            )}
            <p className="text-xl mt-8 text-gray-300">
              {t.newYear.wish}
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t.countdown.heading}
            </h1>
            {newYearType !== 'gregorian' && (
              <p className="text-lg text-purple-300 mb-2">
                {typeName}
              </p>
            )}
            <p className="text-2xl md:text-4xl font-semibold text-yellow-300 mb-8">
              {targetYear}
            </p>

            {timeLeft && (
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <TimeBlock value={timeLeft.days} label={t.countdown.days} />
                <TimeBlock value={timeLeft.hours} label={t.countdown.hours} />
                <TimeBlock value={timeLeft.minutes} label={t.countdown.minutes} />
                <TimeBlock value={timeLeft.seconds} label={t.countdown.seconds} highlight />
              </div>
            )}

            {notificationSettings.enabled && (
              <p className="mt-12 text-gray-400 text-center flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
                {t.countdown.spokenCountdown}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function TimeBlock({ value, label, highlight = false }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center p-4 md:p-6 rounded-2xl backdrop-blur-sm ${
      highlight
        ? 'bg-purple-500/30 border-2 border-purple-400 shadow-lg shadow-purple-500/20'
        : 'bg-white/10 border border-white/20'
    }`}>
      <span className={`text-5xl md:text-7xl font-bold font-mono ${
        highlight ? 'text-purple-300' : 'text-white'
      }`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-sm md:text-base text-gray-300 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
