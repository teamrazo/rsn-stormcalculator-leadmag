import Image from 'next/image';

// RSN canonical footer. Source of truth: lever-portal js/shell.js footer()
// (portal.gitlever.ai). Links, copy and order match that file; styles live
// in src/app/side-tabs.css under "Standard Footer".

const FOOT_LINKS: [string, string][] = [
  ['https://support.razorsharpnetworks.com/knowledge-base', 'Help Center'],
  ['https://support.razorsharpnetworks.com/pricing', 'Pricing'],
  ['https://partner.razorsharpnetworks.com', 'Partner Program'],
];

const FOOT_LEGAL: [string, string][] = [
  ['https://www.razorsharpnetworks.com/master-service-agreement-2/', 'Master Service Agreement'],
  ['https://www.razorsharpnetworks.com/accessibility-statement/', 'Accessibility'],
  ['https://www.razorsharpnetworks.com/acceptable-use-policy/', 'Acceptable Use'],
  ['https://www.razorsharpnetworks.com/privacy-policy/', 'Privacy Policy'],
  ['https://www.razorsharpnetworks.com/cookie-policy/', 'Cookie Policy'],
];

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function Footer() {
  return (
    <footer className="rsn-footer">
      <div className="foot-stack">
        <Image src="/rsn-logo-full.png" alt="RazoRSharp Networks" width={138} height={28} className="foot-logo" />
        <div className="foot-links">
          {FOOT_LINKS.map(([href, label]) => <a key={href} href={href} {...ext}>{label}</a>)}
        </div>
        <div className="foot-built">
          Built using:{' '}
          <a href="https://pillar.razorsharpnetworks.com/webassetfx-smart-sites" {...ext}>WebAssetFX</a>
          <span style={{ margin: '0 4px' }}>&amp;</span>
          <a href="https://gitlever.ai" {...ext}>LEVER AI</a>
        </div>
        <div className="foot-copy">&copy; 2026 &bull; Legacy Media LLC DBA RazoRSharp Networks &bull; All Rights Reserved.</div>
        <div className="foot-legal-links">
          {FOOT_LEGAL.map(([href, label]) => <a key={href} href={href} {...ext}>{label}</a>)}
        </div>
      </div>
    </footer>
  );
}
