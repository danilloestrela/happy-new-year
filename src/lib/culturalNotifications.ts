import type { NewYearType } from './newYearTypes';

export interface NotificationTime {
  id: string;
  seconds: number; // seconds before midnight
  label: string;
  enabled: boolean;
  isCustom?: boolean;
}

export interface CulturalMessages {
  // Time announcements
  timeRemaining: (minutes: number, seconds: number) => string;
  oneMinute: string;
  thirtySeconds: string;
  tenSeconds: string;
  // Countdown numbers (some cultures have special ways)
  countdownNumber: (n: number) => string;
  // New Year greeting
  happyNewYear: string;
  // Cultural-specific phrases
  culturalPhrase?: string;
}

// Default notification times (in seconds before midnight)
export const defaultNotificationTimes: NotificationTime[] = [
  { id: 'five-min', seconds: 300, label: '5 minutes', enabled: true },
  { id: 'one-min', seconds: 60, label: '1 minute', enabled: true },
  { id: 'thirty-sec', seconds: 30, label: '30 seconds', enabled: true },
  { id: 'ten-sec', seconds: 10, label: '10 seconds', enabled: true },
];

// Cultural messages for each New Year type and language
export const culturalMessages: Record<NewYearType, Record<string, CulturalMessages>> = {
  gregorian: {
    'en-US': {
      timeRemaining: (m, s) => s > 0 ? `${m} minutes and ${s} seconds remaining` : `${m} minutes remaining`,
      oneMinute: 'One minute until the New Year!',
      thirtySeconds: 'Thirty seconds!',
      tenSeconds: 'Ten seconds! Get ready!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Happy New Year!',
    },
    'pt-BR': {
      timeRemaining: (m, s) => s > 0 ? `Faltam ${m} minutos e ${s} segundos` : `Falta ${m} minuto${m > 1 ? 's' : ''}`,
      oneMinute: 'Falta um minuto para o Ano Novo!',
      thirtySeconds: 'Trinta segundos!',
      tenSeconds: 'Dez segundos! Preparem-se!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Feliz Ano Novo!',
    },
  },
  chinese: {
    'en-US': {
      timeRemaining: (m, s) => s > 0 ? `${m} minutes and ${s} seconds remaining` : `${m} minutes remaining`,
      oneMinute: 'One minute until the Year of prosperity!',
      thirtySeconds: 'Thirty seconds to welcome good fortune!',
      tenSeconds: 'Ten seconds! Prepare for the dragon dance!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Gong Xi Fa Cai! Happy Chinese New Year!',
      culturalPhrase: 'May the Year of the Dragon bring you prosperity!',
    },
    'pt-BR': {
      timeRemaining: (m, s) => s > 0 ? `Faltam ${m} minutos e ${s} segundos` : `Falta ${m} minuto${m > 1 ? 's' : ''}`,
      oneMinute: 'Falta um minuto para o Ano da prosperidade!',
      thirtySeconds: 'Trinta segundos para receber a boa fortuna!',
      tenSeconds: 'Dez segundos! Prepare-se para a dança do dragão!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Gong Xi Fa Cai! Feliz Ano Novo Chinês!',
      culturalPhrase: 'Que o Ano do Dragão traga prosperidade!',
    },
    'zh-CN': {
      timeRemaining: (m, s) => s > 0 ? `还有${m}分${s}秒` : `还有${m}分钟`,
      oneMinute: '还有一分钟！新年快到了！',
      thirtySeconds: '三十秒！准备迎接好运！',
      tenSeconds: '十秒！龙舞开始！',
      countdownNumber: (n) => ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][n] || n.toString(),
      happyNewYear: '新年快乐！恭喜发财！',
      culturalPhrase: '龙年大吉！',
    },
  },
  japanese: {
    'en-US': {
      timeRemaining: (m, s) => s > 0 ? `${m} minutes and ${s} seconds remaining` : `${m} minutes remaining`,
      oneMinute: 'One minute until Shōgatsu!',
      thirtySeconds: 'Thirty seconds! The temple bells will ring!',
      tenSeconds: 'Ten seconds to Akemashite!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Akemashite Omedetou Gozaimasu!',
      culturalPhrase: 'May this year bring you happiness and health!',
    },
    'pt-BR': {
      timeRemaining: (m, s) => s > 0 ? `Faltam ${m} minutos e ${s} segundos` : `Falta ${m} minuto${m > 1 ? 's' : ''}`,
      oneMinute: 'Falta um minuto para Shōgatsu!',
      thirtySeconds: 'Trinta segundos! Os sinos do templo vão tocar!',
      tenSeconds: 'Dez segundos para Akemashite!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Akemashite Omedetou Gozaimasu! Feliz Ano Novo!',
      culturalPhrase: 'Que este ano traga felicidade e saúde!',
    },
    'ja-JP': {
      timeRemaining: (m, s) => s > 0 ? `あと${m}分${s}秒` : `あと${m}分`,
      oneMinute: 'あと1分で新年です！',
      thirtySeconds: '30秒！除夜の鐘が鳴ります！',
      tenSeconds: '10秒！明けまして！',
      countdownNumber: (n) => ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][n] || n.toString(),
      happyNewYear: '明けましておめでとうございます！',
      culturalPhrase: '今年もよろしくお願いします！',
    },
  },
  jewish: {
    'en-US': {
      timeRemaining: (m, s) => s > 0 ? `${m} minutes and ${s} seconds remaining` : `${m} minutes remaining`,
      oneMinute: 'One minute until Rosh Hashanah!',
      thirtySeconds: 'Thirty seconds! Prepare for the shofar!',
      tenSeconds: 'Ten seconds to the new year!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Shanah Tovah! Happy Rosh Hashanah!',
      culturalPhrase: 'May you be inscribed in the Book of Life!',
    },
    'pt-BR': {
      timeRemaining: (m, s) => s > 0 ? `Faltam ${m} minutos e ${s} segundos` : `Falta ${m} minuto${m > 1 ? 's' : ''}`,
      oneMinute: 'Falta um minuto para Rosh Hashaná!',
      thirtySeconds: 'Trinta segundos! Prepare-se para o shofar!',
      tenSeconds: 'Dez segundos para o ano novo!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Shaná Tová! Feliz Rosh Hashaná!',
      culturalPhrase: 'Que você seja inscrito no Livro da Vida!',
    },
    'he-IL': {
      timeRemaining: (m, s) => s > 0 ? `עוד ${m} דקות ו-${s} שניות` : `עוד ${m} דקות`,
      oneMinute: 'עוד דקה לראש השנה!',
      thirtySeconds: 'שלושים שניות! התכוננו לשופר!',
      tenSeconds: 'עשר שניות לשנה החדשה!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'שנה טובה ומתוקה!',
      culturalPhrase: 'לשנה טובה תכתבו ותחתמו!',
    },
  },
  islamic: {
    'en-US': {
      timeRemaining: (m, s) => s > 0 ? `${m} minutes and ${s} seconds remaining` : `${m} minutes remaining`,
      oneMinute: 'One minute until the Islamic New Year!',
      thirtySeconds: 'Thirty seconds!',
      tenSeconds: 'Ten seconds to Muharram!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Happy Islamic New Year! Blessed Muharram!',
      culturalPhrase: 'May Allah bless you with a year of peace!',
    },
    'pt-BR': {
      timeRemaining: (m, s) => s > 0 ? `Faltam ${m} minutos e ${s} segundos` : `Falta ${m} minuto${m > 1 ? 's' : ''}`,
      oneMinute: 'Falta um minuto para o Ano Novo Islâmico!',
      thirtySeconds: 'Trinta segundos!',
      tenSeconds: 'Dez segundos para Muharram!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Feliz Ano Novo Islâmico! Abençoado Muharram!',
      culturalPhrase: 'Que Allah abençoe você com um ano de paz!',
    },
    'ar-SA': {
      timeRemaining: (m, s) => s > 0 ? `باقي ${m} دقيقة و ${s} ثانية` : `باقي ${m} دقيقة`,
      oneMinute: 'دقيقة واحدة حتى رأس السنة الهجرية!',
      thirtySeconds: 'ثلاثون ثانية!',
      tenSeconds: 'عشر ثوان حتى محرم!',
      countdownNumber: (n) => ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠'][n] || n.toString(),
      happyNewYear: 'كل عام وأنتم بخير! سنة هجرية مباركة!',
      culturalPhrase: 'اللهم اجعله عام خير وبركة!',
    },
  },
  persian: {
    'en-US': {
      timeRemaining: (m, s) => s > 0 ? `${m} minutes and ${s} seconds remaining` : `${m} minutes remaining`,
      oneMinute: 'One minute until Nowruz!',
      thirtySeconds: 'Thirty seconds! Spring is coming!',
      tenSeconds: 'Ten seconds to the spring equinox!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Nowruz Mobarak! Happy Persian New Year!',
      culturalPhrase: 'Eid-e Shoma Mobarak! May your new year be blessed!',
    },
    'pt-BR': {
      timeRemaining: (m, s) => s > 0 ? `Faltam ${m} minutos e ${s} segundos` : `Falta ${m} minuto${m > 1 ? 's' : ''}`,
      oneMinute: 'Falta um minuto para Nowruz!',
      thirtySeconds: 'Trinta segundos! A primavera está chegando!',
      tenSeconds: 'Dez segundos para o equinócio de primavera!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Nowruz Mobarak! Feliz Ano Novo Persa!',
      culturalPhrase: 'Que seu novo ano seja abençoado!',
    },
    'fa-IR': {
      timeRemaining: (m, s) => s > 0 ? `${m} دقیقه و ${s} ثانیه مانده` : `${m} دقیقه مانده`,
      oneMinute: 'یک دقیقه تا نوروز!',
      thirtySeconds: 'سی ثانیه! بهار در راه است!',
      tenSeconds: 'ده ثانیه تا لحظه تحویل سال!',
      countdownNumber: (n) => ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۱۰'][n] || n.toString(),
      happyNewYear: 'نوروزتان پیروز! سال نو مبارک!',
      culturalPhrase: 'عیدتان مبارک!',
    },
  },
  thai: {
    'en-US': {
      timeRemaining: (m, s) => s > 0 ? `${m} minutes and ${s} seconds remaining` : `${m} minutes remaining`,
      oneMinute: 'One minute until Songkran!',
      thirtySeconds: 'Thirty seconds! Water festival begins soon!',
      tenSeconds: 'Ten seconds to the Thai New Year!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Sawasdee Pee Mai! Happy Songkran!',
      culturalPhrase: 'May the water wash away bad luck!',
    },
    'pt-BR': {
      timeRemaining: (m, s) => s > 0 ? `Faltam ${m} minutos e ${s} segundos` : `Falta ${m} minuto${m > 1 ? 's' : ''}`,
      oneMinute: 'Falta um minuto para Songkran!',
      thirtySeconds: 'Trinta segundos! O festival da água começa em breve!',
      tenSeconds: 'Dez segundos para o Ano Novo Tailandês!',
      countdownNumber: (n) => n.toString(),
      happyNewYear: 'Sawasdee Pee Mai! Feliz Songkran!',
      culturalPhrase: 'Que a água lave a má sorte!',
    },
    'th-TH': {
      timeRemaining: (m, s) => s > 0 ? `เหลืออีก ${m} นาที ${s} วินาที` : `เหลืออีก ${m} นาที`,
      oneMinute: 'อีก 1 นาทีจะถึงสงกรานต์!',
      thirtySeconds: 'สามสิบวินาที! เทศกาลน้ำเริ่มเร็วๆ นี้!',
      tenSeconds: 'สิบวินาทีจะถึงปีใหม่ไทย!',
      countdownNumber: (n) => ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า', 'สิบ'][n] || n.toString(),
      happyNewYear: 'สวัสดีปีใหม่! สุขสันต์วันสงกรานต์!',
      culturalPhrase: 'ขอให้น้ำล้างสิ่งไม่ดีออกไป!',
    },
  },
};

// Get messages for a specific culture and language, with fallback
export function getCulturalMessages(newYearType: NewYearType, locale: string): CulturalMessages {
  const typeMessages = culturalMessages[newYearType];

  // Try exact match first
  if (typeMessages[locale]) {
    return typeMessages[locale];
  }

  // Try language code only (e.g., 'en' from 'en-US')
  const langCode = locale.split('-')[0];
  const matchingKey = Object.keys(typeMessages).find(key => key.startsWith(langCode));
  if (matchingKey) {
    return typeMessages[matchingKey];
  }

  // Fallback to English, then to first available
  return typeMessages['en-US'] || Object.values(typeMessages)[0];
}

// Get the appropriate speech language code for the culture
export function getSpeechLanguage(newYearType: NewYearType, userLocale: string): string {
  const culturalLangMap: Record<NewYearType, string> = {
    gregorian: userLocale,
    chinese: 'zh-CN',
    japanese: 'ja-JP',
    jewish: 'he-IL',
    islamic: 'ar-SA',
    persian: 'fa-IR',
    thai: 'th-TH',
  };

  // If user prefers their own language, use it; otherwise use cultural language
  return userLocale === 'en-US' || userLocale === 'pt-BR'
    ? userLocale
    : culturalLangMap[newYearType];
}
