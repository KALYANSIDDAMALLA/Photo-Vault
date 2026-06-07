"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function TrendingPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    const { data: photoData } = await supabase
      .from("photos")
      .select("*")
      .eq("is_draft", false);

    if (!photoData) {
      setLoading(false);
      return;
    }

    const photosWithLikes = await Promise.all(
      photoData.map(async (photo) => {
        const { count } = await supabase
          .from("likes")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("photo_id", photo.id);

        return {
          ...photo,
          likes: count || 0,
        };
      })
    );

    photosWithLikes.sort(
      (a, b) => b.likes - a.likes
    );

    setPhotos(photosWithLikes);
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        Loading Trending Feed...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          🔥 Trending
        </h1>

        <div className="grid grid-cols-3 gap-4">

          {photos.map((photo) => (
            <Link
              key={photo.id}
              href={`/photo/${photo.id}`}
              className="block bg-gray-900 rounded-lg overflow-hidden"
            >
              <img
                src={photo.image_url}
                alt={photo.caption}
                className="w-full aspect-square object-cover"
              />

              <div className="p-3">

                <p className="text-sm mb-2">
                  ❤️ {photo.likes}
                </p>

                <p className="text-gray-400 text-sm">
                  {photo.caption}
                </p>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </main>
  );
}
