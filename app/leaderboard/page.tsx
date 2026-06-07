"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*");

    if (!profiles) return;

    const leaderboard = await Promise.all(
      profiles.map(async (profile) => {
        const { count: followers } = await supabase
          .from("follows")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("following_id", profile.id);

        const { data: photos } = await supabase
          .from("photos")
          .select("id")
          .eq("user_id", profile.id)
          .eq("is_draft", false);

        let totalLikes = 0;
        let totalComments = 0;

        if (photos) {
          for (const photo of photos) {
            const { count: likes } = await supabase
              .from("likes")
              .select("*", {
                count: "exact",
                head: true,
              })
              .eq("photo_id", photo.id);

            totalLikes += likes || 0;

            const { count: comments } = await supabase
              .from("comments")
              .select("*", {
                count: "exact",
                head: true,
              })
              .eq("photo_id", photo.id);

            totalComments += comments || 0;
          }
        }

        const score =
          (followers || 0) * 10 +
          totalLikes * 5 +
          totalComments * 3;

        return {
          ...profile,
          followers: followers || 0,
          likes: totalLikes,
          comments: totalComments,
          score,
        };
      })
    );

    leaderboard.sort(
      (a, b) => b.score - a.score
    );

    setUsers(leaderboard);
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          🏆 Top Photographers
        </h1>

        <div className="space-y-4">

          {users.map((user, index) => (
            <Link
              key={user.id}
              href={`/u/${user.username}`}
              className="block bg-gray-900 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-semibold">
                    #{index + 1} {user.username}
                  </h2>

                  <p className="text-gray-400">
                    {user.followers} Followers •
                    {" "}
                    {user.likes} Likes •
                    {" "}
                    {user.comments} Comments
                  </p>
                </div>

                <div className="text-2xl font-bold">
                  {user.score} pts
                </div>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </main>
  );
}
