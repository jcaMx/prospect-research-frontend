import { API_BASE } from "./config";

export type ProspectFormData = {
  name: string;
  title?: string;
  company?: string;
  email?: string;
  company_website?: string;
  linkedin_url?: string;
};

export type ExperienceEntry = {
  title?: string;
  company?: string | { name?: string };
  start_date?: string;
  end_date?: string;
};

export type EducationEntry = {
  school?: string | { name?: string };
  degree?: string;
  degrees?: string[];
  majors?: string[];
};

export type ProspectResult = {
  prospect_info?: {
    name?: string;
    title?: string;
    company?: string;
    email?: string;
    company_website?: string;
    linkedin_url?: string;
  };
  summary_text?: string | null;
  profile_enrichment?: {
    full_name?: string;
    linkedin_url?: string;
    industry?: string;
    skills?: string[];
    experience?: ExperienceEntry[];
    education?: EducationEntry[];
    location?: string | { locality?: string; region?: string; country?: string; name?: string };
  } | null;
  company_enrichment?: {
    industry?: string;
    location?: { city?: string; region?: string; country?: string; name?: string } | null;
  } | null;
};

export type OutputFiles = {
  json_path: string;
  md_path: string;
};

export type ProspectResponse = {
  result: ProspectResult;
  output_files?: OutputFiles | null;
};

export type SlidesRequestPayload = ProspectFormData & {
  result?: ProspectResult;
};

export type SlidesStartResponse = {
  request_id: string;
};

export type SlidesStatusResponse = {
  status: "processing" | "completed" | "error" | "not_found";
  slides_url?: string;
  audio_download_url?: string | null;
  error?: string;
};

export const runProspect = async (data: ProspectFormData): Promise<ProspectResponse> => {
    const response = await fetch(`${API_BASE}/prospect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json();
};

export const generateSlides = async (
  data: SlidesRequestPayload
): Promise<SlidesStartResponse> => {
  const response = await fetch(`${API_BASE}/prospect/slides`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
};

export const getSlidesStatus = async (
  requestId: string
): Promise<SlidesStatusResponse> => {
  const response = await fetch(`${API_BASE}/prospect/slides/${requestId}`);

  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
};

const API = { runProspect, generateSlides, getSlidesStatus };
export default API;
