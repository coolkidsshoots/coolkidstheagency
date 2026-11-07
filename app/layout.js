import "./globals.css";

const SITE = "https://www.coolkidstheagency.com";

export const metadata = {
  metadataBase: new URL(SITE),
  title: "Cool Kids The Agency",
  description:
    "Cool Kids The Agency is a creative agency of a filmmaker and a photographer, capturing sport in style. Cinematic film and photography for athletes, clubs and brands.",
  applicationName: "Cool Kids The Agency",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Cool Kids The Agency",
    title: "Cool Kids The Agency",
    description: "Sport is life, and it deserves to be captured in style. Film and photography for athletes, clubs and brands.",
  },
  twitter: { card: "summary", title: "Cool Kids The Agency", description: "Cinematic film and photography for sport." },
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
