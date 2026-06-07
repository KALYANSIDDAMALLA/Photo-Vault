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

const [likes, setLikes] = useState<Record<string, number>>({});
const [likedPhotos, setLikedPhotos] = useState<string[]>([]);

const [comments, setComments] = useState<Record<string, any[]>>({});
const [newComments, setNewComments] = useState<Record<string, string>>({});

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

      const likesMap: Record<string, number> = {};

      for (const photo of userPhotos) {
        const { count } = await supabase
          .from("likes")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("photo_id", photo.id);

        likesMap[photo.id] = count || 0;
      }

      setLikes(likesMap);
      const commentsMap: Record<string, any[]> = {};

      for (const photo of userPhotos) {
      const { data: photoComments } = await supabase
      .from("comments")
      .select("*")
      .eq("photo_id", photo.id)
      .order("created_at", { ascending: true });

      commentsMap[photo.id] = photoComments || [];
}

setComments(commentsMap);
    }
    
    const { count: followerCount } = await supabase
      .from("follows")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("following_id", profileData.id);

    setFollowers(followerCount || 0);

    const { count: followingCount } = await supabase
      .from("follows")
      .select("*", {
        count: "exact",
        head: true,
      })
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

      const { data: userLikes } = await supabase
        .from("likes")
        .select("photo_id")
        .eq("user_id", user.id);

      setLikedPhotos(
        userLikes?.map((like) => like.photo_id) || []
      );
    }
  };

  const followUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("USER:", user);
  console.log("PROFILE:", profile);

  if (!user || !profile) return;

  const followResult = await supabase
    .from("follows")
    .insert({
      follower_id: user.id,
      following_id: profile.id,
    });

  console.log("FOLLOW RESULT:", followResult);

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const notificationResult = await supabase
    .from("notifications")
    .insert({
      user_id: profile.id,
      actor_username: myProfile?.username,
      type: "follow",
      message: `${myProfile?.username} followed you`,
    });

  console.log(
    "NOTIFICATION RESULT:",
    notificationResult
  );

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

  const toggleLike = async (photoId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const alreadyLiked =
      likedPhotos.includes(photoId);

    if (alreadyLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("photo_id", photoId);
    } else {
      await supabase
        .from("likes")
        .insert({
          user_id: user.id,
          photo_id: photoId,
        });
    }

    loadProfile();
  };
    const addComment = async (photoId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const content = newComments[photoId];

  if (!content?.trim()) return;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  await supabase.from("comments").insert({
    user_id: user.id,
    photo_id: photoId,
    username: profileData?.username,
    content,
  });

  setNewComments({
    ...newComments,
    [photoId]: "",
  });

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
            <div key={photo.id}>
              <img
                src={photo.image_url}
                alt={photo.caption}
                className="aspect-square object-cover rounded-lg"
              />

              <div className="mt-2 flex items-center justify-between">
               <div className="mt-3 space-y-2">

  {(comments[photo.id] || []).map((comment) => (
    <div
      key={comment.id}
      className="bg-gray-900 p-2 rounded text-sm"
    >
      <span className="font-semibold">
        {comment.username}
      </span>
      {" "}
      {comment.content}
    </div>
  ))}

  <div className="flex gap-2">

    <input
      type="text"
      placeholder="Write a comment..."
      value={newComments[photo.id] || ""}
      onChange={(e) =>
        setNewComments({
          ...newComments,
          [photo.id]: e.target.value,
        })
      }
      className="flex-1 bg-gray-900 p-2 rounded text-sm"
    />

    <button
      onClick={() => addComment(photo.id)}
      className="bg-white text-black px-3 rounded"
    >
      Post
    </button>

  </div>

</div>
                <span>
                  ❤️ {likes[photo.id] || 0}
                </span>

                <button
                  onClick={() =>
                    toggleLike(photo.id)
                  }
                  className="bg-gray-800 px-3 py-1 rounded text-sm"
                >
                  {likedPhotos.includes(photo.id)
                    ? "Unlike"
                    : "Like"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
