import { Poppins, Racing_Sans_One } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ReduxProvider from "@/provider/ReduxProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const racingSansOne = Racing_Sans_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-racing",
});

export const metadata = {
  title: "Yourserviceapp",
  description: "Find the best service at Yourserviceapp",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} ${racingSansOne.variable} bg-gray-100`}
      >
        <Toaster position="bottom-right" richColors />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
