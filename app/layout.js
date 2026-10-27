import "./globals.css";

export const metadata = {
  title: "Cool Kids The Agency — Nothing For Sale",
  description: "We make the coolest stories in sport. Playful, cinematic storytelling.",
  icons: { icon: "/logo.png" },
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
