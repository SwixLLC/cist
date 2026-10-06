import { Ghost, Candy, Leaf, Moon, Star, Sparkles, Gift, Pencil, BookOpen, Backpack, Ruler } from 'lucide-react';

/**
 * Seasonal themes the admin can switch on (Admin → Themes).
 * A theme only adds accents to the top banner: a greeting, an accent colour and light decorations.
 */
export const THEMES = {
  halloween: {
    label: 'Halloween',
    accent: '#ffa94d',
    icon: Ghost,
    decor: [Ghost, Candy, Leaf, Leaf],
    motion: 'drift',
    message: {
      en: 'Happy Halloween from all of us at CIST!',
      fr: 'Joyeux Halloween de la part de toute l’équipe CIST !',
      es: '¡Feliz Halloween de parte de todos en CIST!',
    },
  },
  ramadan: {
    label: 'Ramadan',
    accent: '#f2c14e',
    icon: Moon,
    decor: [Star, Star, Sparkles],
    crescent: true,
    motion: 'twinkle',
    message: {
      en: 'Ramadan Kareem from the CIST family',
      fr: 'Ramadan Karim de la part de toute la famille CIST',
      es: 'Ramadán Kareem de parte de toda la familia CIST',
    },
  },
  eid: {
    label: 'Eid',
    accent: '#f2c14e',
    icon: Sparkles,
    decor: [Star, Sparkles, Gift, Star],
    crescent: true,
    motion: 'twinkle',
    message: {
      en: 'Eid Mubarak from the CIST family',
      fr: 'Aïd Moubarak de la part de toute la famille CIST',
      es: 'Eid Mubarak de parte de toda la familia CIST',
    },
  },
  backToSchool: {
    label: 'Back to school',
    accent: '#ffd166',
    icon: Backpack,
    decor: [Pencil, BookOpen, Ruler, Backpack],
    motion: 'drift',
    message: {
      en: 'Welcome back! A new school year begins at CIST',
      fr: 'Bonne rentrée ! Une nouvelle année scolaire commence à CIST',
      es: '¡Bienvenidos! Comienza un nuevo curso escolar en CIST',
    },
  },
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** 'off' | 'live' | 'scheduled' | 'ended' for a saved theme setting. */
export function themeStatus(setting) {
  if (!setting || !THEMES[setting.active]) return 'off';
  const now = today();
  if (setting.start && now < setting.start) return 'scheduled';
  if (setting.end && now > setting.end) return 'ended';
  return 'live';
}

/** The theme to show right now, or null. */
export function resolveTheme(setting) {
  if (themeStatus(setting) !== 'live') return null;
  const def = THEMES[setting.active];
  return {
    id: setting.active,
    ...def,
    message: { ...def.message, ...Object.fromEntries(Object.entries(setting.message || {}).filter(([, v]) => v && v.trim())) },
    heroImage: setting.heroImage || '',
  };
}
