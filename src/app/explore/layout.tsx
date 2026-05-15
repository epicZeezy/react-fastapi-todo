import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Explore | ShapeShop",
  description:
    "Orbit 3D shape transformations, switch geometry variants, and jump into curated products.",
};

export default function ExploreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
