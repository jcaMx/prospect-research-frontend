import { useState } from "react";

import FormView from "./components/FormView";
import ProcessingView from "./components/ProcessingView";
import ResultView from "./components/ResultView";
import API, { getSlidesStatus, type ProspectResponse } from "./api/client";

export default function App() {
  const [result, setResult] = useState<ProspectResponse | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const [slidesUrl, setSlidesUrl] = useState<string | null>(null);
  const [audioDownloadUrl, setAudioDownloadUrl] = useState<string | null>(null);
  const [slidesError, setSlidesError] = useState<string | null>(null);

  const handleGenerateSlides = async () => {
    const prospect = result?.result?.prospect_info;
    if (!prospect?.name) {
      setSlidesError("Missing prospect details for slide generation.");
      return;
    }

    setSlidesLoading(true);
    setSlidesUrl(null);
    setAudioDownloadUrl(null);
    setSlidesError(null);

    try {
      const start = await API.generateSlides({
        name: prospect.name,
        title: prospect.title ?? "",
        company: prospect.company ?? "",
        email: prospect.email ?? "",
        company_website: prospect.company_website ?? "",
        linkedin_url: prospect.linkedin_url ?? "",
        result: result?.result,
      });

      const poll = async (): Promise<void> => {
        const status = await getSlidesStatus(start.request_id);
        setAudioDownloadUrl(status.audio_download_url ?? null);

        if (status.status === "completed" && status.slides_url) {
          setSlidesUrl(status.slides_url);
          setSlidesLoading(false);
          return;
        }

        if (status.status === "error" || status.status === "not_found") {
          setSlidesError(status.error ?? "Slide generation failed.");
          setSlidesLoading(false);
          return;
        }

        window.setTimeout(() => {
          void poll();
        }, 3000);
      };

      await poll();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Slide generation failed.";
      setSlidesError(message);
      setSlidesLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {!result && (
        <FormView
          onCompleted={setResult}
          onProcessingChange={setProcessing}
          processing={processing}
          error={error}
          onError={setError}
        />
      )}

      {processing && <ProcessingView />}

      {result && !processing && (
        <ResultView
          response={result}
          onReset={() => {
            setResult(null);
            setError(null);
            setSlidesLoading(false);
            setSlidesUrl(null);
            setAudioDownloadUrl(null);
            setSlidesError(null);
          }}
          onGenerateSlides={handleGenerateSlides}
          slidesLoading={slidesLoading}
          slidesUrl={slidesUrl}
          audioDownloadUrl={audioDownloadUrl}
          slidesError={slidesError}
        />
      )}
    </div>
  );
}
