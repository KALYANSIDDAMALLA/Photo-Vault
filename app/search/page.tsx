"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    searchUsers();
  }, [query]);

  const searchUsers = async () => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${query}%`);

    setUsers(data || []);
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Search Users
        </h1>

        <input
          type="text"
          placeholder="Search photographers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 rounded bg-gray-900 mb-6"
        />

        <div className="space-y-3">

          {users.map((user) => (
            <Link
              key={user.id}
              href={`/u/${user.username}`}
              className="block bg-gray-900 p-4 rounded-lg"
            >
              <div className="flex items-center gap-4">

                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                )}

                <div>
                  <h2 className="font-semibold">
                    {user.username}
                  </h2>

                  <p className="text-sm text-gray-400">
                    {user.bio}
                  </p>
                </div>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </main>
  );
}
