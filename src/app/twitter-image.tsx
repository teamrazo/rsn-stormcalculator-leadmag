import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Storm Revenue Recovery Calculator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A24 50%, #0A0A0F 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '40px',
        }}>
          <div style={{
            fontSize: '48px',
          }}>⚡</div>
          <div style={{
            fontSize: '24px',
            color: '#A83AC4',
            fontWeight: 600,
          }}>RazoRSharp Networks</div>
        </div>
        <div style={{
          fontSize: '52px',
          fontWeight: 800,
          color: '#F2F2F2',
          textAlign: 'center',
          lineHeight: 1.2,
          marginBottom: '24px',
        }}>Storm Revenue Recovery Calculator</div>
        <div style={{
          fontSize: '28px',
          color: '#F59E0B',
          fontWeight: 700,
          marginBottom: '20px',
        }}>How Much Are You Leaving on the Table?</div>
        <div style={{
          fontSize: '20px',
          color: '#87878E',
          textAlign: 'center',
        }}>6 questions · 90 seconds · See your exact revenue gap</div>
      </div>
    ),
    { ...size }
  );
}
