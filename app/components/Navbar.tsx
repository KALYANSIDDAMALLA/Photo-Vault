"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
export default function Navbar() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-black border-b border-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex gap-6 items-center">

        <a href="/">Home</a>

        <a href="/dashboard">Dashboard</a>

        <a href="/photoupload">Upload</a>

        <a href="/profile">Profile</a>
        <Link href="/explore">Explore</Link>
        <Link href="/trending">Trending</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        <Link href="/search">Search</Link>
        <Link href="/notifications">Notifications</Link>       
        <Link href="/search">Search</Link>
        <Link href="/drafts">Drafts</Link>
        <a href="/drafts">Drafts</a>
        <a href="/settings/profile">Settings</a>

        <button
          onClick={logout}
          className="ml-auto bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}
