export interface BankInfo {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

// Parse QR code data to extract bank information
export function parseQRCode(qrData: string): BankInfo | null {
  try {
    // VietQR format: https://api.vietqr.io/v2/banks
    // Example: 970415|123456789|NGUYEN VAN A|VietQR|...
    
    if (qrData.includes('|')) {
      const parts = qrData.split('|');
      if (parts.length >= 3) {
        const bankCode = parts[0];
        const accountNumber = parts[1];
        const accountName = parts[2];
        
        return {
          accountNumber,
          accountName,
          bankCode,
          bankName: getBankName(bankCode),
        };
      }
    }
    
    // Try JSON format
    const jsonData = JSON.parse(qrData);
    if (jsonData.accountNumber && jsonData.accountName) {
      return {
        accountNumber: jsonData.accountNumber,
        accountName: jsonData.accountName,
        bankCode: jsonData.bankCode || '',
        bankName: jsonData.bankName || getBankName(jsonData.bankCode),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
}

// Get bank name from bank code
function getBankName(bankCode: string): string {
  const bankNames: { [key: string]: string } = {
    '970415': 'Vietinbank',
    '970436': 'Vietcombank',
    '970418': 'BIDV',
    '970407': 'Techcombank',
    '970422': 'MBBank',
    '970432': 'VPBank',
    '970423': 'TPBank',
    '970443': 'SHB',
    '970405': 'Agribank',
    '970403': 'Sacombank',
    '970448': 'OCB',
    // Add more bank codes as needed
  };
  
  return bankNames[bankCode] || 'Ngân hàng khác';
}

// Generate deeplink for banking apps
export function generateBankDeeplink(
  bankScheme: string,
  accountNumber: string,
  amount: string,
  message: string,
  accountName: string
): string {
  const amountNumber = amount.replace(/,/g, '');
  
  // Generic deeplink format for Vietnamese banks
  // Most banks support these parameters
  const params = new URLSearchParams({
    account: accountNumber,
    amount: amountNumber,
    content: message,
    beneficiary: accountName,
  });
  
  // Bank-specific deeplink formats
  switch (bankScheme) {
    case 'vietcombank':
      return `vcbdigibank://transfer?${params.toString()}`;
    
    case 'techcombank':
      return `techcombank://transfer?${params.toString()}`;
    
    case 'bidv':
      return `bidvsmart://transfer?${params.toString()}`;
    
    case 'vietinbank':
      return `vietinbank://transfer?${params.toString()}`;
    
    case 'acb':
      return `acbapp://transfer?${params.toString()}`;
    
    case 'tpbank':
      return `tpbank://transfer?${params.toString()}`;
    
    case 'mbbank':
      return `mbbank://transfer?${params.toString()}`;
    
    case 'shb':
      return `shb://transfer?${params.toString()}`;
    
    case 'vpbank':
      return `vpbank://transfer?${params.toString()}`;
    
    case 'sacombank':
      return `sacombank://transfer?${params.toString()}`;
    
    default:
      // Fallback to generic format
      return `${bankScheme}://transfer?${params.toString()}`;
  }
}

// Open banking app with deeplink
export function openBankingApp(deeplink: string): void {
  try {
    // For mobile devices
    if (typeof window !== 'undefined') {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = deeplink;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Try to open the deeplink
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
      // Fallback: show instructions if app doesn't open
      setTimeout(() => {
        if (confirm('Không thể mở app ngân hàng tự động. Bạn có muốn sao chép thông tin?')) {
          // Here you could show a modal with transfer details
          console.log('Deeplink:', deeplink);
        }
      }, 2000);
    }
  } catch (error) {
    console.error('Error opening banking app:', error);
    alert('Không thể mở app ngân hàng. Vui lòng mở app thủ công và nhập thông tin chuyển tiền.');
  }
}
