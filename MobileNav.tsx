"use client";

import Link from "next/link";

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-red-500 flex justify-around items-center z-[99999]">
      <Link href="/explore">🏠</Link>
      <Link href="/trending">🔥</Link>
      <Link href="/photoupload">➕</Link>
      <Link href="/search">🔍</Link>
      <Link href="/profile">👤</Link>
    </div>
  );
}
