"use client";

import Link from "next/link";

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center h-16 z-50">

      <Link href="/explore">
        🏠
      </Link>

      <Link href="/trending">
        🔥
      </Link>

      <Link href="/photoupload">
        ➕
      </Link>

      <Link href="/search">
        🔍
      </Link>

      <Link href="/profile">
        👤
      </Link>

    </div>
  );
}
