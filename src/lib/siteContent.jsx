import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n';
import en from '../i18n/en.json';
import fr from '../i18n/fr.json';
import es from '../i18n/es.json';
import { getSiteContent, getCachedSiteContent } from './cmsData';
import { DEFAULT_IMAGES, DEFAULT_SETTINGS } from './defaultContent';
import { resolveTheme } from './themes';

export const BASE_TRANSLATIONS = { en, fr, es };

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Deep-merges admin text overrides over the built-in translations. Empty strings mean "use default". */
function mergeTranslations(base, overrides) {
  if (!isObject(overrides)) return base;
  const out = { ...base };
  Object.entries(overrides).forEach(([k, v]) => {
    if (isObject(v) && isObject(base[k])) out[k] = mergeTranslations(base[k], v);
    else if (Array.isArray(v)) {
      const items = v.map((item) => String(item).trim()).filter(Boolean);
      if (items.length) out[k] = items;
    } else if (v !== '' && v !== null && v !== undefined) out[k] = v;
  });
  return out;
}

function applyTranslations(overrides = {}) {
  Object.entries(BASE_TRANSLATIONS).forEach(([lang, base]) => {
    i18n.addResourceBundle(lang, 'translation', mergeTranslations(base, overrides[lang]), true, true);
  });
  // Re-render translated components
  i18n.changeLanguage(i18n.language);
}

function resolve(content) {
  const images = { ...DEFAULT_IMAGES, ...(content.images || {}) };
  if (!Array.isArray(images.heroSlides) || images.heroSlides.filter(Boolean).length === 0) {
    images.heroSlides = DEFAULT_IMAGES.heroSlides;
  }
  // Blank fields fall back to the built-in value
  Object.keys(DEFAULT_IMAGES).forEach((k) => { if (!images[k]) images[k] = DEFAULT_IMAGES[k]; });

  const settings = { ...DEFAULT_SETTINGS };
  Object.entries(content.settings || {}).forEach(([k, v]) => {
    if (typeof v === 'boolean' || v) settings[k] = v;
  });

  return { images, settings, theme: resolveTheme(content.theme) };
}

const SiteContext = createContext(resolve({}));

export function SiteContentProvider({ children }) {
  const [site, setSite] = useState(() => {
    const cached = getCachedSiteContent();
    applyTranslations(cached.translations);
    return resolve(cached);
  });

  // A live theme recolours the public site by overriding the brand colour variables
  useEffect(() => {
    const root = document.documentElement.style;
    const vars = {
      '--canadian-red': site.theme?.palette.primary,
      '--canadian-red-dark': site.theme?.palette.dark,
      '--canadian-red-light': site.theme?.palette.light,
      '--canadian-red-wash': site.theme?.palette.wash,
    };
    Object.entries(vars).forEach(([name, value]) => {
      if (value) root.setProperty(name, value);
      else root.removeProperty(name);
    });
  }, [site.theme]);

  useEffect(() => {
    const load = async () => {
      const content = await getSiteContent();
      applyTranslations(content.translations);
      setSite(resolve(content));
    };
    load();
    window.addEventListener('cist_content_updated', load);
    return () => window.removeEventListener('cist_content_updated', load);
  }, []);

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);

/** "+212 80 857 0841" -> "212808570841" */
const digitsOnly = (phone = '') => phone.replace(/\D/g, '');
export const telHref = (phone) => `tel:+${digitsOnly(phone)}`;
export const whatsappHref = (phone) => `https://api.whatsapp.com/send/?phone=${digitsOnly(phone)}&text&type=phone_number&app_absent=0`;
