import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/** Sticky bar shown while there are unsaved changes. Also warns before leaving the page. */
export default function SaveBar({ dirty, saving, onSave, onDiscard }) {
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!dirty && !saving) return null;

  return (
    <div className="adm-savebar" role="region" aria-label="Unsaved changes">
      <span>You have unsaved changes.</span>
      <div>
        <button type="button" className="adm-btn adm-btn--ghost" onClick={onDiscard} disabled={saving}>Discard</button>
        <button type="button" className="adm-btn adm-btn--primary" onClick={onSave} disabled={saving}>
          {saving && <Loader2 size={16} className="adm-spin" />}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
