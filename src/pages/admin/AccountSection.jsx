import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast, Field } from './ui';

const MIN_LENGTH = 8;

function PasswordInput({ id, value, onChange, autoComplete, show, invalid, describedBy }) {
  return (
    <input
      id={id}
      type={show ? 'text' : 'password'}
      className="adm-input"
      autoComplete={autoComplete}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    />
  );
}

export default function AccountSection() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ''));
  }, []);

  const tooShort = next.length > 0 && next.length < MIN_LENGTH;
  const mismatch = confirm.length > 0 && next !== confirm;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (next.length < MIN_LENGTH) return setError(`The new password needs at least ${MIN_LENGTH} characters.`);
    if (next !== confirm) return setError('The two new passwords don’t match.');
    if (next === current) return setError('The new password must be different from the current one.');

    setSaving(true);
    // Confirm it's really the admin by checking the current password first
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: current });
    if (signInError) {
      setSaving(false);
      return setError('Your current password is incorrect.');
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setSaving(false);
    if (updateError) {
      return setError(updateError.message || 'We couldn’t change your password. Please try again.');
    }

    setCurrent('');
    setNext('');
    setConfirm('');
    setShow(false);
    toast('Password changed', { detail: 'Use your new password the next time you sign in.' });
  };

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Account</h1>
          <p>The admin account used to sign in to this panel.</p>
        </div>
      </header>

      <section className="adm-panel" style={{ maxWidth: 560 }}>
        <div className="adm-panel__head"><h2>Signed in as</h2></div>
        <p style={{ marginBottom: 0, color: 'var(--ink)', fontWeight: 500 }}>{email || '…'}</p>
      </section>

      <form className="adm-panel" style={{ maxWidth: 560 }} onSubmit={submit} noValidate>
        <div className="adm-panel__head">
          <h2>Change password</h2>
          <button type="button" className="adm-linkbtn" onClick={() => setShow((s) => !s)} aria-pressed={show}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
              {show ? 'Hide passwords' : 'Show passwords'}
            </span>
          </button>
        </div>
        <p>Choose a password you don’t use anywhere else.</p>

        <div style={{ display: 'grid', gap: 18 }}>
          {/* Hidden username helps password managers save the right account */}
          <input type="email" autoComplete="username" value={email} readOnly hidden />

          <Field label="Current password" htmlFor="pw-current">
            <PasswordInput id="pw-current" value={current} onChange={setCurrent} autoComplete="current-password" show={show} />
          </Field>

          <Field label="New password" htmlFor="pw-new" hint={tooShort ? undefined : `At least ${MIN_LENGTH} characters.`}>
            <PasswordInput
              id="pw-new"
              value={next}
              onChange={setNext}
              autoComplete="new-password"
              show={show}
              invalid={tooShort}
              describedBy={tooShort ? 'pw-new-error' : undefined}
            />
            {tooShort && <span id="pw-new-error" className="adm-hint" style={{ color: 'var(--red-strong)' }}>At least {MIN_LENGTH} characters ({next.length} so far).</span>}
          </Field>

          <Field label="Repeat new password" htmlFor="pw-confirm">
            <PasswordInput
              id="pw-confirm"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
              show={show}
              invalid={mismatch}
              describedBy={mismatch ? 'pw-confirm-error' : undefined}
            />
            {mismatch && <span id="pw-confirm-error" className="adm-hint" style={{ color: 'var(--red-strong)' }}>Doesn’t match the new password.</span>}
          </Field>

          {error && (
            <div className="adm-alert" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <button type="submit" className="adm-btn adm-btn--primary" disabled={saving || !current || !next || !confirm}>
              {saving && <Loader2 size={16} className="adm-spin" />}
              {saving ? 'Changing…' : 'Change password'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
