import { type NextRequest, NextResponse } from 'next/server';
import { getTicketById } from '@/app/actions/guestbook.actions';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const ticket = await getTicketById(id);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      userName: ticket.userName,
      userEmail: ticket.userEmail,
      userAvatar: ticket.userAvatar,
      userProvider: ticket.userProvider,
      primaryColor: ticket.primaryColor,
      secondaryColor: ticket.secondaryColor,
      accentColor: ticket.accentColor,
      backgroundColor: ticket.backgroundColor,
      createdAt: ticket.createdAt,
      entry: ticket.entry,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
