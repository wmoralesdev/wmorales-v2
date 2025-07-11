'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CameraOff, AlertCircle, CheckCircle, Sparkles, QrCode } from 'lucide-react';
import { getEventByQRCode } from '@/app/actions/events.actions';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CameraOff className="h-5 w-5 text-red-400" />
              Camera Access Required
            </CardTitle>
            <CardDescription className="text-gray-400">
              Camera permission is required to scan QR codes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                Please allow camera access in your browser settings and try again.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={startScanning} 
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <Camera className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!isScanning) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Camera className="h-5 w-5 text-purple-400" />
              Ready to Scan
              <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            </CardTitle>
            <CardDescription className="text-gray-400">
              Click the button below to start scanning QR codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={startScanning} 
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300" 
              size="lg"
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Scanner
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div 
          ref={containerRef}
          id="qr-reader"
          className="w-full max-w-md mx-auto rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20"
        />
        
        {isProcessing && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <motion.div 
              className="bg-gray-900/90 backdrop-blur-xl border border-purple-500/30 p-6 rounded-xl flex items-center gap-3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className="h-6 w-6 text-green-400 animate-pulse" />
              <span className="text-white font-medium">Processing...</span>
            </motion.div>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Alert className="bg-red-500/10 border-red-500/30 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="flex gap-2">
        <Button 
          onClick={stopScanning} 
          variant="outline" 
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-gray-600"
        >
          Stop Scanner
        </Button>
        <Button 
          onClick={startScanning} 
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          Restart
        </Button>
      </div>

      <div className="text-center text-sm">
        <p className="text-gray-400">Point your camera at a Cursor event QR code</p>
        <p className="mt-1 text-gray-500">The scanner will automatically detect and process valid QR codes</p>
      </div>
    </motion.div>
  );
}