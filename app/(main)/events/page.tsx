import { Camera, QrCode, Sparkles, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { EventsList } from '@/components/events/events-list';
import { EventsScanner } from '@/components/events/events-scanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Events - QR Code Scanner',
  description: 'Scan QR codes to access Cursor event galleries and upload your photos',
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text font-bold text-4xl text-transparent tracking-tight sm:text-5xl">
            Events
          </h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Scan QR codes to access event galleries and share your photos
          </p>
        </div>

        <Tabs className="space-y-6" defaultValue="scanner">
          <TabsList className="grid w-full grid-cols-2 border border-gray-800 bg-gray-900/80 backdrop-blur-xl">
            <TabsTrigger
              className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
              value="scanner"
            >
              <QrCode className="h-4 w-4" />
              Scan QR Code
            </TabsTrigger>
            <TabsTrigger
              className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
              value="events"
            >
              <Users className="h-4 w-4" />
              Active Events
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-6" value="scanner">
            <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Camera className="h-5 w-5 text-purple-400" />
                  QR Code Scanner
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Point your camera at a Cursor event QR code to access the photo gallery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="flex h-64 items-center justify-center">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Sparkles className="h-5 w-5 animate-pulse text-purple-400" />
                        Loading scanner...
                      </div>
                    </div>
                  }
                >
                  <EventsScanner />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent className="space-y-6" value="events">
            <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-purple-400" />
                  Active Events
                </CardTitle>
                <CardDescription className="text-gray-400">Browse and join active Cursor events</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="flex h-64 items-center justify-center">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Sparkles className="h-5 w-5 animate-pulse text-purple-400" />
                        Loading events...
                      </div>
                    </div>
                  }
                >
                  <EventsList />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
