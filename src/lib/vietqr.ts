// Simple VietQR parser for Vietnamese banking QR codes (EMVCo/VietQR)
// Supports extracting bank code, account number, account name, amount, message

export interface VietQRData {
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  amount?: string;
  message?: string;
  raw: string;
}

// EMVCo TLV parser
function parseTLV(data: string): Record<string, string> {
  let i = 0;
  const result: Record<string, string> = {};
  while (i < data.length - 4) {
    const tag = data.slice(i, i + 2);
    const len = parseInt(data.slice(i + 2, i + 4), 10);
    const value = data.slice(i + 4, i + 4 + len);
    result[tag] = value;
    i += 4 + len;
  }
  return result;
}

export function parseVietQR(raw: string): VietQRData {
  // EMVCo root
  const tlv = parseTLV(raw);
  // Bank info is in tag 38 (VietQR)
  let bankCode, accountNumber, accountName, amount, message;
  if (tlv['38']) {
    const vietqr = parseTLV(tlv['38']);
    bankCode = vietqr['00'];
    accountNumber = vietqr['01'];
    accountName = vietqr['02'];
  }
  if (tlv['54']) amount = tlv['54'];
  if (tlv['62']) {
    const addData = parseTLV(tlv['62']);
    if (addData['08']) message = addData['08'];
  }
  return {
    bankCode,
    accountNumber,
    accountName,
    amount,
    message,
    raw,
  };
}
