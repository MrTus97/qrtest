'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { parseVietQR } from '@/lib/vietqr';
import { useState as useCopyState } from 'react';

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [error, setError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [debugRaw, setDebugRaw] = useState<string | null>(null);
  const [debugParsed, setDebugParsed] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !videoRef.current) return;

    // Kiểm tra hỗ trợ camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Trình duyệt của bạn không hỗ trợ truy cập camera. Vui lòng sử dụng trình duyệt khác.');
      return;
    }


    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        // Debug: show raw and parsed info
        setDebugRaw(result.data);
        const parsed = parseVietQR(result.data);
        setDebugParsed(parsed);
        // In ra console để debug thực tế
        console.log('QR RAW:', result.data);
        console.log('QR PARSED:', parsed);
        if (parsed.accountNumber && parsed.bankCode) {
          onScanSuccess(JSON.stringify(parsed));
        } else {
          setError('Không nhận diện được mã QR ngân hàng Việt Nam hợp lệ. Vui lòng thử lại.');
        }
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
      if (error && error.name === 'NotAllowedError') {
        setError('Bạn đã từ chối quyền truy cập camera. Vui lòng cho phép quyền camera trong trình duyệt.');
      } else if (error && error.name === 'NotFoundError') {
        setError('Không tìm thấy thiết bị camera. Vui lòng kiểm tra lại thiết bị.');
      } else if (window.isSecureContext === false) {
        setError('Truy cập camera chỉ hoạt động trên HTTPS hoặc localhost. Vui lòng kiểm tra lại đường dẫn.');
      } else {
        setError('Không thể truy cập camera. Vui lòng kiểm tra lại quyền hoặc thiết bị.');
      }
    });

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [isClient, onScanSuccess]);

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
            <div className="text-red-500 text-center p-4 whitespace-pre-line">
              {error}
              <div className="mt-2 text-xs text-gray-400">
                Nếu bạn đã cho phép quyền camera mà vẫn không hoạt động, hãy thử tải lại trang hoặc kiểm tra lại kết nối HTTPS/localhost.
              </div>
            </div>
          ) : (
            isClient && (
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
            )
          )}
          <p className="text-sm text-gray-600 text-center mt-4">
            Đưa mã QR vào khung để quét
          </p>

          {/* Debug info */}
          {debugRaw && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs break-all">
              <div className="font-semibold mb-1">Chuỗi QR gốc:</div>
              <textarea
                className="w-full bg-gray-200 rounded p-1 mb-2"
                value={debugRaw}
                readOnly
                rows={3}
                onFocus={e => e.target.select()}
              />
              <div className="font-semibold mb-1">Kết quả parse:</div>
              <textarea
                className="w-full bg-gray-200 rounded p-1"
                value={JSON.stringify(debugParsed, null, 2)}
                readOnly
                rows={5}
                onFocus={e => e.target.select()}
              />
              <div className="text-xs text-gray-500 mt-1">Bạn có thể copy 2 vùng trên và gửi lại cho tôi để debug chính xác.</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
