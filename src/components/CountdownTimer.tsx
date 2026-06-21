import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { parseDateStr } from '../App';

interface CountdownTimerProps {
  dateStr: string;
  status: string;
}

export default function CountdownTimer({ dateStr, status }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isExpired: boolean } | null>(null);

  useEffect(() => {
    if (status !== 'Aberto') return;

    const deadline = parseDateStr(dateStr);
    if (!deadline) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    calculateTimeLeft(); // initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [dateStr, status]);

  if (status !== 'Aberto' || !timeLeft) return null;

  if (timeLeft.isExpired) {
    return (
      <div className="mx-auto -mt-2 bg-[#ffebee] text-[#c62828] font-sans text-xs font-bold py-1 px-4 rounded-b-xl shadow-sm border border-t-0 border-[#c62828]/20 flex items-center justify-center gap-1.5 w-max relative z-0">
        <Clock className="w-3.5 h-3.5" />
        Iniciando...
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-2 bg-[#191c1e] text-white font-sans text-[11px] font-bold py-1.5 px-4 rounded-b-xl shadow-md border border-t-0 border-transparent flex items-center gap-2 w-max relative z-0">
      <div className="flex items-center gap-1.5 text-[#fed01b]">
        <Clock className="w-3.5 h-3.5" />
        <span>Inicia em:</span>
      </div>
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && <span className="bg-white/10 px-1.5 py-0.5 rounded">{timeLeft.days}d</span>}
        {(timeLeft.days > 0 || timeLeft.hours > 0) && <span className="bg-white/10 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>}
        <span className="bg-white/10 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="bg-white/10 px-1.5 py-0.5 rounded text-[#fed01b]">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
}
