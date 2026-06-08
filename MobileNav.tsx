"use client";

import Link from "next/link";

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800 flex justify-around items-center z-[9999]">

      <Link href="/explore" className="text-white">
        Home
      </Link>

      <Link href="/trending" className="text-white">
        Trending
      </Link>

      <Link href="/photoupload" className="text-white">
        Upload
      </Link>

      <Link href="/search" className="text-white">
        Search
      </Link>

      <Link href="/profile" className="text-white">
        Profile
      </Link>

    </div>
  );
}
