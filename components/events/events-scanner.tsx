'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CameraOff, AlertCircle, CheckCircle } from 'lucide-react';
import { getEventByQRCode } from '@/app/actions/events.actions';
import { toast } from 'sonner';

export function EventsScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleScan = useCallback(async (decodedText: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // Validate QR code format (should be a short code)
      if (!decodedText || decodedText.length < 3) {
        throw new Error('Invalid QR code format');
      }

      // Get event details
      const event = await getEventByQRCode(decodedText);
      
      // Navigate to event gallery
      router.push(`/events/${event.id}`);
      
      toast.success(`Welcome to ${event.title}!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process QR code';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, router]);

  const startScanning = useCallback(async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      
      setHasPermission(true);
      setIsScanning(true);
      setError(null);

      // Initialize scanner
      if (containerRef.current && !scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          false
        );

        scannerRef.current.render(handleScan, (errorMessage) => {
          // Ignore errors during scanning
          console.log('QR Scanner error:', errorMessage);
        });
      }
    } catch (err) {
      setHasPermission(false);
      setError('Camera permission denied. Please allow camera access to scan QR codes.');
    }
  }, [handleScan]);

  const stopScanning = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  if (hasPermission === false) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CameraOff className="h-5 w-5 text-destructive" />
            Camera Access Required
          </CardTitle>
          <CardDescription>
            Camera permission is required to scan QR codes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please allow camera access in your browser settings and try again.
            </AlertDescription>
          </Alert>
          <Button onClick={startScanning} className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isScanning) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Ready to Scan
          </CardTitle>
          <CardDescription>
            Click the button below to start scanning QR codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={startScanning} className="w-full" size="lg">
            <Camera className="h-4 w-4 mr-2" />
            Start Scanner
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          ref={containerRef}
          id="qr-reader"
          className="w-full max-w-md mx-auto rounded-lg overflow-hidden"
        />
        
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="bg-background p-4 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 animate-pulse" />
              <span>Processing...</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={stopScanning} variant="outline" className="flex-1">
          Stop Scanner
        </Button>
        <Button onClick={startScanning} className="flex-1">
          Restart
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Point your camera at a Cursor event QR code</p>
        <p className="mt-1">The scanner will automatically detect and process valid QR codes</p>
      </div>
    </div>
  );
}