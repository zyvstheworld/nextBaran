"use client"

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check credentials against users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        setError("Invalid username or password");
        return;
      }

      // Store login state
      localStorage.setItem("isAdminAuthenticated", "true");
      router.push("/admin/services");
    } catch (error) {
      setError("An error occurred during login");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* Blurred Barangay Seal Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Image
          src="/olongapo-seal.png"
          alt="Barangay Old Cabalan Seal"
          width={950}
          height={950}
          style={{ objectFit: "contain" }}
          className="blur-l opacity-10"
          priority
        />
      </div>
      {/* Login Card */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
        <Image
          src="/baranguide-log.png"
          alt="Barangay Old Cabalan Seal"
          width={100}
          height={100}
          className="mb-4"
        />
        <Image
          src="/olongapo-seal.png"
          alt="BaranGuide Logo"
          width={160}
          height={20}
          className="mb-2"
        />
        <h2 className="text-3xl font-bold text-center text-[#5f3dc4] mt-2">BaranGuide</h2>
        <p className="text-center text-gray-600 mb-6">Admin Portal</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            className="mb-4 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#5f3dc4]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="mb-6 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#5f3dc4]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-[#5f3dc4] text-white rounded font-semibold hover:bg-[#4b2fa6] transition mb-2"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
} 