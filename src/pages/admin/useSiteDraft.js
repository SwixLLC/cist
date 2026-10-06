import { useEffect, useMemo, useState } from 'react';
import { getSiteContent, saveSiteContent } from '../../lib/cmsData';
import { useSaveToast } from './ui';

/**
 * Loads one site_content entry ('images', 'settings' or 'translations'), keeps an editable draft,
 * and saves it back. `dirty` is true while the draft differs from what is saved.
 */
export default function useSiteDraft(key, label) {
  const saveToast = useSaveToast();
  const [saved, setSaved] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteContent().then((content) => {
      const value = content[key] || {};
      setSaved(value);
      setDraft(value);
    });
  }, [key]);

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);

  const save = async () => {
    setSaving(true);
    const result = await saveSiteContent(key, draft);
    setSaving(false);
    setSaved(draft);
    saveToast(result, label);
  };

  const discard = () => setDraft(saved);

  return { draft, setDraft, dirty, saving, save, discard, loading: draft === null };
}
