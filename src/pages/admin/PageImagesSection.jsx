import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DEFAULT_IMAGES } from '../../lib/defaultContent';
import { ImagePicker, SkeletonGrid } from './ui';
import useSiteDraft from './useSiteDraft';
import SaveBar from './SaveBar';

const GROUPS = [
  {
    title: 'About section',
    description: 'The two photos next to “Shaping Tomorrow’s Leaders Today”.',
    slots: [
      { key: 'aboutMain', label: 'Large photo' },
      { key: 'aboutInset', label: 'Small photo', hint: 'Overlaps the corner of the large photo.' },
    ],
  },
  {
    title: 'Academic programs',
    description: 'Shown when a visitor picks a school stage.',
    slots: [
      { key: 'programKindergarten', label: 'Greenbridge Academy (ages 3–5)' },
      { key: 'programPrimary', label: 'Primary school' },
      { key: 'programMiddle', label: 'Middle school' },
      { key: 'programHigh', label: 'High school' },
    ],
  },
  {
    title: 'Logo',
    description: 'Shown in the top menu, the footer and the admin sign-in page.',
    slots: [{ key: 'logo', label: 'School logo', hint: 'A wide logo with a transparent background works best.' }],
  },
];

export default function PageImagesSection() {
  const { draft, setDraft, dirty, saving, save, discard, loading } = useSiteDraft('images', 'Page images');

  const value = (key) => (draft && draft[key]) || DEFAULT_IMAGES[key];
  const setValue = (key, url) => setDraft((d) => ({ ...d, [key]: url || undefined }));

  const slides = (draft && Array.isArray(draft.heroSlides) && draft.heroSlides.length ? draft.heroSlides : DEFAULT_IMAGES.heroSlides);
  const setSlides = (next) => setDraft((d) => ({ ...d, heroSlides: next }));

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Page images</h1>
          <p>The pictures in fixed places on the home page. Changes show on the website as soon as you save.</p>
        </div>
      </header>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : (
        <>
          <section className="adm-panel">
            <div className="adm-panel__head">
              <h2>Top banner</h2>
              <span className="adm-hint">{slides.length} {slides.length === 1 ? 'photo' : 'photos'}</span>
            </div>
            <p>The large photos behind the main title. With more than one, they change every few seconds.</p>
            <div className="adm-slots">
              {slides.map((src, index) => (
                <div className="adm-slot" key={index}>
                  <div className="adm-slot__label">
                    <span className="adm-label">Photo {index + 1}</span>
                    {slides.length > 1 && (
                      <button
                        type="button"
                        className="adm-icon-btn adm-icon-btn--danger"
                        aria-label={`Remove photo ${index + 1}`}
                        onClick={() => setSlides(slides.filter((_, i) => i !== index))}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <ImagePicker
                    value={src}
                    onChange={(url) => setSlides(slides.map((s, i) => (i === index ? url : s)))}
                  />
                </div>
              ))}
            </div>
            <button type="button" className="adm-btn" style={{ marginTop: 18 }} onClick={() => setSlides([...slides, ''])}>
              <Plus size={16} /> Add a banner photo
            </button>
          </section>

          {GROUPS.map((group) => (
            <section className="adm-panel" key={group.title}>
              <div className="adm-panel__head"><h2>{group.title}</h2></div>
              <p>{group.description}</p>
              <div className="adm-slots">
                {group.slots.map((slot) => (
                  <div className="adm-slot" key={slot.key}>
                    <div className="adm-slot__label">
                      <span className="adm-label">{slot.label}</span>
                      {draft[slot.key] && draft[slot.key] !== DEFAULT_IMAGES[slot.key] && (
                        <button type="button" className="adm-linkbtn" onClick={() => setValue(slot.key, '')}>
                          Use original
                        </button>
                      )}
                    </div>
                    <ImagePicker value={value(slot.key)} onChange={(url) => setValue(slot.key, url)} />
                    {slot.hint && <span className="adm-hint">{slot.hint}</span>}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
        </>
      )}
    </>
  );
}
