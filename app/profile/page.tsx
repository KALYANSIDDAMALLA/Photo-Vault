"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Profile = {
  username: string;
  bio: string;
  avatar_url: string | null;
  is_private: boolean;
};

type Photo = {
  id: string;
  image_url: string;
  caption: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: photoData } = await supabase
        .from("photos")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_draft", false)
        .order("created_at", { ascending: false });

      if (photoData) {
        setPhotos(photoData);
      }
    };

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-8">

        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">

          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border border-gray-700"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-800"></div>
          )}

          <div>
            <h1 className="text-3xl font-bold">
              {profile?.username}
            </h1>

            <p className="text-gray-400 mt-2">
              {profile?.bio}
            </p>

            <div className="flex gap-8 mt-4">
              <div>
                <span className="font-bold">
                  {photos.length}
                </span>{" "}
                Posts
              </div>

              <div>
                <span className="font-bold">
                  {profile?.is_private ? "Private" : "Public"}
                </span>
              </div>
            </div>
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
