(() => {
  const pageKey = document.body.dataset.intentPage;
  const page = window.hbiIntentLibrary?.[pageKey];
  if (!page) return;
  const activeClass = (key) => (pageKey === key ? " is-active" : "");

  function renderLibraryNav() {
    const nav = document.querySelector(".library-nav");
    if (!nav) return;
    nav.innerHTML = `
      <div class="nav-item">
        <button class="nav-trigger${activeClass("buy")}" type="button" aria-expanded="false" aria-controls="mega-buy" data-mega-trigger>Buy</button>
        <div class="mega-menu" id="mega-buy" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For buyers</p>
            <h2>Start with fit before listings.</h2>
            <p>Compare budget, daily life, commute, and offer strategy before the tour calendar gets noisy.</p>
            <a class="button button-primary" href="../buy/#article-library">Start a buyer plan</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="../buy/#article-library">Compare rent vs. buy <span>Decide whether buying now actually fits.</span></a>
              <a href="../local-areas/#article-library">Compare Local Areas before touring <span>Use city fit to narrow the search radius.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="../buy/#article-library">Understand offer strategy <span>Know what matters when the right home appears.</span></a>
              <a href="../index.html#contact-israel">Ask a buyer question <span>Get routed without giving up your weekend.</span></a>
            </section>
          </div>
        </div>
      </div>

      <div class="nav-item">
        <button class="nav-trigger${activeClass("sell")}" type="button" aria-expanded="false" aria-controls="mega-sell" data-mega-trigger>Sell</button>
        <div class="mega-menu" id="mega-sell" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For sellers</p>
            <h2>Price, prep, and timing with less guesswork.</h2>
            <p>Sort repairs, privacy, showing pressure, pricing, and your next move before listing.</p>
            <a class="button button-primary" href="../sell/#article-library">Start seller planning</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="../sell/#article-library">Prep before pricing <span>Decide what to fix and what to leave alone.</span></a>
              <a href="../sell/#article-library">Sell privately or go public <span>Understand the tradeoffs before exposure.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="../sell/#article-library">Think through a home value path <span>Discuss condition, timing, and local demand.</span></a>
              <a href="../index.html#contact-israel">Ask a private seller question <span>Use a low-pressure route first.</span></a>
            </section>
          </div>
        </div>
      </div>

      <div class="nav-item">
        <button class="nav-trigger${activeClass("move")}" type="button" aria-label="Move / Relocate" aria-expanded="false" aria-controls="mega-move" data-mega-trigger><span class="wide-label">Move / Relocate</span><span class="short-label" aria-hidden="true">Move</span></button>
        <div class="mega-menu" id="mega-move" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For movers</p>
            <h2>Line up the real estate pieces first.</h2>
            <p>Connect sale timing, purchase timing, leases, school calendars, commute changes, and household pressure.</p>
            <a class="button button-primary" href="../move-relocate/#article-library">Plan the move sequence</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="../move-relocate/#article-library">Move into Southern California <span>Compare cities before choosing a search path.</span></a>
              <a href="../move-relocate/#article-library">Move out while owning <span>Decide what happens to the current property.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="../local-areas/#article-library">Compare commute and city fit <span>Use daily-life context before touring.</span></a>
              <a href="../index.html#contact-israel">Ask a timing question <span>Start with the sequence, not paperwork.</span></a>
            </section>
          </div>
        </div>
      </div>

      <div class="nav-item">
        <button class="nav-trigger${activeClass("homeowners")}" type="button" aria-expanded="false" aria-controls="mega-homeowners" data-mega-trigger>Homeowners</button>
        <div class="mega-menu" id="mega-homeowners" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For homeowners</p>
            <h2>Separate the property decision from the life decision.</h2>
            <p>Clarify whether the next move is sell, rent, hold, repair, refinance, or wait.</p>
            <a class="button button-primary" href="../homeowners/#article-library">Choose a homeowner path</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="../homeowners/#article-library">Decide whether to sell, rent, or hold <span>Compare cash, risk, repairs, and timeline.</span></a>
              <a href="../homeowners/#article-library">Review a home value path <span>Start with condition and local demand.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="../homeowners/#article-library">Think through repairs before selling <span>Know what could help or waste money.</span></a>
              <a href="../index.html#contact-israel">Ask a private homeowner question <span>Useful for sensitive timing or tenant issues.</span></a>
            </section>
          </div>
        </div>
      </div>

      <div class="nav-item">
        <button class="nav-trigger${activeClass("invest")}" type="button" aria-expanded="false" aria-controls="mega-invest" data-mega-trigger>Invest</button>
        <div class="mega-menu" id="mega-invest" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For investors</p>
            <h2>Compare return, risk, and exit path.</h2>
            <p>Use local demand, rent potential, repairs, and holding costs before deciding what to buy or keep.</p>
            <a class="button button-primary" href="../invest/#article-library">Start an investment review</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="../invest/#article-library">Rental and investment decisions <span>Compare cash flow against ownership friction.</span></a>
              <a href="../invest/#article-library">Should I sell, rent, or hold? <span>Useful for an existing property.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="../invest/#article-library">Ask a market question <span>Use property type and timing to make it specific.</span></a>
              <a href="../index.html#contact-israel">Talk through risk privately <span>Good for tenant, repair, or exit questions.</span></a>
            </section>
          </div>
        </div>
      </div>

      <div class="nav-item">
        <button class="nav-trigger${activeClass("local")}" type="button" aria-expanded="false" aria-controls="mega-local" data-mega-trigger>Local Areas</button>
        <div class="mega-menu" id="mega-local" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For local-area researchers</p>
            <h2>Compare places by daily life.</h2>
            <p>Look at commute, housing type, beach access, price bands, schools, and how each city changes your strategy.</p>
            <a class="button button-primary" href="../local-areas/#article-library">Explore Local Areas</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>Nearby</h3>
              <a href="../local-areas/?q=Redondo%20Beach#article-library">Redondo Beach <span>Coastal lifestyle, housing mix, and South Bay tradeoffs.</span></a>
              <a href="../local-areas/?q=Manhattan%20Beach%20Hermosa%20Beach#article-library">Manhattan Beach and Hermosa Beach <span>Beach-city daily life and price pressure.</span></a>
            </section>
            <section>
              <h3>Broader context</h3>
              <a href="../local-areas/?q=Long%20Beach#article-library">Long Beach Area <span>Neighborhood variety and commute choices.</span></a>
              <a href="../local-areas/?q=Orange%20County#article-library">LA County and Orange County <span>Useful when your search crosses county lines.</span></a>
            </section>
          </div>
        </div>
      </div>

      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-market-trends" data-nav-href="../housing-market-pulse/" data-mega-trigger>Market Trends</button>
        <div class="mega-menu" id="mega-market-trends" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">Market context</p>
            <h2>Read the numbers before timing the move.</h2>
            <p>Use local market charts and plain-English Housing Market Pulse reads before deciding how fast, firm, or cautious to be.</p>
            <a class="button button-primary" href="../housing-market-pulse/">Open Housing Market Pulse</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>Monthly reads</h3>
              <a href="../housing-market-pulse/">Housing Market Pulse <span>Plain-English buyer and seller reads by city or ZIP.</span></a>
              <a href="../market-trends/">Market Trends finder <span>Use live charts for price, inventory, pace, and supply.</span></a>
            </section>
            <section>
              <h3>Local timing</h3>
              <a href="../market-trends/?mode=pulse#article-library">Find a Pulse by city <span>Start with the route picker when the location matters most.</span></a>
              <a href="../market-trends/?view=zip#article-library">Search by ZIP <span>Useful when citywide numbers are too broad.</span></a>
            </section>
          </div>
        </div>
      </div>

      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-resources" data-mega-trigger>Resources</button>
        <div class="mega-menu" id="mega-resources" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">Support library</p>
            <h2>Use this once you know the decision.</h2>
            <p>Use guides, tools, FAQs, and local updates when you already know the decision you are researching.</p>
            <a class="button button-primary" href="../index.html#resources">Find the right support</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>Research support</h3>
              <a href="../buy/#article-library">Buyer guidance <span>Search buyer guides and decision articles.</span></a>
              <a href="../sell/#article-library">Seller guidance <span>Search prep, pricing, repairs, and timing topics.</span></a>
            </section>
            <section>
              <h3>Market context</h3>
              <a href="../index.html#resources">Ask a market question <span>Make the answer city and property specific.</span></a>
              <a href="../index.html#resources">Watch local market videos <span>Use videos after you know the city or topic.</span></a>
            </section>
          </div>
        </div>
      </div>

      <a class="nav-link" href="../index.html#contact-israel">Contact</a>
    `;
  }

  renderLibraryNav();

  const state = {
    query: "",
    titleOnly: false,
    sort: "relevance",
    page: 1,
    perPage: 10,
    radiusArea: "",
    radiusLabel: "",
    place: {
      mode: "city",
      value: "",
      label: "",
      terms: [],
      area: "",
      county: ""
    },
    guidanceQuery: "",
    guidanceChip: "",
    expanded: { tag: false, area: false },
    selected: {
      type: new Set(),
      tag: new Set(),
      year: new Set(),
      area: new Set(),
      stage: new Set()
    }
  };

  const els = {
    title: document.querySelector("[data-page-title]"),
    eyebrow: document.querySelector("[data-page-eyebrow]"),
    intro: document.querySelector("[data-page-intro]"),
    feature: document.querySelector("[data-feature-card]"),
    searchLabel: document.querySelector("[data-search-label]"),
    resultsTitle: document.querySelector("[data-results-title]"),
    resultCount: document.querySelector("#result-count"),
    selectedFilters: document.querySelector("#selected-filters"),
    results: document.querySelector("#article-results"),
    sort: document.querySelector("#sort-filter"),
    query: document.querySelector("#article-search"),
    titleOnly: document.querySelector("#title-only"),
    perPage: document.querySelector("#per-page"),
    tagSearch: document.querySelector("#tag-filter-search"),
    areaSearch: document.querySelector("#area-filter-search"),
    pagination: document.querySelector("#pagination-status"),
    prev: document.querySelector("[data-page-prev]"),
    next: document.querySelector("[data-page-next]"),
    filters: document.querySelector(".library-filters"),
    resultsShell: document.querySelector(".library-results"),
    menu: document.querySelector("#site-menu"),
    menuToggle: document.querySelector(".menu-toggle")
  };

  const filterContainers = {
    type: document.querySelector("#content-type-filters"),
    tag: document.querySelector("#tag-filters"),
    year: document.querySelector("#year-filters"),
    area: document.querySelector("#area-filters"),
    stage: document.querySelector("#stage-filters")
  };

  const guidancePages = new Set(["buy", "sell", "homeowners", "move", "invest", "local"]);
  const guidanceGraph = window.hbiGuidanceGraph || { items: [], quickChips: [], relationshipGroups: [] };
  const relationshipLabelById = new Map((guidanceGraph.relationshipGroups || []).map((group) => [group.id, group.label]));
  let guidanceEls = null;
  let filterToggle = null;
  let filterBackdrop = null;
  let lastFilterTrigger = null;
  const filterModalMedia = window.matchMedia("(max-width: 900px)");
  const libraryScriptUrl = document.currentScript?.src || "";
  const cityZipDataUrl = libraryScriptUrl ? new URL("content/la-oc-city-zips.json", libraryScriptUrl).href : "../content/la-oc-city-zips.json";
  let cityZipRows = [];

  const filterCopyByPage = {
    buy: {
      tagHeading: "Buyer decisions",
      tagPlaceholder: "Financing, offers, inspections",
      stageHeading: "Buying stage"
    },
    sell: {
      tagHeading: "Seller decisions",
      tagPlaceholder: "Pricing, prep, repairs",
      stageHeading: "Selling stage"
    },
    homeowners: {
      tagHeading: "Homeowner decisions",
      tagPlaceholder: "Sell, rent, hold, repairs",
      stageHeading: "Owner stage"
    },
    move: {
      tagHeading: "Move decisions",
      tagPlaceholder: "Commute, schools, timing",
      stageHeading: "Move stage"
    },
    invest: {
      tagHeading: "Investment decisions",
      tagPlaceholder: "Cash flow, tenants, repairs",
      stageHeading: "Investment stage"
    },
    local: {
      tagHeading: "Local priorities",
      tagPlaceholder: "Commute, schools, lifestyle",
      stageHeading: "Research stage"
    }
  };

  const megaTriggers = document.querySelectorAll("[data-mega-trigger]");
  const navHubHrefs = {
    "mega-buy": "../buy/#article-library",
    "mega-sell": "../sell/#article-library",
    "mega-move": "../move-relocate/#article-library",
    "mega-homeowners": "../homeowners/#article-library",
    "mega-invest": "../invest/#article-library",
    "mega-local": "../local-areas/#article-library",
    "mega-resources": "../index.html#resources"
  };

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

  function normalizeHubNavigationLinks() {
    const hubTargets = {
      "../buy/": "../buy/#article-library",
      "../sell/": "../sell/#article-library",
      "../move-relocate/": "../move-relocate/#article-library",
      "../homeowners/": "../homeowners/#article-library",
      "../invest/": "../invest/#article-library",
      "../local-areas/": "../local-areas/#article-library"
    };
    document.querySelectorAll("#site-menu a[href], .primary-nav a.nav-link[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (hubTargets[href]) link.setAttribute("href", hubTargets[href]);
    });
  }

  normalizeHubNavigationLinks();

  function closeMegaMenus() {
    megaTriggers.forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
      trigger.closest(".nav-item")?.classList.remove("is-open");
    });
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pageFilterCopy() {
    return filterCopyByPage[pageKey] || filterCopyByPage.buy;
  }

  function filterGroupFor(container) {
    return container?.closest(".filter-group") || null;
  }

  async function loadCityZipData() {
    if (!cityZipDataUrl) return;
    try {
      const response = await fetch(cityZipDataUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`City ZIP data ${response.status}`);
      const rows = await response.json();
      cityZipRows = Array.isArray(rows)
        ? rows
            .filter((row) => row?.city && Array.isArray(row.zips))
            .map((row) => ({
              county: String(row.county || ""),
              city: String(row.city || ""),
              zips: row.zips.map(String).filter(Boolean)
            }))
        : [];
      renderPlaceOptions();
    } catch (error) {
      cityZipRows = [];
    }
  }

  function setupFilterLayout() {
    const copy = pageFilterCopy();
    const sortControl = els.sort?.closest(".filter-control");
    const searchControl = els.query?.closest(".filter-control");
    const typeGroup = filterGroupFor(filterContainers.type);
    const tagGroup = filterGroupFor(filterContainers.tag);
    const yearGroup = filterGroupFor(filterContainers.year);
    const areaGroup = filterGroupFor(filterContainers.area);
    const stageGroup = filterGroupFor(filterContainers.stage);
    const resetButton = document.querySelector("[data-reset-filters]");
    const radiusForm = document.querySelector("[data-radius-filter]");
    const scrollBody = els.filters?.querySelector(".filter-scroll-body") || els.filters;

    if (els.filters) els.filters.classList.add("library-filters-enhanced");
    if (sortControl) sortControl.classList.add("filter-control-secondary");
    if (searchControl) {
      searchControl.classList.add("library-primary-search");
      searchControl.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = "";
      });
      const label = searchControl.querySelector("[data-search-label]");
      if (label) label.textContent = `Search ${page.searchLabel || "articles"}`;
    }

    if (areaGroup) {
      areaGroup.classList.add("place-filter-group");
      const heading = areaGroup.querySelector("h3");
      if (heading) heading.textContent = "Find by place";
      if (!areaGroup.querySelector("[data-place-mode]")) {
        areaGroup.insertAdjacentHTML(
          "afterbegin",
          `<div class="place-mode-toggle" role="tablist" aria-label="Place search type">
            <button type="button" role="tab" aria-selected="true" data-place-mode="city">City</button>
            <button type="button" role="tab" aria-selected="false" data-place-mode="zip">ZIP code</button>
          </div>`
        );
      }
    }

    if (tagGroup) {
      tagGroup.classList.add("decision-filter-group");
      const heading = tagGroup.querySelector("h3");
      if (heading) heading.textContent = copy.tagHeading;
      if (els.tagSearch) els.tagSearch.placeholder = copy.tagPlaceholder;
    }

    if (stageGroup) {
      stageGroup.classList.add("decision-stage-filter-group");
      const heading = stageGroup.querySelector("h3");
      if (heading) heading.textContent = copy.stageHeading;
    }

    if (typeGroup) {
      typeGroup.classList.add("secondary-filter-group");
      const heading = typeGroup.querySelector("h3");
      if (heading) heading.textContent = "Guide type";
    }

    if (yearGroup) {
      yearGroup.classList.add("secondary-filter-group");
      const heading = yearGroup.querySelector("h3");
      if (heading) heading.textContent = "Year";
    }

    if (els.areaSearch) els.areaSearch.placeholder = "Search city, area, or ZIP";
    if (document.querySelector("[data-toggle-more='area']")) document.querySelector("[data-toggle-more='area']").textContent = "+ More places";
    if (document.querySelector("[data-toggle-more='tag']")) document.querySelector("[data-toggle-more='tag']").textContent = "+ More decision filters";

    [
      searchControl,
      els.titleOnly?.closest(".check-row"),
      areaGroup,
      tagGroup,
      stageGroup,
      typeGroup,
      yearGroup,
      radiusForm,
      sortControl,
      resetButton
    ].forEach((node) => {
      if (node && scrollBody) scrollBody.append(node);
    });
  }

  function filtersUseModal() {
    return filterModalMedia.matches;
  }

  function syncFilterDisclosure() {
    if (!els.filters) return;
    const isModal = filtersUseModal();
    const isOpen = isModal && els.filters.classList.contains("is-open");

    if (!isModal) els.filters.classList.remove("is-open");

    els.filters.classList.toggle("is-modal-ready", isModal);
    if (isModal) {
      els.filters.setAttribute("role", "dialog");
      els.filters.setAttribute("aria-hidden", isOpen ? "false" : "true");
      if (isOpen) els.filters.setAttribute("aria-modal", "true");
      else els.filters.removeAttribute("aria-modal");
    } else {
      els.filters.removeAttribute("role");
      els.filters.removeAttribute("aria-hidden");
      els.filters.removeAttribute("aria-modal");
    }

    if (filterToggle) {
      filterToggle.hidden = !isModal;
      filterToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    if (filterBackdrop) filterBackdrop.hidden = !isOpen;
    document.body.classList.toggle("library-filters-open", isOpen);
    syncOverlayState();
  }

  function openFilters(trigger = filterToggle) {
    if (!els.filters || !filtersUseModal()) return;
    lastFilterTrigger = trigger;
    closeMegaMenus();
    if (els.menu && !els.menu.hidden) closeMenu();
    els.filters.classList.add("is-open");
    syncFilterDisclosure();
    window.setTimeout(() => {
      els.filters.querySelector("[data-close-library-filters]")?.focus();
    }, 0);
  }

  function closeFilters({ restoreFocus = false } = {}) {
    if (!els.filters) return;
    const wasOpen = els.filters.classList.contains("is-open");
    els.filters.classList.remove("is-open");
    syncFilterDisclosure();
    if (restoreFocus && wasOpen) (lastFilterTrigger || filterToggle)?.focus();
  }

  function focusableFilterControls() {
    if (!els.filters) return [];
    return [...els.filters.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")]
      .filter((element) => !element.hidden && element.offsetParent !== null);
  }

  function initResponsiveFilters() {
    if (!els.filters || !els.resultsShell) return;
    if (!els.filters.id) els.filters.id = "library-filters";
    els.filters.setAttribute("tabindex", "-1");

    const heading = els.filters.querySelector(".filter-heading");
    if (heading && !heading.querySelector("[data-close-library-filters]")) {
      heading.insertAdjacentHTML(
        "beforeend",
        '<button class="filter-close" type="button" aria-label="Close filters" data-close-library-filters><span aria-hidden="true">X</span></button>'
      );
    }

    if (!els.resultsShell.querySelector("[data-open-library-filters]")) {
      filterToggle = document.createElement("button");
      filterToggle.className = "filter-toggle";
      filterToggle.type = "button";
      filterToggle.hidden = true;
      filterToggle.setAttribute("aria-controls", els.filters.id);
      filterToggle.setAttribute("aria-expanded", "false");
      filterToggle.setAttribute("data-open-library-filters", "");
      filterToggle.textContent = "Show filters";
      els.resultsShell.insertBefore(filterToggle, els.resultsShell.firstElementChild);
    } else {
      filterToggle = els.resultsShell.querySelector("[data-open-library-filters]");
    }

    if (!els.filters.querySelector("[data-save-library-filters]")) {
      const saveButton = document.createElement("button");
      saveButton.className = "filter-save";
      saveButton.type = "button";
      saveButton.setAttribute("data-save-library-filters", "");
      saveButton.textContent = "Save filters";
      els.filters.append(saveButton);
    }

    if (!els.filters.querySelector(".filter-scroll-body")) {
      const saveButton = els.filters.querySelector("[data-save-library-filters]");
      const scrollBody = document.createElement("div");
      scrollBody.className = "filter-scroll-body";
      [...els.filters.children].forEach((child) => {
        if (!child.classList.contains("filter-heading") && child !== saveButton) {
          scrollBody.append(child);
        }
      });
      els.filters.insertBefore(scrollBody, saveButton);
    }

    if (!document.querySelector("[data-filter-backdrop]")) {
      filterBackdrop = document.createElement("button");
      filterBackdrop.className = "filter-backdrop";
      filterBackdrop.type = "button";
      filterBackdrop.hidden = true;
      filterBackdrop.setAttribute("aria-label", "Close filters");
      filterBackdrop.setAttribute("data-filter-backdrop", "");
      filterBackdrop.setAttribute("data-close-library-filters", "");
      document.body.append(filterBackdrop);
    } else {
      filterBackdrop = document.querySelector("[data-filter-backdrop]");
    }

    if (filterModalMedia.addEventListener) filterModalMedia.addEventListener("change", syncFilterDisclosure);
    else filterModalMedia.addListener(syncFilterDisclosure);
    window.addEventListener("resize", syncFilterDisclosure);
    window.addEventListener("orientationchange", syncFilterDisclosure);
    window.addEventListener("pageshow", syncFilterDisclosure);
    syncFilterDisclosure();
  }

  function normalizedWords(value) {
    return normalize(value)
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function tokensFor(value) {
    return normalizedWords(value)
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 1);
  }

  function guidanceHref(item) {
    if (window.hbiSearch) return window.hbiSearch.href(item, "../");
    if (!item.urlPath) return item.href || "#article-library";
    if (/^(?:https?:|mailto:|tel:|\/)/.test(item.urlPath)) return item.urlPath;
    return `../${item.urlPath}`;
  }

  function guidanceSearchText(item) {
    return [
      item.title,
      item.summary,
      item.category,
      item.type,
      item.stage,
      item.year,
      item.intentLabel,
      item.primaryDiscoveryIntentLabel,
      ...(item.secondaryDiscoveryIntentLabels || []),
      ...(item.relationshipGroupLabels || []),
      ...(item.areas || []),
      ...(item.tags || []),
      ...(item.searchKeywords || [])
    ].join(" ");
  }

  function guidanceScore(item, query, chip) {
    if (item.status !== "live") return 0;
    const normalizedQuery = normalizedWords(query);
    const text = normalizedWords(guidanceSearchText(item));
    const tokens = tokensFor(normalizedQuery);
    let total = 0;

    if (!normalizedQuery && (item.intent === pageKey || item.primaryDiscoveryIntent === pageKey)) total += 8;
    if (!normalizedQuery && (item.secondaryDiscoveryIntents || []).includes(pageKeyToIntent())) total += 5;

    if (normalizedQuery && text.includes(normalizedQuery)) total += 18;
    tokens.forEach((token) => {
      if (normalizedWords(item.title).includes(token)) total += 6;
      if (normalizedWords(item.summary).includes(token)) total += 3;
      if ((item.areas || []).some((area) => normalizedWords(area).includes(token))) total += 4;
      if ((item.tags || []).some((tag) => normalizedWords(tag).includes(token))) total += 4;
      if ((item.relationshipGroupLabels || []).some((label) => normalizedWords(label).includes(token))) total += 5;
      if ((item.searchKeywords || []).some((keyword) => normalizedWords(keyword).includes(token))) total += 3;
    });

    (chip?.groups || []).forEach((groupId) => {
      if ((item.relationshipGroups || []).includes(groupId)) total += 22;
    });

    if (item.primaryDiscoveryIntent === pageKeyToIntent()) total += 3;
    if ((item.secondaryDiscoveryIntents || []).includes(pageKeyToIntent())) total += 2;
    total += 5;
    return total;
  }

  function pageKeyToIntent() {
    return pageKey === "move" ? "move-relocate" : pageKey === "local" ? "local-areas" : pageKey;
  }

  function guidanceMatchReason(item, query, chip) {
    const chipGroups = (chip?.groups || []).filter((groupId) => (item.relationshipGroups || []).includes(groupId));
    if (chipGroups.length) {
      return "Related guide for this decision";
    }

    const tokens = tokensFor(query);
    const area = (item.areas || []).find((value) => tokens.some((token) => normalizedWords(value).includes(token)));
    const tag = (item.tags || []).find((value) => tokens.some((token) => normalizedWords(value).includes(token)));
    const group = (item.relationshipGroupLabels || []).find((value) => tokens.some((token) => normalizedWords(value).includes(token)));
    if (area || tag || group) return "Related guide for this decision";
    if ((item.secondaryDiscoveryIntents || []).includes(pageKeyToIntent())) return `Also supports ${page.eyebrow || "this decision"}`;
    return `Related ${item.primaryDiscoveryIntentLabel || item.intentLabel} decision`;
  }

  function guidanceResults() {
    if (window.hbiSearch) {
      return window.hbiSearch.search(state.guidanceQuery, {
        chipLabel: state.guidanceChip,
        pageIntent: pageKeyToIntent(),
        limit: 6
      });
    }

    const chip = (guidanceGraph.quickChips || []).find((item) => item.label === state.guidanceChip);
    const query = state.guidanceQuery || chip?.query || "";
    const seen = new Map();

    (guidanceGraph.items || []).forEach((item) => {
      const scoreValue = guidanceScore(item, query, chip);
      if (scoreValue <= 0) return;
      const existing = seen.get(item.topicId);
      if (!existing || scoreValue > existing.score) {
        seen.set(item.topicId, {
          item,
          score: scoreValue,
          reason: guidanceMatchReason(item, query, chip)
        });
      }
    });

    return [...seen.values()]
      .sort((a, b) => b.score - a.score || (a.item.priority || 999) - (b.item.priority || 999))
      .slice(0, 6);
  }

  function updateGuidanceUrl() {
    if (!guidanceEls) return;
    const url = new URL(window.location.href);
    const value = state.guidanceQuery.trim();
    if (value) url.searchParams.set("guide", value);
    else url.searchParams.delete("guide");
    if (state.guidanceChip) url.searchParams.set("situation", state.guidanceChip);
    else url.searchParams.delete("situation");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function renderGuidanceResults() {
    if (!guidanceEls) return;
    const results = guidanceResults();
    if (window.hbiSearch) {
      window.hbiSearch.renderCards(guidanceEls.results, results, {
        hrefPrefix: "../",
        emptyHtml: `<div class="guidance-empty"><h3>No related guidance found</h3><p>Try a broader phrase like local areas, beach city fit, area fit, payment, offer strategy, rent-back, tenant risk, or proceeds.</p><div class="search-empty-actions"><button type="button" data-guidance-suggestion="Compare Local Areas">Compare Local Areas</button><button type="button" data-guidance-suggestion="Beach city fit">Beach city fit</button><button type="button" data-guidance-suggestion="Compare areas before touring">Compare areas before touring</button></div></div>`
      });
      window.hbiSearch.track("hbi_intent_guidance_render", {
        page: pageKey,
        query: state.guidanceQuery,
        situation: state.guidanceChip,
        resultCount: results.length
      });
      updateGuidanceUrl();
      return;
    }
    guidanceEls.results.innerHTML = results.length
      ? results
          .map(({ item, reason }) => {
            const secondary = (item.secondaryDiscoveryIntentLabels || []).filter((label) => label !== item.primaryDiscoveryIntentLabel);
            return `
              <a class="guidance-result-card" href="${escapeHtml(guidanceHref(item))}" data-topic-id="${escapeHtml(item.topicId)}" data-primary-intent="${escapeHtml(item.primaryDiscoveryIntent)}">
                <span class="guidance-card-meta">
                  <span class="guidance-intent-badge">${escapeHtml(item.primaryDiscoveryIntentLabel || item.intentLabel)}</span>
                </span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.summary)}</p>
                <span class="guidance-match">${escapeHtml(reason)}</span>
                ${secondary.length ? `<span class="guidance-secondary">Also appears in: ${escapeHtml(secondary.slice(0, 2).join(", "))}</span>` : ""}
              </a>
            `;
          })
          .join("")
      : `<div class="guidance-empty"><h3>No related guidance found</h3><p>Try a broader phrase like area fit, payment, offer strategy, rent-back, tenant risk, or proceeds.</p></div>`;
  }

  function setGuidanceChip(label) {
    const wasActive = state.guidanceChip === label;
    state.guidanceChip = wasActive ? "" : label;
    if (wasActive) {
      state.guidanceQuery = "";
      guidanceEls.input.value = "";
    }
    if (state.guidanceChip) {
      const chip = (guidanceGraph.quickChips || []).find((item) => item.label === state.guidanceChip);
      state.guidanceQuery = chip?.query || label;
      guidanceEls.input.value = state.guidanceQuery;
    }
    guidanceEls.chips.querySelectorAll("[data-guidance-chip]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.guidanceChip === state.guidanceChip);
      button.setAttribute("aria-pressed", button.dataset.guidanceChip === state.guidanceChip ? "true" : "false");
    });
    renderGuidanceResults();
  }

  function initGuidanceFinder() {
    if (!guidancePages.has(pageKey) || !guidanceGraph.items?.length) return;
    const shell = document.querySelector(".library-shell");
    if (!shell) return;
    const chips = guidanceGraph.quickChips || [];
    shell.insertAdjacentHTML(
      "beforebegin",
      `
        <section class="cross-guidance" aria-labelledby="cross-guidance-title">
          <div class="cross-guidance-header">
            <p class="eyebrow">Connected guidance</p>
            <h2 id="cross-guidance-title">Find guidance across related decisions</h2>
            <p>Search the situation, not the section. Results can include buyer, seller, homeowner, move, and investment paths when the decision overlaps.</p>
          </div>
          <div class="cross-guidance-controls">
            <label class="cross-guidance-search">
              <span class="visually-hidden">Search related decisions</span>
              <input id="cross-guidance-search" type="search" placeholder="Try: local areas, beach city fit, commute, schools">
            </label>
            <div class="cross-guidance-chips" aria-label="Common related situations">
              ${chips
                .map((chip) => `<button type="button" data-guidance-chip="${escapeHtml(chip.label)}" aria-pressed="false">${escapeHtml(chip.label)}</button>`)
                .join("")}
            </div>
          </div>
          <div class="cross-guidance-results" data-guidance-results aria-live="polite"></div>
        </section>
      `
    );
    guidanceEls = {
      input: document.querySelector("#cross-guidance-search"),
      chips: document.querySelector(".cross-guidance-chips"),
      results: document.querySelector("[data-guidance-results]")
    };
    guidanceEls.input.addEventListener("input", () => {
      state.guidanceQuery = guidanceEls.input.value;
      state.guidanceChip = "";
      guidanceEls.chips.querySelectorAll("[data-guidance-chip]").forEach((button) => {
        button.classList.remove("is-active");
        button.setAttribute("aria-pressed", "false");
      });
      renderGuidanceResults();
    });
    guidanceEls.chips.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-guidance-chip]");
      if (!chip) return;
      setGuidanceChip(chip.dataset.guidanceChip);
    });
    guidanceEls.results.addEventListener("click", (event) => {
      const card = event.target.closest("[data-topic-id]");
      if (!card || !window.hbiSearch) return;
      window.hbiSearch.track("hbi_intent_guidance_click", {
        page: pageKey,
        query: state.guidanceQuery,
        situation: state.guidanceChip,
        topicId: card.dataset.topicId,
        primaryIntent: card.dataset.primaryIntent
      });
    });
    guidanceEls.results.addEventListener("click", (event) => {
      const suggestion = event.target.closest("[data-guidance-suggestion]");
      if (!suggestion) return;
      setGuidanceChip(suggestion.dataset.guidanceSuggestion);
    });
    const initialParams = new URLSearchParams(window.location.search);
    const initialGuide = initialParams.get("guide");
    const initialSituation = initialParams.get("situation");
    if (initialSituation) {
      setGuidanceChip(initialSituation);
      return;
    }
    if (initialGuide) {
      state.guidanceQuery = initialGuide;
      guidanceEls.input.value = initialGuide;
    }
    renderGuidanceResults();
  }

  function valuesForField(item, field) {
    const raw = field === "tags" && item.filterTags?.length ? item.filterTags : item[field];
    return Array.isArray(raw) ? raw.filter(Boolean).map(String) : [raw].filter(Boolean).map(String);
  }

  function uniqueValues(field) {
    const values = [];
    page.articles.forEach((item) => {
      valuesForField(item, field).forEach((value) => {
        if (!values.includes(value)) values.push(value);
      });
    });
    return values;
  }

  const tagOrderByPage = {
    buy: [
      "Area comparison",
      "Financing & Affordability",
      "Monthly payment",
      "Loan strategy",
      "Offer Strategy",
      "Inspection",
      "Property condition checks",
      "Closing costs",
      "New construction",
      "Condo buying",
      "Townhomes",
      "Buying"
    ],
    sell: [
      "Pricing",
      "Prep and pricing",
      "Repairs",
      "Repair tradeoffs",
      "Timing",
      "Rent-back",
      "Privacy",
      "Tenants",
      "Inherited property",
      "Next purchase",
      "Offer review",
      "Selling"
    ],
    homeowners: [
      "Sell, rent, or hold",
      "Home value path",
      "Repairs",
      "Refinance",
      "Home equity",
      "Tenant issue",
      "Inherited property",
      "Family decision",
      "Financial pressure",
      "Mortgage delinquency",
      "Homeowners"
    ],
    move: [
      "Area comparison",
      "Job relocation",
      "Lifestyle and commute fit",
      "Seller relocation",
      "Buy-before-sell",
      "Sell or rent",
      "Timing and rent-backs",
      "Equity planning",
      "Tax and Prop 19",
      "Out-of-state move",
      "In-state move",
      "Downsizing / retirement",
      "Family move",
      "Aerospace / tech jobs",
      "Healthcare / port jobs",
      "Gateway / value move",
      "Move planning"
    ],
    invest: [
      "Rental demand",
      "Cash flow",
      "Cash Flow vs Appreciation",
      "Tenant risk",
      "Vacancy",
      "Repairs",
      "Rent-ready repairs",
      "Hold or sell",
      "Exit planning",
      "Property type",
      "Investing"
    ],
    local: [
      "Area guide",
      "Area comparison",
      "Area intelligence",
      "Neighborhood fit",
      "Commute and lifestyle fit",
      "Schools",
      "Beach access",
      "Parking",
      "Budget",
      "Local areas"
    ]
  };

  function orderedTagValues(values) {
    const order = tagOrderByPage[pageKey];
    if (!order) return values;
    return [...values].sort((a, b) => {
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }

  function tagFilterLimit() {
    return pageKey === "move" ? 8 : 5;
  }

  function countFor(field, value) {
    return page.articles.filter((item) => {
      return valuesForField(item, field).includes(String(value));
    }).length;
  }

  function placeAreaForRow(row) {
    const zipArea = row.zips.map(mapZipToArea).find(Boolean);
    if (zipArea) return zipArea;
    return row.county || "";
  }

  function matchingArticleCountForPlace(place) {
    return page.articles.filter((item) => placeMatches(item, place)).length;
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function textContainsPhrase(text, phrase) {
    const normalizedPhrase = normalize(phrase);
    if (!normalizedPhrase) return false;
    if (/^\d{5}$/.test(normalizedPhrase)) return text.includes(normalizedPhrase);
    const pattern = escapeRegExp(normalizedPhrase).replace(/\s+/g, "\\s+");
    return new RegExp(`(^|[^a-z0-9])${pattern}([^a-z0-9]|$)`).test(text);
  }

  function placeMatchesSearch(place, search) {
    if (!search) return true;
    const searchable = normalize([place.label, place.detail, ...(place.terms || [])].join(" "));
    return queryTokens(search).every((token) => searchable.includes(token));
  }

  function placeOptions() {
    if (state.place.mode === "zip") {
      const zipMap = new Map();
      cityZipRows.forEach((row) => {
        row.zips.forEach((zip) => {
          const current = zipMap.get(zip) || {
            mode: "zip",
            kind: "zip",
            label: zip,
            detail: "",
            value: zip,
            terms: [zip],
            area: mapZipToArea(zip),
            county: row.county
          };
          current.terms.push(row.city);
          current.detail = current.detail ? `${current.detail}, ${row.city}` : row.city;
          if (!current.area) current.area = placeAreaForRow(row);
          zipMap.set(zip, current);
        });
      });
      return [...zipMap.values()]
        .filter((place) => matchingArticleCountForPlace(place) > 0)
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    return cityZipRows
      .map((row) => ({
        mode: "city",
        kind: "city",
        label: row.city,
        detail: "",
        value: row.city,
        terms: [row.city, ...row.zips],
        area: placeAreaForRow(row),
        county: row.county
      }))
      .filter((place) => matchingArticleCountForPlace(place) > 0)
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  function renderPlaceOptions() {
    const container = filterContainers.area;
    if (!container) return;
    const search = normalize(els.areaSearch?.value);
    const expanded = state.expanded.area || Boolean(search);
    const limit = state.place.mode === "zip" ? 10 : 8;
    const options = placeOptions().filter((place) => placeMatchesSearch(place, search));
    const visible = expanded ? options : options.slice(0, limit);
    const activeValue = state.place.value;
    const activeMode = state.place.mode;

    if (els.areaSearch) {
      els.areaSearch.inputMode = state.place.mode === "zip" ? "numeric" : "search";
      els.areaSearch.placeholder = state.place.mode === "zip" ? "Search ZIP code" : "Search city";
    }

    document.querySelectorAll("[data-place-mode]").forEach((button) => {
      const selected = button.dataset.placeMode === state.place.mode;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.classList.toggle("is-active", selected);
    });

    const clearButton = activeValue
      ? `<button class="place-clear" type="button" data-place-clear>Clear ${escapeHtml(state.place.label)}</button>`
      : "";

    container.innerHTML = `
      ${clearButton}
      <div class="place-options" data-place-options>
        ${
          visible.length
            ? visible
                .map((place) => {
                  const count = matchingArticleCountForPlace(place);
                  const active = activeValue === place.value && activeMode === place.mode;
                  return `
                    <button class="place-option${active ? " is-active" : ""}" type="button" data-place-option="${escapeHtml(place.value)}" data-place-mode-value="${place.mode}">
                      <span><strong>${escapeHtml(place.label)}</strong>${place.detail ? `<small>${escapeHtml(place.detail)}</small>` : ""}</span>
                      <span class="filter-count">${count}</span>
                    </button>
                  `;
                })
                .join("")
            : `<p class="place-empty">No matching places</p>`
        }
      </div>
    `;

    const moreButton = document.querySelector("[data-toggle-more='area']");
    if (moreButton) {
      moreButton.hidden = options.length <= limit && !search;
      moreButton.textContent = expanded ? "- Fewer places" : "+ More places";
    }
  }

  function findPlaceOption(mode, value) {
    return placeOptions().find((place) => place.mode === mode && place.value === value) || null;
  }

  function applyPlaceOption(mode, value) {
    const place = findPlaceOption(mode, value);
    if (!place) return;
    state.place = {
      mode: place.mode,
      value: place.value,
      label: place.mode === "zip" ? `${place.label} (${place.detail})` : place.label,
      terms: [...new Set(place.terms || [place.value])],
      area: place.area || "",
      county: place.county || ""
    };
    state.page = 1;
    renderPlaceOptions();
    renderArticles();
  }

  function clearPlaceOption() {
    state.place = {
      mode: state.place.mode || "city",
      value: "",
      label: "",
      terms: [],
      area: "",
      county: ""
    };
    state.page = 1;
    renderPlaceOptions();
    renderArticles();
  }

  function setPlaceMode(mode) {
    state.place = {
      mode,
      value: "",
      label: "",
      terms: [],
      area: "",
      county: ""
    };
    state.expanded.area = false;
    if (els.areaSearch) els.areaSearch.value = "";
    state.page = 1;
    renderPlaceOptions();
    renderArticles();
  }

  function renderFilter(kind, values, limit = 5) {
    const container = filterContainers[kind];
    if (!container) return;
    const search = kind === "tag" ? normalize(els.tagSearch?.value) : kind === "area" ? normalize(els.areaSearch?.value) : "";
    const expanded = state.expanded[kind] || false;
    container.innerHTML = values
      .map((value, index) => {
        const hiddenBySearch = search && !normalize(value).includes(search);
        const hiddenByLimit = !search && (kind === "tag" || kind === "area") && !expanded && index >= limit;
        const checked = state.selected[kind].has(String(value));
        return `
          <label class="filter-option${hiddenByLimit || hiddenBySearch ? " is-hidden" : ""}">
            <input type="checkbox" value="${value}" data-filter-kind="${kind}"${checked ? " checked" : ""}>
            <span>${value}</span>
            <span class="filter-count">${countFor(kind === "type" ? "type" : kind === "year" ? "year" : kind === "area" ? "areas" : kind === "stage" ? "stage" : "tags", value)}</span>
          </label>
        `;
      })
      .join("");
  }

  function renderFilters() {
    renderFilter("type", uniqueValues("type"), 10);
    renderFilter("tag", orderedTagValues(uniqueValues("tags")), tagFilterLimit());
    renderFilter("year", uniqueValues("year").sort((a, b) => b - a), 10);
    renderPlaceOptions();
    renderFilter("stage", uniqueValues("stage"), 10);
  }

  function searchText(item) {
    const broad = [
      item.title,
      item.summary,
      item.category,
      item.type,
      item.stage,
      item.year,
      ...(item.tags || []),
      ...(item.filterTags || []),
      ...(item.areas || []),
      ...(item.searchKeywords || [])
    ].join(" ");
    return state.titleOnly ? item.title : broad;
  }

  function queryTokens(value) {
    return normalize(value)
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 1);
  }

  function queryMatches(item, query) {
    if (!query) return true;
    const normalizedText = normalize(searchText(item));
    if (normalizedText.includes(query)) return true;
    const tokens = queryTokens(query);
    return tokens.length ? tokens.every((token) => normalizedText.includes(token)) : true;
  }

  function itemPlaceText(item) {
    return normalize(
      [
        item.title,
        item.summary,
        item.category,
        item.stage,
        ...(item.areas || []),
        ...(item.tags || []),
        ...(item.filterTags || []),
        ...(item.searchKeywords || [])
      ].join(" ")
    );
  }

  function placeMatches(item, overridePlace) {
    const place = overridePlace || state.place;
    if (!place?.value) return true;
    const haystack = itemPlaceText(item);
    return (place.terms?.length ? place.terms : [place.value])
      .map((term) => normalize(term))
      .filter((term) => term.length > 1)
      .some((term) => textContainsPhrase(haystack, term));
  }

  function matchesSet(item, kind, field) {
    const selected = state.selected[kind];
    if (!selected.size) return true;
    const values = valuesForField(item, field);
    return [...selected].some((value) => values.includes(value));
  }

  function score(item) {
    if (!state.query) return 0;
    const q = normalize(state.query);
    const tokens = queryTokens(q);
    let total = 0;
    if (normalize(item.title).includes(q)) total += 8;
    if (normalize(item.summary).includes(q)) total += 4;
    if ((item.tags || []).some((tag) => normalize(tag).includes(q))) total += 3;
    if ((item.filterTags || []).some((tag) => normalize(tag).includes(q))) total += 3;
    if ((item.searchKeywords || []).some((keyword) => normalize(keyword).includes(q))) total += 5;
    if ((item.areas || []).some((area) => normalize(area).includes(q))) total += 4;
    tokens.forEach((token) => {
      if (normalize(item.title).includes(token)) total += 3;
      if (normalize(item.summary).includes(token)) total += 1;
      if ((item.tags || []).some((tag) => normalize(tag).includes(token))) total += 2;
      if ((item.filterTags || []).some((tag) => normalize(tag).includes(token))) total += 2;
      if ((item.searchKeywords || []).some((keyword) => normalize(keyword).includes(token))) total += 2;
      if ((item.areas || []).some((area) => normalize(area).includes(token))) total += 2;
    });
    return total;
  }

  function filteredArticles() {
    const q = normalize(state.query);
    let items = page.articles.filter((item) => {
      const queryMatch = queryMatches(item, q);
      const radiusMatch = !state.radiusArea || (item.areas || []).includes(state.radiusArea);
      return (
        queryMatch &&
        placeMatches(item) &&
        radiusMatch &&
        matchesSet(item, "type", "type") &&
        matchesSet(item, "tag", "tags") &&
        matchesSet(item, "year", "year") &&
        matchesSet(item, "area", "areas") &&
        matchesSet(item, "stage", "stage")
      );
    });

    if (state.sort === "newest") {
      items = items.sort((a, b) => b.year - a.year || a.priority - b.priority);
    } else if (state.sort === "useful") {
      items = items.sort((a, b) => a.priority - b.priority);
    } else {
      items = items.sort((a, b) => score(b) - score(a) || a.priority - b.priority);
    }
    return items;
  }

  function selectedLabels() {
    const labels = [];
    if (state.query) labels.push(`Search: ${state.query}`);
    if (state.titleOnly) labels.push("Titles only");
    if (state.place.value) labels.push(`Place: ${state.place.label}`);
    if (state.radiusLabel) labels.push(state.radiusLabel);
    Object.entries(state.selected).forEach(([, set]) => {
      set.forEach((value) => labels.push(value));
    });
    return labels;
  }

  function renderArticles() {
    const items = filteredArticles();
    const perPage = state.perPage === "all" ? items.length || 1 : Number(state.perPage);
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * perPage;
    const visible = items.slice(start, start + perPage);

    els.resultCount.textContent = items.length
      ? `Showing ${start + 1}-${start + visible.length} out of ${items.length} articles`
      : "Showing 0 articles";
    const labels = selectedLabels();
    els.selectedFilters.textContent = labels.length ? labels.join(" | ") : "No filters selected";

    els.results.innerHTML = visible.length
      ? visible
          .map((item) => {
            const publicTags = item.filterTags?.length ? item.filterTags : item.tags || [];
            const pills = [item.type, item.year, item.stage, ...publicTags.slice(0, 3)]
              .map((tag) => `<span class="article-tag-button" role="button" tabindex="0" data-article-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>`)
              .join("");
            return `
              <article class="library-article" data-intent="${pageKey}" data-topic-id="${item.topicId || ""}" data-status="${item.status || "live"}" data-tags="${publicTags.join(",")}">
                <img src="${item.image}" alt="${item.imageAlt}">
                <span class="library-article-body">
                  <a class="library-article-copy" href="${item.href}">
                    <span class="article-meta-row"><span class="article-category">${item.category}</span></span>
                    <h3>${item.title}</h3>
                    <p>${item.summary}</p>
                    <span class="article-cta">${item.cta}</span>
                  </a>
                  <span class="article-tags">${pills}</span>
                </span>
              </article>
            `;
          })
          .join("")
      : `<div class="empty-results"><h3>No matching articles</h3><p>Try removing a filter or ask Israel to route the question privately.</p><a class="button button-primary" href="${contactPath()}">Ask Israel privately</a></div>`;

    els.pagination.textContent = `Page ${state.page} of ${totalPages}`;
    els.prev.disabled = state.page <= 1;
    els.next.disabled = state.page >= totalPages;
  }

  function contactPath() {
    return "../index.html#contact-israel";
  }

  function applyFromControls() {
    state.sort = els.sort.value;
    state.query = els.query.value;
    state.titleOnly = els.titleOnly.checked;
    state.perPage = els.perPage.value;
    state.page = 1;
    renderArticles();
  }

  function mapZipToArea(zip) {
    if (/^9027/.test(zip) || /^9026/.test(zip)) return "South Bay";
    if (/^905/.test(zip)) return "South Bay";
    if (/^908/.test(zip)) return "Long Beach Area";
    if (/^906|^907|^9025/.test(zip)) return "Gateway Cities";
    if (/^926|^927|^928/.test(zip)) return "Orange County";
    if (/^900|^901|^913|^914|^915|^916/.test(zip)) return "Los Angeles County";
    return "";
  }

  function resetFilters() {
    state.query = "";
    state.titleOnly = false;
    state.sort = "relevance";
    state.page = 1;
    state.perPage = 10;
    state.radiusArea = "";
    state.radiusLabel = "";
    state.place = {
      mode: "city",
      value: "",
      label: "",
      terms: [],
      area: "",
      county: ""
    };
    Object.values(state.selected).forEach((set) => set.clear());
    els.sort.value = "relevance";
    els.query.value = "";
    els.titleOnly.checked = false;
    els.perPage.value = "10";
    els.tagSearch.value = "";
    els.areaSearch.value = "";
    document.querySelectorAll(".radius-filter input").forEach((input) => {
      input.value = "";
    });
    renderFilters();
    renderArticles();
  }

  function initPage() {
    document.title = `${page.resultsTitle.replace("All ", "").replace(" articles", "")} | Israel Hernandez | Think Boutiq Real Estate`;
    els.title.textContent = page.title;
    els.eyebrow.textContent = page.eyebrow;
    els.intro.textContent = page.intro;
    els.searchLabel.textContent = page.searchLabel;
    els.resultsTitle.textContent = page.resultsTitle;
    els.feature.innerHTML = `
      <img src="${page.feature.image}" alt="">
      <span class="library-feature-body">
        <span class="article-category">${page.feature.category}</span>
        <strong>${page.feature.title}</strong>
        <p>${page.feature.summary}</p>
      </span>
    `;
    initResponsiveFilters();
    setupFilterLayout();
    renderFilters();
    const initialQuery = new URLSearchParams(window.location.search).get("q");
    if (initialQuery) {
      state.query = initialQuery;
      els.query.value = initialQuery;
    }
    initGuidanceFinder();
    renderArticles();
    loadCityZipData();
  }

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open-library-filters]");
    if (openButton) {
      event.preventDefault();
      openFilters(openButton);
      return;
    }

    if (event.target.closest("[data-close-library-filters], [data-save-library-filters]")) {
      event.preventDefault();
      closeFilters({ restoreFocus: true });
      return;
    }

    const placeMode = event.target.closest("[data-place-mode]");
    if (placeMode) {
      event.preventDefault();
      const mode = placeMode.dataset.placeMode;
      if (mode && mode !== state.place.mode) setPlaceMode(mode);
      return;
    }

    const placeOption = event.target.closest("[data-place-option]");
    if (placeOption) {
      event.preventDefault();
      applyPlaceOption(placeOption.dataset.placeModeValue || state.place.mode, placeOption.dataset.placeOption);
      return;
    }

    if (event.target.closest("[data-place-clear]")) {
      event.preventDefault();
      clearPlaceOption();
    }
  });

  document.addEventListener("change", (event) => {
    const filter = event.target.closest("[data-filter-kind]");
    if (filter) {
      const kind = filter.dataset.filterKind;
      if (filter.checked) {
        state.selected[kind].add(filter.value);
      } else {
        state.selected[kind].delete(filter.value);
      }
      state.page = 1;
      renderArticles();
      return;
    }
    if ([els.sort, els.titleOnly, els.perPage].includes(event.target)) {
      applyFromControls();
    }
  });

  ["input", "search"].forEach((eventName) => {
    els.query.addEventListener(eventName, applyFromControls);
    els.tagSearch.addEventListener(eventName, () => renderFilter("tag", orderedTagValues(uniqueValues("tags")), tagFilterLimit()));
    els.areaSearch.addEventListener(eventName, () => renderPlaceOptions());
  });

  document.querySelectorAll("[data-toggle-more]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.toggleMore;
      state.expanded[key] = !state.expanded[key];
      button.textContent = state.expanded[key]
        ? key === "area"
          ? "- Fewer places"
          : "- Fewer tag filters"
        : key === "area"
          ? "+ More places"
          : "+ More tag filters";
      renderFilters();
    });
  });

  document.querySelector("[data-reset-filters]").addEventListener("click", resetFilters);

  document.querySelector("[data-radius-filter]").addEventListener("submit", (event) => {
    event.preventDefault();
    const miles = document.querySelector("#radius-miles").value.trim();
    const zip = document.querySelector("#radius-zip").value.trim();
    const mappedArea = mapZipToArea(zip);
    state.radiusArea = miles && zip ? mappedArea || "__no_radius_match__" : "";
    state.radiusLabel = miles && zip ? `${miles} miles from ${zip}` : "";
    state.page = 1;
    renderArticles();
  });

  document.querySelectorAll("[data-library-header-search]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const value = String(data.get("q") || "").trim();
      const query = value ? `?q=${encodeURIComponent(value)}` : "";
      window.location.href = `../search/${query}`;
    });
  });

  document.addEventListener("click", (event) => {
    const tag = event.target.closest("[data-article-tag]");
    if (!tag) return;
    event.preventDefault();
    event.stopPropagation();
    state.query = tag.dataset.articleTag || "";
    els.query.value = state.query;
    state.page = 1;
    renderArticles();
    document.querySelector("#article-library").scrollIntoView({ behavior: "smooth", block: "start" });
    els.query.focus();
    if (window.hbiSearch) {
      window.hbiSearch.track("hbi_article_tag_filter", {
        page: pageKey,
        tag: state.query
      });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const tag = event.target.closest("[data-article-tag]");
    if (!tag) return;
    event.preventDefault();
    tag.click();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !filtersUseModal() || !els.filters?.classList.contains("is-open")) return;
    const controls = focusableFilterControls();
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  els.prev.addEventListener("click", () => {
    state.page = Math.max(1, state.page - 1);
    renderArticles();
  });

  els.next.addEventListener("click", () => {
    state.page += 1;
    renderArticles();
  });

  function syncOverlayState() {
    const menuOpen = els.menu && !els.menu.hidden;
    const filtersOpen = els.filters && filtersUseModal() && els.filters.classList.contains("is-open");
    document.body.classList.toggle("overlay-open", Boolean(menuOpen || filtersOpen));
  }

  function openMenu() {
    closeMegaMenus();
    els.menu.hidden = false;
    els.menuToggle.setAttribute("aria-expanded", "true");
    els.menuToggle.setAttribute("aria-label", "Close menu");
    syncOverlayState();
    els.menu.querySelector("[data-close-menu]")?.focus();
  }

  function closeMenu({ restoreFocus = false } = {}) {
    els.menu.hidden = true;
    els.menuToggle.setAttribute("aria-expanded", "false");
    els.menuToggle.setAttribute("aria-label", "Open menu");
    syncOverlayState();
    if (restoreFocus) els.menuToggle.focus();
  }

  megaTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (goToNavHub(trigger)) return;
      const item = trigger.closest(".nav-item");
      const willOpen = trigger.getAttribute("aria-expanded") !== "true";
      closeMegaMenus();
      if (willOpen) {
        trigger.setAttribute("aria-expanded", "true");
        item?.classList.add("is-open");
      }
    });
  });

  els.menuToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const willOpen = els.menu.hidden;
    if (willOpen) {
      openMenu();
    } else {
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-menu]")) {
      closeMenu();
      return;
    }

    const menuIsOpen = els.menu && !els.menu.hidden;
    const clickedInsideMenu = event.target.closest("#site-menu");
    const clickedMenuToggle = event.target.closest(".menu-toggle");
    const clickedMenuControl = event.target.closest(
      "#site-menu a, #site-menu button, #site-menu input, #site-menu select, #site-menu textarea"
    );
    if (menuIsOpen && !clickedMenuToggle && (!clickedInsideMenu || !clickedMenuControl)) {
      closeMenu();
      if (clickedInsideMenu) return;
    }

    const clickedInsideMega = event.target.closest(".nav-item");
    if (!clickedInsideMega && !event.target.closest("[data-mega-menu]")) {
      closeMegaMenus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (filtersUseModal() && els.filters?.classList.contains("is-open")) {
      closeFilters({ restoreFocus: true });
      return;
    }

    if (!els.menu.hidden) {
      closeMenu({ restoreFocus: true });
      return;
    }

    closeMegaMenus();
  });

  initPage();
})();
