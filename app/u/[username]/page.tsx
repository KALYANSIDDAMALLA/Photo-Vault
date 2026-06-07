"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function PublicProfilePage() {
  const params = useParams();

  const [profile, setProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const username = params.username as string;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (!profileData) return;

      setProfile(profileData);

      const { data: photoData } = await supabase
        .from("photos")
        .select("*");

      console.log("ALL PHOTOS:", photoData);

      if (photoData) {
        const userPhotos = photoData.filter(
          (photo) =>
            photo.user_id === profileData.id &&
            photo.is_draft === false
        );

        setPhotos(userPhotos);
      }
    };

    loadData();
  }, [params]);

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-8 mb-10">

          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-800"></div>
          )}

          <div>
            <h1 className="text-3xl font-bold">
              {profile.username}
            </h1>

            <p className="text-gray-400">
              {profile.bio}
            </p>

            <p className="mt-2">
              {photos.length} Posts
            </p>
          </div>

        </div>

        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.image_url}
              alt={photo.caption}
              className="aspect-square object-cover rounded-lg"
            />
          ))}
        </div>

      </div>
    </main>
  );
}
