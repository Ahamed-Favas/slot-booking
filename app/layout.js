import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Slot booking App",
  description: "Developed by Ahamed Favas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
      {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
