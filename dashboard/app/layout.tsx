import "./globals.css";
import localFont from "next/font/local";
import Providers from "./providers";
import Footer from "./footer";

const inter = localFont({
  src: [
    {
      path: "../fonts/InterVariable.woff2",
    },
    {
      path: "../fonts/InterVariable-italic.woff2",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
