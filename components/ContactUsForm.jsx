"use client";
import { useState } from "react";

export default function ContactUsForm() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.target);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setError(data.error || "Submission failed");
        return;
      }

      setStatus("success");
      e.target.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-darker/50 p-12 rounded-2xl border border-neon-green/30 text-center backdrop-blur-sm">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Message Sent</h2>
        <p className="text-gray-400">Thanks, we&apos;ll get back to you soon.</p>
        <div className="mt-8">
          <button onClick={() => setStatus("idle")} className="text-sm font-bold uppercase tracking-widest text-neon-green">
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-darker/50 p-8 rounded-2xl border border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500">Full Name</label>
          <input name="name" required className="w-full bg-darkest/50 border border-white/5 rounded-lg px-4 py-3 text-white outline-none" />
        </div>
        <div>
          <label className="text-xs text-gray-500">Email</label>
          <input name="email" type="email" required className="w-full bg-darkest/50 border border-white/5 rounded-lg px-4 py-3 text-white outline-none" />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500">Phone Number</label>
        <input name="phone" type="tel" className="w-full bg-darkest/50 border border-white/5 rounded-lg px-4 py-3 text-white outline-none" />
      </div>

      <div>
        <label className="text-xs text-gray-500">Message</label>
        <textarea name="message" required className="w-full bg-darkest/50 border border-white/5 rounded-lg px-4 py-3 text-white outline-none h-32 resize-none" />
      </div>

      {status === "error" && <div className="text-sm text-red-400">{error}</div>}

      <button type="submit" disabled={status === "loading"} className="w-full rounded-lg bg-neon-green py-4 font-bold uppercase tracking-widest text-darkest">
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
