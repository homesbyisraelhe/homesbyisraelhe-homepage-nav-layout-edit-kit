(() => {
  const modes = {
    trends: {
      label: "Local Market Trends",
      type: "Live market data",
      cityCta: "View market data",
      zipCta: "View ZIP data",
      cityBase: "./",
      zipBase: "./"
    },
    pulse: {
      label: "Housing Market Pulse",
      type: "Plain-English read",
      cityCta: "Read Market Pulse",
      zipCta: "Read ZIP Pulse",
      cityBase: "../housing-market-pulse/",
      zipBase: "../housing-market-pulse/"
    }
  };

  const cityRows = [
    ["Carson", "Los Angeles"],
    ["El Segundo", "Los Angeles"],
    ["Gardena", "Los Angeles"],
    ["Hawthorne", "Los Angeles"],
    ["Hermosa Beach", "Los Angeles"],
    ["Inglewood", "Los Angeles"],
    ["Lawndale", "Los Angeles"],
    ["Lomita", "Los Angeles"],
    ["Manhattan Beach", "Los Angeles"],
    ["Palos Verdes Estates", "Los Angeles"],
    ["Rancho Palos Verdes", "Los Angeles"],
    ["Redondo Beach", "Los Angeles"],
    ["Rolling Hills", "Los Angeles"],
    ["Rolling Hills Estates", "Los Angeles"],
    ["Torrance", "Los Angeles"],
    ["Beverly Hills", "Los Angeles"],
    ["Culver City", "Los Angeles"],
    ["Malibu", "Los Angeles"],
    ["Santa Monica", "Los Angeles"],
    ["West Hollywood", "Los Angeles"],
    ["Los Angeles \u2014 Westside", "Los Angeles"],
    ["Los Angeles \u2014 Central L.A. & Downtown", "Los Angeles"],
    ["Artesia", "Los Angeles"],
    ["Avalon", "Los Angeles"],
    ["Bell", "Los Angeles"],
    ["Bellflower", "Los Angeles"],
    ["Bell Gardens", "Los Angeles"],
    ["Cerritos", "Los Angeles"],
    ["Commerce", "Los Angeles"],
    ["Compton", "Los Angeles"],
    ["Cudahy", "Los Angeles"],
    ["Downey", "Los Angeles"],
    ["Hawaiian Gardens", "Los Angeles"],
    ["Huntington Park", "Los Angeles"],
    ["Industry", "Los Angeles"],
    ["La Habra Heights", "Los Angeles"],
    ["La Mirada", "Los Angeles"],
    ["Lakewood", "Los Angeles"],
    ["Long Beach", "Los Angeles"],
    ["Lynwood", "Los Angeles"],
    ["Maywood", "Los Angeles"],
    ["Montebello", "Los Angeles"],
    ["Norwalk", "Los Angeles"],
    ["Paramount", "Los Angeles"],
    ["Pico Rivera", "Los Angeles"],
    ["Santa Fe Springs", "Los Angeles"],
    ["Signal Hill", "Los Angeles"],
    ["South Gate", "Los Angeles"],
    ["Vernon", "Los Angeles"],
    ["Whittier", "Los Angeles"],
    ["Los Angeles \u2014 Harbor Area", "Los Angeles"],
    ["Buena Park", "Orange"],
    ["Cypress", "Orange"],
    ["La Habra", "Orange"],
    ["La Palma", "Orange"],
    ["Los Alamitos", "Orange"],
    ["Seal Beach", "Orange"],
    ["Stanton", "Orange"],
    ["Westminster", "Orange"],
    ["Anaheim", "Orange"],
    ["Fullerton", "Orange"],
    ["Garden Grove", "Orange"],
    ["Orange", "Orange"],
    ["Santa Ana", "Orange"],
    ["Tustin", "Orange"],
    ["Villa Park", "Orange"],
    ["Brea", "Orange"],
    ["Placentia", "Orange"],
    ["Yorba Linda", "Orange"],
    ["Costa Mesa", "Orange"],
    ["Fountain Valley", "Orange"],
    ["Huntington Beach", "Orange"],
    ["Newport Beach", "Orange"]
  ];

  const zipRowsText = `
90745|Carson|Los Angeles
90746|Carson|Los Angeles
90245|El Segundo|Los Angeles
90247|Gardena|Los Angeles
90248|Gardena|Los Angeles
90249|Gardena|Los Angeles
90250|Hawthorne|Los Angeles
90254|Hermosa Beach|Los Angeles
90301|Inglewood|Los Angeles
90302|Inglewood|Los Angeles
90303|Inglewood|Los Angeles
90304|Inglewood|Los Angeles
90305|Inglewood|Los Angeles
90260|Lawndale|Los Angeles
90717|Lomita|Los Angeles
90266|Manhattan Beach|Los Angeles
90274|Palos Verdes Estates|Los Angeles
90275|Rancho Palos Verdes|Los Angeles
90732|Rancho Palos Verdes|Los Angeles
90277|Redondo Beach|Los Angeles
90278|Redondo Beach|Los Angeles
90274|Rolling Hills|Los Angeles
90274|Rolling Hills Estates|Los Angeles
90275|Rolling Hills Estates|Los Angeles
90501|Torrance|Los Angeles
90503|Torrance|Los Angeles
90504|Torrance|Los Angeles
90505|Torrance|Los Angeles
90210|Beverly Hills|Los Angeles
90211|Beverly Hills|Los Angeles
90212|Beverly Hills|Los Angeles
90230|Culver City|Los Angeles
90232|Culver City|Los Angeles
90265|Malibu|Los Angeles
90401|Santa Monica|Los Angeles
90402|Santa Monica|Los Angeles
90403|Santa Monica|Los Angeles
90404|Santa Monica|Los Angeles
90405|Santa Monica|Los Angeles
90046|West Hollywood|Los Angeles
90048|West Hollywood|Los Angeles
90069|West Hollywood|Los Angeles
90024|Los Angeles \u2014 Westside|Los Angeles
90025|Los Angeles \u2014 Westside|Los Angeles
90034|Los Angeles \u2014 Westside|Los Angeles
90035|Los Angeles \u2014 Westside|Los Angeles
90045|Los Angeles \u2014 Westside|Los Angeles
90049|Los Angeles \u2014 Westside|Los Angeles
90064|Los Angeles \u2014 Westside|Los Angeles
90066|Los Angeles \u2014 Westside|Los Angeles
90067|Los Angeles \u2014 Westside|Los Angeles
90077|Los Angeles \u2014 Westside|Los Angeles
90094|Los Angeles \u2014 Westside|Los Angeles
90272|Los Angeles \u2014 Westside|Los Angeles
90291|Los Angeles \u2014 Westside|Los Angeles
90292|Los Angeles \u2014 Westside|Los Angeles
90293|Los Angeles \u2014 Westside|Los Angeles
90004|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90005|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90006|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90007|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90010|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90011|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90012|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90013|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90014|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90015|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90017|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90020|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90021|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90026|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90027|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90028|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90029|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90031|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90033|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90037|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90038|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90039|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90057|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90062|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90063|Los Angeles \u2014 Central L.A. & Downtown|Los Angeles
90701|Artesia|Los Angeles
90704|Avalon|Los Angeles
90201|Bell|Los Angeles
90706|Bellflower|Los Angeles
90201|Bell Gardens|Los Angeles
90703|Cerritos|Los Angeles
90040|Commerce|Los Angeles
90220|Compton|Los Angeles
90221|Compton|Los Angeles
90222|Compton|Los Angeles
90201|Cudahy|Los Angeles
90240|Downey|Los Angeles
90241|Downey|Los Angeles
90242|Downey|Los Angeles
90716|Hawaiian Gardens|Los Angeles
90255|Huntington Park|Los Angeles
91744|Industry|Los Angeles
90631|La Habra Heights|Los Angeles
90638|La Mirada|Los Angeles
90712|Lakewood|Los Angeles
90713|Lakewood|Los Angeles
90715|Lakewood|Los Angeles
90802|Long Beach|Los Angeles
90803|Long Beach|Los Angeles
90804|Long Beach|Los Angeles
90805|Long Beach|Los Angeles
90806|Long Beach|Los Angeles
90807|Long Beach|Los Angeles
90808|Long Beach|Los Angeles
90810|Long Beach|Los Angeles
90813|Long Beach|Los Angeles
90814|Long Beach|Los Angeles
90815|Long Beach|Los Angeles
90262|Lynwood|Los Angeles
90270|Maywood|Los Angeles
90640|Montebello|Los Angeles
90650|Norwalk|Los Angeles
90723|Paramount|Los Angeles
90660|Pico Rivera|Los Angeles
90670|Santa Fe Springs|Los Angeles
90755|Signal Hill|Los Angeles
90280|South Gate|Los Angeles
90058|Vernon|Los Angeles
90601|Whittier|Los Angeles
90602|Whittier|Los Angeles
90603|Whittier|Los Angeles
90604|Whittier|Los Angeles
90605|Whittier|Los Angeles
90710|Los Angeles \u2014 Harbor Area|Los Angeles
90731|Los Angeles \u2014 Harbor Area|Los Angeles
90732|Los Angeles \u2014 Harbor Area|Los Angeles
90744|Los Angeles \u2014 Harbor Area|Los Angeles
90620|Buena Park|Orange
90621|Buena Park|Orange
90630|Cypress|Orange
90631|La Habra|Orange
90623|La Palma|Orange
90720|Los Alamitos|Orange
90740|Seal Beach|Orange
90743|Seal Beach|Orange
90680|Stanton|Orange
92683|Westminster|Orange
92801|Anaheim|Orange
92802|Anaheim|Orange
92804|Anaheim|Orange
92805|Anaheim|Orange
92806|Anaheim|Orange
92807|Anaheim|Orange
92808|Anaheim|Orange
92831|Fullerton|Orange
92832|Fullerton|Orange
92833|Fullerton|Orange
92835|Fullerton|Orange
92840|Garden Grove|Orange
92841|Garden Grove|Orange
92843|Garden Grove|Orange
92844|Garden Grove|Orange
92845|Garden Grove|Orange
92865|Orange|Orange
92866|Orange|Orange
92867|Orange|Orange
92868|Orange|Orange
92869|Orange|Orange
92701|Santa Ana|Orange
92703|Santa Ana|Orange
92704|Santa Ana|Orange
92705|Santa Ana|Orange
92706|Santa Ana|Orange
92707|Santa Ana|Orange
92780|Tustin|Orange
92782|Tustin|Orange
92861|Villa Park|Orange
92867|Villa Park|Orange
92821|Brea|Orange
92823|Brea|Orange
92870|Placentia|Orange
92886|Yorba Linda|Orange
92887|Yorba Linda|Orange
92626|Costa Mesa|Orange
92627|Costa Mesa|Orange
92708|Fountain Valley|Orange
90742|Huntington Beach|Orange
92646|Huntington Beach|Orange
92647|Huntington Beach|Orange
92648|Huntington Beach|Orange
92649|Huntington Beach|Orange
92625|Newport Beach|Orange
92657|Newport Beach|Orange
92660|Newport Beach|Orange
92661|Newport Beach|Orange
92662|Newport Beach|Orange
92663|Newport Beach|Orange
`;

  const state = {
    mode: "trends",
    kind: "city",
    query: "",
    index: "all",
    page: 1,
    perPage: 10
  };

  const els = {
    menu: document.querySelector("#site-menu"),
    menuToggle: document.querySelector(".menu-toggle"),
    search: document.querySelector("#market-location-search"),
    resultCount: document.querySelector("#market-result-count"),
    selected: document.querySelector("#market-selected-filters"),
    title: document.querySelector("#results-title"),
    results: document.querySelector("#market-results"),
    index: document.querySelector("#market-index"),
    indexBlock: document.querySelector("[data-market-index-block]"),
    indexTitle: document.querySelector("#quick-index-title"),
    pathHelp: document.querySelector("[data-market-path-help]"),
    autocomplete: document.querySelector("#market-autocomplete"),
    perPage: document.querySelector("#market-per-page"),
    pagination: document.querySelector("#market-pagination-status"),
    prev: document.querySelector("[data-market-page-prev]"),
    next: document.querySelector("[data-market-page-next]"),
    conciergeForm: document.querySelector("[data-market-concierge-form]"),
    conciergeInput: document.querySelector("#market-concierge-input"),
    conciergeResponse: document.querySelector("[data-market-concierge-response]")
  };

  const navHubHrefs = {
    "mega-buy": "../buy/#article-library",
    "mega-sell": "../sell/#article-library",
    "mega-move": "../move-relocate/#article-library",
    "mega-homeowners": "../homeowners/#article-library",
    "mega-invest": "../invest/#article-library",
    "mega-local": "../local-areas/#article-library",
    "mega-resources": "../index.html#resources"
  };

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const slugify = (value) => normalize(value).replace(/\s+/g, "-");

  const countyLabel = (county) => (county ? `${county} County` : "Market area");

  const cityEntries = cityRows
    .map(([name, county]) => ({
      kind: "city",
      name,
      county,
      slug: slugify(name),
      indexKey: name.charAt(0).toUpperCase(),
      searchText: normalize(`${name} ${county} County`)
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const zipEntries = zipRowsText
    .trim()
    .split("\n")
    .map((line) => line.split("|"))
    .filter(([zip]) => /^\d{5}$/.test(zip))
    .map(([zip, place, county]) => ({
      kind: "zip",
      zip,
      name: zip,
      place,
      county,
      slug: zip,
      indexKey: zip.slice(0, 3),
      searchText: normalize(`${zip} ${place} ${county} County`)
    }))
    .sort((a, b) => a.zip.localeCompare(b.zip) || a.place.localeCompare(b.place));

  const entriesByKind = {
    city: cityEntries,
    zip: zipEntries
  };

  let activeEntriesByKind = entriesByKind;

  function entryFromIndexLocation(location) {
    const kind = location.kind === "zip" ? "zip" : "city";
    const name = kind === "zip" ? location.zip || location.name : location.name;
    const county = location.county || "";

    return {
      kind,
      name,
      zip: location.zip || "",
      place: location.city || "",
      county,
      slug: location.slug || slugify(name),
      pagePath: location.pagePath || "",
      dataPath: location.dataPath || "",
      capabilitySummary: location.capabilitySummary || {},
      rowCount: location.rowCount || 0,
      downloadedRowCount: location.downloadedRowCount || 0,
      noDataRowCount: location.noDataRowCount || 0,
      indexKey: kind === "zip" ? String(location.zip || name).slice(0, 3) : String(name || "").charAt(0).toUpperCase(),
      searchText:
        location.searchText ||
        normalize(
          [
            name,
            location.zip,
            location.city,
            county,
            location.regionGroup,
            location.subregion,
            location.infosparksLocationName
          ].join(" ")
        )
    };
  }

  function normalizeIndexPayload(payload) {
    if (!payload || !Array.isArray(payload.locations)) return null;
    const nextEntriesByKind = { city: [], zip: [] };

    payload.locations.forEach((location) => {
      if (!location || !["city", "zip"].includes(location.kind)) return;
      const entry = entryFromIndexLocation(location);
      nextEntriesByKind[entry.kind].push(entry);
    });

    nextEntriesByKind.city.sort((a, b) => a.name.localeCompare(b.name));
    nextEntriesByKind.zip.sort((a, b) => a.zip.localeCompare(b.zip) || a.place.localeCompare(b.place));

    if (!nextEntriesByKind.city.length || !nextEntriesByKind.zip.length) return null;
    return nextEntriesByKind;
  }

  async function loadMarketIndex() {
    try {
      const response = await fetch("./data/market-index.json");
      if (!response.ok) throw new Error(`Market index request failed: ${response.status}`);
      const payload = await response.json();
      if (payload.schemaVersion !== 1) throw new Error("Market index schema version is unsupported.");
      const nextEntriesByKind = normalizeIndexPayload(payload);
      if (!nextEntriesByKind) throw new Error("Market index did not include city and ZIP entries.");
      activeEntriesByKind = nextEntriesByKind;
    } catch (error) {
      activeEntriesByKind = entriesByKind;
      console.warn("Using fallback market finder dataset.", error);
    }
  }

  function hrefFor(entry) {
    const mode = modes[state.mode];
    if (state.mode === "trends" && entry.pagePath) return entry.pagePath;
    const base = entry.kind === "city" ? mode.cityBase : mode.zipBase;
    return `${base}${entry.slug}/`;
  }

  function entryTitle(entry) {
    return entry.kind === "city" ? entry.name : entry.zip;
  }

  function entryMeta(entry) {
    if (entry.kind === "city") return countyLabel(entry.county);
    return entry.place ? `${entry.place} | ${countyLabel(entry.county)}` : countyLabel(entry.county);
  }

  function ctaFor(entry) {
    const mode = modes[state.mode];
    return entry.kind === "city" ? mode.cityCta : mode.zipCta;
  }

  function itemNoun(count) {
    if (state.kind === "city") return count === 1 ? "city" : "cities";
    return count === 1 ? "ZIP code" : "ZIP codes";
  }

  function currentEntries() {
    const query = normalize(state.query);
    return (activeEntriesByKind[state.kind] || []).filter((entry) => {
      const indexMatch = state.kind !== "city" || state.index === "all" || entry.indexKey === state.index;
      const queryMatch = !query || entry.searchText.includes(query);
      return indexMatch && queryMatch;
    });
  }

  function autocompleteScore(entry, query) {
    const title = normalize(entryTitle(entry));
    const meta = normalize(entryMeta(entry));
    if (title === query) return 0;
    if (title.startsWith(query)) return 1;
    if (title.split(" ").some((part) => part.startsWith(query))) return 2;
    if (meta.includes(query)) return 3;
    if (entry.searchText.includes(query)) return 4;
    return 99;
  }

  function autocompleteMatches() {
    const query = normalize(state.query);
    if (query.length < 2) return [];
    return (activeEntriesByKind[state.kind] || [])
      .map((entry) => ({ entry, score: autocompleteScore(entry, query) }))
      .filter((item) => item.score < 99)
      .sort((a, b) => a.score - b.score || entryTitle(a.entry).localeCompare(entryTitle(b.entry), undefined, { numeric: true }))
      .slice(0, 6)
      .map((item) => item.entry);
  }

  function allActiveEntries() {
    return [...(activeEntriesByKind.city || []), ...(activeEntriesByKind.zip || [])];
  }

  function routeMatchFor(queryValue) {
    const raw = String(queryValue || "").trim();
    const query = normalize(raw);
    if (!query) return null;
    const pools = /^\d{5}$/.test(raw)
      ? [activeEntriesByKind.zip || [], activeEntriesByKind.city || []]
      : [activeEntriesByKind[state.kind] || [], allActiveEntries()];
    const seen = new Set();
    const candidates = pools.flat().filter((entry) => {
      const key = `${entry.kind}:${entry.slug}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const exact = candidates.find((entry) => normalize(entryTitle(entry)) === query || normalize(entry.zip) === query);
    if (exact) return exact;
    return candidates
      .map((entry) => ({ entry, score: autocompleteScore(entry, query) }))
      .filter((item) => item.score < 99)
      .sort((a, b) => a.score - b.score || entryTitle(a.entry).localeCompare(entryTitle(b.entry), undefined, { numeric: true }))[0]?.entry || null;
  }

  function entryKey(entry) {
    return `${entry.kind}:${entry.slug}`;
  }

  function entryFromKey(key) {
    const [kind, ...slugParts] = String(key || "").split(":");
    const slug = slugParts.join(":");
    return (activeEntriesByKind[kind] || []).find((entry) => entry.slug === slug) || null;
  }

  function trendHrefFor(entry) {
    if (!entry) return "./#article-library";
    if (entry.pagePath) return entry.pagePath;
    const base = entry.kind === "city" ? modes.trends.cityBase : modes.trends.zipBase;
    return `${base}${entry.slug}/`;
  }

  function conciergeIntentFor(prompt) {
    const query = normalize(prompt);
    const strategyTerms = [
      "should i",
      "good time",
      "bad time",
      "sell",
      "selling",
      "buy",
      "buying",
      "wait",
      "hold",
      "rent",
      "lease",
      "offer",
      "pricing",
      "price my",
      "timing",
      "move",
      "relocate",
      "advice",
      "strategy",
      "worth"
    ];
    const dataTerms = [
      "chart",
      "charts",
      "data",
      "stats",
      "statistics",
      "trend",
      "trends",
      "inventory",
      "active listings",
      "pending",
      "closed sales",
      "median",
      "average",
      "months supply",
      "days on market",
      "price per sq ft",
      "ppsf"
    ];
    const isStrategy = strategyTerms.some((term) => query.includes(term));
    const isData = dataTerms.some((term) => query.includes(term));

    return {
      mode: isStrategy && !isData ? "pulse" : "trends",
      needsHumanAdvice: isStrategy
    };
  }

  function conciergeLocationFor(prompt) {
    const raw = String(prompt || "").trim();
    const normalizedPrompt = normalize(raw);
    const zipMatch = raw.match(/\b\d{5}\b/);
    if (zipMatch) {
      const zipEntry = (activeEntriesByKind.zip || []).find((entry) => entry.zip === zipMatch[0]);
      if (zipEntry) return zipEntry;
    }

    const entries = allActiveEntries()
      .map((entry) => ({ entry, title: normalize(entryTitle(entry)) }))
      .filter((item) => item.title.length >= 3)
      .sort((a, b) => b.title.length - a.title.length || entryTitle(a.entry).localeCompare(entryTitle(b.entry)));

    const direct = entries.find(({ entry, title }) => {
      if (!normalizedPrompt.includes(title)) return false;
      if (entry.kind === "city" && title === "orange" && normalizedPrompt.includes("orange county")) return false;
      return true;
    });

    return direct?.entry || routeMatchFor(raw);
  }

  function applyConciergeToFinder(entry, mode) {
    if (!entry) {
      setFinderOpen(true);
      document.querySelector("#article-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
      els.search.focus({ preventScroll: true });
      return;
    }

    state.mode = modes[mode] ? mode : "trends";
    state.kind = entry.kind;
    state.query = entryTitle(entry);
    state.index = "all";
    state.page = 1;
    els.search.value = state.query;
    setFinderOpen(true);
    renderControls();
    updateUrl();
    document.querySelector("#article-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
    els.search.focus({ preventScroll: true });
  }

  function renderConciergeResponse(result) {
    if (!els.conciergeResponse) return;
    const { entry, mode, needsHumanAdvice } = result;
    const modeLabel = modes[mode]?.label || modes.trends.label;

    if (!entry) {
      els.conciergeResponse.hidden = false;
      els.conciergeResponse.innerHTML = `
        <h3>Add a city or ZIP so I can point you in the right direction.</h3>
        <p>I can read the question, but I need a place such as Torrance, Long Beach, or 90803 before opening the right market page.</p>
        <div class="market-concierge-actions">
          <button type="button" class="market-concierge-action is-primary" data-concierge-action="focus-finder">Choose from the finder</button>
        </div>
      `;
      syncViewportSpace();
      return;
    }

    const title = entryTitle(entry);
    const advice = mode === "pulse"
      ? `This sounds like a timing or strategy question for ${title}. Start with the Pulse lens, then use the live dashboard if you want the numbers behind it.`
      : `This sounds like a data question for ${title}. Start with the live trend dashboard for inventory, price, and activity signals.`;
    const finderLabel = mode === "pulse" ? "Show Pulse finder" : "Show Trends finder";
    const dashboardClass = mode === "trends" ? " is-primary" : "";
    const finderClass = mode === "pulse" ? " is-primary" : "";

    els.conciergeResponse.hidden = false;
    els.conciergeResponse.innerHTML = `
      <h3>${escapeHtml(modeLabel)} for ${escapeHtml(title)}</h3>
      <p>${escapeHtml(advice)}</p>
      <div class="market-concierge-actions">
        <a class="market-concierge-action${dashboardClass}" href="${escapeHtml(trendHrefFor(entry))}">Open live dashboard</a>
        <button type="button" class="market-concierge-action${finderClass}" data-concierge-action="apply-finder" data-concierge-entry="${escapeHtml(entryKey(entry))}" data-concierge-mode="${escapeHtml(mode)}">${escapeHtml(finderLabel)}</button>
        ${needsHumanAdvice ? `<a class="market-concierge-action" href="../index.html#contact-israel">Talk to Israel</a>` : ""}
      </div>
    `;
    syncViewportSpace();
  }

  function runConcierge(prompt) {
    const raw = String(prompt || "").trim();
    if (!raw) {
      renderConciergeResponse({ entry: null, mode: "trends", needsHumanAdvice: false });
      return;
    }
    const intent = conciergeIntentFor(raw);
    renderConciergeResponse({
      entry: conciergeLocationFor(raw),
      mode: intent.mode,
      needsHumanAdvice: intent.needsHumanAdvice
    });
  }

  function openEntryRoute(entry) {
    if (!entry) return false;
    window.location.href = hrefFor(entry);
    return true;
  }

  function openBestRoute() {
    const query = els.search.value.trim();
    const match = routeMatchFor(query);
    if (match) return openEntryRoute(match);
    setQuery(query);
    return false;
  }

  function hideAutocomplete() {
    if (!els.autocomplete) return;
    els.autocomplete.hidden = true;
    els.autocomplete.innerHTML = "";
    els.search?.setAttribute("aria-expanded", "false");
  }

  function renderAutocomplete() {
    if (!els.autocomplete || document.activeElement !== els.search) {
      hideAutocomplete();
      return;
    }
    const matches = autocompleteMatches();
    if (!matches.length) {
      hideAutocomplete();
      return;
    }
    els.autocomplete.hidden = false;
    els.search.setAttribute("aria-expanded", "true");
    els.autocomplete.innerHTML = matches
      .map(
        (entry) => `
          <button type="button" class="market-autocomplete-option" role="option" data-market-autocomplete-option="${escapeHtml(entry.kind)}:${escapeHtml(entry.slug)}">
            <span>${escapeHtml(entryTitle(entry))}</span>
            <small>${escapeHtml(entryMeta(entry))}</small>
          </button>
        `
      )
      .join("");
  }

  function selectAutocomplete(value, { navigate = false } = {}) {
    const [kind, ...slugParts] = String(value || "").split(":");
    const slug = slugParts.join(":");
    const entry = (activeEntriesByKind[kind] || []).find((item) => item.slug === slug);
    if (!entry) return;
    if (navigate) {
      openEntryRoute(entry);
      return;
    }
    state.kind = kind;
    state.query = entryTitle(entry);
    state.index = "all";
    state.page = 1;
    els.search.value = state.query;
    hideAutocomplete();
    renderControls();
    updateUrl();
    els.search.focus({ preventScroll: true });
  }

  function indexOptions() {
    const keys = [...new Set((activeEntriesByKind[state.kind] || []).map((entry) => entry.indexKey).filter(Boolean))];
    return ["all", ...keys];
  }

  function renderIndex() {
    if (els.indexBlock) els.indexBlock.hidden = state.kind !== "city";
    if (state.kind !== "city") {
      els.index.innerHTML = "";
      return;
    }
    els.indexTitle.textContent = "A-Z city index";
    els.index.innerHTML = indexOptions()
      .map((key) => {
        const label = key === "all" ? "All" : key;
        const active = state.index === key ? " is-active" : "";
        return `<button type="button" class="${active.trim()}" data-index-option="${escapeHtml(key)}" aria-pressed="${state.index === key ? "true" : "false"}">${escapeHtml(label)}</button>`;
      })
      .join("");
  }

  function renderResults() {
    const items = currentEntries();
    const mode = modes[state.mode];
    const kindLabel = state.kind === "city" ? "City" : "ZIP";
    const perPage = Number(state.perPage) || 10;
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * perPage;
    const visible = items.slice(start, start + perPage);
    els.title.textContent = `${mode.label} by ${kindLabel}`;
    els.resultCount.textContent = items.length
      ? `Showing ${start + 1}-${start + visible.length} out of ${items.length} ${itemNoun(items.length)}`
      : `Showing 0 ${itemNoun(0)}`;
    els.selected.textContent = `${mode.label} | ${kindLabel} | ${state.query ? `Search: ${state.query}` : state.index === "all" ? "All locations" : state.index}`;
    if (els.pagination) els.pagination.textContent = `Page ${state.page} of ${totalPages}`;
    if (els.prev) els.prev.disabled = state.page <= 1;
    if (els.next) els.next.disabled = state.page >= totalPages;

    if (!items.length) {
      els.results.innerHTML = `
        <div class="market-empty">
          <h3>No matching locations</h3>
          <p>Try a city name like Long Beach or Cerritos, or a ZIP like 90803.</p>
        </div>
      `;
      syncViewportSpace();
      return;
    }

    let currentGroup = "";
    const html = [];
    visible.forEach((entry) => {
      if (entry.indexKey !== currentGroup) {
        if (currentGroup) html.push("</div>");
        currentGroup = entry.indexKey;
        html.push(`<div class="market-result-group"><h3 class="market-group-heading">${escapeHtml(currentGroup)}</h3>`);
      }
      html.push(`
        <a class="market-result-card" href="${escapeHtml(hrefFor(entry))}">
          <span class="market-result-copy">
            <span class="market-result-type">${escapeHtml(mode.type)}</span>
            <span class="market-result-title">${escapeHtml(entryTitle(entry))}</span>
            <span class="market-result-meta">${escapeHtml(entryMeta(entry))}</span>
          </span>
          <span class="market-result-cta">${escapeHtml(ctaFor(entry))}</span>
        </a>
      `);
    });
    if (currentGroup) html.push("</div>");
    els.results.innerHTML = html.join("");
    syncViewportSpace();
  }

  function renderControls() {
    document.querySelectorAll("[data-route-card]").forEach((card) => {
      const active = card.dataset.routeCard === state.mode;
      card.classList.toggle("is-active", active);
      card.setAttribute("aria-pressed", active ? "true" : "false");
    });
    document.querySelectorAll("[data-mode-option]").forEach((button) => {
      const active = button.dataset.modeOption === state.mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    document.querySelectorAll("[data-kind-option]").forEach((button) => {
      const active = button.dataset.kindOption === state.kind;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    els.search.placeholder = state.kind === "zip" ? "Search ZIP code" : "Search city";
    renderPathHelp();
    renderIndex();
    renderResults();
    renderAutocomplete();
  }

  function renderPathHelp() {
    if (!els.pathHelp) return;
    const copy = state.mode === "pulse"
      ? {
          title: "Explain it to me",
          body: "Use this when you want plain-English context for a buying, selling, downsizing, investing, holding, leasing, or waiting decision."
        }
      : {
          title: "Show me the data",
          body: "Use this when you want to check live signals like inventory, sales pace, price movement, and supply before choosing a city or ZIP."
        };

    els.pathHelp.innerHTML = `
      <strong>${escapeHtml(copy.title)}</strong>
      <span>${escapeHtml(copy.body)}</span>
    `;
  }

  function updateUrl() {
    const params = new URLSearchParams();
    if (state.mode !== "trends") params.set("mode", state.mode);
    if (state.kind !== "city") params.set("view", state.kind);
    if (state.query) params.set("q", state.query);
    if (state.kind === "city" && state.index !== "all") params.set("index", state.index);
    if (state.page !== 1) params.set("page", String(state.page));
    if (state.perPage !== 10) params.set("perPage", String(state.perPage));
    const query = params.toString();
    const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash || ""}`;
    window.history.replaceState({}, "", next);
  }

  function setMode(mode, { scroll = false } = {}) {
    if (!modes[mode]) return;
    state.mode = mode;
    state.page = 1;
    renderControls();
    updateUrl();
    if (scroll) document.querySelector("#article-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setKind(kind) {
    if (!activeEntriesByKind[kind]) return;
    state.kind = kind;
    state.index = "all";
    state.page = 1;
    renderControls();
    updateUrl();
  }

  function setQuery(query) {
    state.query = query.trim();
    state.index = "all";
    state.page = 1;
    els.search.value = state.query;
    renderIndex();
    renderResults();
    renderAutocomplete();
    updateUrl();
  }

  function setIndex(index) {
    state.index = index;
    state.page = 1;
    renderIndex();
    renderResults();
    updateUrl();
  }

  function setPage(page) {
    state.page = Math.max(1, page);
    renderResults();
    updateUrl();
  }

  function setPerPage(perPage) {
    state.perPage = Number(perPage) || 10;
    state.page = 1;
    renderResults();
    updateUrl();
  }

  function resetFinder() {
    state.mode = "trends";
    state.kind = "city";
    state.query = "";
    state.index = "all";
    state.page = 1;
    state.perPage = 10;
    els.search.value = "";
    els.perPage.value = "10";
    renderControls();
    updateUrl();
  }

  function setFinderOpen(open) {
    const toggle = document.querySelector("[data-market-filter-toggle]");
    const body = document.querySelector("#market-filter-body");
    if (!toggle || !body) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    body.hidden = !open;
    syncViewportSpace();
  }

  function shouldOpenFinderByDefault() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("q") || params.has("view") || params.has("mode") || window.location.hash === "#article-library") return true;
    return window.matchMedia("(min-width: 901px)").matches;
  }

  function globalSearchUrl(query) {
    const url = new URL("../search/", window.location.href);
    if (query) url.searchParams.set("q", query);
    return url.href;
  }

  function closeMenu() {
    if (!els.menu) return;
    els.menu.hidden = true;
    els.menuToggle?.setAttribute("aria-expanded", "false");
    els.menuToggle?.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("overlay-open");
  }

  function openMenu() {
    if (!els.menu) return;
    els.menu.hidden = false;
    els.menuToggle?.setAttribute("aria-expanded", "true");
    els.menuToggle?.setAttribute("aria-label", "Close menu");
    document.body.classList.add("overlay-open");
  }

  function syncViewportSpace() {
    // CSS owns sticky sidebar sizing; avoid scroll-time style writes that make the panel jump.
  }

  function navHubHrefForTrigger(trigger) {
    if (!trigger) return "";
    return trigger.dataset.navHref || navHubHrefs[trigger.getAttribute("aria-controls")] || "";
  }

  function goToNavHub(trigger) {
    const href = navHubHrefForTrigger(trigger);
    if (!href) return false;
    window.location.href = href;
    return true;
  }

  function closeMegaMenus() {
    document.querySelectorAll("[data-mega-trigger]").forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".nav-item.is-open").forEach((item) => item.classList.remove("is-open"));
  }

  function applyInitialState() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const view = params.get("view");
    const q = params.get("q");
    const index = params.get("index");
    const page = Number(params.get("page"));
    const perPage = Number(params.get("perPage"));
    if (modes[mode]) state.mode = mode;
    if (activeEntriesByKind[view]) state.kind = view;
    if (q) state.query = q;
    if (index && state.kind === "city") state.index = index;
    else state.index = "all";
    if ([10, 20, 50].includes(perPage)) state.perPage = perPage;
    if (page > 1) state.page = page;
    els.search.value = state.query;
    els.perPage.value = String(state.perPage);
  }

  async function init() {
    await loadMarketIndex();
    applyInitialState();
    renderControls();
    setFinderOpen(shouldOpenFinderByDefault());
    syncViewportSpace();

    document.addEventListener("click", (event) => {
      const megaTrigger = event.target.closest("[data-mega-trigger]");
      if (megaTrigger) {
        if (goToNavHub(megaTrigger)) return;
        const item = megaTrigger.closest(".nav-item");
        const willOpen = megaTrigger.getAttribute("aria-expanded") !== "true";
        closeMegaMenus();
        if (willOpen) {
          megaTrigger.setAttribute("aria-expanded", "true");
          item?.classList.add("is-open");
        }
        return;
      }

      const conciergeExample = event.target.closest("[data-concierge-example]");
      if (conciergeExample) {
        const value = conciergeExample.dataset.conciergeExample || "";
        if (els.conciergeInput) els.conciergeInput.value = value;
        runConcierge(value);
        return;
      }

      const conciergeAction = event.target.closest("[data-concierge-action]");
      if (conciergeAction) {
        const action = conciergeAction.dataset.conciergeAction;
        if (action === "apply-finder") {
          applyConciergeToFinder(entryFromKey(conciergeAction.dataset.conciergeEntry), conciergeAction.dataset.conciergeMode);
          return;
        }
        if (action === "focus-finder") {
          applyConciergeToFinder(null, "trends");
          return;
        }
      }

      const autocompleteOption = event.target.closest("[data-market-autocomplete-option]");
      if (autocompleteOption) {
        selectAutocomplete(autocompleteOption.dataset.marketAutocompleteOption, { navigate: true });
        return;
      }

      if (event.target.closest("[data-market-location-submit]")) {
        openBestRoute();
        return;
      }

      const filterToggle = event.target.closest("[data-market-filter-toggle]");
      if (filterToggle) {
        const isOpen = filterToggle.getAttribute("aria-expanded") === "true";
        setFinderOpen(!isOpen);
        return;
      }

      const heroKind = event.target.closest("[data-hero-kind]");
      if (heroKind) {
        event.preventDefault();
        setKind(heroKind.dataset.heroKind);
        setFinderOpen(true);
        document.querySelector("#article-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
        els.search.focus({ preventScroll: true });
        return;
      }

      const signalCard = event.target.closest("[data-signal-mode]");
      if (signalCard) {
        setMode(signalCard.dataset.signalMode || "pulse", { scroll: true });
        return;
      }

      const modeButton = event.target.closest("[data-set-mode]");
      if (modeButton) {
        setMode(modeButton.dataset.setMode, { scroll: true });
        return;
      }

      const modeOption = event.target.closest("[data-mode-option]");
      if (modeOption) {
        setMode(modeOption.dataset.modeOption);
        return;
      }

      const kindOption = event.target.closest("[data-kind-option]");
      if (kindOption) {
        setKind(kindOption.dataset.kindOption);
        return;
      }

      const indexOption = event.target.closest("[data-index-option]");
      if (indexOption) {
        setIndex(indexOption.dataset.indexOption);
        return;
      }

      if (event.target.closest("[data-market-reset]")) {
        resetFinder();
        return;
      }

      if (event.target.closest("[data-market-page-prev]")) {
        setPage(state.page - 1);
        return;
      }

      if (event.target.closest("[data-market-page-next]")) {
        setPage(state.page + 1);
        return;
      }

      if (event.target.closest("[data-close-menu]")) {
        closeMenu();
      }

      const clickedInsideMega = event.target.closest(".nav-item");
      if (!clickedInsideMega && !event.target.closest("[data-mega-menu]")) {
        closeMegaMenus();
      }

      if (!event.target.closest(".market-search-control")) {
        hideAutocomplete();
      }
    });

    els.search.addEventListener("input", () => {
      state.query = els.search.value.trim();
      state.index = "all";
      state.page = 1;
      renderIndex();
      renderResults();
      renderAutocomplete();
      updateUrl();
    });

    els.search.addEventListener("focus", renderAutocomplete);

    els.search.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideAutocomplete();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const firstOption = els.autocomplete.querySelector("[data-market-autocomplete-option]");
        if (firstOption) {
          selectAutocomplete(firstOption.dataset.marketAutocompleteOption, { navigate: true });
          return;
        }
        openBestRoute();
      }
    });

    els.autocomplete?.addEventListener("mousedown", (event) => event.preventDefault());

    els.perPage.addEventListener("change", () => setPerPage(els.perPage.value));

    els.conciergeForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      runConcierge(els.conciergeInput?.value || "");
    });

    document.querySelectorAll("[data-market-header-search]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const value = String(data.get("q") || "").trim();
        window.location.href = globalSearchUrl(value);
      });
    });

    els.menuToggle?.addEventListener("click", () => {
      if (els.menu?.hidden) openMenu();
      else closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeMenu();
      closeMegaMenus();
    });

    window.addEventListener("resize", syncViewportSpace);
    window.addEventListener("orientationchange", syncViewportSpace);
  }

  init();
})();
