import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Newspaper, Image as ImageIcon } from 'lucide-react';
import { getNews, saveNews, deleteNews } from '../../lib/cmsData';
import {
  useToast, useSaveToast, useConfirm, Sheet, Field, ImagePicker, EmptyState, SkeletonList,
  newsDateToIso, isoToNewsDate,
} from './ui';

const CATEGORIES = [
  { value: 'announcements', label: 'Announcement' },
  { value: 'achievements', label: 'Achievement' },
  { value: 'events', label: 'Event' },
  { value: 'academics', label: 'Academics' },
];

const todayIso = () => newsDateToIso(new Date().toDateString());

const blankArticle = () => ({
  title: '',
  category: 'announcements',
  date: isoToNewsDate(todayIso()),
  readTime: '3 min',
  author: 'Admin Office',
  image: '',
  excerpt: '',
  content: '',
});

export default function NewsSection() {
  const toast = useToast();
  const saveToast = useSaveToast();
  const confirm = useConfirm();
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = async () => setItems(await getNews());

  useEffect(() => {
    load();
  }, []);

  const remove = async (item) => {
    const ok = await confirm({
      title: 'Delete this article?',
      message: `“${item.title}” will be removed from the website. This can’t be undone.`,
    });
    if (!ok) return;
    await deleteNews(item.id);
    setItems((list) => list.filter((n) => n.id !== item.id));
    toast('Article deleted');
  };

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>News</h1>
          <p>Articles and announcements shown in the News section of the website, newest first.</p>
        </div>
        <div className="adm-head__actions">
          <button type="button" className="adm-btn adm-btn--primary" onClick={() => setEditing(blankArticle())}>
            <Plus size={17} /> New article
          </button>
        </div>
      </header>

      {items === null ? (
        <SkeletonList />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No articles yet"
          action={(
            <button type="button" className="adm-btn adm-btn--primary" onClick={() => setEditing(blankArticle())}>
              <Plus size={17} /> Write the first article
            </button>
          )}
        >
          Share school news, achievements and announcements with families.
        </EmptyState>
      ) : (
        <div className="adm-list">
          {items.map((item) => (
            <article className="adm-row" key={item.id}>
              {item.image ? (
                <img className="adm-row__thumb" src={item.image} alt="" loading="lazy" />
              ) : (
                <div className="adm-row__thumb adm-row__thumb--empty"><ImageIcon size={20} strokeWidth={1.5} /></div>
              )}
              <div className="adm-row__body">
                <h3 className="adm-row__title">{item.title || 'Untitled article'}</h3>
                <div className="adm-row__meta">
                  <span className="adm-tag">{CATEGORIES.find((c) => c.value === item.category)?.label || item.categoryLabel || item.category}</span>
                  <span>{item.date}</span>
                  {item.author && <span className="adm-row__author"><i>·</i> {item.author}</span>}
                </div>
                {item.excerpt && <p className="adm-row__excerpt">{item.excerpt}</p>}
              </div>
              <div className="adm-row__actions">
                <button type="button" className="adm-icon-btn" onClick={() => setEditing(item)} aria-label={`Edit “${item.title}”`} title="Edit">
                  <Pencil size={17} />
                </button>
                <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => remove(item)} aria-label={`Delete “${item.title}”`} title="Delete">
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <ArticleEditor
          article={editing}
          onClose={() => setEditing(null)}
          onSaved={async (result) => {
            saveToast(result, 'Article');
            setEditing(null);
            await load();
          }}
        />
      )}
    </>
  );
}

function ArticleEditor({ article, onClose, onSaved }) {
  const [draft, setDraft] = useState({ ...article });
  const [dateIso, setDateIso] = useState(newsDateToIso(article.date) || todayIso());
  const [saving, setSaving] = useState(false);
  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const submit = async () => {
    setSaving(true);
    const category = CATEGORIES.find((c) => c.value === draft.category) || CATEGORIES[0];
    const result = await saveNews({
      ...draft,
      title: draft.title.trim(),
      categoryLabel: category.label,
      date: isoToNewsDate(dateIso) || draft.date,
      readTime: draft.readTime || '3 min',
      author: draft.author || 'Admin Office',
    });
    setSaving(false);
    onSaved(result);
  };

  return (
    <Sheet
      title={article.id ? 'Edit article' : 'New article'}
      onClose={onClose}
      onSubmit={submit}
      saving={saving}
      submitLabel={article.id ? 'Save changes' : 'Publish article'}
    >
      <Field label="Title" htmlFor="n-title">
        <input id="n-title" className="adm-input" required value={draft.title} onChange={set('title')} placeholder="e.g. Science fair winners announced" data-autofocus />
      </Field>

      <Field label="Cover picture" htmlFor="n-image">
        <ImagePicker id="n-image" value={draft.image} onChange={(url) => setDraft((d) => ({ ...d, image: url }))} />
      </Field>

      <div className="adm-row-2">
        <Field label="Category" htmlFor="n-category">
          <select id="n-category" className="adm-select" value={draft.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Date" htmlFor="n-date">
          <input id="n-date" type="date" className="adm-input" required value={dateIso} onChange={(e) => setDateIso(e.target.value)} />
        </Field>
      </div>

      <Field label="Summary" htmlFor="n-excerpt" hint="One or two sentences shown on the news card.">
        <textarea id="n-excerpt" className="adm-textarea" style={{ minHeight: 80 }} value={draft.excerpt} onChange={set('excerpt')} placeholder="A short summary of the article" />
      </Field>

      <Field label="Full article" htmlFor="n-content">
        <textarea id="n-content" className="adm-textarea" value={draft.content} onChange={set('content')} placeholder="Write the full article here" />
      </Field>

      <div className="adm-row-2">
        <Field label="Author" htmlFor="n-author">
          <input id="n-author" className="adm-input" value={draft.author} onChange={set('author')} placeholder="Admin Office" />
        </Field>
        <Field label="Reading time" htmlFor="n-read">
          <input id="n-read" className="adm-input" value={draft.readTime} onChange={set('readTime')} placeholder="3 min" />
        </Field>
      </div>
    </Sheet>
  );
}
