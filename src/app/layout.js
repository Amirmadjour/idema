import localFont from "next/font/local";
import "./globals.css";
import { EditorProvider } from "@/components/Context/EditorContext";
import { ThemeProvider } from "@/components/Context/ThemeContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const interVariable = localFont({
  src: [
    {
      path: "./fonts/InterVariable.woff2",
      style: "normal",
    },
    {
      path: "./fonts/InterVariable-Italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-inter-variable", // Optional CSS variable
  display: "swap",
});

export const metadata = {
  title: "Mini Compiler",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider>
        <EditorProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} ${interVariable.className} antialiased w-screen h-screen`}
          >
            {children}
          </body>
        </EditorProvider>
      </ThemeProvider>
    </html>
  );
}
