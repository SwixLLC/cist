import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  CheckCircle2, AlertTriangle, AlertCircle, X, Loader2, ImagePlus, FolderOpen, Upload,
} from 'lucide-react';
import { uploadImage, listUploadedImages } from '../../lib/cmsData';

/* ---------- Toasts ---------- */

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, { tone = 'ok', detail, duration } = {}) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list.slice(-2), { id, message, tone, detail }]);
    setTimeout(() => dismiss(id), duration || (tone === 'ok' ? 3500 : 7000));
  }, [dismiss]);

  const icons = { ok: CheckCircle2, warn: AlertTriangle, error: AlertCircle };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {toasts.map((t) => {
          const Icon = icons[t.tone];
          return (
            <div key={t.id} className={`adm-toast adm-toast--${t.tone}`}>
              <Icon size={18} />
              <p>
                {t.message}
                {t.detail && <small>{t.detail}</small>}
              </p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/** Shows the right toast after a save, depending on whether it reached the live database. */
export function useSaveToast() {
  const toast = useToast();
  return (result, what) => {
    if (result && result.savedInSupabase === false) {
      toast(`${what} saved on this device only`, {
        tone: 'warn',
        detail: "We couldn't reach the website database, so visitors won't see this yet. Check your connection and save again.",
      });
    } else {
      toast(`${what} saved and live on the website`);
    }
  };
}

/* ---------- Focus + escape handling for overlays ---------- */

function useOverlay(open, onClose, panelRef) {
  // Keep the latest onClose without re-running the effect (which would steal focus on every render)
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        // Only the topmost overlay handles Escape
        if (panelRef.current && !panelRef.current.contains(document.activeElement)) return;
        e.stopPropagation();
        closeRef.current();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector('[data-autofocus]')
        || panelRef.current?.querySelector('input, textarea, select, button');
      target?.focus();
    });

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, panelRef]);
}

/* ---------- Confirm dialog ---------- */

const ConfirmContext = createContext(async () => false);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const panelRef = useRef(null);

  const confirm = useCallback((options) => new Promise((resolve) => {
    setState({ ...options, resolve });
  }), []);

  const close = useCallback((answer) => {
    setState((s) => {
      s?.resolve(answer);
      return null;
    });
  }, []);

  const cancel = useCallback(() => close(false), [close]);
  useOverlay(!!state, cancel, panelRef);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="adm-dialog-wrap" onMouseDown={(e) => e.target === e.currentTarget && cancel()}>
          <div className="adm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="adm-confirm-title" ref={panelRef}>
            <h2 id="adm-confirm-title">{state.title}</h2>
            {state.message && <p>{state.message}</p>}
            <div className="adm-dialog__foot">
              <button type="button" className="adm-btn adm-btn--ghost" onClick={cancel}>Cancel</button>
              <button type="button" className="adm-btn adm-btn--danger" onClick={() => close(true)} data-autofocus>
                {state.confirmLabel || 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);

/* ---------- Sheet: side panel used for every create/edit form ---------- */

export function Sheet({ title, onClose, onSubmit, saving, submitLabel = 'Save', children }) {
  const panelRef = useRef(null);
  useOverlay(true, onClose, panelRef);

  return (
    <>
      <div className="adm-scrim" onMouseDown={onClose} />
      <form
        className="adm-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adm-sheet-title"
        ref={panelRef}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="adm-sheet__head">
          <h2 id="adm-sheet-title">{title}</h2>
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="adm-sheet__body">{children}</div>
        <div className="adm-sheet__foot">
          <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="adm-btn adm-btn--primary" disabled={saving}>
            {saving && <Loader2 size={16} className="adm-spin" />}
            {saving ? 'Saving…' : submitLabel}
          </button>
        </div>
      </form>
    </>
  );
}

export function Field({ label, hint, htmlFor, children }) {
  return (
    <div className="adm-field">
      <label className="adm-label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

/* ---------- Empty + skeleton ---------- */

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="adm-empty">
      <Icon size={32} strokeWidth={1.5} />
      <strong>{title}</strong>
      <p>{children}</p>
      {action}
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="adm-grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="adm-skel" style={{ aspectRatio: '4 / 3', borderRadius: 12 }} />
          <div className="adm-skel" style={{ height: 12, width: '60%', marginTop: 10 }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="adm-list" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div className="adm-row" key={i}>
          <div className="adm-skel" style={{ width: 88, aspectRatio: '4 / 3' }} />
          <div style={{ flex: 1 }}>
            <div className="adm-skel" style={{ height: 14, width: '55%' }} />
            <div className="adm-skel" style={{ height: 11, width: '30%', marginTop: 10 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Image picker: upload new or choose from the photo library ---------- */

export function ImagePicker({ value, onChange, id }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [over, setOver] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast(`"${file.name}" isn't a picture`, { tone: 'error', detail: 'Choose a JPG, PNG or WebP file.' });
      return;
    }
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange(res.publicUrl);
    } catch (err) {
      toast("The picture didn't upload", { tone: 'error', detail: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="adm-picker">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {value ? (
        <div className="adm-picker__preview">
          <img src={value} alt="Selected" />
          <button type="button" className="adm-icon-btn" onClick={() => onChange('')} aria-label="Remove picture">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`adm-picker__empty${over ? ' adm-picker__empty--over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            upload(e.dataTransfer.files?.[0]);
          }}
        >
          {uploading ? (
            <span style={{ display: 'grid', justifyItems: 'center', gap: 6 }}>
              <Loader2 size={22} className="adm-spin" /> Uploading…
            </span>
          ) : (
            <span style={{ display: 'grid', justifyItems: 'center', gap: 6 }}>
              <ImagePlus size={24} strokeWidth={1.5} />
              Drop a picture here
            </span>
          )}
        </div>
      )}

      <div className="adm-picker__buttons">
        <button type="button" className="adm-btn" onClick={() => fileRef.current?.click()} disabled={uploading} id={id}>
          <Upload size={16} /> {value ? 'Upload a different one' : 'Upload from computer'}
        </button>
        <button type="button" className="adm-btn" onClick={() => setLibraryOpen(true)} disabled={uploading}>
          <FolderOpen size={16} /> Choose from Photos
        </button>
      </div>

      {showLink ? (
        <input
          className="adm-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /images/…"
          aria-label="Picture link"
        />
      ) : (
        <button type="button" className="adm-linkbtn" onClick={() => setShowLink(true)}>
          Use a picture link instead
        </button>
      )}

      {libraryOpen && (
        <LibraryDialog
          current={value}
          onClose={() => setLibraryOpen(false)}
          onPick={(url) => {
            onChange(url);
            setLibraryOpen(false);
          }}
        />
      )}
    </div>
  );
}

function LibraryDialog({ current, onClose, onPick }) {
  const panelRef = useRef(null);
  const [images, setImages] = useState(null);
  useOverlay(true, onClose, panelRef);

  useEffect(() => {
    listUploadedImages().then(setImages);
  }, []);

  return (
    <div className="adm-dialog-wrap" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-dialog adm-dialog--wide" role="dialog" aria-modal="true" aria-labelledby="adm-lib-title" ref={panelRef}>
        <div className="adm-dialog__head">
          <h2 id="adm-lib-title">Choose a picture</h2>
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {images === null ? (
          <div className="adm-lib">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="adm-skel" style={{ aspectRatio: '4 / 3' }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <p>No pictures uploaded yet. Use "Upload from computer" instead.</p>
        ) : (
          <div className="adm-lib">
            {images.map((img) => (
              <button
                key={img.name}
                type="button"
                aria-pressed={current === img.publicUrl}
                aria-label={prettyFileName(img.name)}
                onClick={() => onPick(img.publicUrl)}
              >
                <img src={img.publicUrl} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

/** "1717171717171_Science_fair.webp" -> "Science fair" */
export function prettyFileName(name = '') {
  return name
    .replace(/^\d{10,}_/, '')
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim() || name;
}

export function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Event dates are stored as "Jun 19" (the public site splits on the space). */
export function eventDateToIso(text = '') {
  const [mon, day] = text.trim().split(/\s+/);
  const m = MONTHS.findIndex((x) => x.toLowerCase() === (mon || '').slice(0, 3).toLowerCase());
  const d = parseInt(day, 10);
  if (m < 0 || !d) return '';
  return toIso(new Date(new Date().getFullYear(), m, d));
}

export function isoToEventDate(iso) {
  if (!iso) return '';
  const [, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

/** News dates are stored as "October 15, 2026". */
export function newsDateToIso(text = '') {
  const t = Date.parse(text);
  return Number.isNaN(t) ? '' : toIso(new Date(t));
}

export function isoToNewsDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
