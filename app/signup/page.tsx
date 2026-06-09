"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const username = email.split("@")[0];

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username,
          bio: "",
          avatar_url: null,
          is_private: false,
        });

      if (profileError) {
        console.error(profileError);
      }
    }

    alert("Account created successfully!");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSignup}
        className="space-y-4 w-96"
      >
        <h1 className="text-3xl font-bold text-center">
          Sign Up
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 bg-gray-900 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 bg-gray-900 rounded"
        />

        <button
          type="submit"
          className="w-full p-3 bg-white text-black rounded"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}
