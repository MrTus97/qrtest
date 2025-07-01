# QR Banking Transfer App

Ứng dụng chuyển tiền ngân hàng thông qua quét mã QR, được xây dựng với Next.js, TypeScript và shadcn/ui.

## Tính năng chính

- 📱 **Quét mã QR**: Sử dụng camera điện thoại để quét mã QR ngân hàng
- 🏦 **Hỗ trợ VietQR**: Đọc và phân tích mã QR theo chuẩn VietQR
- 💰 **Nhập thông tin giao dịch**: Form để nhập số tiền và lời nhắn
- 🔗 **Deeplink ngân hàng**: Tự động mở app ngân hàng với thông tin đã điền sẵn
- 📱 **Responsive Design**: Tối ưu cho thiết bị di động

## Ngân hàng được hỗ trợ

- Vietcombank (VCB)
- Techcombank (TCB)
- BIDV
- Vietinbank (VTB)
- ACB
- TPBank (TPB)
- MBBank (MB)
- SHB
- VPBank (VPB)
- Sacombank (STB)

## Công nghệ sử dụng

- **Framework**: Next.js 15 với App Router
- **Language**: TypeScript
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **QR Scanner**: qr-scanner library
- **Build Tool**: npm

## Cài đặt và chạy

1. **Clone project hoặc tạo mới**:

   ```bash
   npx create-next-app@latest qr-banking-app --typescript --tailwind --eslint --app --src-dir
   cd qr-banking-app
   ```

2. **Cài đặt dependencies**:

   ```bash
   npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
   npm install qr-scanner @zxing/library --legacy-peer-deps
   ```

3. **Cài đặt shadcn/ui components**:

   ```bash
   npx shadcn@latest add button card input label select dialog
   ```

4. **Chạy development server**:

   ```bash
   npm run dev
   ```

5. **Mở trình duyệt**: <http://localhost:3000>

## Cách sử dụng

1. **Bắt đầu giao dịch**: Nhấn nút "Quét mã QR" trên màn hình chính
2. **Quét mã QR**: Cho phép truy cập camera và quét mã QR ngân hàng
3. **Nhập thông tin**: Điền số tiền, lời nhắn và chọn ngân hàng
4. **Chuyển tiền**: Nhấn "Chuyển tiền" để mở app ngân hàng

## Cấu trúc project

```
src/
├── app/
│   ├── page.tsx              # Trang chính
│   ├── layout.tsx            # Layout chung
│   └── globals.css           # CSS toàn cục
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── QRScanner.tsx         # Component quét QR
│   └── TransactionForm.tsx   # Form giao dịch
└── lib/
    ├── utils.ts              # Utility functions
    └── banking.ts            # Logic xử lý ngân hàng
```

## API và Deeplink

Ứng dụng sử dụng deeplink để mở các app ngân hàng:

- **Vietcombank**: `vcbdigibank://transfer`
- **Techcombank**: `techcombank://transfer`
- **BIDV**: `bidvsmart://transfer`
- **Vietinbank**: `vietinbank://transfer`
- **ACB**: `acbapp://transfer`

## Lưu ý

- Cần cấp quyền truy cập camera để quét QR
- Deeplink chỉ hoạt động khi đã cài đặt app ngân hàng tương ứng
- Hỗ trợ định dạng VietQR chuẩn
- Tối ưu cho thiết bị di động

## Development

Để phát triển thêm tính năng:

1. **Thêm ngân hàng mới**: Cập nhật `BANKS` array trong `TransactionForm.tsx`
2. **Cải thiện QR parsing**: Sửa đổi `parseQRCode` function trong `banking.ts`
3. **Thêm deeplink**: Cập nhật `generateBankDeeplink` function

## License

MIT License
