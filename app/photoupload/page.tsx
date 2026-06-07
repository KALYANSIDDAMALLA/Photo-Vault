"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PhotoUploadPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");

  const uploadPhoto = async (isDraft: boolean) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please login first.");
        return;
      }

      if (!photo) {
        setMessage("Please select a photo.");
        return;
      }

      const fileExt = photo.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, photo);

      if (uploadError) {
        setMessage(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("photos")
        .getPublicUrl(fileName);

      const { error } = await supabase
        .from("photos")
        .insert({
          user_id: user.id,
          image_url: data.publicUrl,
          caption,
          is_draft: isDraft,
        });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        isDraft
          ? "Draft saved successfully!"
          : "Photo published successfully!"
      );
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Upload Photo
        </h1>

        <div className="space-y-6">

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setPhoto(e.target.files?.[0] || null)
            }
            className="w-full"
          />

          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 h-32"
          />

          <div className="flex gap-4">

            <button
              onClick={() => uploadPhoto(true)}
              className="bg-gray-700 px-6 py-3 rounded-lg"
            >
              Save Draft
            </button>

            <button
              onClick={() => uploadPhoto(false)}
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
            >
              Publish
            </button>

          </div>

          {message && (
            <div className="p-3 rounded bg-gray-900">
              {message}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
