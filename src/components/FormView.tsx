import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { runProspect } from "../api/client";
import type { ProspectFormData, ProspectResponse } from "../api/client";

type FormViewProps = {
  onCompleted: (result: ProspectResponse) => void;
  onProcessingChange: (processing: boolean) => void;
  processing: boolean;
  error: string | null;
  onError: (message: string | null) => void;
};

export default function FormView({
  onCompleted,
  onProcessingChange,
  processing,
  error,
  
  onError,
}: FormViewProps) {
  const [form, setForm] = useState<ProspectFormData>({
    name: "",
    title: "",
    company: "",
    email: "",
    company_website: "",
    linkedin_url: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    onError(null);
    onProcessingChange(true);
    try {
      const result = await runProspect(form);
      onCompleted(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      onError(message);
    } finally {
      onProcessingChange(false);
    }
  };

  return (
    <div className=" min-h-screen hero-grad bg-prussian
      text-slate-100 font-body
      selection:bg-indigo-500/30 selection:text-white
      flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
        
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Prospect Research
        </h1>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* <input
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          /> */}

          <input
            name="company_website"
            placeholder="Company Website (optional)"
            value={form.company_website}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="linkedin_url"
            placeholder="LinkedIn URL (optional)"
            value={form.linkedin_url}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={processing || !form.name.trim()}
            className={`mt-6 w-full py-3 rounded-xl font-semibold text-white backdrop-blur-sm border border-white/20 transition ${
              processing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-steel/90 hover:bg-steel"
            }`}
          >
            {processing ? "Processing..." : "Start Research"}
          </button>

          {error && (
            <div className="mt-4 rounded-lg border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
