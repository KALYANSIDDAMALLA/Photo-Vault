"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Draft = {
  id: string;
  image_url: string;
  caption: string;
};

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const loadDrafts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("photos")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_draft", true)
      .order("created_at", { ascending: false });

    if (data) {
      setDrafts(data);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const publishDraft = async (id: string) => {
    await supabase
      .from("photos")
      .update({
        is_draft: false,
      })
      .eq("id", id);

    loadDrafts();
  };

  const deleteDraft = async (id: string) => {
    await supabase
      .from("photos")
      .delete()
      .eq("id", id);

    loadDrafts();
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          My Drafts
        </h1>

        {drafts.length === 0 ? (
          <p>No drafts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-gray-900 rounded-xl overflow-hidden"
              >
                <img
                  src={draft.image_url}
                  alt={draft.caption}
                  className="w-full aspect-square object-cover"
                />

                <div className="p-4">

                  <p className="mb-4">
                    {draft.caption}
                  </p>

                  <div className="flex gap-2">

                    <button
                      onClick={() => publishDraft(draft.id)}
                      className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
                    >
                      Publish
                    </button>

                    <button
                      onClick={() => deleteDraft(draft.id)}
                      className="bg-red-600 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}
