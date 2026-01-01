'use client'
import { useEffect, useState, useRef } from "react";
import { Fireworks } from '@fireworks-js/react'

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isNewYear, setIsNewYear] = useState(false);
  const lastSpokenSecond = useRef<number>(-1);

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Se já passou meia-noite de 1º de janeiro, mostra a celebração
    const isAlreadyNewYear = now.getMonth() === 0 && now.getDate() === 1;
    const targetDate = isAlreadyNewYear
      ? new Date(currentYear + 1, 0, 1)
      : new Date(currentYear + 1, 0, 1);

    const calculateTimeLeft = (): TimeLeft | null => {
      const now = new Date();
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
        // Cancela qualquer fala anterior para evitar sobreposição
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(num.toString());
        utterance.lang = "pt-BR";
        utterance.rate = 1.2;
        speechSynthesis.speak(utterance);
      }
    };

    const interval = setInterval(() => {
      const now = new Date();
      const distance = targetDate.getTime() - now.getTime();

      if (distance <= 0) {
        clearInterval(interval);
        setShowFireworks(true);
        setIsNewYear(true);
        setTimeLeft(null);
        // Fala "Feliz Ano Novo" quando chegar
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("Feliz Ano Novo!");
          utterance.lang = "pt-BR";
          speechSynthesis.speak(utterance);
        }
        return;
      }

      // Contagem falada nos últimos 10 segundos (evita sobreposição)
      const secondsLeft = Math.floor(distance / 1000);
      if (secondsLeft <= 10 && secondsLeft > 0 && secondsLeft !== lastSpokenSecond.current) {
        lastSpokenSecond.current = secondsLeft;
        speakNumber(secondsLeft);
      }

      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Calcula imediatamente
    setTimeLeft(calculateTimeLeft());

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const targetYear = new Date().getFullYear() + 1;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Fogos de artifício - atrás do conteúdo mas visíveis */}
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

      {/* Conteúdo principal */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-white">
        {isNewYear ? (
          <div className="text-center animate-pulse">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-bounce">
              🎆 FELIZ ANO NOVO! 🎆
            </h1>
            <p className="text-4xl md:text-6xl font-bold text-yellow-300">
              {targetYear}
            </p>
            <p className="text-xl mt-8 text-gray-300">
              Que este ano seja repleto de alegrias! 🎉
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Contagem Regressiva para {targetYear}
            </h1>

            {timeLeft && (
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <TimeBlock value={timeLeft.days} label="Dias" />
                <TimeBlock value={timeLeft.hours} label="Horas" />
                <TimeBlock value={timeLeft.minutes} label="Minutos" />
                <TimeBlock value={timeLeft.seconds} label="Segundos" highlight />
              </div>
            )}

            <p className="mt-12 text-gray-400 text-center">
              ✨ Nos últimos 10 segundos, faremos a contagem juntos! ✨
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