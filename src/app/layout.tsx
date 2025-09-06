
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Spline_Sans } from 'next/font/google'

const splineSans = Spline_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-spline-sans',
})
 

export const metadata: Metadata = {
  title: 'Diploma Prep Hub',
  description: 'Your AI-Powered Partner for Diploma and Government Exams',
  icons: {
    icon: '/images/favlogo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${splineSans.variable} h-full`} suppressHydrationWarning>
      <body className="font-body antialiased bg-[#111714] text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
