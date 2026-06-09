"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ProfileSettingsPage() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setUsername(data.username || "");
        setBio(data.bio || "");
        setIsPrivate(data.is_private || false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("You must be logged in.");
        return;
      }

      let avatarUrl: string | null = null;

      if (avatar) {
        const fileExt = avatar.name.split(".").pop();
        const filePath = `${user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar, {
            upsert: true,
          });

        if (uploadError) {
          setMessage(uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }

      const updateData: any = {
        username,
        bio,
        is_private: isPrivate,
      };

      if (avatarUrl) {
        updateData.avatar_url = avatarUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Profile saved successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Edit Profile
        </h1>

        <form onSubmit={handleSave} className="space-y-6">

          <div>
            <label className="block mb-2">
              Profile Picture
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setAvatar(e.target.files?.[0] || null)
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="your_username"
              className="w-full p-3 rounded bg-gray-900"
            />
          </div>

          <div>
            <label className="block mb-2">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              placeholder="Tell people about yourself..."
              className="w-full p-3 rounded bg-gray-900 h-32"
            />
          </div>

          <div>
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
          </div>

          <button
            type="submit"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
          >
            Save Profile
          </button>

          {message && (
            <div className="p-3 rounded bg-gray-900">
              {message}
            </div>
          )}

        </form>

      </div>
    </main>
  );
}
