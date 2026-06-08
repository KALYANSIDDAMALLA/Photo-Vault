"use client";

import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-black border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">

        <Link href="/" className="font-bold text-xl">
          PhotoVault
        </Link>

        <Link href="/explore">
          Explore
        </Link>

        <Link href="/trending">
          Trending
        </Link>

        <Link href="/photoupload">
          Upload
        </Link>

        <Link href="/search">
          Search
        </Link>

        <Link href="/drafts">
          Drafts
        </Link>

        <Link href="/profile">
          Profile
        </Link>

        <button
          onClick={logout}
          className="ml-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}
