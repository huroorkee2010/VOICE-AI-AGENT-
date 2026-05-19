import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jarvis AI - Voice Assistant',
  description: 'Production-ready real-time Voice AI Agent using Next.js, OpenAI, and ElevenLabs',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-950 text-white antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
