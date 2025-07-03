import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    console.log('OG: ticket id', id);

    // Fetch ticket data from a regular API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/tickets/${id}`);
    console.log('OG: fetch status', response.status);

    if (!response.ok) {
      console.log('OG: ticket not found');
      return new Response('Ticket not found', { status: 404 });
    }

    const ticket = await response.json();
    console.log('OG: ticket data', ticket);

    // Validate required fields
    if (!(ticket.primaryColor && ticket.userName && ticket.ticketNumber)) {
      console.log('OG: missing required ticket fields');
      return new Response('Invalid ticket data', { status: 400 });
    }

    return new ImageResponse(
      <div tw="flex w-full h-full bg-gray-900 p-16 items-center justify-center">
        {/* Main Ticket */}
        <div
          style={{
            backgroundColor: ticket.backgroundColor || '#1f1f23',
            boxShadow: '0 40px 80px rgba(0, 0, 0, 0.6)',
          }}
          tw="flex flex-col w-full max-w-4xl h-96 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div tw="flex justify-between items-center px-12 py-8">
            {/* Branding */}
            <div tw="flex items-center">
              <div
                style={{
                  background: `linear-gradient(135deg, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                }}
                tw="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4"
              >
                ✨
              </div>
              <div tw="flex flex-col">
                <div tw="text-gray-200 font-bold text-lg tracking-wider uppercase">Walter Morales</div>
                <div tw="text-gray-400 text-sm">Digital Guestbook</div>
              </div>
            </div>

            {/* Provider Badge */}
            <div tw="flex items-center bg-white bg-opacity-10 px-5 py-3 rounded-full">
              <span tw="text-lg mr-2">{ticket.userProvider === 'github' ? '🐙' : '📧'}</span>
              <span tw="text-gray-200 font-semibold text-sm uppercase">{ticket.userProvider}</span>
            </div>
          </div>

          {/* User Section */}
          <div tw="flex items-center px-12 py-4 flex-1">
            {/* Avatar */}
            <div
              style={{
                background: `linear-gradient(135deg, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                boxShadow: `0 0 60px ${ticket.primaryColor}40`,
                border: '4px solid rgba(255, 255, 255, 0.1)',
              }}
              tw="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white mr-8"
            >
              {ticket.userName
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()}
            </div>

            {/* User Info */}
            <div tw="flex flex-col">
              <h1 tw="text-white text-5xl font-bold mb-2">{ticket.userName}</h1>
              <p tw="text-gray-400 text-xl">{ticket.userEmail}</p>
            </div>
          </div>

          {/* Perforated Line */}
          <div
            style={{
              height: '2px',
              borderTop: '2px dashed #3f3f46',
            }}
            tw="mx-12 relative flex"
          >
            {/* Left hole */}
            <div
              style={{
                left: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#0a0a0a',
              }}
              tw="absolute w-6 h-6 rounded-full"
            />
            {/* Right hole */}
            <div
              style={{
                right: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#0a0a0a',
              }}
              tw="absolute w-6 h-6 rounded-full"
            />
          </div>

          {/* Ticket Number Section */}
          <div tw="flex justify-between items-center px-12 py-8">
            <div tw="flex flex-col">
              <div tw="text-gray-400 text-sm uppercase tracking-wider mb-2">Ticket Number</div>
              <div
                style={{
                  background: `linear-gradient(to right, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
                tw="text-4xl font-bold font-mono"
              >
                #{ticket.ticketNumber}
              </div>
            </div>

            {/* Visual Pattern */}
            <div tw="flex">
              {[...new Array(6)].map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: index will stay constant
                  key={`pattern-${i}`}
                  style={{
                    height: `${40 - i * 5}px`,
                    background: `linear-gradient(to bottom, ${ticket.primaryColor}${(100 - i * 15).toString(16)}, transparent)`,
                  }}
                  tw="w-1 rounded-sm mr-1"
                />
              ))}
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('OG: error', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
