import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ClientWrapper from "./ClientWrapper.jsx"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Trendlama - Best Clothes",
  description: "Trendlama is the best place to find the best clothes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>
          <div className="mx-auto p-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}