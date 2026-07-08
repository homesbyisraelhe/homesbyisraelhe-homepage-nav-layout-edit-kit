(() => {
  const depth = "../../";
  const leadKey = `hbiArticleLeadDismissed:${document.body.dataset.articleSlug || "article"}`;
  const articleTitle = document.body.dataset.articleTitle || document.title.replace(/\s+\|\s+Israel Hernandez$/, "");
  const articleSummary =
    document.querySelector(".article-dek")?.textContent?.trim() ||
    document.querySelector('meta[name="description"]')?.getAttribute("content") ||
    `Current ${document.body.dataset.articleIntentLabel || "real estate"} guide.`;
  const articleOffer = document.body.dataset.articleOffer || "Compare options before you decide";
  const articleIntentLabel = document.body.dataset.articleIntentLabel || "Move / Relocate";
  const articleIntentPath =
    {
      Buy: "buy",
      Sell: "sell",
      "Move / Relocate": "move-relocate",
      Homeowners: "homeowners",
      Invest: "invest",
      "Local Areas": "local-areas",
      "Housing Market Pulse": "housing-market-pulse"
    }[articleIntentLabel] || "move-relocate";
  const pulseAvatar = document.body.dataset.pulseAvatar || "";
  const isBuyerPulseArticle = articleIntentPath === "housing-market-pulse" && (!pulseAvatar || pulseAvatar === "buyer");
  const buyerGuideHref = "https://israelhernandez.thinkboutiq.com/home-buyer-guide";
  let previousFocus = null;
  let intakePreviousFocus = null;
  let activeIntakeForm = null;
  let lastMegaFocus = null;
  let viewportSyncFrame = 0;
  const compactIntakeKinds = new Set(["buy", "sell", "move-relocate", "homeowners", "invest", "housing-market-pulse"]);
  const googleClientId = "261880757190-vahpflcil50ok1keekda4qg50qphme5i.apps.googleusercontent.com";
  const googleIdentityHosts = new Set(["homesbyisraelhe.com", "www.homesbyisraelhe.com"]);
  const phoneConsentCopy = 'By checking this box, I agree to receive recurring marketing communication from Israel Hernandez, including auto-dialed calls, texts, and artificial/prerecorded voice messages (message frequency varies; data rates may apply; reply "STOP" to opt-out of texts or "HELP" for assistance); Consent not required to make a purchase. I understand that I can call 424-243-1233 to obtain direct assistance.';
  const siteHref = (path = "") => `${depth}${path}`;
  const searchHref = (query = "") => siteHref(`search/${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  const navHubHrefs = {
    "mega-buy": `${depth}buy/#article-library`,
    "mega-sell": `${depth}sell/#article-library`,
    "mega-move": `${depth}move-relocate/#article-library`,
    "mega-homeowners": `${depth}homeowners/#article-library`,
    "mega-invest": `${depth}invest/#article-library`,
    "mega-local": `${depth}local-areas/#article-library`,
    "mega-market-trends": `${depth}housing-market-pulse/`,
    "mega-resources": `${depth}index.html#resources`
  };
  let googleScriptPromise = null;
  let activeGoogleForm = null;

  function navHubHrefForTrigger(trigger) {
    if (!trigger) return "";
    return trigger.dataset.navHref || navHubHrefs[trigger.getAttribute("aria-controls")] || "";
  }

  function normalizeHubNavigationLinks() {
    const hubTargets = {
      [`${depth}buy/`]: `${depth}buy/#article-library`,
      [`${depth}sell/`]: `${depth}sell/#article-library`,
      [`${depth}move-relocate/`]: `${depth}move-relocate/#article-library`,
      [`${depth}homeowners/`]: `${depth}homeowners/#article-library`,
      [`${depth}invest/`]: `${depth}invest/#article-library`,
      [`${depth}local-areas/`]: `${depth}local-areas/#article-library`
    };
    document.querySelectorAll("#site-menu a[href], .primary-nav a.nav-link[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (hubTargets[href]) link.setAttribute("href", hubTargets[href]);
    });
  }

  function ensureMarketPulseReachability() {
    const pulseHref = siteHref("housing-market-pulse/");
    const trendsHref = siteHref("market-trends/");
    const nav = document.querySelector(".primary-nav");
    if (nav && !nav.querySelector('[aria-controls="mega-market-trends"], a[href$="housing-market-pulse/"]')) {
      const link = document.createElement("a");
      link.className = "nav-link";
      link.href = pulseHref;
      link.textContent = "Market Pulse";
      const before = Array.from(nav.children).find((item) => {
        if (!(item instanceof HTMLAnchorElement)) return false;
        const href = item.getAttribute("href") || "";
        return href.includes("index.html#contact-israel") || href.endsWith("#contact-israel") || href.endsWith("/#contact-israel");
      });
      nav.insertBefore(link, before || null);
    }
    if (nav && !nav.querySelector('[aria-controls="mega-market-trends"], a[href*="market-trends/"]')) {
      const link = document.createElement("a");
      link.className = "nav-link";
      link.href = trendsHref;
      link.textContent = "Market Trends";
      const pulseLink = Array.from(nav.children).find((item) => {
        if (!(item instanceof HTMLAnchorElement)) return false;
        return (item.getAttribute("href") || "").includes("housing-market-pulse/");
      });
      const before = pulseLink?.nextElementSibling || Array.from(nav.children).find((item) => {
        if (!(item instanceof HTMLAnchorElement)) return false;
        const href = item.getAttribute("href") || "";
        return href.includes("index.html#contact-israel") || href.endsWith("#contact-israel") || href.endsWith("/#contact-israel");
      });
      nav.insertBefore(link, before || null);
    }

    const mobileGrid = document.querySelector("#site-menu .mobile-menu-grid");
    if (mobileGrid && !mobileGrid.querySelector('a[href$="housing-market-pulse/"]')) {
      const link = document.createElement("a");
      link.href = pulseHref;
      link.setAttribute("data-close-menu", "");
      link.innerHTML = "<strong>Housing Market Pulse</strong><span>Monthly local market reads before buying or selling.</span>";
      const before = Array.from(mobileGrid.children).find((item) => item instanceof HTMLAnchorElement && item.textContent.includes("Contact Israel"));
      mobileGrid.insertBefore(link, before || null);
    }
    if (mobileGrid && !mobileGrid.querySelector('a[href*="market-trends/"]')) {
      const link = document.createElement("a");
      link.href = trendsHref;
      link.setAttribute("data-close-menu", "");
      link.innerHTML = "<strong>Market Trends</strong><span>Use local charts for price, inventory, pace, and supply.</span>";
      const pulseLink = Array.from(mobileGrid.children).find((item) => {
        if (!(item instanceof HTMLAnchorElement)) return false;
        return (item.getAttribute("href") || "").includes("housing-market-pulse/");
      });
      const before = pulseLink?.nextElementSibling || Array.from(mobileGrid.children).find((item) => item instanceof HTMLAnchorElement && item.textContent.includes("Contact Israel"));
      mobileGrid.insertBefore(link, before || null);
    }
  }

  function closeMegaMenus() {
    document.querySelectorAll("[data-mega-trigger]").forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
      trigger.closest(".nav-item")?.classList.remove("is-open");
    });
  }

  function syncOverlayOpenState() {
    const menu = document.querySelector("#site-menu");
    const leadModal = document.querySelector("#article-lead-modal");
    const searchPanel = document.querySelector("#search-panel");
    const menuOpen = Boolean(menu && !menu.hidden);
    const modalOpen = Boolean(leadModal && !leadModal.hidden);
    const searchOpen = Boolean(searchPanel && !searchPanel.hidden);
    const intakeOpen = Boolean(document.querySelector("[data-intake-modal]:not([hidden])"));
    document.body.classList.toggle("overlay-open", menuOpen || modalOpen || searchOpen || intakeOpen);
  }

  function formDataObject(data) {
    if (window.HBILeadClient?.formDataObject) return window.HBILeadClient.formDataObject(data);
    const output = {};
    for (const [key, value] of data.entries()) {
      if (output[key]) output[key] = Array.isArray(output[key]) ? output[key].concat(value) : [output[key], value];
      else output[key] = value;
    }
    return output;
  }

  function sanitizedLeadFields(data) {
    const fields = formDataObject(data);
    if (fields.phone && fields.phone_consent !== "yes") delete fields.phone;
    return fields;
  }

  function consentedPhone(data) {
    const phone = String(data.get("phone") || "").trim();
    return phone && data.get("phone_consent") === "yes" ? phone : "";
  }

  function routeKeyForIntakeKind(kind) {
    if (kind === "housing-market-pulse" || articleIntentPath === "housing-market-pulse") {
      const avatar = document.body.dataset.pulseAvatar || "buyer";
      if (avatar === "seller") return "article_seller_private_question";
      if (avatar === "investor") return "article_invest_hold_private_question";
      return "article_buyer_private_question";
    }
    const routeMap = {
      buy: "article_buyer_private_question",
      sell: "article_seller_private_question",
      homeowners: "article_homeowner_private_question",
      "move-relocate": "article_move_relocate_private_question",
      invest: "article_invest_hold_private_question",
      "local-areas": "article_buyer_private_question"
    };
    return routeMap[kind] || routeMap[articleIntentPath] || "article_homeowner_private_question";
  }

  function articlePageContext(extra = {}) {
    return {
      articleTitle,
      articleSlug: document.body.dataset.articleSlug || "",
      articleOffer,
      intentLabel: articleIntentLabel,
      ...extra
    };
  }

  function articleLeadPayload({ form, data, details = [], formType, formLocation, ctaLabel, ctaPromise }) {
    const intakeKind = data.get("intake_kind") || (form ? inferIntakeKind(form) : articleIntentPath);
    return {
      routeKey: routeKeyForIntakeKind(intakeKind),
      leadAction: "create_lead_and_start_outreach",
      followUpType: `${articleIntentLabel} private question outreach`,
      routeTags: [articleIntentLabel, intakeKind, "Private Question"].filter(Boolean),
      formType,
      formLocation,
      contact: {
        firstName: String(data.get("first_name") || "").trim(),
        lastName: String(data.get("last_name") || "").trim(),
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: consentedPhone(data),
        phoneConsent: data.get("phone_consent") === "yes"
      },
      fields: sanitizedLeadFields(data),
      details,
      cta: {
        label: ctaLabel || articleOffer || "Private question",
        promise: ctaPromise || "Private real estate question"
      },
      destination: {
        type: "crm_lead",
        url: ""
      },
      page: articlePageContext()
    };
  }

  async function submitArticleLead(payload) {
    if (window.HBILeadClient?.submitLead) {
      return window.HBILeadClient.submitLead(payload);
    }
    throw new Error("lead_capture_unavailable");
  }

  function searchItems() {
    return [
      [
        articleTitle,
        articleSummary,
        window.location.pathname.split("/").pop() ? window.location.href : "#main"
      ],
      ["Start with your situation", "Use the homepage dashboard when the path is not obvious.", siteHref("index.html#decision-dashboard")],
      ["Buy a Home", "Compare budget, local fit, touring, offers, and inspections.", siteHref("buy/#article-library")],
      ["Sell a Home", "Plan prep, pricing, timing, repairs, and offer review.", siteHref("sell/#article-library")],
      ["Move / Relocate", "Line up sale timing, purchase timing, leases, commute, and calendar pressure.", siteHref("move-relocate/#article-library")],
      ["Homeowners", "Decide whether to sell, rent, hold, repair, refinance, or wait.", siteHref("homeowners/#article-library")],
      ["Invest", "Compare rental demand, hold strategy, risk, and exit planning.", siteHref("invest/#article-library")],
      ["Local Areas", "Compare city, neighborhood, commute, and market context.", siteHref("local-areas/#article-library")],
      ["Housing Market Pulse", "Read local market signals in plain English before acting.", siteHref("housing-market-pulse/#article-library")],
      ["Resources", "Find guides, FAQs, source notes, market updates, and support tools.", siteHref("index.html#resources")],
      ["Contact Israel", "Ask a private real estate question.", siteHref("index.html#contact-israel")]
    ];
  }

  function renderArticleSearch(query = "") {
    const searchResults = document.querySelector("#search-results");
    if (!searchResults) return;
    if (window.hbiSearch) {
      const value = query.trim();
      const matches = window.hbiSearch.search(value, {
        pageIntent: articleIntentPath,
        limit: 7
      });
      const results = matches.length ? matches : window.hbiSearch.search("sell rent hold", { limit: 5 });
      searchResults.innerHTML = "";
      const intro = document.createElement("p");
      intro.className = "eyebrow";
      intro.textContent = value ? `Best matches for "${value}"` : "Useful starting points";
      searchResults.append(intro);
      results.forEach(({ item, reason }) => {
        const link = document.createElement("a");
        link.className = "search-result";
        link.href = window.hbiSearch.href(item, depth);
        link.dataset.topicId = item.topicId || "";
        link.innerHTML = `<strong>${item.title}</strong><span>${reason}</span>`;
        searchResults.append(link);
      });
      const allLink = document.createElement("a");
      allLink.className = "search-result search-result-all";
      allLink.href = searchHref(value);
      allLink.innerHTML = "<strong>Open full search</strong><span>Use intent and situation filters across the whole guidance library.</span>";
      searchResults.append(allLink);
      return;
    }

    const normalized = query.trim().toLowerCase();
    const matches = normalized
      ? searchItems().filter(([title, copy]) => `${title} ${copy}`.toLowerCase().includes(normalized))
      : searchItems().slice(0, 7);
    const results = matches.length
      ? matches
      : [
          ["Search the article library", "Use the closest intent page and filter from there.", siteHref(`${articleIntentPath}/#article-library`)],
          ["Ask Israel to route the question", "Share the decision and get pointed to the right path.", siteHref("index.html#contact-israel")]
        ];

    searchResults.innerHTML = "";
    const intro = document.createElement("p");
    intro.className = "eyebrow";
    intro.textContent = normalized ? `Results for "${query.trim()}"` : "Useful starting points";
    searchResults.append(intro);
    results.forEach(([title, copy, href]) => {
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = href;
      link.innerHTML = `<strong>${title}</strong><span>${copy}</span>`;
      searchResults.append(link);
    });
  }

  function closeArticleSearch() {
    const searchPanel = document.querySelector("#search-panel");
    if (!searchPanel) return;
    searchPanel.hidden = true;
    syncOverlayOpenState();
  }

  function openArticleSearch(query = "") {
    const searchPanel = document.querySelector("#search-panel");
    const input = document.querySelector("#overlay-search-input");
    if (!searchPanel || !input) return;
    setArticleMenu(false);
    closeMegaMenus();
    searchPanel.hidden = false;
    input.value = query;
    renderArticleSearch(query);
    syncOverlayOpenState();
    input.focus();
    input.select();
  }

  function setArticleMenu(open, { returnFocus = false } = {}) {
    const menu = document.querySelector("#site-menu");
    const menuToggle = document.querySelector(".menu-toggle");
    if (!menu) return;
    menu.hidden = !open;
    menuToggle?.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      closeArticleSearch();
      closeMegaMenus();
      menu.querySelector("[data-close-menu]")?.focus();
    }
    syncOverlayOpenState();
    if (returnFocus) menuToggle?.focus();
  }

  function renderArticleNav() {
    const nav = document.querySelector(".primary-nav");
    if (!nav) return;
    if (nav.querySelector("[data-mega-menu]")) return;

    nav.innerHTML = `
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-buy" data-mega-trigger>Buy</button>
        <div class="mega-menu" id="mega-buy" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For buyers</p>
            <h2>Start with fit before listings.</h2>
            <p>Compare budget, daily life, commute, and offer strategy before the tour calendar gets noisy.</p>
            <a class="button button-primary" href="${siteHref("buy/#article-library")}">Start a buyer plan</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="${siteHref("buy/#article-library")}">Compare rent vs. buy <span>Decide whether buying now actually fits.</span></a>
              <a href="${siteHref("local-areas/#article-library")}">Compare Local Areas before touring <span>Use city fit to narrow the search radius.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="${siteHref("buy/#article-library")}">Understand offer strategy <span>Know what matters when the right home appears.</span></a>
              <a href="${siteHref("index.html#contact-israel")}">Ask a buyer question <span>Get routed without giving up your weekend.</span></a>
            </section>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-sell" data-mega-trigger>Sell</button>
        <div class="mega-menu" id="mega-sell" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For sellers</p>
            <h2>Price, prep, and timing with less guesswork.</h2>
            <p>Sort repairs, privacy, showing pressure, pricing, and your next move before listing.</p>
            <a class="button button-primary" href="${siteHref("sell/#article-library")}">Start seller planning</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="${siteHref("sell/#article-library")}">Prep before pricing <span>Decide what to fix and what to leave alone.</span></a>
              <a href="${siteHref("sell/#article-library")}">Sell privately or go public <span>Understand the tradeoffs before exposure.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="${siteHref("sell/#article-library")}">Think through a home value path <span>Discuss condition, timing, and local demand.</span></a>
              <a href="${siteHref("index.html#contact-israel")}">Ask a private seller question <span>Use a low-pressure route first.</span></a>
            </section>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-label="Move / Relocate" aria-expanded="false" aria-controls="mega-move" data-mega-trigger><span class="wide-label">Move / Relocate</span><span class="short-label" aria-hidden="true">Move</span></button>
        <div class="mega-menu" id="mega-move" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For movers</p>
            <h2>Line up the real estate pieces first.</h2>
            <p>Connect sale timing, purchase timing, leases, school calendars, commute changes, and household pressure.</p>
            <a class="button button-primary" href="${siteHref("move-relocate/#article-library")}">Plan the move sequence</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="${siteHref("move-relocate/#article-library")}">Move into Southern California <span>Compare cities before choosing a search path.</span></a>
              <a href="${siteHref("move-relocate/#article-library")}">Move out while owning <span>Decide what happens to the current property.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="${siteHref("local-areas/#article-library")}">Compare commute and city fit <span>Use daily-life context before touring.</span></a>
              <a href="${siteHref("index.html#contact-israel")}">Ask a timing question <span>Start with the sequence, not paperwork.</span></a>
            </section>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-homeowners" data-mega-trigger>Homeowners</button>
        <div class="mega-menu" id="mega-homeowners" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For homeowners</p>
            <h2>Separate the property decision from the life decision.</h2>
            <p>Clarify whether the next move is sell, rent, hold, repair, refinance, or wait.</p>
            <a class="button button-primary" href="${siteHref("homeowners/#article-library")}">Choose a homeowner path</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="${siteHref("homeowners/#article-library")}">Decide whether to sell, rent, or hold <span>Compare cash, risk, repairs, and timeline.</span></a>
              <a href="${siteHref("homeowners/#article-library")}">Review a home value path <span>Start with condition and local demand.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="${siteHref("homeowners/#article-library")}">Think through repairs before selling <span>Know what could help or waste money.</span></a>
              <a href="${siteHref("index.html#contact-israel")}">Ask a private homeowner question <span>Useful for sensitive timing or tenant issues.</span></a>
            </section>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-invest" data-mega-trigger>Invest</button>
        <div class="mega-menu" id="mega-invest" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For investors</p>
            <h2>Compare return, risk, and exit path.</h2>
            <p>Use local demand, rent potential, repairs, and holding costs before deciding what to buy or keep.</p>
            <a class="button button-primary" href="${siteHref("invest/#article-library")}">Start an investment review</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>First decisions</h3>
              <a href="${siteHref("invest/#article-library")}">Rental and investment decisions <span>Compare cash flow against ownership friction.</span></a>
              <a href="${siteHref("invest/#article-library")}">Should I sell, rent, or hold? <span>Useful for an existing property.</span></a>
            </section>
            <section>
              <h3>Support</h3>
              <a href="${siteHref("invest/#article-library")}">Ask a market question <span>Use property type and timing to make it specific.</span></a>
              <a href="${siteHref("index.html#contact-israel")}">Talk through risk privately <span>Good for tenant, repair, or exit questions.</span></a>
            </section>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-local" data-mega-trigger>Local Areas</button>
        <div class="mega-menu" id="mega-local" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">For local-area researchers</p>
            <h2>Compare places by daily life.</h2>
            <p>Look at commute, housing type, beach access, price bands, schools, and how each city changes your strategy.</p>
            <a class="button button-primary" href="${siteHref("local-areas/#article-library")}">Explore Local Areas</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>Nearby</h3>
              <a href="${siteHref("local-areas/?q=Redondo%20Beach#article-library")}">Redondo Beach <span>Coastal lifestyle, housing mix, and South Bay tradeoffs.</span></a>
              <a href="${siteHref("local-areas/?q=Manhattan%20Beach%20Hermosa%20Beach#article-library")}">Manhattan Beach and Hermosa Beach <span>Beach-city daily life and price pressure.</span></a>
            </section>
            <section>
              <h3>Broader context</h3>
              <a href="${siteHref("local-areas/?q=Long%20Beach#article-library")}">Long Beach Area <span>Neighborhood variety and commute choices.</span></a>
              <a href="${siteHref("local-areas/?q=Orange%20County#article-library")}">LA County and Orange County <span>Useful when your search crosses county lines.</span></a>
            </section>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-market-trends" data-nav-href="${siteHref("housing-market-pulse/")}" data-mega-trigger>Market Trends</button>
        <div class="mega-menu" id="mega-market-trends" data-mega-menu>
          <div class="mega-feature">
            <p class="eyebrow">Market context</p>
            <h2>Read the numbers before timing the move.</h2>
            <p>Use local market charts and plain-English Housing Market Pulse reads before deciding how fast, firm, or cautious to be.</p>
            <a class="button button-primary" href="${siteHref("housing-market-pulse/")}">Open Housing Market Pulse</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>Monthly reads</h3>
              <a href="${siteHref("housing-market-pulse/")}">Housing Market Pulse <span>Plain-English buyer and seller reads by city or ZIP.</span></a>
              <a href="${siteHref("market-trends/")}">Market Trends finder <span>Use live charts for price, inventory, pace, and supply.</span></a>
            </section>
            <section>
              <h3>Local timing</h3>
              <a href="${siteHref("market-trends/?mode=pulse#article-library")}">Find a Pulse by city <span>Start with the route picker when the location matters most.</span></a>
              <a href="${siteHref("market-trends/?view=zip#article-library")}">Search by ZIP <span>Useful when citywide numbers are too broad.</span></a>
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
            <a class="button button-primary" href="${siteHref("index.html#resources")}">Find the right support</a>
          </div>
          <div class="mega-groups">
            <section>
              <h3>Research support</h3>
              <a href="${siteHref("index.html#resources")}">Find the right guide <span>Get routed by decision, not by content type.</span></a>
              <a href="${siteHref("index.html#resources")}">Review FAQs and source notes <span>Understand the assumptions behind local guidance.</span></a>
            </section>
            <section>
              <h3>Market context</h3>
              <a href="${siteHref("index.html#resources")}">Ask a market question <span>Make the answer city and property specific.</span></a>
              <a href="${siteHref("index.html#resources")}">Watch local market videos <span>Use videos after you know the city or topic.</span></a>
            </section>
          </div>
        </div>
      </div>
      <a class="nav-link" href="${siteHref("index.html#contact-israel")}">Contact</a>
    `;
  }

  function initHeader() {
    const menu = document.querySelector("#site-menu");
    const menuToggle = document.querySelector(".menu-toggle");

    document.addEventListener("click", (event) => {
      const menuIsOpen = menu && !menu.hidden;
      const clickedInsideMenu = event.target.closest("#site-menu");
      const clickedMenuToggle = event.target.closest(".menu-toggle");
      const clickedMegaTrigger = event.target.closest("[data-mega-trigger]");
      const clickedMenuControl = event.target.closest(
        "#site-menu a, #site-menu button, #site-menu input, #site-menu select, #site-menu textarea"
      );

      if (event.target.closest("[data-close-menu]")) {
        setArticleMenu(false);
        return;
      }

      if (clickedMegaTrigger) {
        event.preventDefault();
        const hubHref = navHubHrefForTrigger(clickedMegaTrigger);
        if (hubHref) {
          window.location.href = hubHref;
          return;
        }
        const shouldOpen = clickedMegaTrigger.getAttribute("aria-expanded") !== "true";
        setArticleMenu(false);
        closeMegaMenus();
        if (shouldOpen) {
          clickedMegaTrigger.setAttribute("aria-expanded", "true");
          clickedMegaTrigger.closest(".nav-item")?.classList.add("is-open");
          lastMegaFocus = clickedMegaTrigger;
        }
        return;
      }

      if (clickedMenuToggle) {
        event.preventDefault();
        const shouldOpen = menu?.hidden !== false;
        setArticleMenu(shouldOpen);
        return;
      }

      if (menuIsOpen && !clickedMenuToggle && (!clickedInsideMenu || !clickedMenuControl)) {
        setArticleMenu(false);
        if (clickedInsideMenu) return;
      }

      if (!event.target.closest(".nav-item")) closeMegaMenus();
    });

    document.querySelectorAll("[data-close-menu]").forEach((item) => {
      item.addEventListener("click", () => {
        setArticleMenu(false, { returnFocus: true });
      });
    });

    document.querySelectorAll("[data-article-header-search]").forEach((form) => {
      form.setAttribute("action", siteHref("search/"));
      form.setAttribute("method", "get");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = String(new FormData(form).get("q") || "").trim();
        window.location.href = searchHref(value);
      });
    });

    document.querySelector("[data-overlay-search]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.querySelector("#overlay-search-input");
      const value = String(input?.value || "").trim();
      window.location.href = searchHref(value);
    });

    document.querySelector("#overlay-search-input")?.addEventListener("input", (event) => {
      renderArticleSearch(event.currentTarget.value);
    });

    document.querySelectorAll("[data-close-search]").forEach((button) => {
      button.addEventListener("click", () => closeArticleSearch());
    });

    document.querySelector("#search-panel")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closeArticleSearch();
    });
  }

  function initShare() {
    const status = document.querySelector("[data-share-status]");
    document.querySelectorAll("[data-share]").forEach((button) => {
      button.addEventListener("click", async () => {
        const action = button.dataset.share;
        if (action === "copy") {
          try {
            await navigator.clipboard.writeText(window.location.href);
            if (status) status.textContent = "Link copied.";
          } catch {
            if (status) status.textContent = "Copy did not complete.";
          }
        }
      });
    });
  }

  function initVideos() {
    const frame = document.querySelector("[data-video-frame]");
    const shell = document.querySelector("[data-video-shell]");
    const openLink = document.querySelector("[data-open-video]");
    if (!frame) return;

    let activeList = document.querySelector("[data-video-tab][aria-selected='true']")?.dataset.videoList || "";

    function playlistUrl(list) {
      return `https://www.youtube.com/playlist?list=${encodeURIComponent(list)}`;
    }

    function embedUrl(list) {
      const origin = window.location.origin;
      const originParam = /^https?:\/\//.test(origin) ? `&origin=${encodeURIComponent(origin)}` : "";
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(list)}${originParam}&rel=0&modestbranding=1`;
    }

    function updateVideoActions(tab) {
      activeList = tab.dataset.videoList;
      const city = tab.textContent.trim();
      const kind = tab.dataset.videoKind || "market";
      const titleContext = kind === "local" ? "local video playlist" : "local market video playlist";
      if (openLink) openLink.href = playlistUrl(activeList);
      frame.title = `${city} ${titleContext}`;
      frame.src = embedUrl(activeList);
      shell?.classList.add("is-loaded");
    }

    document.querySelectorAll("[data-video-tab]").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll("[data-video-tab]").forEach((item) => item.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        updateVideoActions(tab);
      });
    });

    const selectedTab = document.querySelector("[data-video-tab][aria-selected='true']");
    if (selectedTab) updateVideoActions(selectedTab);
  }

  function getFocusable(container) {
    return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
  }

  function openLeadModal(returnTarget = document.activeElement) {
    const modal = document.querySelector("#article-lead-modal");
    if (!modal || !modal.hidden) return;
    previousFocus = returnTarget;
    modal.hidden = false;
    syncViewportSpaces();
    syncOverlayOpenState();
    scheduleViewportSpaceSync();
    const focusable = getFocusable(modal);
    focusable[0]?.focus();
  }

  function closeLeadModal({ remember = true } = {}) {
    const modal = document.querySelector("#article-lead-modal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    syncOverlayOpenState();
    if (remember) sessionStorage.setItem(leadKey, "true");
    previousFocus?.focus?.();
  }

  function initLeadModal() {
    const modal = document.querySelector("#article-lead-modal");
    if (!modal) return;

    if (!sessionStorage.getItem(leadKey)) {
      const modalDelay = isBuyerPulseArticle ? 40000 : 10000;
      window.setTimeout(openLeadModal, modalDelay);
    }

    document.querySelectorAll("[data-open-lead]").forEach((button) => {
      button.addEventListener("click", (event) => openLeadModal(event.currentTarget));
    });

    modal.querySelectorAll("[data-close-lead]").forEach((button) => {
      button.addEventListener("click", () => closeLeadModal());
    });

    modal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeLeadModal();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable(modal);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const form = modal.querySelector("form");
    if (form) {
      const phoneInput = form.querySelector('[name="phone"]');
      const consentInput = form.querySelector('[name="phone_consent"]');
      const consentText = form.querySelector("[data-phone-consent] span");
      if (consentText) consentText.textContent = phoneConsentCopy;
      syncPhoneConsent(form);
      phoneInput?.addEventListener("input", () => syncPhoneConsent(form));
      consentInput?.addEventListener("change", () => consentInput.setCustomValidity(""));
    }

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      syncPhoneConsent(event.currentTarget);
      if (!event.currentTarget.checkValidity()) {
        event.currentTarget.reportValidity();
        return;
      }
      const data = new FormData(event.currentTarget);
      await submitAndCloseLeadModal(modal, () => submitArticleLead(
        articleLeadPayload({
          form: event.currentTarget,
          data,
          formType: "article_lead_modal",
          formLocation: "article lead modal",
          ctaLabel: articleOffer,
          ctaPromise: isBuyerPulseArticle ? "Buyer Market Timing Kit" : "Private question from article modal"
        })
      ));
    });
  }

  const intakeConfigs = {
    buy: {
      title: "Buyer context",
      intro: "A few quick choices can make the reply more useful before you tour.",
      fields: [
        { type: "text", name: "locations", label: "Where are you considering?", placeholder: "Cities, neighborhoods, or ZIP codes" },
        { type: "select", name: "buyer_focus", label: "What is the main comparison?", options: ["Area comparison", "Budget", "Touring", "Financing", "Offers", "Inspections"] },
        { type: "select", name: "timeframe", label: "Timeframe", options: ["Just researching", "3-6 months", "Soon", "Urgent"] },
        { type: "choice", name: "sell_first", label: "Do you need to sell first?", options: ["Yes", "No", "Not sure"] }
      ]
    },
    sell: {
      title: "Seller context",
      intro: "Answer only what helps explain the selling decision.",
      fields: [
        { type: "select", name: "seller_driver", label: "What is driving the decision?", options: ["Timing", "Pricing", "Repairs", "Privacy", "Tenants", "Next purchase", "Inherited/family issue"] },
        { type: "text", name: "property_city", label: "Property city", placeholder: "Example: Long Beach, Torrance, Redondo Beach" },
        { type: "select", name: "seller_help", label: "What would help most?", options: ["Sale estimate", "Prep advice", "Private strategy conversation", "Offer/timing plan"] }
      ]
    },
    "move-relocate": {
      title: "Move context",
      intro: "Use this when timing, commute, and housing pieces overlap.",
      fields: [
        { type: "select", name: "move_direction", label: "What kind of move is this?", options: ["Moving into Southern California", "Moving out of Southern California", "Moving within Southern California"] },
        { type: "text", name: "commute_city", label: "Job or commute city", placeholder: "Example: El Segundo, Torrance, Long Beach" },
        { type: "select", name: "move_need", label: "What needs sequencing?", options: ["Buy before selling", "Sell before buying", "Rent-back", "School-year timing", "Area comparison"] }
      ]
    },
    homeowners: {
      title: "Homeowner context",
      intro: "This helps separate the property decision from the life decision.",
      fields: [
        { type: "select", name: "homeowner_decision", label: "What are you weighing?", options: ["Sell", "Rent", "Hold", "Repair", "Refinance", "Inherited", "Tenant issue", "Family decision", "Financial pressure"] },
        { type: "text", name: "property_city", label: "Property city", placeholder: "Example: Lakewood, Carson, Palos Verdes" },
        { type: "choice", name: "private_sensitive", label: "Is this private or sensitive?", options: ["Yes", "Somewhat", "No"] }
      ]
    },
    invest: {
      title: "Investment context",
      intro: "Use this for rental, tenant, hold, and exit decisions.",
      fields: [
        { type: "select", name: "invest_focus", label: "What is the main concern?", options: ["Rental demand", "Tenant issue", "Cash flow", "Repairs", "Vacancy", "Exit planning", "Hold vs sell"] },
        { type: "text", name: "property_city", label: "Property city", placeholder: "Example: Long Beach, Downey, Orange County" },
        { type: "select", name: "property_status", label: "Current status", options: ["Owned", "Considering", "Inherited", "Tenant-occupied"] }
      ]
    },
    "local-areas": {
      title: "Local area context",
      intro: "Share the daily-life tradeoffs behind the area comparison.",
      fields: [
        { type: "text", name: "cities_compared", label: "Cities being compared", placeholder: "Example: Redondo, Torrance, Long Beach" },
        { type: "text", name: "commute_anchor", label: "Commute anchor", placeholder: "Example: LAX, El Segundo, Irvine, Port of LA" },
        { type: "chips", name: "area_priorities", label: "What matters most?", options: ["Schools", "Walkability", "Budget", "Lifestyle", "Space", "Beach access", "Parking", "Investment potential"] }
      ]
    },
    "housing-market-pulse": {
      title: "Market read context",
      intro: "Use this when the local numbers need to become a property-level next step.",
      fields: [
        { type: "text", name: "property_or_area", label: "Property or area", placeholder: "Example: Redondo Beach, 90277, or a listing address" },
        { type: "select", name: "market_signal_focus", label: "What signal are you weighing?", options: ["Inventory", "Days on market", "Offer timing", "Price support", "Inspection risk", "Area comparison"] },
        { type: "select", name: "decision_stage", label: "Decision stage", options: ["Watching the market", "Comparing homes", "Before writing", "Already in negotiations"] }
      ]
    }
  };

  function isCompactIntakeForm(form) {
    if (!form?.matches?.("[data-intake-form]")) return false;
    if (window.location.pathname.includes("/local-areas/")) return false;
    return compactIntakeKinds.has(inferIntakeKind(form));
  }

  function ensureHiddenInput(form, name, value) {
    let input = form.querySelector(`input[type="hidden"][name="${name}"]`);
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.append(input);
    }
    input.value = value;
    return input;
  }

  function replaceLabelPrefix(control, text) {
    const label = control?.closest("label");
    if (!label) return;
    while (label.firstChild && label.firstChild !== control) label.removeChild(label.firstChild);
    label.insertBefore(document.createTextNode(text), control);
  }

  function compactIntakeCopy(kind) {
    const labels = {
      buy: "Buy a Home",
      sell: "Sell a Home",
      "move-relocate": "Plan a Move",
      homeowners: "Homeowner Decision",
      invest: "Property Decision",
      "housing-market-pulse": "Buyer market kit"
    };
    const pulseCopy = kind === "housing-market-pulse";
    const pulseSellerCopy = pulseCopy && pulseAvatar === "seller";
    const pulseInvestorCopy = pulseCopy && pulseAvatar === "investor";
    if (pulseSellerCopy) {
      return {
        label: "Pricing next step",
        title: "Pressure-test your price before the market does.",
        intro: "Get a private pricing-readiness read before choosing launch price, prep, timing, and showing strategy.",
        submitLabel: "Start my price check",
        modalTitle: "Add the pricing context",
        modalIntro: "Add the property, likely timing, condition, and price range. Skip anything you do not know yet."
      };
    }
    if (pulseInvestorCopy) {
      return {
        label: "Due diligence next step",
        title: "Pressure-test the deal before you model returns.",
        intro: "Get a private due-diligence read on liquidity, property type, local rules, and market signal before making assumptions.",
        submitLabel: "Start my deal check",
        modalTitle: "Add the deal context",
        modalIntro: "Add the location, property type, hold strategy, and assumption you want stress-tested. Skip anything you do not know yet."
      };
    }
    return {
      label: labels[kind] || "Next Step",
      title: pulseCopy ? "Buying in this market? Start here." : "Get a clearer answer.",
      intro: pulseCopy ? "Get the buyer guide and a quick market-timing checklist before you spend weekends chasing listings." : "Send your contact info. You can add details next, or skip and send.",
      submitLabel: pulseCopy ? "Get the buyer kit" : "Continue",
      modalTitle: pulseCopy ? "Add your buyer timing context" : "Optional context",
      modalIntro: pulseCopy ? "Share only what helps me point you toward prepare, watch, negotiate, or move quickly. Skip anything you do not know yet." : "Want to add details so I can reply better?"
    };
  }

  function decodeJwtPayload(token) {
    try {
      const payload = token.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join("")
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function applyGoogleProfile(form, profile) {
    if (!form || !profile) return;
    let firstName = profile.given_name || "";
    let lastName = profile.family_name || "";
    if ((!firstName || !lastName) && profile.name) {
      const parts = String(profile.name).trim().split(/\s+/);
      if (!firstName) firstName = parts.shift() || "";
      if (!lastName) lastName = parts.join(" ");
    }
    const values = {
      first_name: firstName,
      last_name: lastName,
      email: profile.email || ""
    };
    Object.entries(values).forEach(([name, value]) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (field && value) {
        field.value = value;
        field.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }

  function handleGoogleCredential(response) {
    const profile = response?.credential ? decodeJwtPayload(response.credential) : null;
    applyGoogleProfile(activeGoogleForm || document.querySelector("[data-intake-form]"), profile);
  }

  function loadGoogleIdentity() {
    if (window.google?.accounts?.id) return Promise.resolve(window.google);
    if (googleScriptPromise) return googleScriptPromise;
    googleScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src^="https://accounts.google.com/gsi/client"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.google), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = reject;
      document.head.append(script);
    });
    return googleScriptPromise;
  }

  function renderGoogleButton(form) {
    const button = form.querySelector("[data-google-button]");
    if (!button || !window.google?.accounts?.id) return;
    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      button.innerHTML = "";
      const width = Math.max(220, Math.min(400, Math.floor(form.getBoundingClientRect().width || 320)));
      window.google.accounts.id.renderButton(button, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width
      });
    } catch {
      form.querySelector("[data-google-prefill]")?.remove();
    }
  }

  function ensureGooglePrefill(form) {
    if (!googleIdentityHosts.has(window.location.hostname)) return;
    if (form.querySelector("[data-google-prefill]")) return;
    const wrap = document.createElement("div");
    wrap.className = "google-prefill";
    wrap.dataset.googlePrefill = "";
    wrap.innerHTML = '<div class="google-prefill-button" data-google-button></div>';
    wrap.addEventListener("pointerdown", () => {
      activeGoogleForm = form;
    });
    wrap.addEventListener("focusin", () => {
      activeGoogleForm = form;
    });
    form.insertBefore(wrap, form.firstElementChild);
    activeGoogleForm ||= form;
    loadGoogleIdentity()
      .then(() => renderGoogleButton(form))
      .catch(() => wrap.remove());
  }

  function prioritizeRailIntakeCards() {
    document.querySelectorAll(".article-rail").forEach((rail) => {
      const intake = rail.querySelector(".article-intake-card");
      if (!intake || rail.firstElementChild === intake) return;
      rail.prepend(intake);
    });
  }

  function isElementVisible(element) {
    return Boolean(element && element.getClientRects().length);
  }

  function syncViewportSpace(element, { min = 240, bottom = 16, property = "--viewport-space" } = {}) {
    if (!isElementVisible(element)) return;
    const rect = element.getBoundingClientRect();
    const top = Math.max(rect.top, 0);
    const available = Math.max(min, Math.floor(window.innerHeight - top - bottom));
    element.style.setProperty(property, `${available}px`);
  }

  function syncViewportSpaces() {
    document.querySelectorAll(".lead-dialog").forEach((dialog) => {
      const modal = dialog.closest("#article-lead-modal");
      if (!modal || modal.hidden) return;
      syncViewportSpace(dialog, { min: 260, bottom: 10 });
    });

    document.querySelectorAll("[data-intake-modal]:not([hidden]) .intake-step-dialog").forEach((dialog) => {
      syncViewportSpace(dialog, { min: 240, bottom: 12 });
    });

    if (!window.matchMedia("(min-width: 981px)").matches) return;
    document.querySelectorAll(".article-rail .article-compact-intake-card").forEach((card) => {
      syncViewportSpace(card, { min: 280, bottom: 16 });
      syncViewportSpace(card, { min: 280, bottom: 16, property: "--rail-visible-space" });
    });
  }

  function scheduleViewportSpaceSync() {
    if (viewportSyncFrame) return;
    viewportSyncFrame = window.requestAnimationFrame(() => {
      viewportSyncFrame = 0;
      syncViewportSpaces();
    });
  }

  function initViewportSpaceSync() {
    syncViewportSpaces();
    window.addEventListener("scroll", scheduleViewportSpaceSync, { passive: true });
    window.addEventListener("resize", scheduleViewportSpaceSync);
    window.addEventListener("orientationchange", scheduleViewportSpaceSync);
    window.addEventListener("focusin", scheduleViewportSpaceSync);
  }

  function prepareCompactIntakeForm(form) {
    if (form.dataset.compactIntakeReady === "true") return;
    const kind = inferIntakeKind(form);
    const copy = compactIntakeCopy(kind);
    const card = form.closest(".article-intake-card");
    card?.classList.add("article-compact-intake-card");
    const label = card?.querySelector(".article-category-label");
    const heading = card?.querySelector("#article-intake-title, h2");
    const intro = heading?.nextElementSibling?.tagName === "P" ? heading.nextElementSibling : null;
    if (label) label.textContent = copy.label;
    if (heading) heading.textContent = copy.title;
    if (intro) intro.textContent = copy.intro;

    ensureGooglePrefill(form);
    ensureHiddenInput(form, "topic", copy.label);
    ensureHiddenInput(form, "intake_kind", kind);
    ensureHiddenInput(form, "source_location", card?.id ? `#${card.id}` : "article intake rail");
    ensureHiddenInput(form, "page_intent", articleIntentLabel);

    const firstName = form.querySelector('[name="first_name"]');
    const lastName = form.querySelector('[name="last_name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    replaceLabelPrefix(firstName, "First name *");
    replaceLabelPrefix(lastName, "Last name *");
    replaceLabelPrefix(email, "Email *");
    replaceLabelPrefix(phone, "Phone optional");

    const topic = form.querySelector("[data-intake-topic]");
    const message = form.querySelector('textarea[name="message"]');
    [topic, message].forEach((control) => {
      if (!control) return;
      control.required = false;
      control.disabled = true;
      control.closest(".form-field")?.setAttribute("hidden", "");
    });

    const consentText = form.querySelector("[data-phone-consent] span");
    if (consentText) consentText.textContent = phoneConsentCopy;
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.textContent = copy.submitLabel || "Continue";
    const note = form.querySelector(".form-privacy-note");
    if (note) note.textContent = "* Required. Phone is optional.";
    form.dataset.compactIntakeReady = "true";
  }

  function syncPhoneConsent(form) {
    const phoneInput = form.querySelector('[name="phone"]');
    const consentWrap = form.querySelector("[data-phone-consent]");
    const consentInput = form.querySelector('[name="phone_consent"]');
    if (!phoneInput || !consentWrap || !consentInput) return;

    const hasPhone = Boolean(phoneInput.value.trim());
    consentWrap.hidden = !hasPhone;
    consentInput.required = hasPhone;
    consentInput.setCustomValidity("");
    if (!hasPhone) consentInput.checked = false;
  }

  function inferIntakeKind(form) {
    const explicit = form.dataset.intakeKind;
    if (explicit && intakeConfigs[explicit]) return explicit;
    const topic = String(form.querySelector("[data-intake-topic]")?.value || "").toLowerCase();
    if (topic.includes("buy") || topic.includes("tour") || topic.includes("offer") || topic.includes("financ")) return "buy";
    if (topic.includes("sell") || topic.includes("pricing") || topic.includes("repairs") || topic.includes("tenant")) return "sell";
    if (topic.includes("move") || topic.includes("relocat") || topic.includes("commute")) return "move-relocate";
    if (topic.includes("homeowner") || topic.includes("inherited") || topic.includes("family")) return "homeowners";
    if (topic.includes("invest") || topic.includes("rental") || topic.includes("cash flow")) return "invest";
    if (topic.includes("area") || topic.includes("city") || topic.includes("school")) return "local-areas";
    return intakeConfigs[articleIntentPath] ? articleIntentPath : "move-relocate";
  }

  function fieldMarkup(field) {
    if (field.type === "select") {
      return `<label class="form-field form-field-full">${field.label}
        <select name="${field.name}" data-detail-label="${field.label}">
          ${field.options.map((option) => `<option>${option}</option>`).join("")}
        </select>
      </label>`;
    }
    if (field.type === "choice") {
      return `<fieldset class="intake-choice-group" data-detail-label="${field.label}">
        <legend>${field.label}</legend>
        <div class="intake-chip-row">
          ${field.options.map((option) => `<label><input type="radio" name="${field.name}" value="${option}" data-detail-label="${field.label}"><span>${option}</span></label>`).join("")}
        </div>
      </fieldset>`;
    }
    if (field.type === "chips") {
      return `<fieldset class="intake-choice-group" data-detail-label="${field.label}">
        <legend>${field.label}</legend>
        <div class="intake-chip-row">
          ${field.options.map((option) => `<label><input type="checkbox" name="${field.name}" value="${option}" data-detail-label="${field.label}"><span>${option}</span></label>`).join("")}
        </div>
      </fieldset>`;
    }
    return `<label class="form-field form-field-full">${field.label}
      <input name="${field.name}" data-detail-label="${field.label}" placeholder="${field.placeholder || ""}">
    </label>`;
  }

  function renderIntakeStep(form) {
    const modal = form.closest(".article-intake-card")?.querySelector("[data-intake-modal]");
    if (!modal) return null;
    const kind = inferIntakeKind(form);
    const config = intakeConfigs[kind] || intakeConfigs["move-relocate"];
    const copy = compactIntakeCopy(kind);
    const compact = isCompactIntakeForm(form);
    modal.querySelector("[data-intake-modal-copy]").textContent = compact ? copy.modalIntro : config.intro;
    modal.querySelector("[data-intake-step-fields]").innerHTML = config.fields.map(fieldMarkup).join("");
    modal.querySelector(".intake-step-header h2").textContent = compact ? copy.modalTitle : config.title;
    setIntakeDetailsState(modal, !compact);
    return modal;
  }

  function setIntakeDetailsState(modal, open) {
    modal.dataset.detailsOpen = open ? "true" : "false";
    modal.querySelector(".intake-step-dialog")?.classList.toggle("is-context-choice", !open);
    const detailForm = modal.querySelector("[data-intake-step-form]");
    const sendButton = modal.querySelector("[data-intake-send]");
    const skipButton = modal.querySelector("[data-intake-skip]");
    if (detailForm) {
      detailForm.hidden = !open;
      detailForm.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (sendButton) sendButton.textContent = open ? "Submit" : "Add details";
    if (skipButton) skipButton.textContent = "Skip and send";
  }

  function validateIntakeForm(form) {
    const consentInput = form.querySelector('[name="phone_consent"]');
    syncPhoneConsent(form);
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }
    const data = new FormData(form);
    const phone = String(data.get("phone") || "").trim();
    if (phone && data.get("phone_consent") !== "yes") {
      consentInput?.setCustomValidity("Please confirm phone/text consent or leave the phone field blank.");
      consentInput?.reportValidity();
      return false;
    }
    return true;
  }

  function stepDetailLines(modal) {
    const controls = [...modal.querySelectorAll("[data-intake-step-form] input, [data-intake-step-form] select, [data-intake-step-form] textarea")];
    const handled = new Set();
    const lines = [];
    controls.forEach((control) => {
      if (!control.name || handled.has(control.name)) return;
      handled.add(control.name);
      const group = controls.filter((item) => item.name === control.name);
      const label = control.dataset.detailLabel || control.closest("fieldset")?.dataset.detailLabel || control.name;
      let value = "";
      if (control.type === "checkbox") {
        value = group.filter((item) => item.checked).map((item) => item.value).join(", ");
      } else if (control.type === "radio") {
        value = group.find((item) => item.checked)?.value || "";
      } else {
        value = control.value.trim();
      }
      if (value) lines.push(`${label}: ${value}`);
    });
    return lines;
  }

  function contactBodyLines(form, data, detailLines = []) {
    const phone = String(data.get("phone") || "").trim();
    const intakeKind = data.get("intake_kind") || inferIntakeKind(form);
    const lines = [
      `Article: ${articleTitle}`,
      `URL: ${window.location.href}`,
      `Category/intake kind: ${intakeKind}`,
      `CTA/source location: ${data.get("source_location") || "article intake rail"}`,
      `Page intent: ${data.get("page_intent") || articleIntentLabel}`,
      `Topic: ${data.get("topic") || data.get("intent") || data.get("about") || "Private question"}`,
      "",
      `First name: ${data.get("first_name") || data.get("name") || ""}`,
      `Last name: ${data.get("last_name") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Phone: ${phone || "Not provided"}`
    ];

    if (phone) lines.push(`Phone/text consent: ${data.get("phone_consent") === "yes" ? "Yes" : "No"}`);
    const message = String(data.get("message") || "").trim();
    if (message) lines.push("", "Message:", message);
    if (detailLines.length) lines.push("", "Optional context:", ...detailLines);
    return lines;
  }

  async function sendIntakeForm(form, { includeDetails = true } = {}) {
    const data = new FormData(form);
    const modal = form.closest(".article-intake-card")?.querySelector("[data-intake-modal]");
    const details = includeDetails && modal ? stepDetailLines(modal) : [];
    return submitArticleLead(
      articleLeadPayload({
        form,
        data,
        details,
        formType: "article_private_question",
        formLocation: data.get("source_location") || "article intake rail",
        ctaLabel: data.get("topic") || data.get("intent") || data.get("about") || "Private question",
        ctaPromise: "Create a lead and start private outreach"
      })
    );
  }

  function openIntakeModal(form, returnTarget = document.activeElement) {
    const modal = renderIntakeStep(form);
    if (!modal) {
      void sendIntakeForm(form, { includeDetails: false });
      return;
    }
    activeIntakeForm = form;
    intakePreviousFocus = returnTarget;
    modal.hidden = false;
    syncViewportSpaces();
    syncOverlayOpenState();
    scheduleViewportSpaceSync();
    const focusTarget = isCompactIntakeForm(form) ? modal.querySelector("[data-intake-skip], [data-intake-send]") : modal.querySelector("input, select, textarea, button");
    focusTarget?.focus();
  }

  function closeIntakeModal({ returnFocus = true } = {}) {
    document.querySelectorAll("[data-intake-modal]").forEach((modal) => {
      modal.hidden = true;
    });
    syncOverlayOpenState();
    if (returnFocus) intakePreviousFocus?.focus?.();
    activeIntakeForm = null;
    intakePreviousFocus = null;
  }

  function setLeadSubmitting(container, submitting) {
    if (!container) return;
    container.querySelectorAll("[data-intake-send], [data-intake-skip], button[type='submit']").forEach((button) => {
      if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent.trim();
      button.disabled = submitting;
      if (submitting) button.textContent = "Sending...";
      else button.textContent = button.dataset.originalLabel;
    });
  }

  function setLeadStatus(container, message, type = "info") {
    if (!container) return;
    let status = container.querySelector("[data-submit-status]");
    if (!status) {
      status = document.createElement("p");
      status.className = "intake-submit-status";
      status.setAttribute("role", type === "error" ? "alert" : "status");
      status.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
      status.dataset.submitStatus = "";
      const anchor = container.querySelector(".intake-step-actions") || container.querySelector("form");
      anchor?.before(status);
    }
    status.className = `intake-submit-status is-${type}`;
    status.textContent = message;
    return status;
  }

  function addLeadStatusLink(status, label, href) {
    if (!status || !href) return;
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    link.target = "_blank";
    link.rel = "noopener";
    status.append(document.createTextNode(" "));
    status.append(link);
  }

  async function submitAndCloseArticleIntake(modal, task) {
    setLeadSubmitting(modal, true);
    setLeadStatus(modal, "Sending your question...", "info");
    try {
      await task();
      setLeadStatus(modal, "Sent. Israel will review it and follow up.", "success");
      window.HBILeadClient?.showLeadNotice?.("Your question was sent. Israel will review it and follow up.", "success");
      window.setTimeout(() => closeIntakeModal({ returnFocus: false }), 700);
    } catch (_error) {
      setLeadSubmitting(modal, false);
      setLeadStatus(modal, "This did not send. Please try again, or use the call/text or email option on this page.", "error");
      window.HBILeadClient?.showLeadNotice?.("This did not send. Please try again, or use the contact options on this page.", "error");
    }
  }

  async function submitAndCloseLeadModal(modal, task) {
    setLeadSubmitting(modal, true);
    setLeadStatus(modal, "Sending your request...", "info");
    try {
      await task();
      const guideRequest = isBuyerPulseArticle;
      const status = setLeadStatus(modal, guideRequest ? "Sent. Open the Buyer Guide now:" : "Sent. Israel will review it and follow up.", "success");
      if (guideRequest) addLeadStatusLink(status, "Open the Buyer Guide", buyerGuideHref);
      window.HBILeadClient?.showLeadNotice?.(guideRequest ? "Your buyer kit request was sent. The guide link is ready in the form." : "Your request was sent. Israel will review it and follow up.", "success");
      if (guideRequest) sessionStorage.setItem(leadKey, "true");
      else window.setTimeout(() => closeLeadModal({ remember: true }), 700);
    } catch (_error) {
      setLeadSubmitting(modal, false);
      setLeadStatus(modal, "This did not send. Please try again, or use the call/text or email option on this page.", "error");
      window.HBILeadClient?.showLeadNotice?.("This did not send. Please try again, or use the contact options on this page.", "error");
    }
  }

  function initContactForms() {
    document.querySelectorAll("[data-mailto-form]").forEach((form) => {
      const phoneInput = form.querySelector('[name="phone"]');
      const consentInput = form.querySelector('[name="phone_consent"]');

      if (isCompactIntakeForm(form)) prepareCompactIntakeForm(form);
      syncPhoneConsent(form);
      phoneInput?.addEventListener("input", () => syncPhoneConsent(form));
      consentInput?.addEventListener("change", () => consentInput.setCustomValidity(""));
      form.querySelector("[data-intake-topic]")?.addEventListener("change", () => {
        const modal = form.closest(".article-intake-card")?.querySelector("[data-intake-modal]");
        if (modal && !modal.hidden) renderIntakeStep(form);
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (validateIntakeForm(form)) openIntakeModal(form, event.submitter || document.activeElement);
      });
    });

    document.querySelectorAll("[data-intake-modal]").forEach((modal) => {
      modal.addEventListener("click", async (event) => {
        if (event.target.closest("[data-intake-close]")) {
          closeIntakeModal();
          return;
        }
        if (event.target.closest("[data-intake-skip]") && activeIntakeForm) {
          await submitAndCloseArticleIntake(modal, () => sendIntakeForm(activeIntakeForm, { includeDetails: false }));
          return;
        }
        if (event.target.closest("[data-intake-send]") && activeIntakeForm) {
          if (isCompactIntakeForm(activeIntakeForm) && modal.dataset.detailsOpen !== "true") {
            setIntakeDetailsState(modal, true);
            modal.querySelector("input, select, textarea")?.focus();
            return;
          }
          await submitAndCloseArticleIntake(modal, () => sendIntakeForm(activeIntakeForm, { includeDetails: true }));
        }
      });

      modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          closeIntakeModal();
          return;
        }
        if (event.key !== "Tab") return;
        const focusable = getFocusable(modal);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    });
  }

  function currentGraphItem() {
    if (!window.hbiSearch?.graph?.items?.length) return null;
    const path = window.location.pathname.replace(/^\/+/, "").replace(/index\.html$/, "");
    return window.hbiSearch.graph.items.find((item) => item.urlPath && path.endsWith(item.urlPath));
  }

  function initArticleRelatedSearch() {
    if (!window.hbiSearch?.graph?.items?.length) return;
    const relatedSection = document.querySelector(".related-grid-section");
    if (!relatedSection || document.querySelector("[data-article-guidance-search]")) return;
    const current = currentGraphItem();
    const currentGroups = current?.relationshipGroups || [];
    const defaultChips = (window.hbiSearch.graph.quickChips || [])
      .filter((chip) => !currentGroups.length || (chip.groups || []).some((groupId) => currentGroups.includes(groupId)))
      .slice(0, 4);
    const chips = defaultChips.length ? defaultChips : (window.hbiSearch.graph.quickChips || []).slice(0, 4);

    relatedSection.insertAdjacentHTML(
      "beforebegin",
      `
        <section class="article-guidance-search" aria-labelledby="article-guidance-title" data-article-guidance-search>
          <div class="article-guidance-copy">
            <p class="eyebrow">Connected guidance</p>
            <h2 id="article-guidance-title">Search related situations from here.</h2>
            <p>Use this when the article raises a connected question about selling, moving, ownership, rental risk, proceeds, taxes, or repairs.</p>
          </div>
          <form class="article-guidance-form" role="search" aria-label="Search related real estate guidance">
            <label class="visually-hidden" for="article-guidance-input">Search related situations</label>
            <input id="article-guidance-input" type="search" placeholder="Try: area fit, payment, offer strategy, rent-back">
            <button class="button button-primary" type="submit">Search</button>
          </form>
          <div class="article-guidance-chips" aria-label="Common related searches">
            ${chips.map((chip) => `<button type="button" data-article-guidance-chip="${window.hbiSearch.escapeHtml(chip.label)}">${window.hbiSearch.escapeHtml(chip.label)}</button>`).join("")}
          </div>
          <div class="article-guidance-results" data-article-guidance-results aria-live="polite"></div>
        </section>
      `
    );

    const shell = document.querySelector("[data-article-guidance-search]");
    const input = shell.querySelector("#article-guidance-input");
    const resultsEl = shell.querySelector("[data-article-guidance-results]");
    let activeChip = "";

    function render(query = "") {
      const chip = (window.hbiSearch.graph.quickChips || []).find((item) => item.label === activeChip);
      const groupIds = chip?.groups || (query ? [] : currentGroups);
      const results = window.hbiSearch.search(query || chip?.query || "", {
        groupIds,
        pageIntent: query ? "" : current?.primaryDiscoveryIntent || articleIntentPath,
        excludeTopicId: current?.topicId,
        limit: 4
      });
      window.hbiSearch.renderCards(resultsEl, results, {
        hrefPrefix: depth,
        emptyHtml: `<div class="guidance-empty"><h3>No direct match yet</h3><p>Open the full search page to widen the query across buyer, move, investment, seller, and homeowner guidance.</p><a class="button button-secondary" href="${searchHref(query)}">Open full search</a></div>`
      });
      window.hbiSearch.track("hbi_article_related_search_render", {
        article: current?.topicId || document.body.dataset.articleSlug,
        query,
        situation: activeChip,
        resultCount: results.length
      });
    }

    shell.querySelector(".article-guidance-form").addEventListener("submit", (event) => {
      event.preventDefault();
      activeChip = "";
      shell.querySelectorAll("[data-article-guidance-chip]").forEach((button) => button.classList.remove("is-active"));
      render(input.value.trim());
    });

    input.addEventListener("input", () => {
      activeChip = "";
      shell.querySelectorAll("[data-article-guidance-chip]").forEach((button) => button.classList.remove("is-active"));
      render(input.value.trim());
    });

    shell.querySelector(".article-guidance-chips").addEventListener("click", (event) => {
      const button = event.target.closest("[data-article-guidance-chip]");
      if (!button) return;
      activeChip = activeChip === button.dataset.articleGuidanceChip ? "" : button.dataset.articleGuidanceChip;
      const chip = (window.hbiSearch.graph.quickChips || []).find((item) => item.label === activeChip);
      input.value = chip?.query || "";
      shell.querySelectorAll("[data-article-guidance-chip]").forEach((item) => item.classList.toggle("is-active", item === button && Boolean(activeChip)));
      render(input.value.trim());
    });

    resultsEl.addEventListener("click", (event) => {
      const card = event.target.closest("[data-topic-id]");
      if (!card) return;
      window.hbiSearch.track("hbi_article_related_search_click", {
        article: current?.topicId || document.body.dataset.articleSlug,
        topicId: card.dataset.topicId,
        primaryIntent: card.dataset.primaryIntent
      });
    });

    render("");
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const intakeModal = document.querySelector("[data-intake-modal]:not([hidden])");
    if (intakeModal) {
      event.preventDefault();
      closeIntakeModal();
      return;
    }
    const leadModal = document.querySelector("#article-lead-modal");
    if (leadModal && !leadModal.hidden) {
      event.preventDefault();
      closeLeadModal({ remember: false });
      return;
    }
    const searchPanel = document.querySelector("#search-panel");
    if (searchPanel && !searchPanel.hidden) {
      event.preventDefault();
      closeArticleSearch();
      return;
    }
    const menu = document.querySelector("#site-menu");
    const menuOpen = Boolean(menu && !menu.hidden);
    closeMegaMenus();
    if (menuOpen) {
      setArticleMenu(false, { returnFocus: true });
      return;
    }
    if (lastMegaFocus) lastMegaFocus.focus();
  });

  renderArticleNav();
  normalizeHubNavigationLinks();
  ensureMarketPulseReachability();
  initHeader();
  initShare();
  initVideos();
  prioritizeRailIntakeCards();
  initLeadModal();
  initContactForms();
  initViewportSpaceSync();
  initArticleRelatedSearch();
})();
