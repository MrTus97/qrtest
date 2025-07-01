'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        console.log('QR Code detected:', result.data);
        onScanSuccess(result.data);
        scanner.stop();
      },
      {
        onDecodeError: (error) => {
          console.log('Decode error:', error);
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scannerRef.current = scanner;

    scanner.start().catch((error) => {
      console.error('Failed to start camera:', error);
      setError('Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.');
    });

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [onScanSuccess]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Quét mã QR ngân hàng</h2>
            <Button variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          </div>
          
          {error ? (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover rounded-lg"
                playsInline
                muted
              />
              <div className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none">
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-blue-500"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-blue-500"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-blue-500"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-600 text-center mt-4">
            Đưa mã QR vào khung để quét
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
