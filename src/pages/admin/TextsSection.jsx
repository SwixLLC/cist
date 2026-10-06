import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { BASE_TRANSLATIONS } from '../../lib/siteContent';
import { SkeletonList, EmptyState } from './ui';
import useSiteDraft from './useSiteDraft';
import SaveBar from './SaveBar';

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'fr', label: 'Français' },
  { id: 'es', label: 'Español' },
];

// In the order they appear on the website
const GROUPS = [
  { id: 'nav', label: 'Top menu' },
  { id: 'hero', label: 'Top banner' },
  { id: 'about', label: 'About' },
  { id: 'academics', label: 'Academic programs' },
  { id: 'campus', label: 'Campus life' },
  { id: 'news', label: 'News and events' },
  { id: 'admissions', label: 'How to join' },
  { id: 'contact', label: 'Contact' },
  { id: 'map', label: 'Map' },
  { id: 'footer', label: 'Footer' },
  { id: 'enrollment', label: 'Registration page' },
];

/** "worldClassDesc" -> "World class desc", "f_english" -> "Feature: english" */
const humanize = (key) => {
  const feature = key.startsWith('f_');
  const words = key
    .replace(/^f_/, '')
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .toLowerCase();
  const text = words.charAt(0).toUpperCase() + words.slice(1);
  return feature ? `Feature: ${words}` : text;
};

const toText = (v) => (Array.isArray(v) ? v.join('\n') : v ?? '');
const sameValue = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function TextsSection() {
  const { draft, setDraft, dirty, saving, save, discard, loading } = useSiteDraft('translations', 'Texts');
  const [lang, setLang] = useState('en');
  const [group, setGroup] = useState('hero');
  const [query, setQuery] = useState('');

  const base = BASE_TRANSLATIONS[lang];
  const overridesFor = (g) => (draft && draft[lang] && draft[lang][g]) || {};
  const valueOf = (g, key) => {
    const o = overridesFor(g)[key];
    return o !== undefined ? o : base[g][key];
  };

  const setValue = (g, key, text) => {
    const original = base[g][key];
    // Blank lines are kept while typing; the website skips them
    const value = Array.isArray(original) ? text.split('\n') : text;
    setDraft((d) => {
      const next = { ...d, [lang]: { ...(d[lang] || {}), [g]: { ...((d[lang] || {})[g] || {}) } } };
      // An empty field is kept while typing; the website falls back to the original text for it
      if (sameValue(value, original)) delete next[lang][g][key];
      else next[lang][g][key] = value;
      return next;
    });
  };

  const editedCount = (g) => Object.keys(overridesFor(g)).length;

  const fields = useMemo(() => {
    if (!draft) return [];
    const q = query.trim().toLowerCase();
    const groups = q ? GROUPS : GROUPS.filter((g) => g.id === group);
    return groups.flatMap((g) =>
      Object.keys(base[g.id] || {})
        .map((key) => ({ group: g, key }))
        .filter(({ key }) => {
          if (!q) return true;
          return toText(valueOf(g.id, key)).toLowerCase().includes(q) || humanize(key).toLowerCase().includes(q);
        })
    );
  }, [draft, query, group, lang]);

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Texts</h1>
          <p>Every heading, sentence and button on the website, in all three languages. Search for any text you see on the site.</p>
        </div>
      </header>

      {loading ? (
        <SkeletonList />
      ) : (
        <div className="adm-texts">
          <nav className="adm-texts__groups" aria-label="Website sections">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={!query && group === g.id}
                onClick={() => { setGroup(g.id); setQuery(''); }}
              >
                {g.label}
                {editedCount(g.id) > 0 && <span>{editedCount(g.id)} edited</span>}
              </button>
            ))}
          </nav>

          <div>
            <div className="adm-texts__toolbar">
              <div className="adm-input-wrap">
                <Search size={17} />
                <input
                  className="adm-input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search all texts…"
                  aria-label="Search all texts"
                />
              </div>
              <div className="adm-seg" role="group" aria-label="Language">
                {LANGUAGES.map((l) => (
                  <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {fields.length === 0 ? (
              <EmptyState icon={Search} title="No matching text">
                Try a shorter word, or switch language.
              </EmptyState>
            ) : (
              <div className="adm-panel">
                {fields.map(({ group: g, key }) => {
                  const original = base[g.id][key];
                  const edited = overridesFor(g.id)[key] !== undefined;
                  const text = toText(valueOf(g.id, key));
                  const isList = Array.isArray(original);
                  const id = `text-${g.id}-${key}`;
                  return (
                    <div className="adm-text-field" key={`${g.id}.${key}`}>
                      <div className="adm-text-field__head">
                        <label className="adm-label" htmlFor={id}>{humanize(key)}</label>
                        {query && <span className="adm-text-field__group">{g.label}</span>}
                        {edited && <span className="adm-edited">Edited</span>}
                        {edited && (
                          <button type="button" className="adm-linkbtn" onClick={() => setValue(g.id, key, toText(original))}>
                            Reset to original
                          </button>
                        )}
                      </div>
                      <textarea
                        id={id}
                        className="adm-textarea"
                        rows={isList ? Math.max(3, text.split('\n').length) : Math.min(6, Math.max(1, Math.ceil(text.length / 80)))}
                        value={text}
                        onChange={(e) => setValue(g.id, key, e.target.value)}
                      />
                      {isList && <span className="adm-hint">One item per line.</span>}
                      {text.includes('{{') && <span className="adm-hint">Keep words in {'{{ }}'} exactly as they are; they are filled in automatically.</span>}
                      {lang !== 'en' && <span className="adm-hint">English: {toText(BASE_TRANSLATIONS.en[g.id][key])}</span>}
                    </div>
                  );
                })}
              </div>
            )}
            <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
          </div>
        </div>
      )}
    </>
  );
}
