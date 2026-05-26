import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/faqs");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
