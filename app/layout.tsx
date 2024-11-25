import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Innovate. Lead. Succeed.",
  description: "Welcome to Syed's website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='flex flex-col bg-diff'>
        <Navbar />

        <div className='flex flex-col min-h-screen'>{children}</div>

        <Footer />
      </body>
    </html>
  );
}
