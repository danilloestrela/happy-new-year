'use client'
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Fireworks } from '@fireworks-js/react'


export default function Home() {
  const [timeLeft, setTimeLeft] = useState("");
  const [showFireworks, setShowFireworks] = useState(false);
  const [newYearMessage, setNewYearMessage] = useState("");

  useEffect(() => {
    const targetDate = new Date(new Date().getFullYear() + 1, 0, 1);
    const interval = setInterval(() => {
      const now = new Date();
      const distance = targetDate.getTime() - now.getTime();

      if (distance <= 0) {
        clearInterval(interval);
        setShowFireworks(true);
        setNewYearMessage("FELIZ ANO NOVO!!");
        return;
      }

      if (distance <= 30000) {
        const seconds = Math.floor(distance / 1000);
        const utterance = new SpeechSynthesisUtterance(seconds.toString());
        utterance.lang = "pt-BR";
        speechSynthesis.speak(utterance);
      }

      setTimeLeft(formatDistanceToNow(targetDate, { locale: ptBR }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Contagem Regressiva para o Ano Novo</h1>
        <p className="text-[60px] text-center w-full">{timeLeft || newYearMessage}</p>
        <div className="absolute bottom-0 top-0 left-0 w-full min-h-screen h-full">
          {showFireworks && <Fireworks />}
        </div>
      </main>
    </div>
  );
}