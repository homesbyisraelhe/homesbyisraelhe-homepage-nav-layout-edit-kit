(() => {
  const graph = window.hbiGuidanceGraph || { items: [], quickChips: [], relationshipGroups: [] };
  const relationshipLabelById = new Map((graph.relationshipGroups || []).map((group) => [group.id, group.label]));
  const intentLabels = {
    buy: "Buy",
    sell: "Sell",
    "move-relocate": "Move / Relocate",
    homeowners: "Homeowners",
    invest: "Invest",
    "local-areas": "Local Areas"
  };

  const synonymRules = [
    ["rentback", "rent back rent-back leaseback stay after closing transition timing"],
    ["leaseback", "rent back rent-back stay after closing transition timing"],
    ["buy before selling", "buy before sell proceeds equity bridge loan contingency rent-back"],
    ["buy before sell", "buy before selling proceeds equity bridge loan contingency rent-back"],
    ["sell before buying", "sell before buy proceeds equity contingency timing"],
    ["tenant occupied", "tenant-occupied tenant risk rental property landlord exit"],
    ["tenant risk", "tenant occupied rental property landlord vacancy cash flow"],
    ["cashflow", "cash flow rental demand reserves investment risk"],
    ["prop19", "prop 19 property tax 55 tax planning"],
    ["as is", "as-is repairs condition disclosures prep"],
    ["move out of state", "moving out of state seller relocation proceeds tax timing"],
    ["out of state", "moving out of state relocation proceeds tax timing"],
    ["notice default", "notice of default foreclosure lender deadline equity protection"],
    ["nod", "notice of default foreclosure lender deadline equity protection"],
    ["probate", "inherited heir estate trust sale life event property"],
    ["divorce", "family home separation equity title timing"],
    ["landlord", "rental property tenant risk cash flow hold sell rent"],
    ["where should i buy", "area comparison local fit commute schools home size buyer area fit"],
    ["where to buy", "area comparison local fit commute schools home size buyer area fit"],
    ["where should i live", "local areas area guide city comparison neighborhood fit commute schools lifestyle daily life"],
    ["where to live", "local areas area guide city comparison neighborhood fit commute schools lifestyle daily life"],
    ["best neighborhoods", "local areas area intelligence neighborhood fit schools commute lifestyle market context"],
    ["best city", "local areas city comparison commute schools lifestyle market context"],
    ["local area", "local areas area guide area intelligence city comparison neighborhood fit commute schools"],
    ["local areas", "local area area guide area intelligence city comparison neighborhood fit commute schools"],
    ["area guide", "local areas area intelligence city comparison neighborhood fit commute schools"],
    ["area intelligence", "local areas area guide market context neighborhood fit daily life commute schools"],
    ["beach city", "beach cities coastal lifestyle walkability parking schools commute local areas"],
    ["south bay areas", "south bay beach cities local areas commute schools lifestyle area comparison"],
    ["long beach neighborhoods", "long beach local areas neighborhood fit commute schools lifestyle"],
    ["lax commute", "el segundo westchester hawthorne local areas lax access commute"],
    ["commute and schools", "local areas commute schools school route daily life neighborhood fit"],
    ["area fit", "area comparison commute schools home size price per square foot local fit"],
    ["payment", "monthly payment affordability loan strategy hoa dues property taxes down payment"],
    ["mortgage", "loan strategy fha conventional jumbo conforming down payment reserves"],
    ["cash buyer", "cash buyers offer strategy proof of funds seller confidence appraisal gap"],
    ["offer", "offer strategy contingencies appraisal gap inspection contingency negotiation"],
    ["inspection risk", "property condition due diligence permits sewer foundation electrical insurance"],
    ["condition risk", "property condition due diligence inspection permits sewer foundation electrical"],
    ["buy rental", "rental property buy box investment purchase cash flow tenant demand reserves"],
    ["investment purchase", "rental property buy box cash flow appreciation reserves tenant demand"]
  ];

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
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

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function expandQuery(query) {
    const original = normalizedWords(query);
    const expansions = [];
    synonymRules.forEach(([needle, words]) => {
      if (original.includes(normalizedWords(needle))) expansions.push(words);
    });
    return [original, ...expansions].filter(Boolean).join(" ");
  }

  function searchText(item) {
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
      ...(item.searchKeywords || []),
      item.matchText
    ].join(" ");
  }

  function resolveChip(chipLabel) {
    if (!chipLabel) return null;
    return (graph.quickChips || []).find((chip) => chip.label === chipLabel) || null;
  }

  function scoreItem(item, query, options = {}) {
    if (item.status !== "live") return 0;
    const chip = options.chip || resolveChip(options.chipLabel);
    const rawQuery = query || chip?.query || "";
    const expanded = expandQuery(rawQuery);
    const normalizedQuery = normalizedWords(rawQuery);
    const expandedTokens = tokensFor(expanded);
    const text = normalizedWords(searchText(item));
    let total = 0;

    if (!normalizedQuery && options.pageIntent) {
      if (item.intent === options.pageIntent || item.primaryDiscoveryIntent === options.pageIntent) total += 8;
      if ((item.secondaryDiscoveryIntents || []).includes(options.pageIntent)) total += 5;
    }

    if (normalizedQuery && text.includes(normalizedQuery)) total += 22;

    expandedTokens.forEach((token) => {
      if (normalizedWords(item.title).includes(token)) total += 7;
      if (normalizedWords(item.summary).includes(token)) total += 3;
      if (normalizedWords(item.category).includes(token)) total += 2;
      if (normalizedWords(item.stage).includes(token)) total += 3;
      if ((item.areas || []).some((area) => normalizedWords(area).includes(token))) total += 5;
      if ((item.tags || []).some((tag) => normalizedWords(tag).includes(token))) total += 5;
      if ((item.relationshipGroupLabels || []).some((label) => normalizedWords(label).includes(token))) total += 6;
      if ((item.searchKeywords || []).some((keyword) => normalizedWords(keyword).includes(token))) total += 3;
    });

    (chip?.groups || []).forEach((groupId) => {
      if ((item.relationshipGroups || []).includes(groupId)) total += 24;
    });

    if (options.groupIds?.length) {
      options.groupIds.forEach((groupId) => {
        if ((item.relationshipGroups || []).includes(groupId)) total += 18;
      });
    }

    if (options.intentFilters?.length) {
      const hasIntent =
        options.intentFilters.includes(item.primaryDiscoveryIntent) ||
        options.intentFilters.includes(item.intent) ||
        (item.secondaryDiscoveryIntents || []).some((intent) => options.intentFilters.includes(intent));
      if (!hasIntent) return 0;
      total += 4;
    }

    if (options.pageIntent) {
      if (item.primaryDiscoveryIntent === options.pageIntent) total += 3;
      if ((item.secondaryDiscoveryIntents || []).includes(options.pageIntent)) total += 2;
    }

    if (options.excludeTopicId && item.topicId === options.excludeTopicId) return 0;
    total += 6;
    return total;
  }

  function matchReason(item, query, options = {}) {
    const chip = options.chip || resolveChip(options.chipLabel);
    const chipGroups = (chip?.groups || []).filter((groupId) => (item.relationshipGroups || []).includes(groupId));
    if (chipGroups.length) {
      return "Related guide for this decision";
    }

    const groupIds = (options.groupIds || []).filter((groupId) => (item.relationshipGroups || []).includes(groupId));
    if (groupIds.length) {
      return "Related guide for this decision";
    }

    const tokens = tokensFor(expandQuery(query));
    const area = (item.areas || []).find((value) => tokens.some((token) => normalizedWords(value).includes(token)));
    const tag = (item.tags || []).find((value) => tokens.some((token) => normalizedWords(value).includes(token)));
    const group = (item.relationshipGroupLabels || []).find((value) => tokens.some((token) => normalizedWords(value).includes(token)));
    if (area || tag || group) return "Related guide for this decision";
    if (options.pageIntent && (item.secondaryDiscoveryIntents || []).includes(options.pageIntent)) {
      return `Also supports ${intentLabels[options.pageIntent] || "this decision"}`;
    }
    return `Related ${item.primaryDiscoveryIntentLabel || item.intentLabel} decision`;
  }

  function search(query = "", options = {}) {
    const seen = new Map();
    (graph.items || []).forEach((item) => {
      const score = scoreItem(item, query, options);
      if (score <= 0) return;
      const existing = seen.get(item.topicId);
      const result = {
        item,
        score,
        reason: matchReason(item, query, options)
      };
      if (!existing || score > existing.score) seen.set(item.topicId, result);
    });

    const limit = Number(options.limit || 10);
    return [...seen.values()]
      .sort((a, b) => b.score - a.score || (a.item.priority || 999) - (b.item.priority || 999))
      .slice(0, limit);
  }

  function href(item, prefix = "") {
    if (!item?.urlPath) return item?.href || "#";
    if (/^(?:https?:|mailto:|tel:|\/)/.test(item.urlPath)) return item.urlPath;
    return `${prefix}${item.urlPath}`;
  }

  function track(name, detail = {}) {
    const payload = { event: name, ...detail };
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    document.dispatchEvent(new CustomEvent("hbi:search", { detail: payload }));
  }

  function resultCard({ item, reason }, options = {}) {
    const prefix = options.hrefPrefix || "";
    const secondary = (item.secondaryDiscoveryIntentLabels || []).filter((label) => label !== item.primaryDiscoveryIntentLabel);
    return `
      <a class="${escapeHtml(options.cardClass || "guidance-result-card")}" href="${escapeHtml(href(item, prefix))}" data-topic-id="${escapeHtml(item.topicId)}" data-primary-intent="${escapeHtml(item.primaryDiscoveryIntent || item.intent)}">
        <span class="guidance-card-meta">
          <span class="guidance-intent-badge">${escapeHtml(item.primaryDiscoveryIntentLabel || item.intentLabel)}</span>
        </span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <span class="guidance-match">${escapeHtml(reason)}</span>
        ${secondary.length ? `<span class="guidance-secondary">Also appears in: ${escapeHtml(secondary.slice(0, 2).join(", "))}</span>` : ""}
      </a>
    `;
  }

  function renderCards(container, results, options = {}) {
    if (!container) return;
    if (!results.length) {
      container.innerHTML =
        options.emptyHtml ||
        `<div class="guidance-empty"><h3>No related guidance found</h3><p>Try a broader phrase like local areas, beach city fit, area fit, payment, offer strategy, rent-back, tenant risk, proceeds, or repairs.</p></div>`;
      return;
    }
    container.innerHTML = results.map((result) => resultCard(result, options)).join("");
  }

  window.hbiSearch = {
    graph,
    intentLabels,
    normalize,
    normalizedWords,
    tokensFor,
    expandQuery,
    searchText,
    scoreItem,
    matchReason,
    search,
    href,
    track,
    renderCards,
    resultCard,
    escapeHtml
  };
})();
