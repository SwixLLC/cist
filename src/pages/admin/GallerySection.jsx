import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, LayoutGrid } from 'lucide-react';
import { getGallery, saveGalleryItem, deleteGalleryItem } from '../../lib/cmsData';
import {
  useToast, useSaveToast, useConfirm, Sheet, Field, ImagePicker, EmptyState, SkeletonGrid,
} from './ui';

const CATEGORIES = [
  { value: 'sports', label: 'Sports' },
  { value: 'arts', label: 'Arts' },
  { value: 'academics', label: 'Academics' },
  { value: 'community', label: 'Community' },
];

const labelFor = (value) => CATEGORIES.find((c) => c.value === value)?.label || value;

export default function GallerySection() {
  const toast = useToast();
  const saveToast = useSaveToast();
  const confirm = useConfirm();
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);

  const load = async () => setItems(await getGallery());

  useEffect(() => {
    load();
  }, []);

  const remove = async (photo) => {
    const ok = await confirm({
      title: 'Remove from gallery?',
      message: `“${photo.title}” will no longer appear in Campus life. The picture itself stays in Photos.`,
      confirmLabel: 'Remove',
    });
    if (!ok) return;
    await deleteGalleryItem(photo.id);
    setItems((list) => list.filter((g) => g.id !== photo.id));
    toast('Removed from gallery');
  };

  const newPhoto = () => setEditing({ src: '', title: '', category: filter === 'all' ? 'sports' : filter });
  const visible = (items || []).filter((g) => filter === 'all' || g.category === filter);
  const countFor = (value) => (items || []).filter((g) => g.category === value).length;

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Gallery</h1>
          <p>Photos shown in the Campus life section of the website, grouped by category.</p>
        </div>
        <div className="adm-head__actions">
          <button type="button" className="adm-btn adm-btn--primary" onClick={newPhoto}>
            <Plus size={17} /> Add photo
          </button>
        </div>
      </header>

      {items && items.length > 0 && (
        <div className="adm-toolbar" role="group" aria-label="Filter by category">
          <button type="button" className="adm-chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            All<span>{items.length}</span>
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.value} type="button" className="adm-chip" aria-pressed={filter === c.value} onClick={() => setFilter(c.value)}>
              {c.label}<span>{countFor(c.value)}</span>
            </button>
          ))}
        </div>
      )}

      {items === null ? (
        <SkeletonGrid />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title={filter === 'all' ? 'The gallery is empty' : `No ${labelFor(filter).toLowerCase()} photos yet`}
          action={(
            <button type="button" className="adm-btn adm-btn--primary" onClick={newPhoto}>
              <Plus size={17} /> Add photo
            </button>
          )}
        >
          Show families what everyday life at CIST looks like.
        </EmptyState>
      ) : (
        <div className="adm-grid">
          {visible.map((g) => (
            <figure className="adm-tile" key={g.id} style={{ margin: 0 }}>
              <div className="adm-tile__img">
                <img src={g.src} alt={g.title} loading="lazy" />
              </div>
              <div className="adm-tile__actions">
                <button type="button" className="adm-icon-btn" onClick={() => setEditing(g)} aria-label={`Edit “${g.title}”`} title="Edit">
                  <Pencil size={16} />
                </button>
                <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => remove(g)} aria-label={`Remove “${g.title}”`} title="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
              <figcaption className="adm-tile__meta">
                <span className="adm-tile__title">{g.title}</span>
                <span className="adm-tile__sub">{labelFor(g.category)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {editing && (
        <PhotoEditor
          photo={editing}
          onClose={() => setEditing(null)}
          onSaved={async (result) => {
            saveToast(result, 'Photo');
            setEditing(null);
            await load();
          }}
        />
      )}
    </>
  );
}

function PhotoEditor({ photo, onClose, onSaved }) {
  const toast = useToast();
  const [draft, setDraft] = useState({ ...photo });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!draft.src) {
      toast('Add a picture first', { tone: 'warn', detail: 'Upload one or choose it from Photos.' });
      return;
    }
    setSaving(true);
    const result = await saveGalleryItem({ ...draft, title: draft.title.trim() });
    setSaving(false);
    onSaved(result);
  };

  return (
    <Sheet
      title={photo.id ? 'Edit photo' : 'Add photo to gallery'}
      onClose={onClose}
      onSubmit={submit}
      saving={saving}
      submitLabel={photo.id ? 'Save changes' : 'Add to gallery'}
    >
      <Field label="Picture" htmlFor="g-src">
        <ImagePicker id="g-src" value={draft.src} onChange={(url) => setDraft((d) => ({ ...d, src: url }))} />
      </Field>

      <Field label="Caption" htmlFor="g-title">
        <input id="g-title" className="adm-input" required value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="e.g. Science fair" data-autofocus />
      </Field>

      <Field label="Category" htmlFor="g-category">
        <select id="g-category" className="adm-select" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </Field>
    </Sheet>
  );
}
