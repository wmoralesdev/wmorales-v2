import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Fetch ticket data from a regular API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/tickets/${id}`);

    if (!response.ok) {
      return new Response('Ticket not found', { status: 404 });
    }

    const ticket = await response.json();

    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          position: 'relative',
          padding: '60px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: `linear-gradient(${ticket.primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${ticket.primaryColor} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Main Ticket */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: ticket.backgroundColor || '#1f1f23',
            width: '900px',
            height: '450px',
            overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0, 0, 0, 0.6)',
            position: 'relative',
            // Simulating cut corners with borders
            borderRadius: '40px',
          }}
        >
          {/* Gradient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              right: '-50%',
              bottom: '-50%',
              background: `radial-gradient(circle at 30% 30%, ${ticket.primaryColor}20, transparent 60%)`,
            }}
          />

          {/* Grid Pattern on Ticket */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.03,
              backgroundImage: `linear-gradient(${ticket.primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${ticket.primaryColor} 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '40px 50px 30px',
              }}
            >
              {/* Branding */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}
                >
                  ✨
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#e4e4e7',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Walter Morales
                  </div>
                  <div style={{ fontSize: '12px', color: '#71717a' }}>Digital Guestbook</div>
                </div>
              </div>

              {/* Provider Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '12px 20px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e4e4e7',
                  textTransform: 'uppercase',
                }}
              >
                {ticket.userProvider === 'github' ? '🐙' : '📧'}
                <span>{ticket.userProvider}</span>
              </div>
            </div>

            {/* User Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                padding: '20px 50px',
                flex: 1,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  boxShadow: `0 0 60px ${ticket.primaryColor}40`,
                  border: '4px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {ticket.userName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>

              {/* User Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h1
                  style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {ticket.userName}
                </h1>
                <p style={{ fontSize: '18px', color: '#a1a1aa', margin: 0 }}>{ticket.userEmail}</p>
              </div>
            </div>

            {/* Perforated Line */}
            <div
              style={{
                display: 'flex',
                height: '2px',
                borderTop: '2px dashed #3f3f46',
                margin: '0 50px',
                position: 'relative',
              }}
            >
              {/* Left hole */}
              <div
                style={{
                  position: 'absolute',
                  left: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#0a0a0a',
                }}
              />
              {/* Right hole */}
              <div
                style={{
                  position: 'absolute',
                  right: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#0a0a0a',
                }}
              />
            </div>

            {/* Ticket Number Section */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '30px 50px 40px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#71717a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  Ticket Number
                </div>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    background: `linear-gradient(to right, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  #{ticket.ticketNumber}
                </div>
              </div>

              {/* Visual Pattern */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...new Array(6)].map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: shadcn convention
                    key={`pattern-${i}`}
                    style={{
                      width: '4px',
                      height: `${40 - i * 5}px`,
                      background: `linear-gradient(to bottom, ${ticket.primaryColor}${(100 - i * 15).toString(16)}, transparent)`,
                      borderRadius: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (_error) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
