import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Lightbox = ({ src, caption, onClose }) => {
  const { t } = useTranslation();
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="lp-lightbox" role="dialog" aria-modal="true" aria-label={caption} onClick={onClose}>
      <button ref={closeRef} type="button" className="lp-lightbox__close" onClick={onClose} aria-label={t('news.close')}>
        <X size={24} />
      </button>
      <figure style={{ margin: 0 }} onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={caption} />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    </div>
  );
};

export default Lightbox;
