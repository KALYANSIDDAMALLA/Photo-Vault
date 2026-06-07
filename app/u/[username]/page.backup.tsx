"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function PublicProfilePage() {
  const params = useParams();

  const [profile, setProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [params]);

  const loadProfile = async () => {
    const username = params.username as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    if (photoData) {
      const userPhotos = photoData.filter(
        (photo) =>
          photo.user_id === profileData.id &&
          photo.is_draft === false
      );

      setPhotos(userPhotos);
    }

    const { count: followerCount } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", profileData.id);

    setFollowers(followerCount || 0);

    const { count: followingCount } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", profileData.id);

    setFollowing(followingCount || 0);

    if (user) {
      const { data: followData } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", profileData.id)
        .maybeSingle();

      setIsFollowing(!!followData);
    }
  };

  const followUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !profile) return;

    await supabase.from("follows").insert({
      follower_id: user.id,
      following_id: profile.id,
    });

    loadProfile();
  };

  const unfollowUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !profile) return;

    await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", profile.id);

    loadProfile();
  };

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

            <div className="flex gap-6 mt-3">
              <span>{photos.length} Posts</span>
              <span>{followers} Followers</span>
              <span>{following} Following</span>
            </div>

            <div className="mt-4">
              {isFollowing ? (
                <button
                  onClick={unfollowUser}
                  className="bg-red-600 px-4 py-2 rounded-lg"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={followUser}
                  className="bg-white text-black px-4 py-2 rounded-lg"
                >
                  Follow
                </button>
              )}
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
