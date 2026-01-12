import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavbar from "@/components/subComponents/BottomNavbar";
import Footer from "@/components/subComponents/Footer";
import Navbar from "@/components/subComponents/Navbar";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Glorious |  The Future of Modern Ecommerce",
    template: "%s | Glorious",
  }, verification: {
    google: 'jZ4aeJNCT2plYEnEoxDpPEC7Qs0esECfkblK677Zbs8',
  },
  description:
    "Shop the latest trends at Glorious. We bring you a seamless, fast, and secure shopping experience with handpicked items that define modern living. Upgrade your lifestyle today.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`selection:bg-primary selection:text-background   ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Navbar />

          {children}
          <Footer />
          <BottomNavbar />
          <Toaster />
      </body>
    </html>
  );
}
