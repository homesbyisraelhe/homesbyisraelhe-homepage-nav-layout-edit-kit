(() => {
  const search = window.hbiSearch;
  if (!search) return;

  const form = document.querySelector("[data-search-page-form]");
  const input = document.querySelector("#search-page-input");
  const resultsEl = document.querySelector("[data-search-page-results]");
  const statusEl = document.querySelector("[data-search-status]");
  const chipsEl = document.querySelector("[data-search-chips]");
  const intentsEl = document.querySelector("[data-intent-filters]");
  const clearButton = document.querySelector("[data-clear-search]");
  const menu = document.querySelector("#site-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const state = {
    query: "",
    chipLabel: "",
    intentFilters: new Set()
  };

  const intentOptions = [
    ["sell", "Sell"],
    ["homeowners", "Homeowners"],
    ["move-relocate", "Move / Relocate"],
    ["invest", "Invest"],
    ["buy", "Buy"],
    ["local-areas", "Local Areas"]
  ];

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function setUrl() {
    const next = new URLSearchParams();
    if (state.query) next.set("q", state.query);
    if (state.chipLabel) next.set("situation", state.chipLabel);
    if (state.intentFilters.size) next.set("intent", [...state.intentFilters].join(","));
    const query = next.toString();
    history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  function readUrl() {
    const urlParams = params();
    state.query = urlParams.get("q") || "";
    state.chipLabel = urlParams.get("situation") || "";
    state.intentFilters = new Set((urlParams.get("intent") || "").split(",").filter(Boolean));
    input.value = state.query;
  }

  function renderIntentFilters() {
    intentsEl.innerHTML = intentOptions
      .map(
        ([value, label]) => `
          <label class="search-check">
            <input type="checkbox" value="${search.escapeHtml(value)}"${state.intentFilters.has(value) ? " checked" : ""}>
            <span>${search.escapeHtml(label)}</span>
          </label>
        `
      )
      .join("");
  }

  function renderChips() {
    chipsEl.innerHTML = (search.graph.quickChips || [])
      .map(
        (chip) => `
          <button type="button" data-search-chip="${search.escapeHtml(chip.label)}" aria-pressed="${state.chipLabel === chip.label ? "true" : "false"}" class="${state.chipLabel === chip.label ? "is-active" : ""}">
            ${search.escapeHtml(chip.label)}
          </button>
        `
      )
      .join("");
  }

  function noResultsHtml() {
    const suggestions = ["Compare Local Areas", "Beach city fit", "Compare areas before touring", "Payment or loan fit", "Offer strategy", "Need proceeds to buy", "Rental or tenant risk"];
    return `
      <div class="guidance-empty">
        <h3>No direct match yet</h3>
        <p>Try one of these broader situations, or use fewer city and timing terms.</p>
        <div class="search-empty-actions">
          ${suggestions.map((label) => `<button type="button" data-search-chip="${search.escapeHtml(label)}">${search.escapeHtml(label)}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function render() {
    const query = state.query || "";
    const results = search.search(query, {
      chipLabel: state.chipLabel,
      intentFilters: [...state.intentFilters],
      limit: 24
    });
    const activeLabel = state.chipLabel || query || "all guidance";
    statusEl.textContent = results.length ? `${results.length} matching path${results.length === 1 ? "" : "s"} for ${activeLabel}` : "No direct matches";
    search.renderCards(resultsEl, results, {
      hrefPrefix: "../",
      emptyHtml: noResultsHtml(),
      cardClass: "guidance-result-card global-result-card"
    });
    renderIntentFilters();
    renderChips();
    setUrl();
    search.track("hbi_global_search_render", {
      query,
      situation: state.chipLabel,
      intents: [...state.intentFilters],
      resultCount: results.length
    });
  }

  function applyQuery(value) {
    state.query = String(value || "").trim();
    state.chipLabel = "";
    render();
  }

  function closeMenu({ restoreFocus = false } = {}) {
    if (!menu) return;
    menu.hidden = true;
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("overlay-open");
    if (restoreFocus) menuToggle?.focus();
  }

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    menuToggle?.setAttribute("aria-expanded", "true");
    menuToggle?.setAttribute("aria-label", "Close menu");
    document.body.classList.add("overlay-open");
    menu.querySelector("[data-close-menu]")?.focus();
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    applyQuery(input.value);
  });

  document.querySelectorAll("[data-global-search-form]").forEach((headerForm) => {
    headerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = String(new FormData(headerForm).get("q") || "").trim();
      input.value = value;
      applyQuery(value);
      input.focus();
    });
  });

  chipsEl?.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-search-chip]");
    if (!chip) return;
    const label = chip.dataset.searchChip;
    state.chipLabel = state.chipLabel === label ? "" : label;
    const graphChip = (search.graph.quickChips || []).find((item) => item.label === state.chipLabel);
    state.query = graphChip?.query || "";
    input.value = state.query;
    render();
  });

  resultsEl?.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-search-chip]");
    if (chip) {
      const label = chip.dataset.searchChip;
      state.chipLabel = label;
      const graphChip = (search.graph.quickChips || []).find((item) => item.label === label);
      state.query = graphChip?.query || "";
      input.value = state.query;
      render();
      return;
    }

    const card = event.target.closest("[data-topic-id]");
    if (!card) return;
    search.track("hbi_global_search_click", {
      query: state.query,
      situation: state.chipLabel,
      topicId: card.dataset.topicId,
      primaryIntent: card.dataset.primaryIntent
    });
  });

  intentsEl?.addEventListener("change", (event) => {
    const checkbox = event.target.closest("input[type='checkbox']");
    if (!checkbox) return;
    if (checkbox.checked) state.intentFilters.add(checkbox.value);
    else state.intentFilters.delete(checkbox.value);
    render();
  });

  clearButton?.addEventListener("click", () => {
    state.query = "";
    state.chipLabel = "";
    state.intentFilters.clear();
    input.value = "";
    render();
    input.focus();
  });

  menuToggle?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (menu?.hidden) openMenu();
    else closeMenu({ restoreFocus: true });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-menu]")) {
      closeMenu({ restoreFocus: true });
      return;
    }
    if (!menu || menu.hidden) return;
    const clickedInsideMenu = event.target.closest("#site-menu");
    const clickedMenuToggle = event.target.closest(".menu-toggle");
    const clickedMenuControl = event.target.closest("#site-menu a, #site-menu button, #site-menu input, #site-menu select, #site-menu textarea");
    if (!clickedMenuToggle && (!clickedInsideMenu || !clickedMenuControl)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu && !menu.hidden) closeMenu({ restoreFocus: true });
  });

  readUrl();
  render();
})();
