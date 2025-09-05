import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
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
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💎</text></svg>',
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
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
