import React from 'react';
import { DEFAULT_SETTINGS } from '../../lib/defaultContent';
import { Field, SkeletonList } from './ui';
import useSiteDraft from './useSiteDraft';
import SaveBar from './SaveBar';

const GROUPS = [
  {
    title: 'Contact details',
    description: 'Shown in the contact section, the footer and the “How to join” buttons.',
    fields: [
      { key: 'phone', label: 'Phone number', type: 'tel' },
      { key: 'whatsapp', label: 'WhatsApp number', type: 'tel', hint: 'Used by the WhatsApp buttons. Include the country code.' },
      { key: 'showWhatsappButton', label: 'Floating WhatsApp button', type: 'toggle', wide: true, hint: 'The round green button in the bottom corner of every page.' },
      { key: 'email', label: 'Email address', type: 'email' },
      { key: 'addressLine1', label: 'Address (line 1)' },
      { key: 'addressLine2', label: 'Address (line 2)' },
    ],
  },
  {
    title: 'Map',
    description: 'The map at the bottom of the home page.',
    fields: [
      {
        key: 'mapDirectionsUrl',
        label: '“Get directions” link',
        type: 'url',
        wide: true,
        hint: 'In Google Maps, open the school, click Share and copy the link.',
      },
      {
        key: 'mapEmbedUrl',
        label: 'Map embed link',
        type: 'url',
        wide: true,
        hint: 'In Google Maps: Share → Embed a map → copy only the address inside src="…".',
      },
    ],
  },
  {
    title: 'Social media',
    description: 'The icons in the contact section and the footer.',
    fields: [
      { key: 'facebookUrl', label: 'Facebook page', type: 'url', wide: true },
      { key: 'instagramUrl', label: 'Instagram profile', type: 'url', wide: true },
      { key: 'linkedinUrl', label: 'LinkedIn page', type: 'url', wide: true },
    ],
  },
];

/** Accepts a full <iframe …> paste and keeps only the src address. */
const cleanEmbed = (text) => {
  const match = text.match(/src="([^"]+)"/);
  return match ? match[1] : text;
};

export default function SchoolInfoSection() {
  const { draft, setDraft, dirty, saving, save, discard, loading } = useSiteDraft('settings', 'School info');

  const set = (key) => (e) => {
    const raw = e.target.value;
    setDraft((d) => ({ ...d, [key]: key === 'mapEmbedUrl' ? cleanEmbed(raw) : raw }));
  };

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>School info</h1>
          <p>Contact details and links used across the website. Clearing a field puts back the original value.</p>
        </div>
      </header>

      {loading ? (
        <SkeletonList count={3} />
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (dirty) save(); }}>
          {GROUPS.map((group) => (
            <section className="adm-panel" key={group.title}>
              <div className="adm-panel__head"><h2>{group.title}</h2></div>
              <p>{group.description}</p>
              <div className="adm-form-grid">
                {group.fields.map((f) => (
                  <div className={f.wide ? 'adm-field--wide' : undefined} key={f.key}>
                    {f.type === 'toggle' ? (
                      <div className="adm-field">
                        <span className="adm-label">{f.label}</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={draft[f.key] !== undefined ? !!draft[f.key] : !!DEFAULT_SETTINGS[f.key]}
                            onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.checked }))}
                            style={{ width: 18, height: 18, accentColor: 'var(--red)' }}
                          />
                          Show on the website
                        </label>
                        <span className="adm-hint">{f.hint}</span>
                      </div>
                    ) : (
                    <Field label={f.label} htmlFor={`info-${f.key}`} hint={f.hint}>
                      <input
                        id={`info-${f.key}`}
                        type={f.type || 'text'}
                        className="adm-input"
                        value={draft[f.key] !== undefined ? draft[f.key] : DEFAULT_SETTINGS[f.key]}
                        onChange={set(f.key)}
                      />
                    </Field>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
          <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
        </form>
      )}
    </>
  );
}
