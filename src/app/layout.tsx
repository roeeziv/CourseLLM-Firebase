import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AuthProviderClient from '@/components/AuthProviderClient';
import AuthRedirector from '@/components/AuthRedirector';

export const metadata: Metadata = {
  title: 'CourseWise',
  description: 'An app that manages university courses in CS to improve learning and teaching.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <AuthProviderClient>
          {children}
          <AuthRedirector />
        </AuthProviderClient>
        <Toaster />
      </body>
    </html>
  );
}
