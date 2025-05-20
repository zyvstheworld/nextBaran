"use client"

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5f3dc4]"></div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editFAQ, setEditFAQ] = useState<FAQ | null>(null);
  const [form, setForm] = useState({
    question: "",
    answer: ""
  });
  const [error, setError] = useState("");

  // Fetch FAQs from Supabase
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("faqs")
        .select("id, question, answer")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      if (data) {
        setFaqs(data);
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Handle Add/Edit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Question and answer are required.");
      return;
    }

    try {
      const faqData = {
        question: form.question,
        answer: form.answer
      };

      if (editFAQ) {
        // Edit
        const { data, error } = await supabase
          .from("faqs")
          .update(faqData)
          .eq("id", editFAQ.id)
          .select();
        
        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }
        setShowModal(false);
        setEditFAQ(null);
        setForm({
          question: "",
          answer: ""
        });
        await fetchFaqs();
      } else {
        // Add
        const { data, error } = await supabase
          .from("faqs")
          .insert([faqData])
          .select();
        
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        setShowModal(false);
        setForm({
          question: "",
          answer: ""
        });
        await fetchFaqs();
      }
    } catch (err) {
      console.error("Error saving FAQ:", err);
      setError(editFAQ ? "Failed to update FAQ." : "Failed to add FAQ.");
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    
    try {
      const { error } = await supabase
        .from("faqs")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      await fetchFaqs();
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      setError("Failed to delete FAQ.");
    }
  };

  // Open modal for add/edit
  const openModal = (faq?: FAQ) => {
    if (faq) {
      setEditFAQ(faq);
      setForm({
        question: faq.question,
        answer: faq.answer
      });
    } else {
      setEditFAQ(null);
      setForm({
        question: "",
        answer: ""
      });
    }
    setShowModal(true);
  };

  return (
    <Suspense fallback={<LoadingState />}>
      <div className="relative min-h-screen p-6">
        {/* Blurred Olongapo Seal Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img
            src="/olongapo-seal.png"
            alt="Olongapo City Seal"
            className="blur-xl opacity-60 w-full h-full object-cover"
            style={{ position: 'absolute', inset: 0 }}
            draggable={false}
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-6">FAQs</h1>
          {error && <ErrorState message={error} />}
          <div className="bg-white rounded-lg shadow p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#5f3dc4] text-white">
                  <th className="py-3 px-4 rounded-tl-lg">Question</th>
                  <th className="py-3 px-4">Answer</th>
                  <th className="py-3 px-4 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8">
                      <LoadingState />
                    </td>
                  </tr>
                ) : faqs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8">No FAQs found.</td>
                  </tr>
                ) : (
                  faqs.map((faq) => (
                    <tr key={faq.id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{faq.question}</td>
                      <td className="py-3 px-4">{faq.answer}</td>
                      <td className="py-3 px-4">
                        <button
                          className="text-[#5f3dc4] font-semibold mr-4 hover:underline"
                          onClick={() => openModal(faq)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 font-semibold hover:underline"
                          onClick={() => handleDelete(faq.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <button
              className="mt-6 px-6 py-2 bg-[#283593] text-white rounded hover:bg-[#1a237e] font-semibold"
              onClick={() => openModal()}
            >
              Add FAQ
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
                <button
                  className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">{editFAQ ? "Edit FAQ" : "Add New FAQ"}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-1">Question</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#5f3dc4]"
                      value={form.question}
                      onChange={(e) => setForm({ ...form, question: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Answer</label>
                    <textarea
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#5f3dc4]"
                      value={form.answer}
                      onChange={(e) => setForm({ ...form, answer: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#5f3dc4] text-white rounded font-semibold hover:bg-[#4b2fa6]"
                    >
                      {editFAQ ? "Save Changes" : "Save FAQ"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
} 