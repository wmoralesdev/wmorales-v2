'use client';

import { motion } from 'framer-motion';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getEventByQRCode } from '@/app/actions/events.actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function EventsScanner() {
  const t = useTranslations('events');
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleScan = useCallback(
    async (decodedText: string) => {
      if (isProcessing) {
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Validate QR code format (should be a short code)
        if (!decodedText || decodedText.length < 3) {
          throw new Error(t('invalidQRCode'));
        }

        // Get event details
        const event = await getEventByQRCode(decodedText);

        // Navigate to event gallery
        router.push(`/events/${event.id}`);

        toast.success(t('welcomeToEvent', { title: event.content[0].title }));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t('qrProcessError');
        setError(message);
        toast.error(message);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, router, t]
  );

  const startScanning = useCallback(async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      for (const track of stream.getTracks()) {
        track.stop(); // Stop the stream immediately
      }

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

        scannerRef.current.render(handleScan, () => {
          // Ignore errors during scanning
        });
      }
    } catch {
      setHasPermission(false);
      setError(t('cameraPermissionDenied'));
    }
  }, [handleScan, t]);

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
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-gray-800 bg-gray-900/80 backdrop-blur-xl">
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
            <Alert className="border-red-500/30 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                Please allow camera access in your browser settings and try
                again.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25"
              onClick={startScanning}
            >
              <Camera className="mr-2 h-4 w-4" />
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
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-gray-800 bg-gray-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Camera className="h-5 w-5 text-purple-400" />
              Ready to Scan
              <Sparkles className="h-4 w-4 animate-pulse text-purple-400" />
            </CardTitle>
            <CardDescription className="text-gray-400">
              Click the button below to start scanning QR codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25"
              onClick={startScanning}
              size="lg"
            >
              <Camera className="mr-2 h-4 w-4" />
              {t('startScanner')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div
          className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20"
          id="qr-reader"
          ref={containerRef}
        />

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/70 backdrop-blur-sm">
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 rounded-xl border border-purple-500/30 bg-gray-900/90 p-6 backdrop-blur-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className="h-6 w-6 animate-pulse text-green-400" />
              <span className="font-medium text-white">{t('processing')}</span>
            </motion.div>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Alert className="border-red-500/30 bg-red-500/10 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="flex gap-2">
        <Button
          className="flex-1 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50 hover:text-white"
          onClick={stopScanning}
          variant="outline"
        >
          {t('stopScanner')}
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25"
          onClick={startScanning}
        >
          {t('restart')}
        </Button>
      </div>

      <div className="text-center text-sm">
        <p className="text-gray-400">{t('scanDescription')}</p>
        <p className="mt-1 text-gray-500">{t('automaticDetection')}</p>
      </div>
    </motion.div>
  );
}
