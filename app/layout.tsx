import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
import QueryProvider from '@/components/query-provider';
import { EmailProvider } from '@/lib/contex/EmailContex';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yodimdasiz - Marhumlarni eslash',
  description: 'Marhumlarni eslash va duolar qilish uchun platforma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        ><EmailProvider>
           <QueryProvider>
            <Header />
            {children}
            <Toaster />
          </QueryProvider>
        </EmailProvider>
         
        </ThemeProvider>
      </body>
    </html>
  );
}