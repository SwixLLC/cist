import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon, Newspaper, CalendarDays, LayoutGrid, LogOut, Lock, Mail, AlertCircle,
  ArrowLeft, ExternalLink, Loader2, LayoutTemplate, Type, School, KeyRound, Palette, MoreHorizontal, X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ToastProvider, ConfirmProvider } from './admin/ui';
import PhotosSection from './admin/PhotosSection';
import NewsSection from './admin/NewsSection';
import EventsSection from './admin/EventsSection';
import GallerySection from './admin/GallerySection';
import PageImagesSection from './admin/PageImagesSection';
import TextsSection from './admin/TextsSection';
import SchoolInfoSection from './admin/SchoolInfoSection';
import AccountSection from './admin/AccountSection';
import ThemesSection from './admin/ThemesSection';
import { useSite } from '../lib/siteContent';
import './admin/admin.css';

const SECTIONS = [
  { id: 'news', label: 'News', icon: Newspaper, Component: NewsSection, group: 'Content' },
  { id: 'events', label: 'Events', icon: CalendarDays, Component: EventsSection, group: 'Content' },
  { id: 'gallery', label: 'Gallery', icon: LayoutGrid, Component: GallerySection, group: 'Content' },
  { id: 'page-images', label: 'Page images', icon: LayoutTemplate, Component: PageImagesSection, group: 'Website' },
  { id: 'texts', label: 'Texts', icon: Type, Component: TextsSection, group: 'Website' },
  { id: 'info', label: 'School info', icon: School, Component: SchoolInfoSection, group: 'Website' },
  { id: 'themes', label: 'Themes', icon: Palette, Component: ThemesSection, group: 'Website' },
  { id: 'photos', label: 'Photo library', icon: ImageIcon, Component: PhotosSection, group: 'Website' },
  { id: 'account', label: 'Account', icon: KeyRound, Component: AccountSection, group: 'Settings' },
];

const sectionFromHash = () => {
  const id = window.location.hash.replace('#', '');
  return SECTIONS.some((s) => s.id === id) ? id : 'news';
};

// A password-reset email link lands here with "type=recovery" in the address
const openedFromResetLink = window.location.hash.includes('type=recovery');

export default function AdminPanelPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [recovering, setRecovering] = useState(openedFromResetLink);

  useEffect(() => {
    document.title = 'Admin · CIST';
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="adm">
      <ToastProvider>
        <ConfirmProvider>
          {checking ? (
            <div className="adm-boot" aria-live="polite">
              <Loader2 size={24} className="adm-spin" />
              <span className="adm-sr">Loading…</span>
            </div>
          ) : recovering && session ? (
            <SetNewPassword onDone={() => setRecovering(false)} />
          ) : session ? (
            <Dashboard session={session} />
          ) : (
            <SignIn onSignedIn={setSession} />
          )}
        </ConfirmProvider>
      </ToastProvider>
    </div>
  );
}

/* ---------- Sign in ---------- */

function SignIn({ onSignedIn }) {
  const { images } = useSite();
  const [mode, setMode] = useState('signin'); // 'signin' | 'forgot' | 'sent'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sendReset = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin-panel`,
    });
    setSubmitting(false);
    if (err) {
      setError(/rate|seconds/i.test(err.message)
        ? 'Too many requests. Wait a minute, then try again.'
        : 'We couldn’t send the email. Check the address and try again.');
      return;
    }
    setMode('sent');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (err) {
      setError(
        /invalid login/i.test(err.message)
          ? 'That email and password don’t match. Check them and try again.'
          : 'We couldn’t sign you in. Check your connection and try again.'
      );
      return;
    }
    onSignedIn(data.session);
  };

  return (
    <div className="adm-login">
      <div className="adm-login__art" aria-hidden="true">
        <img src={images.heroSlides[0]} alt="" />
        <div className="adm-login__caption">
          <p>Keep the CIST website up to date.</p>
          <p>News, events, photos, texts and school info, all in one place.</p>
        </div>
      </div>

      <div className="adm-login__panel">
        <form className="adm-login__form" onSubmit={mode === 'signin' ? submit : sendReset}>
          <div>
            <img className="adm-login__logo" src={images.logo} alt="CIST" />
            <h1 className="adm-login__title">
              {mode === 'signin' ? 'Admin sign in' : mode === 'forgot' ? 'Reset your password' : 'Check your email'}
            </h1>
            <p className="adm-login__sub">
              {mode === 'signin' && 'Canadian International School Tangier'}
              {mode === 'forgot' && 'Enter the admin email and we’ll send you a link to choose a new password.'}
              {mode === 'sent' && `If ${email} is the admin email, a reset link is on its way. Open it on this device. It can take a few minutes; check your spam folder too.`}
            </p>
          </div>

          {error && (
            <div className="adm-alert" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {mode !== 'sent' && (
            <div className="adm-field">
              <label className="adm-label" htmlFor="login-email">Email</label>
              <div className="adm-input-wrap">
                <Mail size={17} />
                <input
                  id="login-email"
                  type="email"
                  className="adm-input"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cist.ma"
                />
              </div>
            </div>
          )}

          {mode === 'signin' && (
            <div className="adm-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label className="adm-label" htmlFor="login-password">Password</label>
                <button type="button" className="adm-linkbtn" onClick={() => { setMode('forgot'); setError(''); }}>
                  Forgot password?
                </button>
              </div>
              <div className="adm-input-wrap">
                <Lock size={17} />
                <input
                  id="login-password"
                  type="password"
                  className="adm-input"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {mode === 'signin' && (
            <button type="submit" className="adm-btn adm-btn--primary adm-btn--block" disabled={submitting}>
              {submitting && <Loader2 size={17} className="adm-spin" />}
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          )}

          {mode === 'forgot' && (
            <button type="submit" className="adm-btn adm-btn--primary adm-btn--block" disabled={submitting || !email}>
              {submitting && <Loader2 size={17} className="adm-spin" />}
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          )}

          {mode === 'signin' ? (
            <a href="/" className="adm-login__back">
              <ArrowLeft size={15} /> Back to the website
            </a>
          ) : (
            <button type="button" className="adm-login__back adm-linkbtn" style={{ textDecoration: 'none' }} onClick={() => { setMode('signin'); setError(''); }}>
              <ArrowLeft size={15} /> Back to sign in
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

/* ---------- New password (opened from a reset email) ---------- */

function SetNewPassword({ onDone }) {
  const { images } = useSite();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('The new password needs at least 8 characters.');
    if (password !== confirm) return setError('The two passwords don’t match.');
    setSaving(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (err) return setError(err.message || 'We couldn’t save the new password. Please try again.');
    window.history.replaceState(null, '', '/admin-panel');
    onDone();
  };

  return (
    <div className="adm-login">
      <div className="adm-login__art" aria-hidden="true">
        <img src={images.heroSlides[0]} alt="" />
      </div>
      <div className="adm-login__panel">
        <form className="adm-login__form" onSubmit={submit} noValidate>
          <div>
            <img className="adm-login__logo" src={images.logo} alt="CIST" />
            <h1 className="adm-login__title">Choose a new password</h1>
            <p className="adm-login__sub">At least 8 characters. You’ll stay signed in afterwards.</p>
          </div>

          {error && (
            <div className="adm-alert" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="adm-field">
            <label className="adm-label" htmlFor="new-password">New password</label>
            <div className="adm-input-wrap">
              <Lock size={17} />
              <input id="new-password" type="password" className="adm-input" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor="new-password-2">Repeat new password</label>
            <div className="adm-input-wrap">
              <Lock size={17} />
              <input id="new-password-2" type="password" className="adm-input" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="adm-btn adm-btn--primary adm-btn--block" disabled={saving}>
            {saving && <Loader2 size={17} className="adm-spin" />}
            {saving ? 'Saving…' : 'Save new password'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Dashboard shell ---------- */

// Shown directly in the phone tab bar; everything else lives under "More"
const PHONE_TABS = ['news', 'events', 'gallery'];

function Dashboard({ session }) {
  const [active, setActive] = useState(sectionFromHash);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!moreOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMoreOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [moreOpen]);

  useEffect(() => {
    const onHash = () => setActive(sectionFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (id) => {
    if (id === active) return;
    window.history.replaceState(null, '', `#${id}`);
    setActive(id);
    window.scrollTo({ top: 0 });
  };

  const signOut = () => supabase.auth.signOut();
  const { Component } = SECTIONS.find((s) => s.id === active);

  const brand = (
    <div className="adm-brand">
      <img src="/icon.webp" alt="" />
      <div>
        <strong>CIST Admin</strong>
        <span>Website content</span>
      </div>
    </div>
  );

  return (
    <div className="adm-shell">
      <aside className="adm-rail">
        {brand}
        <nav className="adm-nav" aria-label="Sections">
          {SECTIONS.map(({ id, label, icon: Icon, group }, index) => (
            <React.Fragment key={id}>
            {group !== SECTIONS[index - 1]?.group && <div className="adm-nav__group">{group}</div>}
            <button
              type="button"
              className="adm-nav__item"
              aria-current={active === id ? 'page' : undefined}
              onClick={() => go(id)}
            >
              <Icon size={18} /> {label}
            </button>
            </React.Fragment>
          ))}
        </nav>
        <div className="adm-rail__foot">
          <div className="adm-user" title={session.user?.email}>{session.user?.email}</div>
          <a className="adm-btn adm-btn--ghost" href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> View website
          </a>
          <button type="button" className="adm-btn adm-btn--ghost" onClick={signOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <header className="adm-topbar">
        {brand}
        <div style={{ display: 'flex' }}>
          <a className="adm-icon-btn" href="/" target="_blank" rel="noreferrer" aria-label="View website">
            <ExternalLink size={18} />
          </a>
          <button type="button" className="adm-icon-btn" onClick={signOut} aria-label="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="adm-main">
        <div className="adm-content">
          <Component key={active} />
        </div>
      </main>

      <nav className="adm-tabs" aria-label="Sections">
        {SECTIONS.filter((s) => PHONE_TABS.includes(s.id)).map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" aria-current={active === id ? 'page' : undefined} onClick={() => go(id)}>
            <Icon size={21} />
            {label}
          </button>
        ))}
        <button
          type="button"
          aria-current={!PHONE_TABS.includes(active) ? 'page' : undefined}
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen(true)}
        >
          <MoreHorizontal size={21} />
          {PHONE_TABS.includes(active) ? 'More' : SECTIONS.find((s) => s.id === active).label}
        </button>
      </nav>

      {moreOpen && (
        <>
          <div className="adm-scrim" onClick={() => setMoreOpen(false)} />
          <div className="adm-more" role="dialog" aria-modal="true" aria-label="All sections">
            <div className="adm-more__head">
              <strong>All sections</strong>
              <button type="button" className="adm-icon-btn" onClick={() => setMoreOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            {['Content', 'Website', 'Settings'].map((group) => (
              <div key={group} className="adm-more__group">
                <span className="adm-nav__group">{group}</span>
                {SECTIONS.filter((s) => s.group === group).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className="adm-nav__item"
                    aria-current={active === id ? 'page' : undefined}
                    onClick={() => { go(id); setMoreOpen(false); }}
                  >
                    <Icon size={19} /> {label}
                  </button>
                ))}
              </div>
            ))}
            <div className="adm-more__group">
              <a className="adm-nav__item" href="/" target="_blank" rel="noreferrer"><ExternalLink size={19} /> View website</a>
              <button type="button" className="adm-nav__item" onClick={signOut}><LogOut size={19} /> Sign out</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
