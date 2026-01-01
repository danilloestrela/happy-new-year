'use client'
import { useEffect, useState, useRef, useCallback } from "react";
import { Fireworks } from '@fireworks-js/react'
import { useTranslation } from "@/hooks/useTranslation";
import { Settings } from "@/components/Settings";
import { getNewYearType, type NewYearType } from "@/lib/newYearTypes";

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
  const lastSpokenSecond = useRef<number>(-1);
  const localeRef = useRef(locale);

  // Keep localeRef in sync with locale
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  // Load saved preferences
  useEffect(() => {
    const savedTimezone = localStorage.getItem('timezone');
    const savedNewYearType = localStorage.getItem('newYearType') as NewYearType | null;

    if (savedTimezone) setTimezone(savedTimezone);
    if (savedNewYearType) setNewYearType(savedNewYearType);
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

  // Main countdown effect
  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = (): TimeLeft | null => {
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

    const speakNumber = (num: number) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(num.toString());
        utterance.lang = localeRef.current;
        utterance.rate = 1.2;
        speechSynthesis.speak(utterance);
      }
    };

    const speakNewYear = (message: string) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = localeRef.current;
        speechSynthesis.speak(utterance);
      }
    };

    const interval = setInterval(() => {
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

      const distance = targetDate.getTime() - now.getTime();

      if (distance <= 0) {
        clearInterval(interval);
        setShowFireworks(true);
        setIsNewYear(true);
        setTimeLeft(null);
        // Speak "Happy New Year" in current locale
        const message = localeRef.current === 'pt-BR' ? 'Feliz Ano Novo!' : 'Happy New Year!';
        speakNewYear(message);
        return;
      }

      // Spoken countdown in the last 10 seconds
      const secondsLeft = Math.floor(distance / 1000);
      if (secondsLeft <= 10 && secondsLeft > 0 && secondsLeft !== lastSpokenSecond.current) {
        lastSpokenSecond.current = secondsLeft;
        speakNumber(secondsLeft);
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
  }, [targetDate, timezone]);

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

            <p className="mt-12 text-gray-400 text-center">
              {t.countdown.spokenCountdown}
            </p>
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
