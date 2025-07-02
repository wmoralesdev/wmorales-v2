export type TicketData = {
  id: string;
  ticketNumber: string;
  userName: string;
  userEmail: string;
  userAvatar: string | null;
  userProvider: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  createdAt: Date;
  entry: {
    message: string | null;
    mood: string | null;
  };
};
