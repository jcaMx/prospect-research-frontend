import { useEffect, useState } from "react";

const steps = [
  "🔎 Searching web sources...",
  "🔗 Enriching profile data...",
  "🏢 Gathering company intelligence...",
  "🧠 Summarizing insights...",
  "📊 Evaluating information quality...",
];

export default function ProcessingView() {
  const [currentStep, setCurrentStep] = useState(0);

  // Step animation (cycles through agent steps)
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(stepTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 text-white p-6">
      {/* Glass Card */}
      <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl px-10 py-12 shadow-xl w-full max-w-md text-center">

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">
          AI Research Agent Running
        </h1>

        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>

        {/* Dynamic Step */}
        <p className="text-lg text-indigo-300 mb-2 transition-all duration-300">
          {steps[currentStep]}
        </p>

        {/* Subtext */}
        <p className="text-sm text-gray-400">Please wait while we analyze the prospect</p>

        {/* Progress Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === currentStep ? "bg-indigo-400" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
