"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");

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
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const deletePhoto = async (photoId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId);

    if (error) {
      alert(error.message);
      return;
    }

    setPhotos((current) =>
      current.filter((photo) => photo.id !== photoId)
    );

    alert("Photo deleted successfully!");
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-8">

        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">

          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border border-gray-700"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-800" />
          )}

          <div>
            <h1 className="text-3xl font-bold">
              {profile?.username || "New User"}
            </h1>

            <p className="text-gray-400 mt-2">
              {email}
            </p>

            <p className="text-gray-500 mt-2">
              {profile?.bio || "No bio yet"}
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

        {photos.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No photos uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption}
                  className="aspect-square object-cover rounded-lg w-full"
                />

                <button
                  onClick={() =>
                    deletePhoto(photo.id)
                  }
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
