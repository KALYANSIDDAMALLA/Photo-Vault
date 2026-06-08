"use client";

import Link from "next/link";

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800 flex justify-around items-center z-[9999]">

      <Link href="/explore" className="flex flex-col items-center text-white">
        <span className="text-xl">🏠</span>
      </Link>

      <Link href="/trending" className="flex flex-col items-center text-white">
        <span className="text-xl">🔥</span>
      </Link>

      <Link href="/photoupload" className="flex flex-col items-center text-white">
        <span className="text-xl">➕</span>
      </Link>

      <Link href="/search" className="flex flex-col items-center text-white">
        <span className="text-xl">🔍</span>
      </Link>

      <Link href="/profile" className="flex flex-col items-center text-white">
        <span className="text-xl">🙂</span>
      </Link>

    </div>
  );
}
