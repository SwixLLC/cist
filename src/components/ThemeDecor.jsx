import React, { useMemo } from 'react';
import { Moon } from 'lucide-react';

// Small seeded random so decorations stay in the same place between renders
const seeded = (seed) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

/** Light seasonal decorations over the hero photo. Purely decorative. */
const ThemeDecor = ({ theme }) => {
  const pieces = useMemo(() => {
    const rand = seeded(theme.id.length * 97 + 13);
    return Array.from({ length: 14 }).map((_, i) => ({
      Icon: theme.decor[i % theme.decor.length],
      left: 38 + rand() * 58, // keep mostly to the right of the headline
      top: 8 + rand() * 70,
      size: 14 + Math.round(rand() * 20),
      delay: -(rand() * 12),
      duration: 9 + rand() * 9,
      opacity: 0.35 + rand() * 0.4,
    }));
  }, [theme]);

  return (
    <div className={`lp-decor lp-decor--${theme.motion}`} aria-hidden="true" style={{ '--theme-accent': theme.accent }}>
      {theme.crescent && <Moon className="lp-decor__crescent" size={120} strokeWidth={1.2} />}
      {pieces.map(({ Icon, left, top, size, delay, duration, opacity }, i) => (
        <Icon
          key={i}
          size={size}
          strokeWidth={1.6}
          className="lp-decor__piece"
          style={{ left: `${left}%`, top: `${top}%`, opacity, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
        />
      ))}
    </div>
  );
};

export default ThemeDecor;
