const VOICE_KEY = "voicedraft.voice-profile.v1";
const LOCAL_PREVIEW_TEXT = {
  email: `Hi Maya,\n\nQuick update: the landing page is ready for review. I kept the pricing section out for now because we still need the final plan limits.\n\nCould you send feedback by Thursday, September 17? That keeps us on track for the September 21 launch.\n\nThanks,\nAlex`,
  linkedin: `Most AI writing problems are not really writing problems.\n\nThey are context problems. The tool does not know what you believe, what you would never say, or which details matter to your reader.\n\nA better prompt helps once. A useful voice profile helps every time.\n\nThat is the workflow I am testing this week.`
};

refreshIcons();

const tool = document.querySelector("[data-rewrite-tool]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-mobile-menu]");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menu?.toggleAttribute("data-open", open);
  menuButton.querySelector("[data-menu-icon]")?.setAttribute("data-lucide", open ? "x" : "menu");
  refreshIcons();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.hasAttribute("data-open")) {
    menu.removeAttribute("data-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

if (tool) initializeRewriteTool(tool);

function initializeRewriteTool(root) {
  const input = root.querySelector("[data-source]");
  const result = root.querySelector("[data-result]");
  const status = root.querySelector("[data-status]");
  const count = root.querySelector("[data-count]");
  const form = root.querySelector("form");
  const submit = root.querySelector("[data-submit]");
  const copyButton = root.querySelector("[data-copy]");
  const retryButton = root.querySelector("[data-retry]");
  const warning = root.querySelector("[data-warning]");
  const warningList = root.querySelector("[data-warning-list]");
  const tags = root.querySelector("[data-tags]");
  const profileState = root.querySelector("[data-profile-state]");
  const contextInput = root.querySelector("[data-context]");
  const modeButtons = [...root.querySelectorAll("[data-mode]")];
  const adjustmentButtons = [...root.querySelectorAll("[data-adjustment]")];
  let mode = root.dataset.defaultMode === "linkedin" ? "linkedin" : "email";
  let lastOutput = "";
  let lastRequest = null;

  updateProfileState(profileState);
  setMode(mode);
  updateCount();

  input?.addEventListener("input", updateCount);
  modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    runRewrite("none");
  });
  retryButton?.addEventListener("click", () => runRewrite("none"));
  adjustmentButtons.forEach((button) => button.addEventListener("click", () => runRewrite(button.dataset.adjustment)));
  copyButton?.addEventListener("click", async () => {
    if (!lastOutput) return;
    await navigator.clipboard.writeText(lastOutput);
    const label = copyButton.querySelector("span");
    const original = label?.textContent;
    if (label) label.textContent = "Copied";
    window.setTimeout(() => { if (label) label.textContent = original; }, 1600);
    track("output_copied", { mode, personalized: Boolean(getProfile()) });
  });

  document.querySelectorAll("[data-fill-sample]").forEach((button) => {
    button.addEventListener("click", () => {
      const sampleMode = button.dataset.fillSample === "linkedin" ? "linkedin" : mode;
      setMode(sampleMode);
      input.value = sampleMode === "email"
        ? `Hi Maya,\n\nI hope this message finds you well. I wanted to reach out and provide you with a quick update regarding the landing page project. I am pleased to inform you that it is now ready for your review. We did not include pricing yet because the final limits are not confirmed.\n\nPlease provide feedback by Thursday, September 17 so we can launch on September 21.\n\nBest regards,\nAlex`
        : `I've been thinking a lot about AI writing tools lately, and I wanted to share an insight. The biggest problem with AI writing is not writing. It is context. AI doesn't know what you believe or what you would never say. A good prompt helps one time. A voice profile helps every time. What do you think?`;
      updateCount();
      input.focus();
    });
  });

  async function runRewrite(adjustment) {
    const sourceText = input.value.trim();
    if (sourceText.length < 20) {
      setState("error", "Add at least 20 characters so there is enough context to rewrite.");
      input.focus();
      return;
    }
    if (sourceText.length > 5000) {
      setState("error", "Shorten the draft to 5,000 characters or fewer.");
      input.focus();
      return;
    }

    setState("loading", "Comparing the draft and preparing an edit...");
    submit.disabled = true;
    lastRequest = {
      mode,
      source_text: sourceText,
      context: { audience: contextInput?.value.trim() || null, goal: null, relationship: null },
      voice_profile: getProfile(),
      adjustment
    };
    track("rewrite_submitted", { mode, profile_state: getProfile() ? "ready" : "none" });

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lastRequest)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Rewrite failed.");
      renderSuccess(data);
      track("rewrite_succeeded", { mode, warning_state: data.meaning_risk });
    } catch (error) {
      if (isLocalPreview()) {
        renderSuccess({
          rewritten_text: applyLocalPreview(mode, sourceText, adjustment),
          change_tags: ["clarity", "brevity", "voice"],
          meaning_risk: "review",
          review_notes: ["Local preview output only. Connect the Cloudflare AI binding for production rewrites."],
          local_preview: true
        });
      } else {
        setState("error", error.message || "The rewrite could not be completed. Your draft is still here.");
        track("rewrite_failed", { mode, error_code: "request_failed" });
      }
    } finally {
      submit.disabled = false;
    }
  }

  function renderSuccess(data) {
    lastOutput = data.rewritten_text;
    result.textContent = lastOutput;
    result.removeAttribute("aria-busy");
    root.dataset.state = "success";
    status.textContent = data.local_preview ? "Preview only" : "Edited version ready";
    tags.innerHTML = "";
    for (const tag of data.change_tags || []) {
      const element = document.createElement("span");
      element.className = "change-tag";
      element.textContent = tag;
      tags.append(element);
    }
    const notes = data.review_notes || [];
    warning.hidden = data.meaning_risk !== "review" && !notes.length;
    warningList.innerHTML = "";
    for (const note of notes) {
      const item = document.createElement("li");
      item.textContent = note;
      warningList.append(item);
    }
    copyButton.hidden = false;
    retryButton.hidden = false;
    adjustmentButtons.forEach((button) => { button.hidden = false; });
    result.setAttribute("tabindex", "-1");
    result.focus({ preventScroll: true });
  }

  function setState(stateName, message) {
    root.dataset.state = stateName;
    status.textContent = message;
    warning.hidden = true;
    copyButton.hidden = true;
    retryButton.hidden = stateName !== "error";
    adjustmentButtons.forEach((button) => { button.hidden = true; });
    tags.innerHTML = "";
    if (stateName === "loading") {
      result.setAttribute("aria-busy", "true");
      result.innerHTML = '<span class="loading-line"></span><span class="loading-line"></span><span class="loading-line short"></span>';
    } else if (stateName === "error") {
      result.removeAttribute("aria-busy");
      result.textContent = "Your draft is unchanged. Fix the issue or try again.";
    }
  }

  function setMode(nextMode) {
    mode = nextMode === "linkedin" ? "linkedin" : "email";
    modeButtons.forEach((button) => {
      const active = button.dataset.mode === mode;
      button.setAttribute("aria-selected", String(active));
      button.classList.toggle("is-active", active);
    });
    if (contextInput) {
      contextInput.placeholder = mode === "email"
        ? "Example: A warm follow-up to a prospective client"
        : "Example: Independent consultants considering AI workflows";
    }
  }

  function updateCount() {
    if (!input || !count) return;
    count.textContent = `${input.value.length.toLocaleString()} / 5,000`;
  }
}

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(VOICE_KEY));
  } catch {
    return null;
  }
}

function updateProfileState(element) {
  if (!element) return;
  const profile = getProfile();
  element.innerHTML = profile
    ? '<i data-lucide="check" aria-hidden="true"></i><span>Voice notes ready</span>'
    : '<i data-lucide="notebook-pen" aria-hidden="true"></i><span>Add voice notes</span>';
  element.classList.toggle("is-ready", Boolean(profile));
  refreshIcons();
}

function applyLocalPreview(mode, sourceText, adjustment) {
  let output = LOCAL_PREVIEW_TEXT[mode];
  if (adjustment === "shorter") output = output.split("\n\n").slice(0, 3).join("\n\n");
  if (adjustment === "more_direct") output = output.replace("Quick update: ", "");
  if (adjustment === "more_conversational" && mode === "email") output = output.replace("Could you send", "Can you send");
  if (sourceText.length < 80) output = sourceText.replace(/I hope this (email|message) finds you well\.?\s*/i, "").trim();
  return output;
}

function isLocalPreview() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function track(event, properties = {}) {
  window.dispatchEvent(new CustomEvent("voicedraft:analytics", { detail: { event, properties } }));
}

function refreshIcons() {
  window.lucide?.createIcons();
}

export { VOICE_KEY, getProfile };
