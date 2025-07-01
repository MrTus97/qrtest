'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRScanner from '@/components/QRScanner';
import TransactionForm from '@/components/TransactionForm';
import { parseQRCode, generateBankDeeplink, openBankingApp, BankInfo } from '@/lib/banking';

type AppState = 'home' | 'scanning' | 'form' | 'success';

export default function Home() {
  const [state, setState] = useState<AppState>('home');
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);

  const handleStartScan = () => {
    setState('scanning');
  };

  const handleScanSuccess = (qrData: string) => {
    console.log('QR Data:', qrData);
    
    const parsedBankInfo = parseQRCode(qrData);
    
    if (parsedBankInfo) {
      setBankInfo(parsedBankInfo);
      setState('form');
    } else {
      alert('Không thể đọc thông tin từ mã QR. Vui lòng thử lại.');
      setState('home');
    }
  };

  const handleScanClose = () => {
    setState('home');
  };

  const handleFormSubmit = (data: {
    amount: string;
    message: string;
    selectedBank: string;
  }) => {
    if (!bankInfo) return;

    const deeplink = generateBankDeeplink(
      data.selectedBank,
      bankInfo.accountNumber,
      data.amount,
      data.message,
      bankInfo.accountName
    );

    console.log('Generated deeplink:', deeplink);
    
    openBankingApp(deeplink);
    setState('success');
  };

  const handleFormBack = () => {
    setState('home');
  };

  const handleCreateNewTransaction = () => {
    setBankInfo(null);
    setState('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Home Screen */}
      {state === 'home' && (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                QR Banking Transfer
              </CardTitle>
              <p className="text-gray-600">
                Quét mã QR để chuyển tiền nhanh chóng
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Bắt đầu giao dịch</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Nhấn nút bên dưới để mở camera và quét mã QR ngân hàng
                </p>
              </div>

              <Button
                onClick={handleStartScan}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                📷 Quét mã QR
              </Button>

              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>• Hỗ trợ mã QR VietQR và các ngân hàng Việt Nam</p>
                <p>• Tự động mở app ngân hàng để thực hiện giao dịch</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* QR Scanner */}
      {state === 'scanning' && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={handleScanClose}
        />
      )}

      {/* Transaction Form */}
      {state === 'form' && bankInfo && (
        <TransactionForm
          bankInfo={bankInfo}
          onSubmit={handleFormSubmit}
          onBack={handleFormBack}
        />
      )}

      {/* Success Screen */}
      {state === 'success' && (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hoàn tất!</h3>
              <p className="text-gray-600 mb-6">
                App ngân hàng đã được mở. Vui lòng hoàn tất giao dịch trên app.
              </p>
              <Button
                onClick={handleCreateNewTransaction}
                className="w-full"
              >
                Tạo giao dịch mới
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
