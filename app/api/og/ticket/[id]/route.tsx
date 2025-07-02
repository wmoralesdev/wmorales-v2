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
            backgroundImage: `linear-gradient(to right, ${ticket.primaryColor}20, ${ticket.secondaryColor}20)`,
          }}
        />

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '60px',
            gap: '60px',
          }}
        >
          {/* Ticket */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: ticket.backgroundColor || '#1f1f23',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              width: '400px',
            }}
          >
            {/* Ticket Header */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                background: `linear-gradient(to right, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                color: 'white',
                position: 'relative',
              }}
            >
              {/* Provider Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {ticket.userProvider}
              </div>

              {/* Avatar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.3)',
                  marginBottom: '16px',
                  fontSize: '32px',
                  fontWeight: 'bold',
                }}
              >
                {ticket.userName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>

              {/* Name */}
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{ticket.userName}</h2>
              <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>{ticket.userEmail}</p>
            </div>

            {/* Ticket Body */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                color: '#e4e4e7',
              }}
            >
              <p style={{ fontSize: '14px', opacity: 0.6, marginBottom: '8px' }}>TICKET ID</p>
              <code
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                }}
              >
                {ticket.ticketNumber}
              </code>
            </div>

            {/* Footer */}
            <div
              style={{
                height: '8px',
                background: `linear-gradient(to right, ${ticket.secondaryColor}, ${ticket.accentColor})`,
              }}
            />
          </div>

          {/* Text Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              color: 'white',
              maxWidth: '400px',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Digital Guestbook
            </h1>
            <p
              style={{
                fontSize: '20px',
                opacity: 0.8,
                margin: 0,
              }}
            >
              Walter Morales Portfolio
            </p>
            {ticket.entry?.mood && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                }}
              >
                <p style={{ fontSize: '16px', opacity: 0.6, marginBottom: '8px' }}>Mood:</p>
                <p style={{ fontSize: '18px', fontStyle: 'italic' }}>"{ticket.entry.mood}"</p>
              </div>
            )}
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
