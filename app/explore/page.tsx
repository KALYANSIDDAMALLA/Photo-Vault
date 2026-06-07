"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ExplorePage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .eq("is_draft", false)
      .order("created_at", {
        ascending: false,
      });

    setPhotos(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Explore
        </h1>

        <div className="grid grid-cols-3 gap-4">

          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              <Link href={`/photo/${photo.id}`}>
  <img
    src={photo.image_url}
    alt={photo.caption}
    className="w-full aspect-square object-cover"
  />
</Link>    
                <div className="p-3">

                <p className="text-sm text-gray-300">
                  {photo.caption}
                </p>

              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
