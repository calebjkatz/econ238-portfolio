"use strict";
(function () {
  const endpoint = window.SNAKE_RIVER_VOTE_ENDPOINT || "";
  const ready = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint);
  const form = document.getElementById("vote-form");
  const state = document.getElementById("state");
  const fields = document.getElementById("ballot-fields");
  const button = document.getElementById("submit-vote");
  const conditionWrap = document.getElementById("conditional-wrap");
  const condition = document.getElementById("condition");
  const browserTokenField = document.getElementById("browser-token");

  function browserToken() {
    let existing;
    try { existing = localStorage.getItem("econ238-snake-river-ballot-token-v1"); } catch (_) {}
    if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
    const newToken = crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2,"0")).join("");
    try { localStorage.setItem("econ238-snake-river-ballot-token-v1", newToken); } catch (_) {}
    return newToken;
  }

  function setState(message, isReady) {
    state.textContent = message;
    state.className = isReady ? "ready" : "";
  }
  function toggleCondition() {
    const selected = form.querySelector('input[name="vote"]:checked');
    const conditional = Boolean(selected && selected.value === "yes_if");
    conditionWrap.classList.toggle("visible", conditional);
    condition.required = conditional;
    if (!conditional) condition.value = "";
  }
  form.querySelectorAll('input[name="vote"]').forEach(el => el.addEventListener("change", toggleCondition));

  if (!ready) {
    setState("Voting has not opened yet. The instructor's ballot page is being connected to its private response database.", false);
    return;
  }

  try { browserTokenField.value = browserToken(); }
  catch (_) { setState("Voting requires a secure browser with JavaScript enabled. Please try another browser.", false); return; }
  form.action = endpoint;
  fields.disabled = false;
  button.disabled = false;
  setState("Voting is open. Your response will be submitted securely and a confirmation page will appear.", true);

  form.addEventListener("submit", function (event) {
    const selected = form.querySelector('input[name="vote"]:checked');
    if (!selected) {
      event.preventDefault();
      setState("Choose YES, NO, or YES, IF… before submitting.", false);
      return;
    }
    if (selected.value === "yes_if" && condition.value.trim().length < 5) {
      event.preventDefault();
      setState("For YES, IF…, please describe your condition in at least five characters.", false);
      condition.focus();
      return;
    }
    if (!browserTokenField.value) {
      event.preventDefault();
      setState("A browser token could not be generated; your vote was not submitted.", false);
      return;
    }
    button.disabled = true;
    button.textContent = "Sending your response…";
    // Standard form POST navigates to a definitive server-side confirmation.
    // No CORS, optimistic success banner, or fake local vote counter is used.
    window.setTimeout(function () { button.disabled = false; button.textContent = "Submit anonymous vote →"; }, 12000);
  });
})();
