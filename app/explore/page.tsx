"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Photo = {
  id: string;
  image_url: string;
  caption: string;
};

export default function ExplorePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: photoData, error } = await supabase
        .from("photos")
        .select("*")
        .eq("is_draft", false)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      setPhotos(photoData || []);

      const { data: likesData } = await supabase
        .from("likes")
        .select("*");

      const likeCounts: Record<string, number> = {};
      const currentUserLikes: Record<string, boolean> = {};

      likesData?.forEach((like) => {
        likeCounts[like.photo_id] =
          (likeCounts[like.photo_id] || 0) + 1;

        if (user && like.user_id === user.id) {
          currentUserLikes[like.photo_id] = true;
        }
      });

      setLikes(likeCounts);
      setUserLikes(currentUserLikes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (photoId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (userLikes[photoId]) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("photo_id", photoId)
        .eq("user_id", user.id);

      if (error) {
        alert(error.message);
        return;
      }

      setUserLikes((prev) => ({
        ...prev,
        [photoId]: false,
      }));

      setLikes((prev) => ({
        ...prev,
        [photoId]: Math.max(
          (prev[photoId] || 1) - 1,
          0
        ),
      }));
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({
          photo_id: photoId,
          user_id: user.id,
        });

      if (error) {
        alert(error.message);
        return;
      }

      setUserLikes((prev) => ({
        ...prev,
        [photoId]: true,
      }));

      setLikes((prev) => ({
        ...prev,
        [photoId]: (prev[photoId] || 0) + 1,
      }));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Explore ({photos.length} photos)
        </h1>

        {photos.length === 0 && (
          <p className="text-red-400">
            No photos found.
          </p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              <Link href={`/photo/${photo.id}`}>
                <img
                  src={photo.image_url}
                  alt={photo.caption || "Photo"}
                  className="w-full aspect-square object-cover"
                />
              </Link>

              <div className="p-3">
                <p className="text-sm text-gray-300 mb-2">
                  {photo.caption}
                </p>

                <button
                  onClick={() =>
                    toggleLike(photo.id)
                  }
                  className="text-lg"
                >
                  ❤️ {likes[photo.id] || 0}
                </button>

                <p className="text-xs text-yellow-400 mt-2">
                  ID: {photo.id}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
