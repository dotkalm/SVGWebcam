import type { Metadata } from "next";
import './fonts.css';
import './globals.css';

export const metadata: Metadata = {
  title: "edge detector",
  description: "lets detect edges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          backgroundColor: 'darkblue',
          overscrollBehaviorY: 'none',
          overscrollBehavior: 'none',
          overflowY: 'auto',
        }}
      >
        {children}
      </body>
    </html>
  );
}
