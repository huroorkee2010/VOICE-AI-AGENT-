import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'HUVOICE AI - Voice Assistant',
  description: 'Production-ready real-time HUVOICE AI voice agent built with Next.js, OpenAI, and ElevenLabs',
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
