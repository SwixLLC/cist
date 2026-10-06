import React from 'react';
import { Ban, ExternalLink } from 'lucide-react';
import { THEMES, themeStatus } from '../../lib/themes';
import { Field, ImagePicker, SkeletonGrid } from './ui';
import useSiteDraft from './useSiteDraft';
import SaveBar from './SaveBar';

const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'fr', label: 'French' },
  { id: 'es', label: 'Spanish' },
];

const formatDay = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

function StatusLine({ setting }) {
  const status = themeStatus(setting);
  if (status === 'off') return <span className="adm-hint">No theme is showing on the website.</span>;
  const name = THEMES[setting.active].label;
  if (status === 'scheduled') return <span className="adm-theme-status adm-theme-status--wait">{name} starts on {formatDay(setting.start)}</span>;
  if (status === 'ended') return <span className="adm-theme-status adm-theme-status--off">{name} ended on {formatDay(setting.end)}, so it’s hidden</span>;
  return (
    <span className="adm-theme-status adm-theme-status--live">
      {name} is live{setting.end ? ` until ${formatDay(setting.end)}` : ''}
    </span>
  );
}

export default function ThemesSection() {
  const { draft, setDraft, dirty, saving, save, discard, loading } = useSiteDraft('theme', 'Theme');

  const active = draft?.active && THEMES[draft.active] ? draft.active : 'none';
  const theme = THEMES[active];
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const setMessage = (lang, value) => setDraft((d) => ({ ...d, message: { ...(d.message || {}), [lang]: value } }));
  const datesInvalid = draft?.start && draft?.end && draft.end < draft.start;

  const options = [
    { id: 'none', label: 'No theme', icon: Ban, sample: 'The website’s normal look.' },
    ...Object.entries(THEMES).map(([id, t]) => ({ id, label: t.label, icon: t.icon, accent: t.accent, sample: t.message.en })),
  ];

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Themes</h1>
          <p>Add a seasonal touch to the top of the home page: a greeting, a matching colour and light decorations. The rest of the website stays the same.</p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> View website</a>
        </div>
      </header>

      {loading ? (
        <SkeletonGrid count={5} />
      ) : (
        <>
          <section className="adm-panel">
            <div className="adm-panel__head">
              <h2>Choose a theme</h2>
              <StatusLine setting={draft} />
            </div>
            <p>Only one theme can be on at a time.</p>
            <div className="adm-themes" role="radiogroup" aria-label="Theme">
              {options.map(({ id, label, icon: Icon, accent, sample }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active === id}
                  className="adm-theme-card"
                  style={accent ? { '--swatch': accent } : undefined}
                  onClick={() => set({ active: id === 'none' ? null : id })}
                >
                  <span className="adm-theme-card__icon"><Icon size={22} /></span>
                  <strong>{label}</strong>
                  <span>{sample}</span>
                </button>
              ))}
            </div>
          </section>

          {theme && (
            <>
              <section className="adm-panel">
                <div className="adm-panel__head"><h2>When to show it</h2></div>
                <p>Leave the dates empty to show the theme until you switch it off. With an end date, it switches itself off.</p>
                <div className="adm-form-grid">
                  <Field label="Start date" htmlFor="theme-start">
                    <input id="theme-start" type="date" className="adm-input" value={draft.start || ''} onChange={(e) => set({ start: e.target.value || undefined })} />
                  </Field>
                  <Field label="End date" htmlFor="theme-end">
                    <input
                      id="theme-end"
                      type="date"
                      className="adm-input"
                      value={draft.end || ''}
                      min={draft.start || undefined}
                      onChange={(e) => set({ end: e.target.value || undefined })}
                      aria-invalid={datesInvalid || undefined}
                    />
                  </Field>
                </div>
                {datesInvalid && <p className="adm-hint" style={{ color: 'var(--red-strong)', marginTop: 10 }}>The end date is before the start date.</p>}
              </section>

              <section className="adm-panel">
                <div className="adm-panel__head"><h2>Greeting</h2></div>
                <p>Shown above the main title. Leave a language empty to use the suggested greeting shown in grey.</p>
                <div style={{ display: 'grid', gap: 16 }}>
                  {LANGS.map((l) => (
                    <Field key={l.id} label={l.label} htmlFor={`theme-msg-${l.id}`}>
                      <input
                        id={`theme-msg-${l.id}`}
                        className="adm-input"
                        value={draft.message?.[l.id] || ''}
                        placeholder={theme.message[l.id]}
                        maxLength={90}
                        onChange={(e) => setMessage(l.id, e.target.value)}
                      />
                    </Field>
                  ))}
                </div>
              </section>

              <section className="adm-panel">
                <div className="adm-panel__head"><h2>Banner photo (optional)</h2></div>
                <p>A photo from a school event that fits the season, shown first in the top banner while the theme is on.</p>
                <div style={{ maxWidth: 420 }}>
                  <ImagePicker value={draft.heroImage || ''} onChange={(url) => set({ heroImage: url || undefined })} />
                </div>
              </section>
            </>
          )}

          <SaveBar dirty={dirty} saving={saving} onSave={datesInvalid ? () => {} : save} onDiscard={discard} />
        </>
      )}
    </>
  );
}
