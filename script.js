const phoneDisplay = "(424) 243-1233";
const googleClientId = "261880757190-vahpflcil50ok1keekda4qg50qphme5i.apps.googleusercontent.com";
const googleIdentityHosts = new Set(["homesbyisraelhe.com", "www.homesbyisraelhe.com"]);
let googleScriptPromise = null;
let activeGoogleForm = null;

const decisionData = {
  "compare-local": {
    diagnosis: "Your first decision is not the home. It is the place that makes the home make sense.",
    bestStep: "Compare Local Areas by commute, housing type, price range, and daily-life fit before touring.",
    primary: ["Explore Local Areas", "#local-areas", "local-area-research"],
    secondary: ["See buyer area guidance", "buy/#article-library", "local-areas"],
  },
  "buyer-plan": {
    diagnosis: "Buying gets easier when budget, area fit, and offer strategy are connected before showings.",
    bestStep: "Start with a local buyer plan that narrows where to look and what a strong offer should solve.",
    primary: ["Compare areas before touring", "#local-areas", "buying"],
    secondary: ["Review buyer paths", "buy/#article-library", "buying"],
  },
  "homeowner-options": {
    diagnosis: "The property decision and the life decision may not be the same thing.",
    bestStep: "Clarify repairs, timing, privacy, cash needs, and next-move pressure before selling, renting, or waiting.",
    primary: ["Review homeowner options", "homeowners/#article-library", "homeowners"],
    secondary: ["Think through home value", "homeowners/#article-library", "owning"],
  },
  "moving-timing": {
    diagnosis: "A move usually has more than one calendar and more than one property decision.",
    bestStep: "Map the sequence first: current home, next home, lease, school calendar, commute, and transition window.",
    primary: ["Plan the move sequence", "move-relocate/#article-library", "moving"],
    secondary: ["Compare commute and city fit", "#local-areas", "moving"],
  },
  "sell-rent-hold": {
    diagnosis: "Selling, renting, and holding each create a different risk profile.",
    bestStep: "Compare local demand, repairs, tenant risk, cash flow, tax questions, and your exit timeline.",
    primary: ["Compare sell, rent, or hold", "invest/#article-library", "investing"],
    secondary: ["Ask a market question", "#contact-israel", "investing"],
  },
  "private-answer": {
    diagnosis: "Some questions need context before they need a public search path.",
    bestStep: "Use a private question when timing, repairs, tenants, family needs, or money pressure changes the advice.",
    primary: ["Ask Israel privately", "#contact-israel", "private-question"],
    secondary: ["Search local guidance", "#resources", "private-question"],
  },
};

const pathData = {
  buying: [
    {
      image: "assets/portal/path-buying.png",
      category: "Buyer Guide",
      title: "Compare Local Areas before the tour calendar takes over",
      summary: "Narrow budget, commute, housing type, and daily-life fit before showings.",
      cta: "Start comparing",
      href: "buy/#article-library",
    },
    {
      image: "assets/portal/resource-market.png",
      category: "Market Context",
      title: "Pressure-test payment comfort before falling in love",
      summary: "Connect payment, reserves, property condition, and local price bands.",
      cta: "Review buyer path",
      href: "buy/#article-library",
    },
    {
      image: "assets/portal/path-moving.png",
      category: "Touring Plan",
      title: "Know what is worth seeing and what is noise",
      summary: "Turn your search into a focused plan instead of a weekend scramble.",
      cta: "Plan next step",
      href: "buy/#article-library",
    },
    {
      image: "assets/portal/resource-consultation.png",
      category: "Offer Strategy",
      title: "Understand what a strong local offer needs to solve",
      summary: "Use timing, terms, competition, and property condition before writing.",
      cta: "Ask a buyer question",
      href: "buy/#article-library",
    },
  ],
  selling: [
    {
      image: "assets/portal/path-selling.png",
      category: "Seller Guide",
      title: "Prep, price, and timing before the market sees the home",
      summary: "Decide what should happen before photos, showings, and public feedback.",
      cta: "Start seller planning",
      href: "sell/#article-library",
    },
    {
      image: "assets/portal/resource-home-value.png",
      category: "Repairs",
      title: "Fix first, sell as-is, or protect your timeline",
      summary: "Compare repair cost, buyer perception, cash, and time pressure.",
      cta: "Think it through",
      href: "sell/#article-library",
    },
    {
      image: "assets/portal/resource-consultation.png",
      category: "Privacy",
      title: "Plan access, privacy, and showing pressure",
      summary: "Useful for occupied homes, tenants, family needs, or sensitive timing.",
      cta: "Ask privately",
      href: "sell/#article-library",
    },
    {
      image: "assets/portal/resource-market.png",
      category: "Market Question",
      title: "Ask what local demand means for your property",
      summary: "Make the answer city, condition, timing, and property-type specific.",
      cta: "Ask a market question",
      href: "sell/#article-library",
    },
  ],
  moving: [
    {
      image: "assets/portal/path-moving.png",
      category: "Relocation",
      title: "Line up the real estate pieces before choosing a route",
      summary: "Map sale, purchase, lease, school, commute, and transition windows.",
      cta: "Plan the sequence",
      href: "move-relocate/#article-library",
    },
    {
      image: "assets/portal/path-homeowners.png",
      category: "Current Home",
      title: "Sell or rent when the move creates pressure",
      summary: "Compare cash flow, tenant risk, repairs, and timing before deciding.",
      cta: "Compare options",
      href: "move-relocate/#article-library",
    },
    {
      image: "assets/portal/path-local-areas.png",
      category: "City Fit",
      title: "Choose the search radius around daily life",
      summary: "Commute, schools, errands, and housing type can change the route.",
      cta: "Explore Local Areas",
      href: "move-relocate/#article-library",
    },
    {
      image: "assets/portal/decision-options.png",
      category: "Timing",
      title: "Make the calendar visible before it controls you",
      summary: "Use a sequence plan when more than one deadline is involved.",
      cta: "Ask a timing question",
      href: "move-relocate/#article-library",
    },
  ],
  homeowners: [
    {
      image: "assets/portal/path-homeowners.png",
      category: "Homeowners",
      title: "Decide whether to sell, rent, hold, repair, or wait",
      summary: "Separate the property decision from the life decision first.",
      cta: "Review options",
      href: "homeowners/#article-library",
    },
    {
      image: "assets/portal/resource-home-value.png",
      category: "Home Value",
      title: "Think through a value path before choosing a number",
      summary: "Condition, timing, and local demand matter before pricing.",
      cta: "Start value path",
      href: "homeowners/#article-library",
    },
    {
      image: "assets/portal/path-selling.png",
      category: "Repairs",
      title: "Know when repairs help and when they become drag",
      summary: "Compare cost, delay, buyer perception, and your next move.",
      cta: "Review repair tradeoffs",
      href: "homeowners/#article-library",
    },
    {
      image: "assets/portal/resource-consultation.png",
      category: "Private Question",
      title: "Use a quieter route for sensitive property questions",
      summary: "Good for tenants, family timing, privacy, or financial pressure.",
      cta: "Ask privately",
      href: "homeowners/#article-library",
    },
  ],
  investing: [
    {
      image: "assets/portal/path-investing.png",
      category: "Investing",
      title: "Compare rental potential, risk, and exit path",
      summary: "Use local demand, repairs, holding costs, and timeline together.",
      cta: "Review investment path",
      href: "invest/#article-library",
    },
    {
      image: "assets/portal/resource-market.png",
      category: "Market Context",
      title: "Ask what local demand means for a property type",
      summary: "Useful when rent, resale, or vacancy risk changes the math.",
      cta: "Ask a market question",
      href: "invest/#article-library",
    },
    {
      image: "assets/portal/path-homeowners.png",
      category: "Hold Strategy",
      title: "Decide whether to sell, rent, or keep a property",
      summary: "Compare cash flow, tenant risk, tax questions, and exit timing.",
      cta: "Compare hold options",
      href: "invest/#article-library",
    },
    {
      image: "assets/portal/resource-home-value.png",
      category: "Risk",
      title: "Inspection and repair risk can change the return",
      summary: "Make property condition part of the investment decision early.",
      cta: "Review risk privately",
      href: "invest/#article-library",
    },
  ],
  "local-areas": [
    {
      image: "assets/portal/area-redondo-beach.jpg",
      category: "Local Areas",
      title: "Redondo Beach decisions need lifestyle and market context",
      summary: "Use this when coastal access, housing mix, and timing matter.",
      cta: "View Redondo context",
      href: "#local-areas",
    },
    {
      image: "assets/portal/area-coastal-aerial.png",
      category: "South Bay",
      title: "Compare beach cities against inland convenience",
      summary: "Daily rhythm, price bands, and commute can point different ways.",
      cta: "Compare South Bay",
      href: "#local-areas",
    },
    {
      image: "assets/portal/area-long-beach.jpg",
      category: "Long Beach Area",
      title: "Long Beach choices depend on neighborhood rhythm",
      summary: "Housing style, commute, and lifestyle can vary block by block.",
      cta: "Explore Long Beach",
      href: "#local-areas",
    },
    {
      image: "assets/portal/area-la-county.png",
      category: "County Context",
      title: "When your search crosses borders, widen the comparison",
      summary: "Use county context when LA and Orange County both fit.",
      cta: "Compare county context",
      href: "#local-areas",
    },
  ],
};

const localAreaData = {
  nearby: [
    {
      image: "assets/portal/area-redondo-beach.jpg",
      label: "Nearby",
      title: "Redondo Beach",
      copy: "Useful when beach access, harbor energy, school conversations, and South Bay price bands shape the decision.",
    },
    {
      image: "assets/portal/area-manhattan-beach.png",
      label: "Nearby",
      title: "Manhattan Beach",
      copy: "Useful when lifestyle, prestige pricing, walkability, and long-term resale strength are central.",
    },
    {
      image: "assets/portal/area-hermosa-beach.jpg",
      label: "Nearby",
      title: "Hermosa Beach",
      copy: "Useful when walkability, beach routine, lot size, and daily-life rhythm matter more than square footage.",
    },
    {
      image: "assets/portal/area-torrance.png",
      label: "Nearby",
      title: "Torrance",
      copy: "Useful when schools, space, commute flexibility, and South Bay access need to work together.",
    },
  ],
  "south-bay": [
    {
      image: "assets/portal/area-coastal-aerial.png",
      label: "South Bay",
      title: "South Bay overview",
      copy: "Useful when you need to compare beach proximity, inland value, commute, and housing stock.",
    },
    {
      image: "assets/portal/area-palos-verdes.png",
      label: "South Bay",
      title: "Palos Verdes",
      copy: "Useful when views, privacy, schools, and hillside property tradeoffs are part of the decision.",
    },
    {
      image: "assets/portal/area-manhattan-beach.png",
      label: "South Bay",
      title: "El Segundo",
      copy: "Useful when airport access, local village feel, employment centers, and beach proximity matter.",
    },
    {
      image: "assets/portal/area-torrance.png",
      label: "South Bay",
      title: "Lomita",
      copy: "Useful when value, commute, and access to Torrance, Palos Verdes, and the coast overlap.",
    },
  ],
  "long-beach-area": [
    {
      image: "assets/portal/area-long-beach.jpg",
      label: "Long Beach Area",
      title: "Long Beach",
      copy: "Useful when neighborhood variety, coastal access, architecture, and commute choices all matter.",
    },
    {
      image: "assets/portal/area-long-beach.jpg",
      label: "Long Beach Area",
      title: "Signal Hill",
      copy: "Useful when views, central access, condo choices, and Long Beach adjacency shape the route.",
    },
    {
      image: "assets/portal/area-gateway.png",
      label: "Long Beach Area",
      title: "Lakewood and nearby options",
      copy: "Useful when space, price, commute, and school conversations compete with coastal preference.",
    },
    {
      image: "assets/portal/area-la-county.png",
      label: "Long Beach Area",
      title: "Harbor and coastal context",
      copy: "Useful when port access, coastal lifestyle, and freeway routes shape the decision.",
    },
  ],
  "gateway-cities": [
    {
      image: "assets/portal/area-gateway.png",
      label: "Gateway Cities",
      title: "Hawthorne",
      copy: "Useful when employment access, freeway reach, and South Bay adjacency are priorities.",
    },
    {
      image: "assets/portal/area-la-county.png",
      label: "Gateway Cities",
      title: "Wilmington",
      copy: "Useful when port proximity, budget, industrial adjacency, and commute matter.",
    },
    {
      image: "assets/portal/area-torrance.png",
      label: "Gateway Cities",
      title: "Carson",
      copy: "Useful when central access, price, home type, and regional commute choices need balance.",
    },
    {
      image: "assets/portal/area-palos-verdes.png",
      label: "Gateway Cities",
      title: "Westchester",
      copy: "Useful when airport access, Westside reach, and single-family options are in play.",
    },
  ],
  "orange-county": [
    {
      image: "assets/portal/area-coastal-aerial.png",
      label: "Orange County",
      title: "North Orange County",
      copy: "Useful when affordability, schools, commute, and LA/OC access need comparison.",
    },
    {
      image: "assets/portal/area-la-county.png",
      label: "Orange County",
      title: "LA to Orange County move",
      copy: "Useful when county change affects commute, schools, taxes, or lifestyle expectations.",
    },
    {
      image: "assets/portal/path-homeowners.png",
      label: "Orange County",
      title: "Keep or sell before crossing counties",
      copy: "Useful when a move creates a sell, rent, or hold decision on the current property.",
    },
    {
      image: "assets/portal/resource-market.png",
      label: "Orange County",
      title: "Market question by city",
      copy: "Useful when the answer depends on property type, timing, and neighborhood demand.",
    },
  ],
  "la-county": [
    {
      image: "assets/portal/area-la-county.png",
      label: "LA County",
      title: "Los Angeles County",
      copy: "Useful when your search includes multiple submarkets with very different daily-life tradeoffs.",
    },
    {
      image: "assets/portal/area-coastal-aerial.png",
      label: "LA County",
      title: "Coastal Los Angeles County",
      copy: "Useful when beach access, price, commute, and housing type all compete.",
    },
    {
      image: "assets/portal/area-palos-verdes.png",
      label: "LA County",
      title: "Palos Verdes Peninsula",
      copy: "Useful when privacy, views, schools, and property upkeep deserve extra attention.",
    },
    {
      image: "assets/portal/area-gateway.png",
      label: "LA County",
      title: "Inland commute options",
      copy: "Useful when value and transportation access matter as much as neighborhood identity.",
    },
  ],
};

const siteIndex = [
  ["Start with your situation", "Use the decision dashboard to identify the right first step.", "#decision-dashboard"],
  ["Buy", "Buyer planning, area comparison, tours, budget, and offer strategy.", "buy/#article-library"],
  ["Sell", "Seller prep, pricing, repairs, timing, privacy, and local demand.", "sell/#article-library"],
  ["Move / Relocate", "Sequence a sale, purchase, lease, commute, school, or transition window.", "move-relocate/#article-library"],
  ["Homeowners", "Decide whether to sell, rent, hold, repair, renovate, or wait.", "homeowners/#article-library"],
  ["Invest", "Rental demand, hold strategy, risk, repairs, cash flow, and exit planning.", "invest/#article-library"],
  ["Local Areas", "Redondo Beach, Manhattan Beach, Hermosa Beach, Torrance, Long Beach, Gateway Cities, LA County, and Orange County.", "#local-areas"],
  ["Find the right guide", "Use guides and support resources once you know the decision.", "#resources"],
  ["Ask a market question", "Ask a local question by city, property type, timing, or condition.", "#resources"],
  ["Contact Israel", `Call or text Israel at ${phoneDisplay}, or send a private question.`, "#contact-israel"],
];

const decisionPanel = document.querySelector("#decision-panel");
const decisionButtons = document.querySelectorAll(".decision-card");
const homepageDecisionCards = document.querySelectorAll("[data-decision-route]");
const homepageDecisionRecommendation = document.querySelector("[data-decision-recommendation]");
const pathTrack = document.querySelector("#path-cards");
const pathTabs = document.querySelectorAll("[data-path-tab][role='tab']");
const localTrack = document.querySelector("#local-cards");
const localTabs = document.querySelectorAll("[data-local-tab]");
const menu = document.querySelector("#site-menu");
const menuToggle = document.querySelector(".menu-toggle");
const searchPanel = document.querySelector("#search-panel");
const overlaySearchInput = document.querySelector("#overlay-search-input");
const searchResults = document.querySelector("#search-results");
const contactSelect = document.querySelector("#contact-intent");
const megaTriggers = document.querySelectorAll("[data-mega-trigger]");
const navHubHrefs = {
  "mega-buy": "buy/#article-library",
  "mega-sell": "sell/#article-library",
  "mega-move": "move-relocate/#article-library",
  "mega-homeowners": "homeowners/#article-library",
  "mega-invest": "invest/#article-library",
  "mega-local": "local-areas/#article-library",
  "mega-market-trends": "housing-market-pulse/",
  "mega-resources": "#resources"
};
let intakePreviousFocus = null;
let activeIntakeForm = null;
let pendingContactIntent = "Private question";

const homepageDecisionRoutes = {
  "moving-sense": {
    title: "Start by deciding whether the move itself makes sense.",
    copy: "Use homeowner guidance when you are comparing staying, waiting, selling, renting, or repairing before you pick a public search path.",
    questions: [
      "What changes if you stay another year?",
      "Would selling, renting, or repairing solve the real pressure?",
      "What local context would make the next step clearer?"
    ],
    primary: ["Review Homeowner Options", "homeowners/#article-library", "homeowners"],
    secondary: ["Talk Through My Situation", "#contact-israel", "homeowners"]
  },
  "home-value": {
    title: "Start with value, timing, and local demand before choosing a path.",
    copy: "Market context helps you understand whether pricing, inventory, days on market, or buyer leverage should shape the next move.",
    questions: [
      "Is the question really price, timing, repairs, or net proceeds?",
      "What are similar homes doing right now?",
      "Would a market report answer enough, or do you need a property-specific read?"
    ],
    primary: ["Read Market Reports", "market-trends/", "market-context"],
    secondary: ["Talk Through My Situation", "#contact-israel", "home-value"]
  },
  "right-order": {
    title: "Plan the order before you commit to a timeline.",
    copy: "A move sequence should connect the current home, next home, financing, lease dates, school calendars, commute, and household pressure.",
    questions: [
      "Which deadline is real and which one is flexible?",
      "Does the next area need to be chosen before the current home decision?",
      "What would create the most expensive mistake if it happened out of order?"
    ],
    primary: ["Plan The Move Sequence", "move-relocate/#article-library", "moving"],
    secondary: ["Explore Local Areas", "local-areas/#article-library", "local-area-research"]
  },
  "two-transactions": {
    title: "Line up both sides before the calendar gets tight.",
    copy: "Buying and selling together needs a sequence plan, a market read, and backup options before one transaction starts controlling the other.",
    questions: [
      "Would selling first, buying first, or a contingency lower the risk?",
      "How much temporary housing or bridge timing is realistic?",
      "What is the market doing in both the sell area and buy area?"
    ],
    primary: ["Plan Buy/Sell Timing", "move-relocate/#article-library", "moving"],
    secondary: ["Check Market Reports", "market-trends/", "market-context"]
  },
  "area-move": {
    title: "Compare places before you commit to one search area.",
    copy: "Local Areas is the right next step when commute, lifestyle, housing type, schools, budget, and resale flexibility matter more than one listing.",
    questions: [
      "Which daily routine are you trying to protect?",
      "Are you comparing neighborhoods, cities, or counties?",
      "Do you need place fit first or a market report first?"
    ],
    primary: ["Explore Local Areas", "local-areas/#article-library", "local-area-research"],
    secondary: ["Check Market Reports", "market-trends/", "market-context"]
  },
  "property-situation": {
    title: "Sort the property situation before choosing the public path.",
    copy: "Use homeowner guidance or a private conversation when repairs, tenants, inheritance, rental questions, privacy, or holding costs change the first step.",
    questions: [
      "Is this a repair issue, timing issue, privacy issue, or ownership issue?",
      "Does the property need to be sold, rented, held, or stabilized first?",
      "Would public guidance help, or is this better talked through privately?"
    ],
    primary: ["Review Homeowner Options", "homeowners/#article-library", "owning"],
    secondary: ["Talk Through My Situation", "#contact-israel", "owning"]
  }
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
    "buy/#article-library": "buy/#article-library",
    "sell/#article-library": "sell/#article-library",
    "move-relocate/#article-library": "move-relocate/#article-library",
    "homeowners/#article-library": "homeowners/#article-library",
    "invest/#article-library": "invest/#article-library",
    "local-areas/#article-library": "local-areas/#article-library"
  };
  document.querySelectorAll("#site-menu a[href], .primary-nav a.nav-link[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (hubTargets[href]) link.setAttribute("href", hubTargets[href]);
  });
}

function decisionMarkup(data, compact = false) {
  return `
    <div class="decision-response${compact ? " compact-response" : ""}">
      <p class="eyebrow">Diagnosis</p>
      <h3>${data.diagnosis}</h3>
      <p class="best-step"><strong>Best next step:</strong> ${data.bestStep}</p>
      <div class="decision-ctas">
        <a class="button button-primary" href="${data.primary[1]}" data-intent="${data.primary[2]}">${data.primary[0]}</a>
        <a class="button button-secondary" href="${data.secondary[1]}" data-intent="${data.secondary[2]}">${data.secondary[0]}</a>
      </div>
    </div>
  `;
}

function selectDecision(key) {
  const data = decisionData[key] || decisionData["compare-local"];

  decisionButtons.forEach((button) => {
    const selected = button.dataset.decision === key;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  if (decisionPanel) {
    decisionPanel.innerHTML = decisionMarkup(data);
  }

  document.querySelectorAll(".decision-inline").forEach((inline) => {
    inline.innerHTML = "";
  });

  const inline = document.querySelector(`#decision-inline-${key}`);
  if (inline) {
    inline.innerHTML = decisionMarkup(data, true);
  }
}

function homepageDecisionRecommendationMarkup(data) {
  const questions = data.questions.map((question) => `<li>${question}</li>`).join("");
  return `
    <div class="decision-recommendation__copy">
      <p class="eyebrow">Recommended path</p>
      <h3>${data.title}</h3>
      <p>${data.copy}</p>
    </div>
    <ul class="decision-recommendation__questions" aria-label="Helpful questions for this path">
      ${questions}
    </ul>
    <div class="decision-recommendation__actions">
      <a class="button button-primary" href="${data.primary[1]}" data-intent="${data.primary[2]}">${data.primary[0]}</a>
      <a class="button button-secondary" href="${data.secondary[1]}" data-intent="${data.secondary[2]}">${data.secondary[0]}</a>
    </div>
  `;
}

function selectHomepageDecisionRoute(key, options = {}) {
  if (!homepageDecisionRecommendation || !homepageDecisionCards.length) return;
  const data = homepageDecisionRoutes[key] || homepageDecisionRoutes["moving-sense"];

  homepageDecisionCards.forEach((card) => {
    const selected = card.dataset.decisionRoute === key;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-expanded", String(selected));
  });

  homepageDecisionRecommendation.innerHTML = homepageDecisionRecommendationMarkup(data);

  if (options.focus) {
    window.requestAnimationFrame(() => {
      homepageDecisionRecommendation.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 760px)").matches) {
        homepageDecisionRecommendation.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

function renderPathCards(key) {
  const cards = pathData[key] || pathData.buying;

  pathTabs.forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.dataset.pathTab === key));
  });

  if (!pathTrack) return;
  pathTrack.innerHTML = cards
    .map(
      (card) => `
        <a class="article-card" href="${card.href}" data-intent="${key}">
          <img src="${card.image}" alt="">
          <span class="article-body">
            <span class="article-category">${card.category}</span>
            <h3>${card.title}</h3>
            <p>${card.summary}</p>
            <span class="card-cta">${card.cta}</span>
          </span>
        </a>
      `
    )
    .join("");
  pathTrack.scrollLeft = 0;
}

function renderLocalCards(key) {
  const cards = localAreaData[key] || localAreaData.nearby;

  localTabs.forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.dataset.localTab === key));
  });

  if (!localTrack) return;
  localTrack.innerHTML = cards
    .map(
      (card) => `
        <a class="area-card" href="#contact-israel" data-intent="local-area-research">
          <img src="${card.image}" alt="${card.title} real estate and local area context">
          <span class="area-body">
            <span class="area-group-label">${card.label}</span>
            <h3>${card.title}</h3>
            <p>${card.copy}</p>
            <span class="card-cta">Ask about this area</span>
          </span>
        </a>
      `
    )
    .join("");
  localTrack.scrollLeft = 0;
}

function renderSearch(query = "") {
  if (window.hbiSearch) {
    const normalized = query.trim();
    const matches = window.hbiSearch.search(normalized, { limit: 7 });
    searchResults.innerHTML = "";
    const intro = document.createElement("p");
    intro.className = "eyebrow";
    intro.textContent = normalized ? `Best matches for "${normalized}"` : "Useful starting points";
    searchResults.append(intro);

    const results = matches.length ? matches : window.hbiSearch.search("sell rent hold", { limit: 5 });
    results.forEach(({ item, reason }) => {
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = window.hbiSearch.href(item, "");
      link.dataset.topicId = item.topicId || "";
      link.innerHTML = `<strong>${item.title}</strong><span>${reason}</span>`;
      searchResults.append(link);
    });

    const allLink = document.createElement("a");
    allLink.className = "search-result search-result-all";
    allLink.href = `search/${normalized ? `?q=${encodeURIComponent(normalized)}` : ""}`;
    allLink.innerHTML = "<strong>Open full search</strong><span>Use intent and situation filters across the whole guidance library.</span>";
    searchResults.append(allLink);
    return;
  }

  const normalized = query.trim().toLowerCase();
  const matches = normalized
    ? siteIndex.filter(([title, copy]) => `${title} ${copy}`.toLowerCase().includes(normalized))
    : siteIndex.slice(0, 7);

  searchResults.innerHTML = "";
  const intro = document.createElement("p");
  intro.className = "eyebrow";
  intro.textContent = normalized ? `Results for "${query.trim()}"` : "Useful starting points";
  searchResults.append(intro);

  const results = matches.length
    ? matches
    : [
        ["Ask Israel to route the question", "Share the decision and get pointed to the right path.", "#contact-israel"],
        ["Start with your situation", "Use the dashboard instead of guessing which page fits.", "#decision-dashboard"],
      ];

  results.forEach(([title, copy, href]) => {
    const link = document.createElement("a");
    link.className = "search-result";
    link.href = href;
    link.innerHTML = `<strong>${title}</strong><span>${copy}</span>`;
    searchResults.append(link);
  });
}

function closeMegaMenus() {
  megaTriggers.forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
    trigger.closest(".nav-item")?.classList.remove("is-open");
  });
}

function syncOverlayState() {
  const menuOpen = menu && !menu.hidden;
  const searchOpen = searchPanel && !searchPanel.hidden;
  const intakeOpen = Boolean(document.querySelector("[data-intake-modal]:not([hidden])"));
  document.body.classList.toggle("overlay-open", Boolean(menuOpen || searchOpen || intakeOpen));
}

function openMenu() {
  closeSearch();
  closeMegaMenus();
  menu.hidden = false;
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
  syncOverlayState();
  menu.querySelector("[data-close-menu]")?.focus();
}

function closeMenu({ restoreFocus = false } = {}) {
  menu.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  syncOverlayState();
  if (restoreFocus) menuToggle.focus();
}

function openSearch(query = "") {
  closeMenu();
  closeMegaMenus();
  searchPanel.hidden = false;
  overlaySearchInput.value = query;
  renderSearch(query);
  syncOverlayState();
  overlaySearchInput.focus();
  overlaySearchInput.select();
}

function closeSearch() {
  searchPanel.hidden = true;
  syncOverlayState();
}

function setContactIntent(intent = "Private question") {
  const map = {
    buying: "Buying and choosing an area",
    "local-area-research": "Comparing Local Areas",
    selling: "Selling timeline",
    moving: "Moving or relocating",
    homeowners: "Homeowner options",
    owning: "Homeowner options",
    investing: "Investing or holding property",
    market: "Comparing Local Areas",
    "home-value": "Homeowner options",
    "private-question": "Private question",
  };

  const desired = map[intent] || "Private question";
  pendingContactIntent = desired;
  if (!contactSelect) return;

  [...contactSelect.options].forEach((option) => {
    option.selected = option.textContent === desired;
  });
}

const homepageTopicOptions = [
  "Buying and choosing an area",
  "Selling timeline",
  "Moving or relocating",
  "Homeowner options",
  "Investing or holding property",
  "Comparing Local Areas",
  "Private question"
];

const intakeConfigs = {
  homepage: {
    title: "Add optional context?",
    intro: "Your contact info was sent. Add only what helps Israel reply with a useful next step.",
    fields: [
      { type: "select", name: "topic", label: "What is this about?", options: homepageTopicOptions },
      { type: "text", name: "property_city", label: "City or area", placeholder: "Example: Long Beach, Torrance, Redondo Beach" },
      { type: "select", name: "timeframe", label: "Timing", options: ["Just researching", "3-6 months", "Soon", "Urgent", "Not sure"] },
      { type: "textarea", name: "message", label: "Anything Israel should know?", placeholder: "Share the decision, property, city, or timing if it is easy." },
    ],
  },
  buy: {
    title: "Buyer context",
    intro: "A few quick choices can make the reply more useful before you tour.",
    fields: [
      { type: "text", name: "locations", label: "Where are you considering?", placeholder: "Cities, neighborhoods, or ZIP codes" },
      { type: "select", name: "buyer_focus", label: "What is the main comparison?", options: ["Area comparison", "Budget", "Touring", "Financing", "Offers", "Inspections"] },
      { type: "select", name: "timeframe", label: "Timeframe", options: ["Just researching", "3-6 months", "Soon", "Urgent"] },
      { type: "choice", name: "sell_first", label: "Do you need to sell first?", options: ["Yes", "No", "Not sure"] },
    ],
  },
  sell: {
    title: "Seller context",
    intro: "Answer only what helps explain the selling decision.",
    fields: [
      { type: "select", name: "seller_driver", label: "What is driving the decision?", options: ["Timing", "Pricing", "Repairs", "Privacy", "Tenants", "Next purchase", "Inherited/family issue"] },
      { type: "text", name: "property_city", label: "Property city", placeholder: "Example: Long Beach, Torrance, Redondo Beach" },
      { type: "select", name: "seller_help", label: "What would help most?", options: ["Sale estimate", "Prep advice", "Private strategy conversation", "Offer/timing plan"] },
    ],
  },
  "move-relocate": {
    title: "Move context",
    intro: "Use this when timing, commute, and housing pieces overlap.",
    fields: [
      { type: "select", name: "move_direction", label: "What kind of move is this?", options: ["Moving into Southern California", "Moving out of Southern California", "Moving within Southern California"] },
      { type: "text", name: "commute_city", label: "Job or commute city", placeholder: "Example: El Segundo, Torrance, Long Beach" },
      { type: "select", name: "move_need", label: "What needs sequencing?", options: ["Buy before selling", "Sell before buying", "Rent-back", "School-year timing", "Area comparison"] },
    ],
  },
  homeowners: {
    title: "Homeowner context",
    intro: "This helps separate the property decision from the life decision.",
    fields: [
      { type: "select", name: "homeowner_decision", label: "What are you weighing?", options: ["Sell", "Rent", "Hold", "Repair", "Refinance", "Inherited", "Tenant issue", "Family decision", "Financial pressure"] },
      { type: "text", name: "property_city", label: "Property city", placeholder: "Example: Lakewood, Carson, Palos Verdes" },
      { type: "choice", name: "private_sensitive", label: "Is this private or sensitive?", options: ["Yes", "Somewhat", "No"] },
    ],
  },
  invest: {
    title: "Investment context",
    intro: "Use this for rental, tenant, hold, and exit decisions.",
    fields: [
      { type: "select", name: "invest_focus", label: "What is the main concern?", options: ["Rental demand", "Tenant issue", "Cash flow", "Repairs", "Vacancy", "Exit planning", "Hold vs sell"] },
      { type: "text", name: "property_city", label: "Property city", placeholder: "Example: Long Beach, Downey, Orange County" },
      { type: "select", name: "property_status", label: "Current status", options: ["Owned", "Considering", "Inherited", "Tenant-occupied"] },
    ],
  },
  "local-areas": {
    title: "Local area context",
    intro: "Share the daily-life tradeoffs behind the area comparison.",
    fields: [
      { type: "text", name: "cities_compared", label: "Cities being compared", placeholder: "Example: Redondo, Torrance, Long Beach" },
      { type: "text", name: "commute_anchor", label: "Commute anchor", placeholder: "Example: LAX, El Segundo, Irvine, Port of LA" },
      { type: "chips", name: "area_priorities", label: "What matters most?", options: ["Schools", "Walkability", "Budget", "Lifestyle", "Space", "Beach access", "Parking", "Investment potential"] },
    ],
  },
};

function getFocusable(container) {
  return [...container.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((item) => !item.disabled && item.offsetParent !== null);
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

function inferHomeIntakeKind(form) {
  const topic = String(form.querySelector("[data-intake-topic]")?.value || pendingContactIntent || "").toLowerCase();
  if (topic.includes("buy")) return "buy";
  if (topic.includes("sell")) return "sell";
  if (topic.includes("moving") || topic.includes("relocat")) return "move-relocate";
  if (topic.includes("homeowner")) return "homeowners";
  if (topic.includes("invest")) return "invest";
  if (topic.includes("area")) return "local-areas";
  return "homeowners";
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
  if (field.type === "textarea") {
    return `<label class="form-field form-field-full">${field.label}
      <textarea name="${field.name}" rows="3" data-detail-label="${field.label}" placeholder="${field.placeholder || ""}"></textarea>
    </label>`;
  }
  return `<label class="form-field form-field-full">${field.label}
    <input name="${field.name}" data-detail-label="${field.label}" placeholder="${field.placeholder || ""}">
  </label>`;
}

function renderIntakeStep(form) {
  const modal = form.closest(".advisor-card")?.querySelector("[data-intake-modal]");
  if (!modal) return null;
  const config = intakeConfigs.homepage;
  modal.querySelector("[data-intake-modal-copy]").textContent = config.intro;
  modal.querySelector("[data-intake-step-fields]").innerHTML = config.fields.map(fieldMarkup).join("");
  modal.querySelector(".intake-step-header h2").textContent = config.title;
  const topicSelect = modal.querySelector('[name="topic"]');
  if (topicSelect && pendingContactIntent) {
    [...topicSelect.options].forEach((option) => {
      option.selected = option.textContent === pendingContactIntent;
    });
  }
  return modal;
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
  applyGoogleProfile(activeGoogleForm || document.querySelector("[data-home-contact-form]"), profile);
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
    const availableWidth = button.getBoundingClientRect().width || form.getBoundingClientRect().width || 320;
    const width = Math.max(180, Math.min(400, Math.floor(availableWidth)));
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
  form.insertBefore(wrap, form.querySelector(".form-grid") || form.firstElementChild);
  activeGoogleForm ||= form;
  loadGoogleIdentity()
    .then(() => renderGoogleButton(form))
    .catch(() => wrap.remove());
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

function contactBodyLines(data, detailLines = []) {
  const phone = String(data.get("phone") || "").trim();
  const lines = [
    "Source: Homepage advisor/contact form",
    `Topic: ${data.get("topic") || "Private question"}`,
    "",
    `First name: ${data.get("first_name") || ""}`,
    `Last name: ${data.get("last_name") || ""}`,
    `Email: ${data.get("email") || ""}`,
    `Phone: ${phone || "Not provided"}`,
  ];
  if (phone) lines.push(`Phone/text consent: ${data.get("phone_consent") === "yes" ? "Yes" : "No"}`);
  lines.push("", "Message:", data.get("message") || "");
  if (detailLines.length) lines.push("", "Optional context:", ...detailLines);
  lines.push("", `Page: ${window.location.href}`);
  return lines;
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

function homepageRouteTags(intakeKind) {
  const labelMap = {
    buy: "Buyer",
    sell: "Seller",
    homeowners: "Homeowner",
    "move-relocate": "Relocation",
    invest: "Investor",
    "local-areas": "Local Area"
  };
  return ["Homepage Contact", labelMap[intakeKind]].filter(Boolean);
}

function homeIntakeIdempotencyKey(form) {
  if (!form.dataset.leadIdempotencyKey) {
    form.dataset.leadIdempotencyKey = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `homepage-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
  return form.dataset.leadIdempotencyKey;
}

function homepageLeadPayload(form, data, details = []) {
  const intakeKind = inferHomeIntakeKind(form);
  const topicDetail = details.find((line) => line.startsWith("What is this about?:"))?.replace("What is this about?:", "").trim();
  return {
    idempotencyKey: homeIntakeIdempotencyKey(form),
    routeKey: "homepage_contact",
    leadAction: "create_lead_and_start_outreach",
    followUpType: "Homepage private decision triage",
    routeTags: homepageRouteTags(intakeKind),
    formType: "homepage_contact_form",
    formLocation: "homepage advisor/contact form",
    contact: {
      firstName: String(data.get("first_name") || "").trim(),
      lastName: String(data.get("last_name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: consentedPhone(data),
      phoneConsent: data.get("phone_consent") === "yes"
    },
    fields: sanitizedLeadFields(data),
    details,
    cta: {
      label: details.length ? "Send details" : "Send My Info",
      promise: topicDetail || "Private real estate question"
    },
    destination: {
      type: "crm_lead",
      url: ""
    },
    page: {
      intentLabel: "Homepage",
      articleTitle: "HomesByIsraelHE Homepage"
    }
  };
}

async function submitHomepageLead(payload) {
  if (window.HBILeadClient?.submitLead) {
    return window.HBILeadClient.submitLead(payload);
  }
  throw new Error("lead_capture_unavailable");
}

async function sendIntakeForm(form, { includeDetails = true } = {}) {
  const data = new FormData(form);
  const modal = form.closest(".advisor-card")?.querySelector("[data-intake-modal]");
  const details = includeDetails && modal ? stepDetailLines(modal) : [];
  return submitHomepageLead(homepageLeadPayload(form, data, details));
}

function setIntakeStatus(modal, message, type = "info") {
  if (!modal) return;
  let status = modal.querySelector("[data-submit-status]");
  if (!status) {
    status = document.createElement("p");
    status.className = "intake-submit-status";
    status.setAttribute("role", type === "error" ? "alert" : "status");
    status.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    status.dataset.submitStatus = "";
    modal.querySelector(".intake-step-actions")?.before(status);
  }
  status.className = `intake-submit-status is-${type}`;
  status.textContent = message;
}

function setHomeFormStatus(form, message, type = "info") {
  if (!form) return;
  let status = form.querySelector("[data-submit-status]");
  if (!status) {
    status = document.createElement("p");
    status.className = "intake-submit-status";
    status.setAttribute("role", type === "error" ? "alert" : "status");
    status.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    status.dataset.submitStatus = "";
    form.querySelector('button[type="submit"]')?.before(status);
  }
  status.className = `intake-submit-status is-${type}`;
  status.textContent = message;
}

function setHomeFormSubmitting(form, submitting) {
  if (!form) return;
  const submit = form.querySelector('button[type="submit"]');
  if (submit) {
    if (!submit.dataset.originalLabel) submit.dataset.originalLabel = submit.textContent.trim();
    submit.disabled = submitting;
    submit.textContent = submitting ? "Sending..." : submit.dataset.originalLabel;
  }
  form.setAttribute("aria-busy", submitting ? "true" : "false");
}

function setIntakeSubmitting(modal, submitting) {
  if (!modal) return;
  modal.querySelectorAll("[data-intake-send], [data-intake-skip]").forEach((button) => {
    if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent.trim();
    button.disabled = submitting;
    if (submitting) button.textContent = "Sending...";
    else button.textContent = button.dataset.originalLabel;
  });
}

async function submitAndCloseHomeIntake(modal, task) {
  setIntakeSubmitting(modal, true);
  setIntakeStatus(modal, "Sending the optional details...", "info");
  try {
    await task();
    setIntakeStatus(modal, "Details sent. Israel will review everything together.", "success");
    window.HBILeadClient?.showLeadNotice?.("Details sent. Israel will review everything together.", "success");
    window.setTimeout(() => closeIntakeModal({ restoreFocus: false }), 700);
  } catch (_error) {
    setIntakeSubmitting(modal, false);
    setIntakeStatus(modal, "Your contact info was already sent, but these details did not send. Please try again.", "error");
    window.HBILeadClient?.showLeadNotice?.("Your contact info was sent, but the optional details did not send.", "error");
  }
}

function openIntakeModal(form, returnTarget = document.activeElement) {
  const modal = renderIntakeStep(form);
  if (!modal) {
    window.HBILeadClient?.showLeadNotice?.("Your info was sent. Israel will review it and follow up.", "success");
    return;
  }
  activeIntakeForm = form;
  intakePreviousFocus = returnTarget;
  modal.hidden = false;
  syncOverlayState();
  modal.querySelector("input, select, textarea, button")?.focus();
}

function closeIntakeModal({ restoreFocus = true } = {}) {
  document.querySelectorAll("[data-intake-modal]").forEach((modal) => {
    modal.hidden = true;
  });
  syncOverlayState();
  if (restoreFocus) intakePreviousFocus?.focus?.();
  activeIntakeForm = null;
  intakePreviousFocus = null;
}

function initHomeContactForm() {
  const form = document.querySelector("[data-home-contact-form]");
  if (!form) return;

  const phoneInput = form.querySelector('[name="phone"]');
  const consentInput = form.querySelector('[name="phone_consent"]');
  const modal = form.closest(".advisor-card")?.querySelector("[data-intake-modal]");

  ensureGooglePrefill(form);
  syncPhoneConsent(form);
  phoneInput?.addEventListener("input", () => syncPhoneConsent(form));
  consentInput?.addEventListener("change", () => consentInput.setCustomValidity(""));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateIntakeForm(form)) return;
    setHomeFormSubmitting(form, true);
    setHomeFormStatus(form, "Sending your info...", "info");
    try {
      await sendIntakeForm(form, { includeDetails: false });
      setHomeFormStatus(form, "Sent. Add optional context next, or skip for now.", "success");
      window.HBILeadClient?.showLeadNotice?.("Your info was sent. Israel will review it and follow up.", "success");
      openIntakeModal(form, event.submitter || document.activeElement);
    } catch (_error) {
      setHomeFormStatus(form, "This did not send. Please try again, or use the call/text or email option on this page.", "error");
      window.HBILeadClient?.showLeadNotice?.("This did not send. Please try again, or use the contact options on this page.", "error");
    } finally {
      setHomeFormSubmitting(form, false);
    }
  });

  modal?.addEventListener("click", async (event) => {
    if (event.target.closest("[data-intake-close]")) {
      closeIntakeModal();
      return;
    }
    if (event.target.closest("[data-intake-skip]") && activeIntakeForm) {
      window.HBILeadClient?.showLeadNotice?.("Your info was sent. Israel will review it and follow up.", "success");
      closeIntakeModal();
      return;
    }
    if (event.target.closest("[data-intake-send]") && activeIntakeForm) {
      await submitAndCloseHomeIntake(modal, () => sendIntakeForm(activeIntakeForm, { includeDetails: true }));
    }
  });

  modal?.addEventListener("keydown", (event) => {
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

document.addEventListener("click", (event) => {
  const openSearchButton = event.target.closest("[data-open-search]");
  if (openSearchButton) {
    event.preventDefault();
    openSearch(openSearchButton.dataset.query || "");
    return;
  }

  const closeMenuButton = event.target.closest("[data-close-menu]");
  if (closeMenuButton) {
    closeMenu();
    return;
  }

  const closeSearchButton = event.target.closest("[data-close-search]");
  if (closeSearchButton) {
    closeSearch();
  }

  const searchResult = event.target.closest(".search-result");
  if (searchResult && searchResult.getAttribute("href").startsWith("#")) {
    closeSearch();
  }

  const pathLink = event.target.closest("a[data-path-tab]");
  if (pathLink) {
    renderPathCards(pathLink.dataset.pathTab);
  }

  const intentLink = event.target.closest("[data-intent][href='#contact-israel']");
  if (intentLink) {
    setContactIntent(intentLink.dataset.intent);
  }

  const menuIsOpen = menu && !menu.hidden;
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

menuToggle.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (menu.hidden) {
    openMenu();
  } else {
    closeMenu({ restoreFocus: true });
  }
});

decisionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectDecision(button.dataset.decision);
  });
});

homepageDecisionCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    selectHomepageDecisionRoute(card.dataset.decisionRoute, { focus: true });
  });
});

pathTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    renderPathCards(tab.dataset.pathTab);
  });
});

localTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    renderLocalCards(tab.dataset.localTab);
  });
});

document.querySelectorAll("[data-site-search]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const value = String(data.get("q") || "").trim();
    window.location.href = `search/${value ? `?q=${encodeURIComponent(value)}` : ""}`;
  });
});

document.querySelector("[data-overlay-search]").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = overlaySearchInput.value.trim();
  window.location.href = `search/${value ? `?q=${encodeURIComponent(value)}` : ""}`;
});

overlaySearchInput.addEventListener("input", () => {
  renderSearch(overlaySearchInput.value);
});

searchPanel.addEventListener("click", (event) => {
  if (event.target === searchPanel) {
    closeSearch();
  }
});

document.querySelectorAll("[data-carousel-prev], [data-carousel-next]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.carouselPrev || button.dataset.carouselNext;
    const track = document.getElementById(id);
    if (!track) return;
    const direction = button.dataset.carouselNext ? 1 : -1;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const intakeModal = document.querySelector("[data-intake-modal]:not([hidden])");
  if (intakeModal) {
    closeIntakeModal();
    return;
  }

  if (!searchPanel.hidden) {
    closeSearch();
    return;
  }

  if (!menu.hidden) {
    closeMenu();
    menuToggle.focus();
    return;
  }

  closeMegaMenus();
});

normalizeHubNavigationLinks();
selectDecision("compare-local");
if (homepageDecisionCards.length) {
  selectHomepageDecisionRoute(homepageDecisionCards[0].dataset.decisionRoute);
}
renderPathCards("buying");
renderLocalCards("nearby");
initHomeContactForm();
