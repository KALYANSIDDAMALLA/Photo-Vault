"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function PhotoPage() {
  const params = useParams();

  const [photo, setPhoto] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    loadPhoto();
  }, []);

  const loadPhoto = async () => {
    const photoId = params.id as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUserId(user?.id || "");

    const { data: photoData } = await supabase
      .from("photos")
      .select("*")
      .eq("id", photoId)
      .single();

    if (!photoData) return;

    setPhoto(photoData);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", photoData.user_id)
      .single();

    setProfile(profileData);

    const { count } = await supabase
      .from("likes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("photo_id", photoId);

    setLikes(count || 0);

    const { data: commentData } = await supabase
      .from("comments")
      .select("*")
      .eq("photo_id", photoId)
      .order("created_at", {
        ascending: true,
      });

    setComments(commentData || []);
  };

  const addComment = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !newComment.trim()) return;

    const { data: userProfile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    const { error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        photo_id: photo.id,
        username: userProfile?.username,
        content: newComment,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setNewComment("");
    loadPhoto();
  };

  const deleteComment = async (commentId: string) => {
    const confirmed = window.confirm(
      "Delete this comment?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      alert(error.message);
      return;
    }

    loadPhoto();
  };

  if (!photo) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">

        <img
          src={photo.image_url}
          alt={photo.caption}
          className="w-full rounded-lg mb-6"
        />

        <h1 className="text-2xl font-bold">
          @{profile?.username}
        </h1>

        <p className="text-gray-400 mt-2">
          {photo.caption}
        </p>

        <p className="mt-4">
          ❤️ {likes} Likes
        </p>

        <div className="mt-8">

          <h2 className="text-xl font-semibold mb-4">
            Comments ({comments.length})
          </h2>

          {comments.length === 0 && (
            <p className="text-gray-500 mb-4">
              No comments yet.
            </p>
          )}

          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-900 p-3 rounded mb-2 flex justify-between items-center"
            >
              <div>
                <span className="font-semibold">
                  {comment.username}
                </span>
                {" "}
                {comment.content}
              </div>

              {comment.user_id === currentUserId && (
                <button
                  onClick={() =>
                    deleteComment(comment.id)
                  }
                  className="text-red-400 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-2 mt-4">

            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) =>
                setNewComment(e.target.value)
              }
              className="flex-1 bg-gray-900 p-3 rounded"
            />

            <button
              onClick={addComment}
              className="bg-white text-black px-4 rounded"
            >
              Post
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}
