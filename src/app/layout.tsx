import type { Metadata } from "next";
import './fonts.css';
import './globals.css';
import LayoutWrapper from '../theme/LayoutWrapper';

export const metadata: Metadata = {
  title: "SVG based Webcam",
  description: "Joel Holmberg 2026",
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
          overscrollBehaviorY: 'none',
          overscrollBehavior: 'none',
          fontFamily: "'Circular Std', sans-serif",
        }}
      >
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
