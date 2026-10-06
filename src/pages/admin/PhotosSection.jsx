import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, Link, Check, Trash2, Image as ImageIcon } from 'lucide-react';
import { listUploadedImages, uploadImage, deleteUploadedImage } from '../../lib/cmsData';
import { useToast, useConfirm, EmptyState, SkeletonGrid, prettyFileName, formatSize } from './ui';

export default function PhotosSection() {
  const toast = useToast();
  const confirm = useConfirm();
  const fileRef = useRef(null);
  const [images, setImages] = useState(null);
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState(null); // { done, total }
  const [copied, setCopied] = useState('');

  const load = async () => {
    const imgs = await listUploadedImages();
    setImages(imgs);
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const pictures = files.filter((f) => f.type.startsWith('image/'));
    const skipped = files.length - pictures.length;

    setProgress({ done: 0, total: pictures.length });
    let failed = 0;
    for (const file of pictures) {
      try {
        await uploadImage(file);
      } catch {
        failed += 1;
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }
    setProgress(null);
    await load();

    const ok = pictures.length - failed;
    if (ok) toast(`${ok} ${ok === 1 ? 'picture' : 'pictures'} uploaded`);
    if (failed) toast(`${failed} ${failed === 1 ? 'picture' : 'pictures'} didn't upload`, { tone: 'error', detail: 'Check your connection and try again.' });
    if (skipped) toast(`${skipped} ${skipped === 1 ? 'file was' : 'files were'} skipped`, { tone: 'warn', detail: 'Only pictures (JPG, PNG, WebP) can be uploaded.' });
  };

  const remove = async (img) => {
    const ok = await confirm({
      title: 'Delete this picture?',
      message: 'Any news article or gallery photo using it will show a broken image. This can’t be undone.',
    });
    if (!ok) return;
    try {
      await deleteUploadedImage(img.name);
      setImages((list) => list.filter((i) => i.name !== img.name));
      toast('Picture deleted');
    } catch (err) {
      toast("Couldn't delete the picture", { tone: 'error', detail: err.message });
    }
  };

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied((c) => (c === url ? '' : c)), 2000);
    } catch {
      toast("Couldn't copy the link", { tone: 'error' });
    }
  };

  const busy = !!progress;

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Photos</h1>
          <p>Upload pictures here, then add them to news articles or the campus gallery.</p>
        </div>
      </header>

      <div
        className={`adm-drop${over ? ' adm-drop--over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (!busy) upload(e.dataTransfer.files);
        }}
      >
        <div className="adm-drop__icon"><UploadCloud size={24} /></div>
        <div className="adm-drop__text">
          {busy ? (
            <>
              <strong className="adm-tnum">Uploading {Math.min(progress.done + 1, progress.total)} of {progress.total}…</strong>
              <div className="adm-progress">
                <div style={{ transform: `scaleX(${progress.done / Math.max(progress.total, 1)})` }} />
              </div>
            </>
          ) : (
            <>
              <strong>Drag pictures here to upload</strong>
              <span>JPG, PNG or WebP. You can upload several at once.</span>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(e) => {
            upload(e.target.files);
            e.target.value = '';
          }}
        />
        <button type="button" className="adm-btn adm-btn--primary" onClick={() => fileRef.current?.click()} disabled={busy}>
          Choose pictures
        </button>
      </div>

      <div className="adm-sub">
        <h2>All pictures</h2>
        {images && <span className="adm-tnum">{images.length} {images.length === 1 ? 'picture' : 'pictures'}</span>}
      </div>

      {images === null ? (
        <SkeletonGrid />
      ) : images.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No pictures yet">
          Pictures you upload appear here. Drag a few into the box above to get started.
        </EmptyState>
      ) : (
        <div className="adm-grid">
          {images.map((img) => (
            <figure className="adm-tile" key={img.name} style={{ margin: 0 }}>
              <div className="adm-tile__img">
                <img src={img.publicUrl} alt={prettyFileName(img.name)} loading="lazy" />
                {copied === img.publicUrl && (
                  <span className="adm-tile__copied"><Check size={13} /> Link copied</span>
                )}
              </div>
              <div className="adm-tile__actions">
                <button type="button" className="adm-icon-btn" onClick={() => copy(img.publicUrl)} aria-label="Copy picture link" title="Copy link">
                  <Link size={16} />
                </button>
                <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => remove(img)} aria-label="Delete picture" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
              <figcaption className="adm-tile__meta">
                <span className="adm-tile__title" title={img.name}>{prettyFileName(img.name)}</span>
                <span className="adm-tile__sub">{formatSize(img.size)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
