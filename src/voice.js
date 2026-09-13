const VOICE_KEY = "voicedraft.voice-profile.v1";
const form = document.querySelector("[data-voice-form]");
const samples = document.querySelector("[data-samples]");
const count = document.querySelector("[data-sample-count]");
const status = document.querySelector("[data-voice-status]");
const result = document.querySelector("[data-profile-result]");
const deleteButton = document.querySelector("[data-delete-profile]");
const saveButton = document.querySelector("[data-save-profile]");
const analyzeButton = document.querySelector("[data-analyze-profile]");
let pendingProfile = null;

window.lucide?.createIcons();
renderSavedProfile();
updateCount();

samples?.addEventListener("input", updateCount);
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const content = samples.value.trim();
  if (content.length < 80) {
    setStatus("Add at least 80 characters from writing that already sounds like you.", "error");
    return;
  }

  setStatus("Looking for observable writing patterns...", "loading");
  analyzeButton.disabled = true;
  track("profile_analysis_submitted", { sample_count: splitSamples(content).length });
  try {
    const response = await fetch("/api/voice/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ samples: splitSamples(content) })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Analysis failed.");
    pendingProfile = data;
    renderProfile(data);
    setStatus("Review the profile before you save it.", "success");
    track("profile_analysis_succeeded", { confidence: data.confidence || "unknown" });
  } catch (error) {
    if (isLocalPreview()) {
      pendingProfile = createLocalProfile(content);
      renderProfile(pendingProfile);
      setStatus("Local preview profile. Cloudflare AI will analyze live samples after deployment.", "warning");
      track("profile_analysis_succeeded", { confidence: "low", local_preview: true });
    } else {
      setStatus(error.message || "The profile could not be created. Your sample is still here.", "error");
      track("profile_analysis_failed", { error_code: "request_failed" });
    }
  } finally {
    analyzeButton.disabled = false;
  }
});

saveButton?.addEventListener("click", () => {
  if (!pendingProfile) return;
  localStorage.setItem(VOICE_KEY, JSON.stringify(pendingProfile));
  setStatus("Voice Profile saved in this browser.", "success");
  track("profile_saved");
  saveButton.disabled = true;
  deleteButton.hidden = false;
});

deleteButton?.addEventListener("click", () => {
  localStorage.removeItem(VOICE_KEY);
  pendingProfile = null;
  result.innerHTML = '<p class="profile-empty">No Voice Profile is saved in this browser.</p>';
  deleteButton.hidden = true;
  saveButton.hidden = true;
  setStatus("Voice Profile deleted.", "success");
  track("profile_deleted");
});

function renderSavedProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(VOICE_KEY));
    if (stored) {
      pendingProfile = stored;
      renderProfile(stored);
      saveButton.disabled = true;
      deleteButton.hidden = false;
      setStatus("Voice Profile ready in this browser.", "success");
    }
  } catch {
    localStorage.removeItem(VOICE_KEY);
  }
}

function renderProfile(profile) {
  const traits = profile.traits || {};
  const rows = [
    ["Formality", traits.formality],
    ["Directness", traits.directness],
    ["Sentence length", traits.sentence_length],
    ["Warmth", traits.warmth],
    ["Contractions", traits.contractions],
    ["Rhythm", traits.rhythm]
  ].filter(([, value]) => value);

  result.innerHTML = "";
  const dl = document.createElement("dl");
  dl.className = "profile-grid";
  for (const [label, value] of rows) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    dl.append(dt, dd);
  }
  result.append(dl);

  if (traits.avoid?.length) {
    const block = document.createElement("div");
    block.className = "profile-avoid";
    const heading = document.createElement("h3");
    heading.textContent = "Patterns to avoid";
    const list = document.createElement("ul");
    traits.avoid.forEach((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      list.append(item);
    });
    block.append(heading, list);
    result.append(block);
  }

  const confidence = document.createElement("p");
  confidence.className = "profile-confidence";
  confidence.textContent = `${capitalize(profile.confidence || "low")} confidence based on this sample set`;
  result.append(confidence);
  saveButton.hidden = false;
  saveButton.disabled = false;
}

function createLocalProfile(text) {
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim());
  const words = text.split(/\s+/).filter(Boolean);
  const average = words.length / Math.max(sentences.length, 1);
  const contractions = (text.match(/\b\w+'(?:t|re|ve|ll|d|m|s)\b/gi) || []).length;
  return {
    schema_version: "voice-v1-local",
    confidence: "low",
    traits: {
      formality: contractions > 1 ? "relaxed" : "balanced",
      directness: "balanced",
      sentence_length: average < 12 ? "short" : average > 22 ? "long" : "mixed",
      warmth: "balanced",
      contractions: contractions > 2 ? "frequent" : contractions ? "sometimes" : "rare",
      rhythm: average < 14 ? "Compact sentences with a quick pace" : "Measured sentences with room for context",
      avoid: ["generic scene-setting", "inflated conclusions"]
    }
  };
}

function splitSamples(value) {
  return value.split(/\n\s*---+\s*\n/).map((sample) => sample.trim()).filter(Boolean).slice(0, 5);
}

function updateCount() {
  if (count && samples) count.textContent = `${samples.value.length.toLocaleString()} / 15,000`;
}

function setStatus(message, stateName) {
  status.textContent = message;
  status.dataset.state = stateName;
}

function isLocalPreview() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function track(event, properties = {}) {
  window.dispatchEvent(new CustomEvent("voicedraft:analytics", { detail: { event, properties } }));
}
