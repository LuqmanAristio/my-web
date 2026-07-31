import { ImageResponse } from 'next/og'

// Social-share card generated at build time — no image asset required.
export const alt = 'Muhammad Luqman Aristio — Full Stack Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#0d0f14'
const ACCENT = '#34d3c0'
const FG = '#fafafa'
const MUTED = '#9aa0aa'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          backgroundImage: `radial-gradient(1200px 600px at 85% 15%, rgba(52,211,192,0.14), transparent 60%)`,
          padding: '72px 80px',
          color: FG,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: availability */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: `1px solid rgba(52,211,192,0.4)`,
              borderRadius: 999,
              padding: '10px 20px',
              color: ACCENT,
              fontSize: 24,
              letterSpacing: 2,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: ACCENT,
              }}
            />
            AVAILABLE FOR WORK
          </div>
        </div>

        {/* Middle: name + role */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Muhammad Luqman
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: ACCENT,
            }}
          >
            Aristio.
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 32,
              letterSpacing: 8,
              color: MUTED,
            }}
          >
            FULL STACK DEVELOPER
          </div>
        </div>

        {/* Bottom: meta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 26,
            color: MUTED,
          }}
        >
          <div style={{ display: 'flex' }}>Based in Bali, Indonesia</div>
          <div style={{ display: 'flex', color: FG }}>itsluqman.com</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
