'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BankInfo {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

interface TransactionFormProps {
  bankInfo: BankInfo;
  onSubmit: (data: {
    amount: string;
    message: string;
    selectedBank: string;
  }) => void;
  onBack: () => void;
}

const BANKS = [
  { code: 'VCB', name: 'Vietcombank', scheme: 'vietcombank' },
  { code: 'TCB', name: 'Techcombank', scheme: 'techcombank' },
  { code: 'BIDV', name: 'BIDV', scheme: 'bidv' },
  { code: 'VTB', name: 'Vietinbank', scheme: 'vietinbank' },
  { code: 'ACB', name: 'ACB', scheme: 'acb' },
  { code: 'TPB', name: 'TPBank', scheme: 'tpbank' },
  { code: 'MB', name: 'MBBank', scheme: 'mbbank' },
  { code: 'SHB', name: 'SHB', scheme: 'shb' },
  { code: 'VPB', name: 'VPBank', scheme: 'vpbank' },
  { code: 'STB', name: 'Sacombank', scheme: 'sacombank' },
];

export default function TransactionForm({ bankInfo, onSubmit, onBack }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedBank) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    onSubmit({
      amount,
      message,
      selectedBank,
    });
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Thông tin chuyển tiền</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Thông tin người nhận */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Thông tin người nhận</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Số tài khoản:</span> {bankInfo.accountNumber}</p>
              <p><span className="font-medium">Tên tài khoản:</span> {bankInfo.accountName}</p>
              <p><span className="font-medium">Ngân hàng:</span> {bankInfo.bankName}</p>
            </div>
          </div>

          {/* Form nhập thông tin */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Số tiền (VNĐ) *</Label>
              <Input
                id="amount"
                type="text"
                placeholder="Nhập số tiền"
                value={amount}
                onChange={handleAmountChange}
                className="text-lg font-semibold"
              />
            </div>

            <div>
              <Label htmlFor="message">Lời nhắn</Label>
              <Input
                id="message"
                type="text"
                placeholder="Nhập lời nhắn (tùy chọn)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="bank">Chọn ngân hàng để mở app *</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngân hàng" />
                </SelectTrigger>
                <SelectContent>
                  {BANKS.map((bank) => (
                    <SelectItem key={bank.code} value={bank.scheme}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Quay lại
              </Button>
              <Button type="submit" className="flex-1">
                Chuyển tiền
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
