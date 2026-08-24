import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store/app-context';
import Header from '@/components/navigation/Header';
import BottomNav from '@/components/navigation/BottomNav';
import RestTimer from '@/components/workouts/RestTimer';

export const metadata: Metadata = {
  title: 'IRONPULSE - Suivi Musculation, Nutrition & Prépa Hyrox 2027',
  description: 'Application mobile-first de suivi de musculation avec surcharge progressive, calcul métabolisme/TDEE et préparation aux 8 stations Hyrox 2027.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'IRONPULSE',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#090b10',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-[#090b10] text-slate-100 min-h-screen antialiased flex flex-col selection:bg-amber-400 selection:text-black">
        <AppProvider>
          <Header />
          <main className="flex-1 max-w-lg w-full mx-auto px-4 py-4 mb-20">
            {children}
          </main>
          <RestTimer />
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
