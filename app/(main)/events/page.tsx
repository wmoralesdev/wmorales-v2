import { Suspense } from 'react';
import { Metadata } from 'next';
import { EventsScanner } from '@/components/events/events-scanner';
import { EventsList } from '@/components/events/events-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, QrCode, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Events - QR Code Scanner',
  description: 'Scan QR codes to access Cursor event galleries and upload your photos',
};

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground mt-2">
          Scan QR codes to access event galleries and share your photos
        </p>
      </div>

      <Tabs defaultValue="scanner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Scan QR Code
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Active Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>
                Point your camera at a Cursor event QR code to access the photo gallery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading scanner...</div>}>
                <EventsScanner />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Events
              </CardTitle>
              <CardDescription>
                Browse and join active Cursor events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading events...</div>}>
                <EventsList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}