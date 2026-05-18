import { Fragment } from 'react';
import Image from 'next/image';

type FooterLink = { label: string; href: string };

const NAV_LINKS: FooterLink[] = [
  { label: 'Help Center', href: 'https://support.razorsharpnetworks.com/knowledge-base' },
  { label: 'Get TimeBACK', href: 'https://freeaudit.razorsharpnetworks.com' },
  { label: 'Partner Program', href: 'https://partner.razorsharpnetworks.com/' },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Master Service Agreement', href: 'https://www.razorsharpnetworks.com/master-service-agreement-2/' },
  { label: 'Accessibility', href: 'https://www.razorsharpnetworks.com/accessibility-statement/' },
  { label: 'Acceptable Use', href: 'https://www.razorsharpnetworks.com/acceptable-use-policy/' },
  { label: 'Privacy Policy', href: 'https://www.razorsharpnetworks.com/privacy-policy/' },
  { label: 'Cookie Policy', href: 'https://www.razorsharpnetworks.com/cookie-policy/' },
];

const dotStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.2)', userSelect: 'none' };

function LinkRow({ links }: { links: FooterLink[] }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', columnGap: 12, rowGap: 4 }}>
      {links.map((link, i) => (
        <Fragment key={link.href}>
          {i > 0 && <span style={dotStyle}>·</span>}
          <a className="footer-link" href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        </Fragment>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ marginTop: 96, paddingTop: 48, paddingBottom: 32, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#0A0A0F', fontSize: 13, lineHeight: 1.4 }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image src="/rsn-logo-wide.png" alt="RazoRSharp Networks" width={138} height={28} style={{ opacity: 0.85 }} />
        </div>
        <LinkRow links={NAV_LINKS} />
        <div style={{ color: '#87878E' }}>
          Built using{' '}
          <a className="footer-link" href="https://pillar.razorsharpnetworks.com/webassetfx-smart-sites" target="_blank" rel="noopener noreferrer">
            WebAssetFX
          </a>
          <span style={{ ...dotStyle, margin: '0 4px' }}>·</span>
          <a className="footer-link" href="https://pillar.razorsharpnetworks.com/" target="_blank" rel="noopener noreferrer">
            AutoMATE™ AI Technology
          </a>
        </div>
        <div style={{ color: '#87878E' }}>
          © 2026
          <span style={{ ...dotStyle, margin: '0 8px' }}>·</span>
          Legacy Media LLC DBA RazoRSharp Networks
          <span style={{ ...dotStyle, margin: '0 8px' }}>·</span>
          All Rights Reserved
        </div>
        <LinkRow links={LEGAL_LINKS} />
      </div>
    </footer>
  );
}
