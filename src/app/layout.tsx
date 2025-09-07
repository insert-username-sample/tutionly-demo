import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from '@/contexts/ThemeContext';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Tuitionly - Because Every Student Learns Differently",
  description: "AI-powered personalized tutoring that adapts to your unique learning style, memory type, and pace. Get step-by-step solutions and interactive lessons.",
  keywords: "AI tutoring, personalized learning, online education, homework help, adaptive learning",
  authors: [{ name: "Tuitionly" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
