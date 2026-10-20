'use client';

// RSN canonical side-tab drawers (Support + Recommend).
// Markup, copy and behavior match gitlever.ai and portal.gitlever.ai.
// Styles live in src/app/side-tabs.css. Do not restyle here.

import { useCallback, useEffect, useRef, useState } from 'react';

type Panel = 'support' | 'recommend';

const PANELS: Record<Panel, {
  title: string;
  endpoint: string;
  messageKey: 'message' | 'recommendation';
  messageLabel: string;
  messageHelp: string;
  rows: number;
  submitLabel: string;
  successTitle: string;
  successBody: string;
}> = {
  support: {
    title: 'Support',
    endpoint: '/api/support-ticket',
    messageKey: 'message',
    messageLabel: 'How can we help?',
    messageHelp: 'A member of our team will follow up via email or phone.',
    rows: 5,
    submitLabel: 'Submit support request',
    successTitle: 'Request submitted',
    successBody: 'A member of our team will follow up with you shortly. Thank you for reaching out.',
  },
  recommend: {
    title: 'Recommend a feature',
    endpoint: '/api/feature-recommendation',
    messageKey: 'recommendation',
    messageLabel: 'What would make this tool more valuable to you?',
    messageHelp: 'Feature ideas, integrations, anything that would unlock more leverage for your business.',
    rows: 6,
    submitLabel: 'Submit recommendation',
    successTitle: 'Thanks for the feedback',
    successBody: 'Our AI assistant will follow up with you soon.',
  },
};

const FAILURE = "We couldn't send that. Please email support@razorsharpnetworks.com.";

function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.charAt(0) === '1') return '+' + digits;
  return null;
}
function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function DrawerForm({ panel, active }: { panel: Panel; active: boolean }) {
  const cfg = PANELS[panel];
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // Reset state each time the panel is reopened, matching the canonical script.
  useEffect(() => {
    if (active) { setError(''); setBusy(false); setDone(false); }
  }, [active]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const phoneRaw = String(fd.get('phone') || '').trim();
    const message = String(fd.get(cfg.messageKey) || '').trim();

    if (!name || !email || !phoneRaw || !message) return setError('All fields are required.');
    if (!isValidEmail(email)) return setError('Please enter a valid email address.');
    const phone = normalizePhone(phoneRaw);
    if (!phone) return setError('Please enter a valid US phone number, e.g. (555) 123-4567.');

    setBusy(true);
    try {
      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, [cfg.messageKey]: message, auditUrl: window.location.href }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || data.ok === false) throw new Error('submit failed');
      form.reset();
      setDone(true);
    } catch {
      setError(FAILURE);
    } finally {
      setBusy(false);
    }
  }

  const id = (f: string) => `${panel}-${f}`;
  return (
    <>
      <form
        className={`drawer-form${active && !done ? ' active' : ''}`}
        data-panel={panel}
        noValidate
        onSubmit={onSubmit}
      >
        <div className={`error${error ? ' show' : ''}`} role="alert" aria-live="polite">{error}</div>
        <div className="field">
          <label htmlFor={id('name')}>Your name</label>
          <input id={id('name')} name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor={id('email')}>Email</label>
          <input id={id('email')} name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor={id('phone')}>Phone</label>
          <input id={id('phone')} name="phone" type="tel" autoComplete="tel" placeholder="(555) 123-4567" required />
        </div>
        <div className="field">
          <label htmlFor={id('message')}>{cfg.messageLabel}</label>
          <textarea id={id('message')} name={cfg.messageKey} rows={cfg.rows} required />
          <p className="help">{cfg.messageHelp}</p>
        </div>
        <button type="submit" className="submit" disabled={busy}>
          {busy ? 'Sending…' : cfg.submitLabel}
        </button>
      </form>
      <div className={`drawer-success${active && done ? ' show' : ''}`} role="status" aria-live="polite">
        <div className="icon" aria-hidden="true">&#10003;</div>
        <h3>{cfg.successTitle}</h3>
        <p>{cfg.successBody}</p>
      </div>
    </>
  );
}

export default function SideTabs() {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [lastPanel, setLastPanel] = useState<Panel>('support');
  const drawerRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((p: Panel, opener: HTMLElement) => {
    openerRef.current = opener;
    setLastPanel(p);
    setPanel(p);
  }, []);
  const close = useCallback(() => {
    setPanel(null);
    openerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!panel) return;
    const t = window.setTimeout(() => {
      drawerRef.current?.querySelector<HTMLInputElement>('.drawer-form.active input')?.focus();
    }, 320);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [panel, close]);

  const isOpen = panel !== null;
  const shown = panel ?? lastPanel;

  return (
    <>
      <div className={`side-tabs${isOpen ? ' drawer-open' : ''}`}>
        <button type="button" className="side-tab" aria-label="Open Support panel" onClick={e => open('support', e.currentTarget)}>
          Support
        </button>
        <button type="button" className="side-tab" aria-label="Open Recommend a feature panel" onClick={e => open('recommend', e.currentTarget)}>
          Recommend
        </button>
      </div>
      <div className={`drawer-backdrop${isOpen ? ' open' : ''}`} aria-hidden="true" onClick={close} />
      <aside
        ref={drawerRef}
        className={`drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawerTitle"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <header className="drawer-head">
          <h2 className="drawer-title" id="drawerTitle">{PANELS[shown].title}</h2>
          <button type="button" className="drawer-close" aria-label="Close panel" onClick={close}>&times;</button>
        </header>
        <div className="drawer-body">
          <DrawerForm panel="support" active={panel === 'support'} />
          <DrawerForm panel="recommend" active={panel === 'recommend'} />
        </div>
      </aside>
    </>
  );
}
