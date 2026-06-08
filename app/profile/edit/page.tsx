"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function EditProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setUsername(data.username || "");
      setBio(data.bio || "");
      setAvatarUrl(data.avatar_url || "");
      setIsPrivate(data.is_private || false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please login.");
        return;
      }

      let finalAvatarUrl = avatarUrl;

      if (avatar) {
        const extension = avatar.name.split(".").pop();
        const fileName = `${user.id}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatar, {
            upsert: true,
          });

        if (uploadError) {
          setMessage(uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        finalAvatarUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username,
          bio,
          avatar_url: finalAvatarUrl,
          is_private: isPrivate,
        });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Profile updated successfully!");

      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Edit Profile
        </h1>

        <div className="space-y-6">

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setAvatar(e.target.files?.[0] || null)
            }
            className="w-full"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-900"
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-900 h-32"
          />

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) =>
                setIsPrivate(e.target.checked)
              }
            />
            Private Account
          </label>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {message && (
            <div className="bg-gray-900 p-3 rounded">
              {message}
            </div>
          )}

        </div>

      </div>
    </main>
  );
}
