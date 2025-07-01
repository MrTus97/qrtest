<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# QR Banking Transfer App

This is a Next.js project with TypeScript and shadcn/ui for QR code banking transactions.

## Project Structure
- Uses Next.js 15 with App Router
- TypeScript for type safety
- shadcn/ui for UI components
- Tailwind CSS for styling
- qr-scanner library for QR code scanning

## Key Features
- QR code scanning using device camera
- Parse Vietnamese banking QR codes (VietQR format)
- Transaction form for amount and message input
- Deeplink generation to open banking apps
- Mobile-first responsive design

## Banking Integration
- Supports major Vietnamese banks
- Generates deeplinks for banking apps
- Handles VietQR standard format
- Bank account number parsing and validation

## Development Guidelines
- Use TypeScript for all components
- Follow React hooks patterns
- Use shadcn/ui components when possible
- Implement responsive design with Tailwind CSS
- Handle camera permissions gracefully
- Provide fallbacks for unsupported browsers
