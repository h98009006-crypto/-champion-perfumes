import "./globals.css";
export const metadata = { title: "Champion Perfumes", description: "Fragrance built for the moment you win." };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
