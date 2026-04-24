import type {
  EducationEntry,
  ExperienceEntry,
  ProspectResponse,
} from "../api/client";
import { API_BASE, SLIDES_API_BASE } from "../api/config";

type ResultViewProps = {
  response: ProspectResponse;
  onReset: () => void;
  onGenerateSlides: () => void;
  slidesLoading: boolean;
  slidesUrl?: string | null;
  audioDownloadUrl?: string | null;
  slidesError?: string | null;
};

const formatLocation = (
  value:
    | string
    | { locality?: string; region?: string; country?: string; name?: string }
    | null
    | undefined
) => {
  if (!value) return "N/A";
  if (typeof value === "string") return value;
  return (
    value.name ||
    [value.locality, value.region, value.country].filter(Boolean).join(", ") ||
    "N/A"
  );
};

const formatCompany = (company: ExperienceEntry["company"]) => {
  if (!company) return "N/A";
  if (typeof company === "string") return company;

  if (typeof company === "object") {
    return company.name || JSON.stringify(company);
  }

  return "N/A";
};

const formatSchool = (school: EducationEntry["school"]) => {
  if (!school) return "N/A";
  if (typeof school === "string") return school;

  if (typeof school === "object") {
    return school.name || JSON.stringify(school);
  }

  return "N/A";
};

const safeText = (value: unknown): string => {
  if (!value) return "N/A";

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    const namedValue = value as { name?: string };
    return namedValue.name || JSON.stringify(value);
  }

  return String(value);
};

const toTitleCase = (text: string) => {
  if (!text) return "N/A";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const triggerDownload = async (path: string) => {
  const base = new URL(API_BASE);
  const url = new URL(path, base);

  if (url.origin !== base.origin || !url.pathname.startsWith("/output/")) {
    throw new Error("Blocked unsafe download URL.");
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to download (${res.status})`);

  const blob = await res.blob();
  const filename = url.pathname.split("/").pop() ?? "download";

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

export default function ResultView({
  response,
  onReset,
  onGenerateSlides,
  slidesLoading,
  slidesUrl,
  audioDownloadUrl,
  slidesError,
}: ResultViewProps) {
  const result = response.result;
  const outputFiles = response.output_files ?? null;

  const prospect = result.prospect_info ?? {};
  const profile = result.profile_enrichment ?? {};
  const company = result.company_enrichment ?? {};

  const name = profile.full_name || prospect.name || "N/A";
  const role = prospect.title || "N/A";
  const companyName = prospect.company || "N/A";
  const industry = profile.industry || company.industry || "N/A";
  const location = formatLocation(profile.location);
  const summary = result.summary_text || "No summary available.";
  const linkedin = profile.linkedin_url || prospect.linkedin_url || "N/A";

  const skills = profile.skills ?? [];
  const experience = profile.experience ?? [];
  const education = profile.education ?? [];

  return (
    <div className="min-h-screen bg-prussian p-6 font-body text-slate-100">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
                Prospect Profile
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                {toTitleCase(safeText(name))}
              </h1>
            </div>
            <button
              onClick={onReset}
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              New Search
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">
                Role
              </p>
              <p className="mt-2 text-lg font-medium">
                {toTitleCase(safeText(role))}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">
                Company
              </p>
              <p className="mt-2 text-lg font-medium">
                {toTitleCase(safeText(companyName))}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">
                Industry
              </p>
              <p className="mt-2 text-lg font-medium">
                {toTitleCase(safeText(industry))}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">
                Location
              </p>
              <p className="mt-2 text-lg font-medium">
                {toTitleCase(safeText(location))}
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white">Summary</h2>
          <p className="mt-4 leading-relaxed text-slate-200">
            {safeText(summary)}
          </p>
        </section>

        <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white">Key Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.length ? (
              skills.map((skill, i) => (
                <span
                  key={typeof skill === "string" ? skill : `skill-${i}`}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-200"
                >
                  {toTitleCase(safeText(skill))}
                </span>
              ))
            ) : (
              <p className="text-slate-300">N/A</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white">Career Highlights</h2>
          <div className="mt-4 space-y-4">
            {experience.length ? (
              experience.map((entry, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-lg font-semibold text-white">
                    {toTitleCase(safeText(entry.title ?? "N/A"))}
                  </p>
                  <p className="text-sm text-slate-300">
                    {toTitleCase(formatCompany(entry.company))}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {(entry.start_date ?? "N/A") +
                      " - " +
                      (entry.end_date ?? "Present")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-300">N/A</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white">Education</h2>

          <div className="mt-4 space-y-4">
            {education.length ? (
              education.map((entry, index) => (
                <div
                  key={`${entry.degrees?.[0] ?? "degree"}-${index}`}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-lg font-semibold text-white">
                    {entry.degrees?.length
                      ? entry.degrees.map((degree) => toTitleCase(degree)).join(", ")
                      : entry.degree
                        ? toTitleCase(entry.degree)
                        : " "}
                  </p>

                  {entry.majors?.length ? (
                    <p className="text-sm text-indigo-300">
                      {entry.majors.map((major) => toTitleCase(major)).join(", ")}
                    </p>
                  ) : null}

                  <p className="text-sm text-slate-300">
                    {formatSchool(entry.school) !== "N/A"
                      ? toTitleCase(formatSchool(entry.school))
                      : "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-300">N/A</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white">Online Presence</h2>
          <p className="mt-4 text-slate-200">
            LinkedIn: <span className="text-slate-100">{safeText(linkedin)}</span>
          </p>
        </section>

        <section className="mb-10 flex justify-end">
          {outputFiles ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={() => triggerDownload(outputFiles.md_path)}
              >
                Download Markdown
              </button>
              <button
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={() => triggerDownload(outputFiles.json_path)}
              >
                Download JSON
              </button>
              <button
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={onGenerateSlides}
                disabled={slidesLoading}
              >
                {slidesLoading ? "Generating Slides..." : "Generate Google Slides"}
              </button>
              {slidesUrl ? (
                <>
                  <a
                    href={slidesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                  >
                    Open Google Slides
                  </a>

                  <button
                    className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => {
                      if (!audioDownloadUrl) return;
                      window.open(
                        new URL(audioDownloadUrl, SLIDES_API_BASE).toString(),
                        "_blank"
                      );
                    }}
                    disabled={!audioDownloadUrl}
                  >
                    Download Audio Zip File
                  </button>
                </>
              ) : null}
              {slidesError ? (
                <p className="self-center text-sm text-red-200">{slidesError}</p>
              ) : null}

            </div>
          ) : (
            <p className="mt-4 text-slate-300">No output files available.</p>
          )}
        </section>
      </div>
    </div>
  );
}
