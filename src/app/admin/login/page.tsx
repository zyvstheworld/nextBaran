"use client"

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ADMIN_USERNAME = "admin1";
const ADMIN_PASSWORD = "admin321";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store login state in localStorage/sessionStorage
      localStorage.setItem("isAdminAuthenticated", "true");
      router.push("/admin/services");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* Blurred Barangay Seal Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Image
          src="/olongapo-seal.png"
          alt="Barangay Old Cabalan Seal"
          fill
          style={{ objectFit: "cover" }}
          className="blur-l opacity-20"
          priority
        />
      </div>
      {/* Login Card */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <Image
          src="/baranguide-log.png"
          alt="Barangay Old Cabalan Seal"
          width={80}
          height={80}
          className="mb-4"
        />
        <Image
          src="/olongapo-seal.png"
          alt="BaranGuide Logo"
          width={180}
          height={40}
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