'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Normalizes a phone number to E.164 (e.g. +15551234567). Returns null if it is not a valid number. */
function normalizePhone(value: string): string | null {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (trimmed.startsWith('+') && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return null;
}

interface SideTabsProps {
  auditUrl?: string;
}

type Panel = 'support' | 'recommend' | null;

export default function SideTabs({ auditUrl }: SideTabsProps) {
  const [activePanel, setActivePanel] = useState<Panel>(null);

  // Support form state
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);

  // Recommend form state
  const [recommendName, setRecommendName] = useState('');
  const [recommendEmail, setRecommendEmail] = useState('');
  const [recommendPhone, setRecommendPhone] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendSuccess, setRecommendSuccess] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  // Hover states
  const [supportTabHover, setSupportTabHover] = useState(false);
  const [recommendTabHover, setRecommendTabHover] = useState(false);
  const [supportCloseHover, setSupportCloseHover] = useState(false);
  const [supportSubmitHover, setSupportSubmitHover] = useState(false);
  const [recommendCloseHover, setRecommendCloseHover] = useState(false);
  const [recommendSubmitHover, setRecommendSubmitHover] = useState(false);

  const togglePanel = (panel: Panel) => {
    setActivePanel(prev => (prev === panel ? null : panel));
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportError(null);

    if (!isValidEmail(supportEmail)) {
      setSupportError('Please enter a valid email address.');
      return;
    }
    const supportPhoneE164 = normalizePhone(supportPhone);
    if (!supportPhoneE164) {
      setSupportError('Please enter a valid phone number, e.g. (555) 123-4567.');
      return;
    }

    setSupportLoading(true);
    try {
      const res = await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: supportName,
          email: supportEmail.trim(),
          phone: supportPhoneE164,
          message: supportMessage,
          auditUrl,
        }),
      });
      const data = await res.json() as { ok: boolean };
      if (data.ok === false) {
        setSupportError('There was an issue saving your info. Please email support@razorsharpnetworks.com');
        return;
      }
      setSupportSuccess(true);
      window.open('https://support.razorsharpnetworks.com', '_blank', 'noopener noreferrer');
    } catch (err) {
      console.error('Support submit error:', err);
      setSupportError('There was an issue saving your info. Please email support@razorsharpnetworks.com');
    } finally {
      setSupportLoading(false);
    }
  };

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendError(null);

    if (!isValidEmail(recommendEmail)) {
      setRecommendError('Please enter a valid email address.');
      return;
    }
    const recommendPhoneE164 = normalizePhone(recommendPhone);
    if (!recommendPhoneE164) {
      setRecommendError('Please enter a valid phone number, e.g. (555) 123-4567.');
      return;
    }

    setRecommendLoading(true);
    try {
      const res = await fetch('/api/feature-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recommendName,
          email: recommendEmail.trim(),
          phone: recommendPhoneE164,
          recommendation,
          auditUrl,
        }),
      });
      const data = await res.json() as { ok: boolean };
      if (data.ok === false) {
        setRecommendError('There was an issue saving your info. Please email support@razorsharpnetworks.com');
        return;
      }
      setRecommendSuccess(true);
    } catch (err) {
      console.error('Recommend submit error:', err);
      setRecommendError('There was an issue saving your info. Please email support@razorsharpnetworks.com');
    } finally {
      setRecommendLoading(false);
    }
  };

  const supportValid =
    supportName.trim() !== '' &&
    supportEmail.trim() !== '' &&
    supportPhone.trim() !== '' &&
    supportMessage.trim() !== '';

  const recommendValid =
    recommendName.trim() !== '' &&
    recommendEmail.trim() !== '' &&
    recommendPhone.trim() !== '' &&
    recommendation.trim() !== '';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#0E0E1A',
    border: '1px solid rgba(139,63,217,0.3)',
    borderRadius: 4,
    padding: '8px 12px',
    fontSize: 14,
    color: '#F0F0F5',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#87878E',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  };

  return (
    <>
      {/* Tab buttons — fixed on right edge, vertically centered */}
      <div
        style={{
          position: 'fixed',
          right: activePanel ? 360 : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          transition: 'right 0.3s ease',
        }}
      >
        <button
          onClick={() => togglePanel('support')}
          aria-label="Open Support panel"
          onMouseEnter={() => setSupportTabHover(true)}
          onMouseLeave={() => setSupportTabHover(false)}
          style={{
            writingMode: 'vertical-rl',
            width: 42,
            height: 120,
            paddingTop: 12,
            paddingBottom: 12,
            backgroundColor: supportTabHover ? '#8B3FD9' : '#A83AC4',
            color: 'white',
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '0.05em',
            borderRadius: '6px 0 0 6px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease',
          }}
        >
          Support
        </button>
        <button
          onClick={() => togglePanel('recommend')}
          aria-label="Open Recommend panel"
          onMouseEnter={() => setRecommendTabHover(true)}
          onMouseLeave={() => setRecommendTabHover(false)}
          style={{
            writingMode: 'vertical-rl',
            width: 42,
            height: 120,
            paddingTop: 12,
            paddingBottom: 12,
            backgroundColor: recommendTabHover ? '#8B3FD9' : '#A83AC4',
            color: 'white',
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '0.05em',
            borderRadius: '6px 0 0 6px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease',
          }}
        >
          Recommend
        </button>
      </div>

      {/* Sliding panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: 360,
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#101018',
          borderLeft: '1px solid rgba(139,63,217,0.3)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          overflowY: 'auto',
          transform: activePanel ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        {activePanel === 'support' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(139,63,217,0.3)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F0F0F5', margin: 0 }}>Support</h2>
              <button
                onClick={() => setActivePanel(null)}
                aria-label="Close panel"
                onMouseEnter={() => setSupportCloseHover(true)}
                onMouseLeave={() => setSupportCloseHover(false)}
                style={{
                  color: supportCloseHover ? '#F0F0F5' : '#87878E',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  transition: 'color 0.15s ease',
                  padding: 0,
                }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div style={{ flex: 1, padding: '24px' }}>
              {supportSuccess ? (
                <div style={{ textAlign: 'center', paddingTop: 32, paddingBottom: 32 }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>✅</div>
                  <p style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 8 }}>Request submitted!</p>
                  <p style={{ fontSize: 14, color: '#87878E', margin: 0 }}>Opening support portal in a new tab…</p>
                </div>
              ) : (
                <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Name <span style={{ color: '#f87171' }}>*</span></label>
                    <input
                      style={inputStyle}
                      placeholder="Your name"
                      required
                      value={supportName}
                      onChange={e => setSupportName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email <span style={{ color: '#f87171' }}>*</span></label>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="you@example.com"
                      required
                      value={supportEmail}
                      onChange={e => setSupportEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone <span style={{ color: '#f87171' }}>*</span></label>
                    <input
                      type="tel"
                      style={inputStyle}
                      placeholder="(555) 123-4567"
                      required
                      value={supportPhone}
                      onChange={e => setSupportPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Message <span style={{ color: '#f87171' }}>*</span></label>
                    <textarea
                      style={{ ...inputStyle, resize: 'none' }}
                      rows={5}
                      placeholder="Describe your issue or question…"
                      required
                      value={supportMessage}
                      onChange={e => setSupportMessage(e.target.value)}
                    />
                  </div>
                  {supportError && (
                    <p style={{ fontSize: 12, color: '#f87171', textAlign: 'center', margin: 0 }}>{supportError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={supportLoading || !supportValid}
                    onMouseEnter={() => setSupportSubmitHover(true)}
                    onMouseLeave={() => setSupportSubmitHover(false)}
                    style={{
                      width: '100%',
                      backgroundColor: supportSubmitHover && !supportLoading && supportValid ? '#8B3FD9' : '#A83AC4',
                      opacity: supportLoading || !supportValid ? 0.5 : 1,
                      cursor: supportLoading || !supportValid ? 'not-allowed' : 'pointer',
                      color: 'white',
                      fontWeight: 700,
                      padding: '12px',
                      borderRadius: 8,
                      fontSize: 14,
                      border: 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {supportLoading ? 'Submitting…' : 'Submit & Open Support Portal'}
                  </button>
                </form>
              )}
            </div>
          </>
        )}

        {activePanel === 'recommend' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(139,63,217,0.3)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F0F0F5', margin: 0 }}>Recommend a Feature</h2>
              <button
                onClick={() => setActivePanel(null)}
                aria-label="Close panel"
                onMouseEnter={() => setRecommendCloseHover(true)}
                onMouseLeave={() => setRecommendCloseHover(false)}
                style={{
                  color: recommendCloseHover ? '#F0F0F5' : '#87878E',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  transition: 'color 0.15s ease',
                  padding: 0,
                }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div style={{ flex: 1, padding: '24px' }}>
              {recommendSuccess ? (
                <div style={{ textAlign: 'center', paddingTop: 32, paddingBottom: 32 }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>🙏</div>
                  <p style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 8 }}>Thanks for the feedback!</p>
                  <p style={{ fontSize: 14, color: '#87878E', margin: 0 }}>Our AI assistant will follow up with you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleRecommendSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Name <span style={{ color: '#f87171' }}>*</span></label>
                    <input
                      style={inputStyle}
                      placeholder="Your name"
                      required
                      value={recommendName}
                      onChange={e => setRecommendName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email <span style={{ color: '#f87171' }}>*</span></label>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="you@example.com"
                      required
                      value={recommendEmail}
                      onChange={e => setRecommendEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone <span style={{ color: '#f87171' }}>*</span></label>
                    <input
                      type="tel"
                      style={inputStyle}
                      placeholder="(555) 123-4567"
                      required
                      value={recommendPhone}
                      onChange={e => setRecommendPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Feature Request <span style={{ color: '#f87171' }}>*</span></label>
                    <textarea
                      style={{ ...inputStyle, resize: 'none' }}
                      rows={6}
                      placeholder="What feature or improvement would make this tool more valuable to you?"
                      required
                      value={recommendation}
                      onChange={e => setRecommendation(e.target.value)}
                    />
                  </div>
                  {recommendError && (
                    <p style={{ fontSize: 12, color: '#f87171', textAlign: 'center', margin: 0 }}>{recommendError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={recommendLoading || !recommendValid}
                    onMouseEnter={() => setRecommendSubmitHover(true)}
                    onMouseLeave={() => setRecommendSubmitHover(false)}
                    style={{
                      width: '100%',
                      backgroundColor: recommendSubmitHover && !recommendLoading && recommendValid ? '#8B3FD9' : '#A83AC4',
                      opacity: recommendLoading || !recommendValid ? 0.5 : 1,
                      cursor: recommendLoading || !recommendValid ? 'not-allowed' : 'pointer',
                      color: 'white',
                      fontWeight: 700,
                      padding: '12px',
                      borderRadius: 8,
                      fontSize: 14,
                      border: 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {recommendLoading ? 'Submitting…' : 'Submit Recommendation'}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>

      {/* Backdrop when panel is open */}
      {activePanel && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 30, backgroundColor: 'rgba(0,0,0,0.2)' }}
          onClick={() => setActivePanel(null)}
        />
      )}
    </>
  );
}
