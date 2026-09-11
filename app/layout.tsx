import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heirloom Launch — screen a family recipe for its first production run",
  description: "A fictional launch-readiness workbench for family food brands.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
