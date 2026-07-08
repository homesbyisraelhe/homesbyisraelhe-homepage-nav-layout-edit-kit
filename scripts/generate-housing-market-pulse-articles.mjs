import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getResourceLink, renderMobileMenu, renderPrimaryNav, resourceHref } from "./site-resource-hub.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const today = "2026-07-07";
const displayDate = "July 7, 2026";
const publicReportPeriod = "July 2026";
const allowedPulseAvatars = new Set(["buyer", "seller"]);
const requestedAvatar = allowedPulseAvatars.has(process.env.PULSE_AVATAR) ? process.env.PULSE_AVATAR : "buyer";
const pulseRoot = path.join(siteRoot, "housing-market-pulse");
const researchRoot = path.join(pulseRoot, "research");
const keywordPlannerCachePath = path.join(researchRoot, "keyword-planner-cache.json");
const marketIndexPath = path.join(siteRoot, "market-trends", "data", "market-index.json");
const marketDataRoot = path.join(siteRoot, "market-trends", "data");

const requiredMetricKeys = [
  "medianSalePrice",
  "averageSalePrice",
  "averagePpsf",
  "medianOriginalPrice",
  "newListings",
  "activeInventory",
  "pendingSales",
  "closedSales",
  "monthsSupply",
  "medianDaysOnMarket",
  "averageDaysOnMarket",
  "closedVolume",
  "totalClosedSides",
  "medianLastListPrice",
  "averageLastListPrice",
  "medianShowsToContract",
  "averageShowsToContract",
  "showsPerListing"
];

const explorerMetricKeys = [
  "activeInventory",
  "newListings",
  "pendingSales",
  "closedSales",
  "monthsSupply",
  "medianDaysOnMarket",
  "medianSalePrice",
  "averagePpsf"
];

const sourceBank = {
  redondoInfosparks: {
    label: "CRMLS / InfoSparks: Redondo Beach market data export",
    sourceType: "local market data",
    url: ""
  },
  redondoResidentialBuildingReports: {
    label: "City of Redondo Beach: Residential Building Reports",
    sourceType: "local building and safety",
    url: "https://www.redondo.org/departments/community_development/building_and_safety/residential_building_reports.php"
  },
  redondoZoningMaps: {
    label: "City of Redondo Beach: Zoning Maps / GIS",
    sourceType: "local planning map",
    url: "https://redondo.org/departments/community_development/planning/property_data_and_maps/index.php"
  },
  rbusdBoundaries: {
    label: "Redondo Beach Unified School District: School Boundary Maps",
    sourceType: "school boundary source",
    url: "https://www.rbusd.org/apps/pages/index.jsp?uREC_ID=858151&type=d&pREC_ID=1221439"
  },
  freddieMacPmms: {
    label: "Freddie Mac: Primary Mortgage Market Survey",
    sourceType: "mortgage rate source",
    url: "https://www.freddiemac.com/pmms"
  },
  censusQuickfacts: {
    label: "U.S. Census Bureau QuickFacts",
    sourceType: "demographic and housing context",
    url: "https://www.census.gov/quickfacts/"
  },
  redondoEconomicProfile: {
    label: "City of Redondo Beach: Economic Profile",
    sourceType: "local economic context",
    url: "https://www.redondo.org/departments/waterfront_and_economic_development/economic_development/business_resources.php"
  },
  femaMsc: {
    label: "FEMA Flood Map Service Center",
    sourceType: "official flood map source",
    url: "https://msc.fema.gov/portal/home"
  },
  cgsEarthquakeZones: {
    label: "California Geological Survey: Earthquake Zones of Required Investigation",
    sourceType: "state seismic hazard map source",
    url: "https://maps.conservation.ca.gov/cgs/informationwarehouse/eqzapp/"
  },
  dreHomebuyers: {
    label: "California Department of Real Estate: Information for Homebuyers",
    sourceType: "California consumer guidance",
    url: "https://www.dre.ca.gov/consumers/informationforhomebuyers.html"
  },
  cfpbInspection: {
    label: "Consumer Financial Protection Bureau: Schedule a home inspection",
    sourceType: "federal consumer guidance",
    url: "https://www.consumerfinance.gov/owning-a-home/close/schedule-a-home-inspection/"
  },
  cfpbAppraisals: {
    label: "Consumer Financial Protection Bureau: What are appraisals and why do I need to look at them?",
    sourceType: "federal consumer guidance",
    url: "https://www.consumerfinance.gov/ask-cfpb/what-are-appraisals-and-why-do-i-need-to-look-at-them-en-167/"
  },
  laCountyAssessor: {
    label: "Los Angeles County Assessor: property assessment resources",
    sourceType: "county property source",
    url: "https://assessor.lacounty.gov/"
  },
  orangeCountyAssessor: {
    label: "Orange County Assessor: property assessment resources",
    sourceType: "county property source",
    url: "https://www.ocassessor.gov/"
  }
};

const buyerSourceKeys = [
  "freddieMacPmms",
  "censusQuickfacts",
  "femaMsc",
  "cgsEarthquakeZones",
  "dreHomebuyers",
  "cfpbInspection",
  "cfpbAppraisals"
];

const buyerRelatedTopicIds = [
  "buy-days-on-market-price-reductions-offer-strategy",
  "buy-how-to-write-strong-offer-without-waiving-protections",
  "buy-flood-liquefaction-coastal-risk-south-bay-long-beach",
  "buy-foundation-drainage-south-bay-coastal-la-homes",
  "buy-how-hoa-dues-change-buying-power-long-beach-south-bay-orange-county"
];

const sellerSourceKeys = [
  "freddieMacPmms",
  "censusQuickfacts",
  "femaMsc",
  "cgsEarthquakeZones"
];

const sellerRelatedTopicIds = [
  "sell-south-bay-move-up-prep-price-or-wait",
  "sell-compare-net-proceeds-before-repairs",
  "sell-cash-offer-vs-list-as-is-home-locally",
  "sell-pre-listing-inspections-older-south-bay-long-beach-homes",
  "sell-redondo-beach-sell-as-is-or-fix-before-listing"
];

const keywordPlannerFindingsBySlug = {
  anaheim: {
    tool: "Google Keyword Planner",
    intent: "buyer",
    accessMethod: "Chrome browser, authenticated Google Ads account",
    collectedAt: today,
    plannerForecastPeriod: "June 2025 - May 2026",
    geoTarget: "United States",
    network: "Google",
    accountStatusNote: "Google Ads displayed an inactive-account banner, but Keyword Planner still returned range metrics for the submitted seed set.",
    seedLimitNote: "Discover New Keywords showed a 10-keyword seed limit; the metrics pass used 10 Anaheim buyer-intent seed terms.",
    seedMetrics: [
      {
        keyword: "anaheim ca housing market july 2026",
        averageMonthlySearches: "no range shown",
        threeMonthChange: null,
        yearOverYearChange: null,
        competition: "no range shown",
        topOfPageBidLow: null,
        topOfPageBidHigh: null
      },
      {
        keyword: "anaheim condos market",
        averageMonthlySearches: "no range shown",
        threeMonthChange: null,
        yearOverYearChange: null,
        competition: "no range shown",
        topOfPageBidLow: null,
        topOfPageBidHigh: null
      },
      {
        keyword: "anaheim home prices",
        averageMonthlySearches: "10-100",
        threeMonthChange: "0%",
        yearOverYearChange: "0%",
        competition: "Low",
        topOfPageBidLow: "$0.93",
        topOfPageBidHigh: "$8.00"
      },
      {
        keyword: "anaheim homes for sale inventory",
        averageMonthlySearches: "no range shown",
        threeMonthChange: null,
        yearOverYearChange: null,
        competition: "no range shown",
        topOfPageBidLow: null,
        topOfPageBidHigh: null
      },
      {
        keyword: "anaheim housing market",
        averageMonthlySearches: "10-100",
        threeMonthChange: "0%",
        yearOverYearChange: "0%",
        competition: "Low",
        topOfPageBidLow: null,
        topOfPageBidHigh: null
      },
      {
        keyword: "anaheim housing market 2026",
        averageMonthlySearches: "no range shown",
        threeMonthChange: null,
        yearOverYearChange: null,
        competition: "no range shown",
        topOfPageBidLow: null,
        topOfPageBidHigh: null
      },
      {
        keyword: "anaheim median home price",
        averageMonthlySearches: "10-100",
        threeMonthChange: "0%",
        yearOverYearChange: "0%",
        competition: "Low",
        topOfPageBidLow: null,
        topOfPageBidHigh: null
      },
      {
        keyword: "anaheim real estate market update",
        averageMonthlySearches: "no range shown",
        threeMonthChange: null,
        yearOverYearChange: null,
        competition: "no range shown",
        topOfPageBidLow: null,
        topOfPageBidHigh: null
      },
      {
        keyword: "are home prices dropping in anaheim",
        averageMonthlySearches: "no range shown",
        threeMonthChange: null,
        yearOverYearChange: null,
        competition: "no range shown",
        topOfPageBidLow: null,
        topOfPageBidHigh: null
      },
      {
        keyword: "is anaheim a buyer market",
        averageMonthlySearches: "no range shown",
        threeMonthChange: null,
        yearOverYearChange: null,
        competition: "no range shown",
        topOfPageBidLow: null,
        topOfPageBidHigh: null
      }
    ],
    keywordIdeasStatus: "Keyword Ideas tab showed no suggestions found for the saved Anaheim keyword plan."
  }
};

const southBayBuyerRouteManifest = [
  {
    routeSlug: "carson",
    comparisonSlugs: ["torrance", "gardena"],
    localGuideSlug: "carson-area-guide",
    localRiskText: "freeway access, industrial-adjacent pockets, commute routes, school boundaries, older systems, and property condition",
    locationSpecificFindings: [
      "Carson buyers should compare freeway access, industrial-adjacent context, school-boundary fit, and property condition by address.",
      "Nearby Torrance and Gardena can be useful substitutes when comparing payment, commute, and home type."
    ]
  },
  {
    routeSlug: "el-segundo",
    comparisonSlugs: ["manhattan-beach", "hawthorne"],
    localGuideSlug: "el-segundo-area-guide",
    localRiskText: "airport and aerospace-adjacent context, lot size, older systems, school-boundary fit, commute value, and coastal-adjacent price pressure",
    locationSpecificFindings: [
      "El Segundo buyers should verify airport context, commute needs, school-boundary assumptions, and property condition by address.",
      "Manhattan Beach and Hawthorne are useful nearby comparisons because the tradeoff can shift between beach proximity, payment, lot, and commute."
    ]
  },
  {
    routeSlug: "gardena",
    comparisonSlugs: ["torrance", "hawthorne"],
    localGuideSlug: "",
    localRiskText: "freeway access, older housing stock, industrial-adjacent pockets, commute tradeoffs, lot utility, and condition",
    locationSpecificFindings: [
      "Gardena buyers should verify commute routes, freeway proximity, property condition, and neighborhood context by address.",
      "Torrance and Hawthorne are useful substitute areas when comparing payment, inventory, and daily-life fit."
    ]
  },
  {
    routeSlug: "hawthorne",
    comparisonSlugs: ["el-segundo", "gardena"],
    localGuideSlug: "hawthorne-area-guide",
    localRiskText: "airport and aerospace-adjacent context, freeway access, school-boundary fit, older systems, and property condition",
    locationSpecificFindings: [
      "Hawthorne buyers should verify airport context, freeway access, school-boundary assumptions, and property condition by address.",
      "El Segundo and Gardena are useful comparisons when payment, commute, and property type pull in different directions."
    ]
  },
  {
    routeSlug: "hermosa-beach",
    comparisonSlugs: ["manhattan-beach", "redondo-beach"],
    localGuideSlug: "hermosa-beach-area-guide",
    localRiskText: "beach proximity, parking, lot size, older coastal systems, walkability, noise, and condo or HOA structure",
    locationSpecificFindings: [
      "Hermosa Beach buyers should verify parking, coastal exposure, older systems, noise, and property condition by address.",
      "Manhattan Beach and Redondo Beach are key substitutes because the payment and lifestyle tradeoff can change block by block."
    ]
  },
  {
    routeSlug: "inglewood",
    comparisonSlugs: ["hawthorne", "el-segundo"],
    localGuideSlug: "",
    localRiskText: "stadium and airport-adjacent context, freeway access, parking, older systems, zoning context, and commute needs",
    locationSpecificFindings: [
      "Inglewood buyers should verify airport/stadium-area context, parking, commute routes, property condition, and zoning context by address.",
      "Hawthorne and El Segundo are useful nearby comparisons when commute and payment matter more than city label."
    ]
  },
  {
    routeSlug: "lawndale",
    comparisonSlugs: ["hawthorne", "redondo-beach"],
    localGuideSlug: "",
    localRiskText: "freeway access, smaller-lot tradeoffs, older systems, school-boundary fit, commute routes, and nearby beach-city substitution",
    locationSpecificFindings: [
      "Lawndale buyers should verify freeway proximity, property condition, school-boundary assumptions, and nearby substitute inventory.",
      "Hawthorne and Redondo Beach are useful comparisons because payment and access tradeoffs can move quickly."
    ]
  },
  {
    routeSlug: "lomita",
    comparisonSlugs: ["torrance", "rancho-palos-verdes"],
    localGuideSlug: "lomita-area-guide",
    localRiskText: "small-city inventory, lot utility, older systems, hillside-adjacent context, commute routes, and nearby Torrance or Palos Verdes alternatives",
    locationSpecificFindings: [
      "Lomita buyers should treat small-sample market data carefully and verify lot, condition, commute, and nearby alternatives by address.",
      "Torrance and Rancho Palos Verdes can be useful substitutes when comparing payment, space, and daily-life fit."
    ]
  },
  {
    routeSlug: "manhattan-beach",
    comparisonSlugs: ["hermosa-beach", "el-segundo"],
    localGuideSlug: "manhattan-beach-area-guide",
    localRiskText: "section-by-section price differences, lot size, parking, beach proximity, older systems, school-boundary expectations, and remodel potential",
    locationSpecificFindings: [
      "Manhattan Beach buyers should compare Sand, Tree, and Hill Section tradeoffs, lot utility, parking, condition, and school-boundary expectations.",
      "Hermosa Beach and El Segundo are useful nearby comparisons when payment, lot, and lifestyle priorities compete."
    ]
  },
  {
    routeSlug: "palos-verdes-estates",
    comparisonSlugs: ["rancho-palos-verdes", "rolling-hills-estates"],
    localGuideSlug: "palos-verdes-area-guide",
    localRiskText: "hillside context, view premiums, fire and insurance questions, geologic or drainage conditions, lot utility, and private-road or HOA-style constraints where applicable",
    locationSpecificFindings: [
      "Palos Verdes Estates buyers should verify hillside, drainage, seismic, fire, insurance, view, and property-condition questions by address.",
      "Rancho Palos Verdes and Rolling Hills Estates are useful comparisons when view, lot, commute, and payment priorities compete."
    ]
  },
  {
    routeSlug: "rancho-palos-verdes",
    comparisonSlugs: ["palos-verdes-estates", "rolling-hills-estates"],
    localGuideSlug: "palos-verdes-area-guide",
    localRiskText: "hillside and coastal exposure, geologic conditions, fire and insurance questions, view premiums, lot utility, and commute routes",
    locationSpecificFindings: [
      "Rancho Palos Verdes buyers should verify hillside, coastal, geologic, fire, insurance, drainage, and property-condition questions by address.",
      "Palos Verdes Estates and Rolling Hills Estates are useful comparisons when view, lot, commute, and payment priorities compete."
    ]
  },
  {
    routeSlug: "redondo-beach",
    comparisonSlugs: ["90277", "90278"],
    localGuideSlug: "redondo-beach-area-guide",
    localRiskText: "lot, view, walkability, parking, school-boundary expectations, HOA structure, coastal exposure, and condition",
    locationSpecificFindings: [
      "Redondo Beach buyers should verify city jurisdiction, school boundary, permits, residential building report, coastal exposure, parking, and HOA questions by address.",
      "The 90277 and 90278 ZIPs are useful comparisons because inventory and product mix can differ within the city."
    ]
  },
  {
    routeSlug: "rolling-hills",
    comparisonSlugs: ["palos-verdes-estates", "rancho-palos-verdes"],
    localGuideSlug: "palos-verdes-area-guide",
    localRiskText: "very thin transaction samples, estate-property uniqueness, gated or private-road context, hillside conditions, equestrian or lot utility, fire and insurance questions, and geologic review",
    locationSpecificFindings: [
      "Rolling Hills buyers should treat citywide metrics as directional because transaction volume is very thin.",
      "Address-level review of private-road context, lot utility, hillside conditions, fire, insurance, geologic, and property-condition questions is a major verification step."
    ]
  },
  {
    routeSlug: "rolling-hills-estates",
    comparisonSlugs: ["rancho-palos-verdes", "palos-verdes-estates"],
    localGuideSlug: "palos-verdes-area-guide",
    localRiskText: "hillside context, equestrian or open-space adjacency, lot utility, school-boundary assumptions, fire and insurance questions, and property condition",
    locationSpecificFindings: [
      "Rolling Hills Estates buyers should verify hillside, fire, insurance, school-boundary, lot-utility, and property-condition questions by address.",
      "Rancho Palos Verdes and Palos Verdes Estates are useful comparisons when payment, lot, view, and commute priorities compete."
    ]
  },
  {
    routeSlug: "torrance",
    comparisonSlugs: ["redondo-beach", "gardena"],
    localGuideSlug: "torrance-area-guide",
    localRiskText: "school-boundary fit, airport or industrial-adjacent pockets, freeway access, older systems, lot utility, and neighborhood-specific demand",
    locationSpecificFindings: [
      "Torrance buyers should verify school-boundary assumptions, airport or industrial-adjacent context, condition, permits, and commute routes by address.",
      "Redondo Beach and Gardena are useful comparisons when payment, school fit, commute, and home type pull in different directions."
    ]
  }
];

const homebotWidgetConfigs = {
  buyer: {
    elementId: "homebot_homeowner",
    token: "a8e0f93dd18e22e9dd00bc9529f23fdc8c86994474601476",
    mode: "buyers-mode"
  },
  seller: {
    elementId: "homebot_homeowner",
    token: "a8e0f93dd18e22e9dd00bc9529f23fdc8c86994474601476",
    mode: ""
  }
};

const pulseCtaConfigs = {
  buyer: {
    articleOffer: "Send me the buyer kit",
    heroTitle: "Get the buyer guide for this market",
    heroIntro: "Use the guide plus a simple timing checklist to decide whether to tour, wait, negotiate, or get pre-approved before prices move again.",
    railLabel: "Buyer market kit",
    railTitle: "Buying in this market? Start here.",
    railIntro: "Get the buyer guide and a quick market-timing checklist before you spend weekends chasing listings.",
    railButton: "Get the buyer kit",
    railSecondary: "Already found a home? Pressure-test the offer",
    modalLabel: "Buyer market timing kit",
    modalTitle: "Still deciding what this market means for you?",
    modalIntro: "I'll send the buyer guide plus a quick checklist for reading inventory, days on market, payment pressure, and offer risk.",
    modalSubmit: "Send me the buyer kit",
    supportLabel: "Two useful next steps",
    supportLinks: [
      {
        href: "buy/how-to-write-a-strong-offer-without-waiving-every-protection/",
        title: "Build a stronger offer",
        text: "Compare price, terms, and protections before making the offer feel cleaner."
      },
      {
        href: "buy/inspection-contingencies-what-local-buyers-should-and-shouldn-t-give-up/",
        title: "Protect the inspection window",
        text: "Know what to verify before shortening or giving up protection."
      }
    ]
  },
  seller: {
    articleOffer: "Pressure-test my sale plan",
    heroTitle: "Pressure-test price, prep, and timing before you launch",
    heroIntro: "Use the current market signals to decide whether the sale needs sharper pricing, better prep, cleaner timing, or stronger proof before buyers judge it.",
    railLabel: "Seller market read",
    railTitle: "Pressure-test your sale plan before the market does.",
    railIntro: "Get a private read on launch price, prep, timing, showing strategy, and likely buyer objections before the listing goes public.",
    railButton: "Start my seller check",
    modalLabel: "Private seller question",
    modalTitle: "Pressure-test my sale plan",
    modalIntro: "Share the property, likely timing, condition, and price range. Use the next step to add prep questions, buyer objections, timing pressure, or net-proceeds concerns.",
    modalSubmit: "Pressure-test my sale plan",
    supportLabel: "Two useful next steps",
    supportLinks: [
      getResourceLink("sellPrepPricing", {
        title: "Review the seller prep and pricing guide",
        text: "Use the seller hub to compare price, prep, timing, and launch pressure before going public."
      }),
      {
        href: "sell/how-to-compare-net-proceeds-before-spending-money-on-repairs/",
        title: "Check net proceeds first",
        text: "Compare repair spend against likely sale impact before committing cash."
      }
    ]
  },
  investor: {
    articleOffer: "Pressure-test the deal",
    railLabel: "Due diligence next step",
    railTitle: "Pressure-test the deal before you model returns.",
    railIntro: "Get a private due-diligence read on liquidity, property type, local rules, and the market signal before making assumptions.",
    railButton: "Start my deal check",
    modalLabel: "Private due-diligence question",
    modalTitle: "Pressure-test the deal",
    modalIntro: "Share the location, property type, hold strategy, and the assumption you want stress-tested. Use the next step to add local rule or rent questions.",
    modalSubmit: "Pressure-test the deal",
    supportLabel: "Two useful next steps",
    supportLinks: [
      {
        href: "invest/#article-library",
        title: "Review investment due diligence",
        text: "Compare rent, repairs, tenant risk, rules, and exit path before underwriting."
      },
      {
        href: "market-trends/",
        title: "Open the market dashboards",
        text: "Use live local charts before trusting a thin sample."
      }
    ]
  }
};

const sellerMetricPromiseBySignal = {
  choicePressure: {
    title: "More choice means your launch has to prove its price.",
    summary: "Buyers have more alternatives, so the sale plan should make price, condition, access, and showing strategy feel obvious before the listing starts collecting days.",
    button: "Pressure-test my launch plan"
  },
  demandCooling: {
    title: "Buyer hesitation makes the first two weeks matter more.",
    summary: "When demand signals cool, sellers need a clearer launch story: the right price lane, the right prep, and fewer unanswered objections.",
    button: "Pressure-test my timing"
  },
  priceSoftening: {
    title: "Price the story before buyers price the discount.",
    summary: "Softening price signals do not automatically mean panic, but they do mean the list price needs stronger proof from recent comps, condition, and buyer alternatives.",
    button: "Pressure-test my price"
  },
  fastMarket: {
    title: "Use the leverage without letting price do all the work.",
    summary: "A faster or tighter market can help sellers, but overpricing can still create stale days if the home does not match what buyers are seeing nearby.",
    button: "Pressure-test my pricing lane"
  },
  priceStrength: {
    title: "Strong price signals still need a clean launch plan.",
    summary: "Higher price pressure can create opportunity, but the plan still has to defend the number with prep, comps, timing, and buyer-confidence details.",
    button: "Pressure-test my sale plan"
  },
  balanced: {
    title: "Pressure-test price, prep, and timing before the market does.",
    summary: "Mixed market signals make the private plan more important than the public guess: price, prep, timing, access, and next-step pressure should be aligned before launch.",
    button: "Pressure-test my sale plan"
  }
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeJsString(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function pulseCtaForAvatar(avatar, context = {}) {
  const base = pulseCtaConfigs[avatar] || pulseCtaConfigs.buyer;
  if (avatar !== "seller") return base;
  return sellerCtaForMarket(base, context);
}

function listText(items, fallback = "nearby alternatives") {
  const values = (items || []).filter(Boolean);
  if (!values.length) return fallback;
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function guideSlugForArticle(article, route) {
  if (article.localGuideSlug) return article.localGuideSlug;
  if (route.slug.includes("palos-verdes") || route.slug.includes("rolling-hills")) return "palos-verdes-area-guide";
  return "";
}

function localAreaGuideHref(article, route, depth) {
  const guideSlug = guideSlugForArticle(article, route);
  if (guideSlug) return `${depth}local-areas/${guideSlug}/`;
  return `${depth}local-areas/?q=${encodeURIComponent(route.name)}#article-library`;
}

function localAreaGuideTitle(article, route) {
  return guideSlugForArticle(article, route)
    ? `Review the ${route.name} area guide`
    : `Search local area guidance for ${route.name}`;
}

function countySourceForRoute(route) {
  return route.county === "Orange"
    ? { key: "orangeCountyAssessor", ...sourceBank.orangeCountyAssessor }
    : { key: "laCountyAssessor", ...sourceBank.laCountyAssessor };
}

function areaContextForRoute(route) {
  const region = [route.subregion, route.regionGroup].filter(Boolean).join(" in ");
  const lowerSearch = String(route.searchText || `${route.name} ${route.subregion || ""} ${route.regionGroup || ""}`).toLowerCase();
  const isCoastal =
    /coastal|beach|harbor|avalon|malibu|newport|seal beach|huntington beach|santa monica|redondo|hermosa|manhattan/.test(lowerSearch);
  const isHillside =
    /foothill|palos verdes|rolling hills|brea|la habra heights|malibu|yorba linda/.test(lowerSearch);
  const isUrban =
    /central|downtown|commerce|vernon|west hollywood|beverly hills|culver city|santa monica/.test(lowerSearch);
  const isGateway =
    /gateway|harbor|freeway|bellflower|cerritos|downey|lakewood|norwalk|whittier|compton|lynwood|south gate/.test(lowerSearch);

  const risks = [
    "property type",
    "condition",
    "commute routes",
    "school-boundary assumptions",
    "insurance",
    "permit history",
    "neighborhood-level fit"
  ];
  if (isCoastal) risks.unshift("coastal exposure", "parking");
  if (isHillside) risks.unshift("hillside conditions", "fire and insurance questions");
  if (isUrban) risks.unshift("parking", "noise or mixed-use adjacency");
  if (isGateway) risks.unshift("freeway access", "industrial-adjacent pockets");

  const localRiskText = [...new Set(risks)].join(", ");
  const findings = [
    `${route.name} buyers should verify ${localRiskText} by address before using citywide market data to shape an offer.`,
    region
      ? `${route.name} sits within ${region}, so nearby substitute areas can matter when payment, commute, property type, and daily-life fit pull in different directions.`
      : `${route.name} should be compared with nearby substitute areas when payment, commute, property type, and daily-life fit pull in different directions.`
  ];
  if (isCoastal) findings.push("Coastal and beach-adjacent searches should treat parking, flood map, insurance, salt-air condition, and walkability tradeoffs as address-level questions.");
  if (isHillside) findings.push("Hillside and foothill searches should treat drainage, slope, access, fire, insurance, and geologic overlays as address-level due-diligence flags.");
  if (isUrban) findings.push("Urban and mixed-use searches should verify noise, parking, HOA rules where applicable, zoning context, and commute pattern before writing aggressively.");
  if (isGateway) findings.push("Gateway-city searches should compare freeway access, industrial adjacency, older systems, commute value, and nearby city alternatives before assuming a lower price is a better value.");

  return {
    localRiskText,
    locationSpecificFindings: findings
  };
}

function comparisonSlugsForRoute(route, routes) {
  const sameSubregion = routes.filter((candidate) => {
    return candidate.kind === "city" && candidate.slug !== route.slug && candidate.subregion === route.subregion;
  });
  const sameCounty = routes.filter((candidate) => {
    return candidate.kind === "city" && candidate.slug !== route.slug && candidate.county === route.county;
  });
  return [...sameSubregion, ...sameCounty]
    .filter((candidate, index, list) => list.findIndex((item) => item.slug === candidate.slug) === index)
    .slice(0, 2)
    .map((candidate) => candidate.slug);
}

function derivedBuyerManifest(route, routes) {
  const context = areaContextForRoute(route);
  return {
    routeSlug: route.slug,
    comparisonSlugs: comparisonSlugsForRoute(route, routes),
    localGuideSlug: "",
    ...context
  };
}

function buildBuyerPulseArticle(route, manifest, priority) {
  const name = route.name;
  const relatedTopicIds = [...buyerRelatedTopicIds];
  if (manifest.localGuideSlug) relatedTopicIds.push(`local-${manifest.localGuideSlug}`);
  return {
    routeSlug: route.slug,
    comparisonSlugs: manifest.comparisonSlugs || [],
    internalReaderAvatar: "buyer",
    publicAngle: `What to watch before writing an offer in ${name}`,
    title: `${name} Housing Market Update: What to Watch Before You Write an Offer`,
    seoTitle: `${name} Housing Market Update Before You Offer`,
    summary: `Use ${name} inventory, pace, pricing, and due-diligence signals before deciding how quickly and how firmly to write an offer.`,
    quickAnswer:
      `${name} should be read through inventory, pending demand, days on market, and property-specific risk together. The citywide data can orient your offer posture, but it cannot tell you what one address is worth or which protections are safe to shorten.`,
    leadParagraph:
      `The useful question in ${name} is not simply whether prices are up or down. The better question is whether the home in front of you is worth moving quickly for, or whether the current inventory, days on market, and payment pressure give you room to slow down and verify the details.`,
    heroCaption: "Read the local market signal before one listing pulls the whole decision out of context.",
    stage: "Decision",
    priority,
    localGuideSlug: manifest.localGuideSlug || "",
    localRiskText: manifest.localRiskText || "property type, condition, commute, school-boundary assumptions, insurance, permits, and neighborhood-level fit",
    locationSpecificFindings: manifest.locationSpecificFindings || [],
    researchFocus: [
      "current inventory choice",
      "pending sales as urgency signal",
      "days-on-market leverage",
      "sale-to-list and price-per-square-foot context where available",
      "nearby substitute areas or ZIPs",
      "inspection, appraisal, school-boundary, flood, seismic, insurance, permit, and HOA checks"
    ],
    sourceKeys: buyerSourceKeys,
    relatedTopicIds
  };
}

function buildSellerPulseArticle(route, manifest, priority) {
  const name = route.name;
  const relatedTopicIds = [...sellerRelatedTopicIds];
  if (manifest.localGuideSlug) relatedTopicIds.push(`local-${manifest.localGuideSlug}`);
  const comparisonLabels = (manifest.comparisonSlugs || [])
    .map((slug) => toTitleCase(slug).replace(/\bZip\b/g, "ZIP"))
    .slice(0, 3);
  const localRiskText =
    manifest.localRiskText ||
    "property type, condition, access, buyer financing, school-boundary assumptions, insurance, permits, and neighborhood-level fit";
  const comparisonFinding = comparisonLabels.length
    ? `${listText(comparisonLabels)} can be useful competition checks because buyers may compare price, condition, payment, commute, and lifestyle fit across nearby alternatives.`
    : "Nearby substitute inventory should be reviewed before choosing a launch price or prep plan.";

  return {
    routeSlug: route.slug,
    comparisonSlugs: manifest.comparisonSlugs || [],
    internalReaderAvatar: "seller",
    publicAngle: `What to watch before pricing a ${name} sale`,
    title: `${name} Housing Market Update: Price, Prep, and Timing Before You List`,
    seoTitle: `${name} Housing Market Update Before You List`,
    summary: `Use ${name} inventory, pending demand, days on market, and price-proof signals before choosing launch price, prep, and timing.`,
    quickAnswer:
      `${name} should be read through active competition, pending demand, days on market, months supply, and recent price proof together. The citywide data can orient a sale plan, but it cannot decide what one property should list for or which prep is worth doing.`,
    leadParagraph:
      `The useful question in ${name} is not whether every sale has leverage. The better question is whether your specific home can defend its price against current inventory, buyer payment pressure, days on market, and nearby alternatives.`,
    heroCaption: "Read the local market signal before one pricing decision sets the whole launch in motion.",
    stage: "Pricing",
    priority,
    localGuideSlug: manifest.localGuideSlug || "",
    localRiskText,
    locationSpecificFindings: [
      `${name} owners preparing to sell should verify ${localRiskText} by address before choosing a public price, prep spend, or launch timeline.`,
      comparisonFinding,
      ...(manifest.locationSpecificFindings || [])
        .slice(0, 1)
        .map((finding) => finding.replace(/\bbuyers\b/gi, "owners preparing to sell").replace(/\bbuyer\b/gi, "seller"))
    ],
    researchFocus: [
      "active inventory competition",
      "new listing pressure",
      "pending sales as a leading demand signal",
      "closed sales as lagging proof",
      "days active in MLS",
      "percent of original or list price received where available",
      "pricing confidence and pricing risk",
      "likely buyer objections by property type and location",
      "condition, staging, timing, and pricing implications",
      "nearby substitute areas or ZIPs",
      "what to verify before choosing a list price",
      "macro pressure from mortgage rates, affordability, and buyer confidence when relevant"
    ],
    sourceKeys: sellerSourceKeys,
    relatedTopicIds
  };
}

function latestMarketPeriod(metricSummaries = []) {
  const preferred = ["activeInventory", "pendingSales", "closedSales", "medianSalePrice", "monthsSupply"];
  for (const key of preferred) {
    const metric = metricByKey(metricSummaries, key);
    if (metric?.latestPeriod) return metric.latestPeriod;
  }
  return metricSummaries.find((metric) => metric.latestPeriod)?.latestPeriod || "Latest local data";
}

function sourceDataPeriod(metricSummaries = []) {
  return latestMarketPeriod(metricSummaries);
}

function roundedMetricValue(metric, digits = 0) {
  if (!Number.isFinite(Number(metric?.latestValue))) return "";
  return numberValue(metric.latestValue, digits);
}

function hasMetricValue(metric) {
  return !!metric && !metric.missing && Number.isFinite(Number(metric.latestValue));
}

function titleTagFor(city, period) {
  const preferred = `${city} Housing Market Update: ${period}`;
  if (preferred.length <= 60) return preferred;
  const compact = `${city} Housing Market: ${period} Update`;
  if (compact.length <= 60) return compact;
  return `${city} Real Estate Market: ${period}`;
}

function metaDescriptionFor(text, fallback) {
  if (text.length <= 155) return text;
  if (fallback.length <= 155) return fallback;
  return `${fallback.slice(0, 152).replace(/\s+\S*$/, "")}...`;
}

function keywordPlannerFindingsFor(route, avatar = "buyer") {
  const avatarSpecific = keywordPlannerFindingsBySlug[`${route.slug}__${avatar}`];
  if (avatarSpecific) return avatarSpecific;
  const legacy = keywordPlannerFindingsBySlug[route.slug];
  if (!legacy) return null;
  return !legacy.intent || legacy.intent === avatar ? legacy : null;
}

function buyerKeywordPlan(route, metricSummaries = []) {
  const city = route.name;
  const period = publicReportPeriod;
  const dataPeriod = sourceDataPeriod(metricSummaries);
  const keywordPlannerFindings = keywordPlannerFindingsFor(route, "buyer");
  const activeInventory = metricByKey(metricSummaries, "activeInventory");
  const pendingSales = metricByKey(metricSummaries, "pendingSales");
  const closedSales = metricByKey(metricSummaries, "closedSales");
  const monthsSupply = metricByKey(metricSummaries, "monthsSupply");
  const medianDays = metricByKey(metricSummaries, "medianDaysOnMarket");
  const medianPrice = metricByKey(metricSummaries, "medianSalePrice");
  const ppsf = metricByKey(metricSummaries, "averagePpsf");
  const activeCount = roundedMetricValue(activeInventory);
  const pendingCount = roundedMetricValue(pendingSales);
  const dayCount = roundedMetricValue(medianDays);
  const supplyCount = roundedMetricValue(monthsSupply, 1);
  const thinSample = Number(closedSales.latestValue || 0) < 8 || Number(pendingSales.latestValue || 0) < 5;
  const inventoryUp = Number(activeInventory.monthChangePercent || 0) > 2.5 || activeInventory.threeMonthDirection === "rising";
  const pendingDown = Number(pendingSales.monthChangePercent || 0) < -8 || Number(pendingSales.yearChangePercent || 0) < -10;
  const daysLonger = Number(medianDays.monthChangePercent || 0) > 8 || Number(medianDays.yearChangePercent || 0) > 15;
  const supplyHigher = Number(monthsSupply.monthChangePercent || 0) > 6 || monthsSupply.threeMonthDirection === "rising";
  const ppsfSoftening = Number(ppsf.monthChangePercent || 0) < -3 || Number(ppsf.yearChangePercent || 0) < -3;
  const pricePressure = Number(medianPrice.yearChangePercent || 0) > 3 || Number(ppsf.yearChangePercent || 0) > 3;

  let headline;
  let primaryQuestion;
  let angle;
  let marketMeaning;
  let takeawaySentence;

  if (thinSample) {
    headline = `${city} Buyers Need a Careful ${period} Market Read`;
    primaryQuestion = `Can buyers trust the ${city} housing market data in ${period}?`;
    angle = "thin sample confidence";
    marketMeaning = "thin MLS sample";
    takeawaySentence = "Use the data as orientation, then verify comps, condition, and risk by address.";
  } else if (activeCount && pendingDown) {
    headline = `${city} Buyers Gain More Room in ${period}`;
    primaryQuestion = `Is ${city} getting easier for buyers in ${period}?`;
    angle = "inventory choice versus pending demand";
    marketMeaning = "inventory outpacing pending activity";
    takeawaySentence = "Buyers may have more room, but strong homes still need fast review.";
  } else if (dayCount && (daysLonger || supplyHigher)) {
    headline = `${city} Buyers See More Time to Compare in ${period}`;
    primaryQuestion = `Can ${city} buyers negotiate more in ${period}?`;
    angle = "days-on-market leverage";
    marketMeaning = "longer market times";
    takeawaySentence = "Longer market time can help, but only if the listing history supports it.";
  } else if (supplyCount && Number(monthsSupply.latestValue || 0) >= 3) {
    headline = `${city} Buyers See More Balance in ${period}`;
    primaryQuestion = `What does ${supplyCount} months of supply mean for ${city} buyers?`;
    angle = "supply balance";
    marketMeaning = "more balanced supply";
    takeawaySentence = "Supply is more balanced, but price, condition, and location still decide leverage.";
  } else if (ppsfSoftening) {
    headline = `${city} Price Signals Soften in ${period}`;
    primaryQuestion = `Are ${city} home prices softening for buyers in ${period}?`;
    angle = "price signal softening";
    marketMeaning = "softer price signals";
    takeawaySentence = "Price signals look softer, but property mix can distort the read.";
  } else if (pricePressure && activeCount) {
    headline = `${city} Buyers Still Face Price Pressure in ${period}`;
    primaryQuestion = `Are ${city} prices still pressuring buyers in ${period}?`;
    angle = "price pressure versus inventory choice";
    marketMeaning = "price pressure";
    takeawaySentence = "Prices still pressure offers, so compare payment, condition, and alternatives.";
  } else if (inventoryUp && activeCount) {
    headline = `${city} Buyers Get More Listings to Compare in ${period}`;
    primaryQuestion = `Do ${city} buyers have more choice in ${period}?`;
    angle = "more choice with property-level verification";
    marketMeaning = "more inventory";
    takeawaySentence = "Buyers have more choice, but clean homes can still move quickly.";
  } else if (activeCount && pendingCount) {
    headline = `${city} Housing Market Shows Mixed Buyer Signals in ${period}`;
    primaryQuestion = `What should buyers know about the ${city} housing market in ${period}?`;
    angle = "inventory and pending-sales read";
    marketMeaning = "mixed inventory and demand";
    takeawaySentence = "The market is mixed, so compare the home against current alternatives before deciding speed.";
  } else {
    headline = `${city} Housing Market Update for ${period}`;
    primaryQuestion = `What should ${city} buyers watch before making an offer in ${period}?`;
    angle = "buyer offer timing";
    marketMeaning = "mixed buyer conditions";
    takeawaySentence = "Use the market as a starting point, then verify the property-level facts.";
  }

  const seoTitle = titleTagFor(city, period);
  const primaryKeyword = `${city} housing market update`;
  const activePhrase = hasMetricValue(activeInventory)
    ? `${formatMetricValue(activeInventory)} single-family listings`
    : "the latest single-family inventory";
  const pendingPhrase = hasMetricValue(pendingSales)
    ? `${formatMetricValue(pendingSales)} pending sales`
    : "current pending-sales activity";
  const subheader = metaDescriptionFor(
    `${period} ${city} housing report uses latest completed ${dataPeriod} MLS data: ${activePhrase}, ${pendingPhrase}. ${takeawaySentence}`,
    `${city} housing market update for ${period}: ${takeawaySentence}`
  );
  const quickSummaryBullets = [
    `${period} report: the latest completed ${dataPeriod} CRMLS / InfoSparks slice shows ${hasMetricValue(activeInventory) ? `${formatMetricValue(activeInventory)} active single-family listings` : "current inventory needs verification"}.`,
    `Demand signal: ${hasMetricValue(pendingSales) ? `${formatMetricValue(pendingSales)} pending sales` : "pending-sales data needs verification"} and ${hasMetricValue(closedSales) ? `${formatMetricValue(closedSales)} closed sales` : "closed-sales data needs verification"} help separate current demand from lagging proof.`,
    `Practical read: ${takeawaySentence}`
  ];
  const seedQueries = [
    `${city} housing market`,
    `${city} real estate market update`,
    `${city} home prices ${period}`,
    `are home prices dropping in ${city}`,
    `${city} homes for sale inventory`,
    `is ${city} a buyer's market`,
    `${city} condos market`,
    `${city} CA housing market ${period}`,
    `${city} housing market 2026`,
    `${city} housing market buyers`,
    `${city} housing market forecast`,
    `${city} median home price`,
    `${city} real estate market ${period}`,
    `how competitive is the ${city} housing market`
  ];
  const secondaryKeywords = [
    `${city} real estate market update`,
    `${city} home prices`,
    `is ${city} a buyer's market`,
    `${city} homes for sale inventory`,
    `${city} housing market ${period}`
  ];
  const autocompletePrompts = [
    `${city} housing market`,
    `${city} home prices`,
    `${city} real estate`,
    `is ${city}`,
    `${city} housing market 2026`,
    `${city} housing market buyers`,
    `${city} housing market forecast`
  ];
  const peopleAlsoAskTargets = [
    `Are ${city} home prices going down?`,
    `Is ${city} a good place to buy a house?`,
    `Is it a buyer's market in ${city}?`,
    `How competitive is the ${city} housing market?`,
    `How much inventory does ${city} have right now?`
  ];
  const contentGaps = [
    "Ranking pages often list stats without explaining what they mean for an offer.",
    "Large portals can be current but light on local buyer strategy.",
    "Most generic market pages do not connect inventory, pending sales, days on market, property type, and address-level risk.",
    "Monthly pages often miss clear guidance on what to verify before shortening protections."
  ];
  const titleBrief = {
    primaryKeyword,
    secondaryKeywords,
    searchIntent: "local informational with buyer decision support",
    titleTag: seoTitle,
    h1: headline,
    subheader,
    keyQuestionsToAnswer: peopleAlsoAskTargets,
    dataSources: ["CRMLS / InfoSparks", "Freddie Mac PMMS", "FEMA", "California Geological Survey", "county assessor records", "Census ACS"],
    internalLinks: [`/market-trends/${route.slug}/`, "/buy/how-to-use-days-on-market-and-price-reductions-before-making-an-offer/"],
    buyerTakeaway: takeawaySentence
  };
  const keywordPlannerStatus = keywordPlannerFindings
    ? `Google Keyword Planner reviewed in Chrome on ${displayDate}; volume/CPC ranges captured for ${keywordPlannerFindings.seedMetrics.length} seed terms.`
    : "Seed queries prepared; authenticated Google Ads Keyword Planner review required for this city before treating volume/CPC as complete.";

  return {
    headline,
    seoTitle,
    subheader,
    reportPeriod: period,
    dataPeriod,
    primaryQuestion,
    angle,
    marketMeaning,
    seedQueries,
    secondaryKeywords,
    autocompletePrompts,
    peopleAlsoAskTargets,
    contentGaps,
    quickSummaryBullets,
    keywordPlannerFindings,
    titleBrief,
    opportunityScore: {
      searchDemand: keywordPlannerFindings ? "Google Keyword Planner shows low-volume but relevant local demand on core market and price terms." : "manual Google Keyword Planner export required",
      businessValue: 5,
      relevance: 5,
      serpWeakness: "manual SERP audit required",
      freshnessOpportunity: 5,
      localExpertiseAdvantage: 5,
      status: "partial score until manual keyword volume, CPC, autocomplete, PAA, and SERP review are attached"
    },
    manualSeoGate: {
      required: true,
      status: "manual verification required before final keyword targeting",
      keywordPlanner: "export keyword ideas, search-volume ranges, and CPC from authenticated Google Keyword Planner; Discover New Keywords accepts up to 10 seed terms per ideas pass",
      autocomplete: "record Google autocomplete suggestions for seed terms and modifiers",
      peopleAlsoAsk: "record recurring People Also Ask questions from the primary query set",
      serpAudit: "review top 10 results for title, URL, source type, freshness, content type, intent, weakness, and manual difficulty score",
      searchConsole: "check Search Console for high-impression, low-click, and position 8-20 market-update queries when available"
    },
    keywordPlannerStatus
  };
}

function sellerKeywordPlan(route, metricSummaries = []) {
  const city = route.name;
  const period = publicReportPeriod;
  const dataPeriod = sourceDataPeriod(metricSummaries);
  const keywordPlannerFindings = keywordPlannerFindingsFor(route, "seller");
  const activeInventory = metricByKey(metricSummaries, "activeInventory");
  const newListings = metricByKey(metricSummaries, "newListings");
  const pendingSales = metricByKey(metricSummaries, "pendingSales");
  const closedSales = metricByKey(metricSummaries, "closedSales");
  const monthsSupply = metricByKey(metricSummaries, "monthsSupply");
  const medianDays = metricByKey(metricSummaries, "medianDaysOnMarket");
  const medianPrice = metricByKey(metricSummaries, "medianSalePrice");
  const ppsf = metricByKey(metricSummaries, "averagePpsf");
  const activeCount = roundedMetricValue(activeInventory);
  const pendingCount = roundedMetricValue(pendingSales);
  const closedCount = roundedMetricValue(closedSales);
  const dayCount = roundedMetricValue(medianDays);
  const supplyCount = roundedMetricValue(monthsSupply, 1);
  const thinSample = Number(closedSales.latestValue || 0) < 8 || Number(pendingSales.latestValue || 0) < 5;
  const inventoryUp =
    Number(activeInventory.monthChangePercent || 0) > 2.5 ||
    Number(activeInventory.yearChangePercent || 0) > 10 ||
    activeInventory.threeMonthDirection === "rising";
  const newListingPressure =
    Number(newListings.monthChangePercent || 0) > 8 ||
    Number(newListings.yearChangePercent || 0) > 10;
  const pendingDown =
    Number(pendingSales.monthChangePercent || 0) < -8 ||
    Number(pendingSales.yearChangePercent || 0) < -10;
  const daysLonger =
    Number(medianDays.monthChangePercent || 0) > 8 ||
    Number(medianDays.yearChangePercent || 0) > 15;
  const supplyHigher = Number(monthsSupply.monthChangePercent || 0) > 6 || monthsSupply.threeMonthDirection === "rising";
  const ppsfSoftening = Number(ppsf.monthChangePercent || 0) < -3 || Number(ppsf.yearChangePercent || 0) < -3;
  const priceSoftening = Number(medianPrice.yearChangePercent || 0) < -2.5 || ppsfSoftening;
  const priceStrength = Number(medianPrice.yearChangePercent || 0) > 3 || Number(ppsf.yearChangePercent || 0) > 3;
  const fastMarket =
    Number(monthsSupply.latestValue || 0) <= 1.5 ||
    Number(medianDays.latestValue || 999) <= 14 ||
    Number(activeInventory.yearChangePercent || 0) < -10;

  let headline;
  let primaryQuestion;
  let angle;
  let marketMeaning;
  let takeawaySentence;

  if (thinSample) {
    headline = `${city} Sellers Need a Careful ${period} Pricing Read`;
    primaryQuestion = `Can ${city} sellers trust the market data before pricing in ${period}?`;
    angle = "thin sample pricing confidence";
    marketMeaning = "thin MLS sample";
    takeawaySentence = "Use the data as orientation, then confirm recent comps, condition, and buyer objections before choosing a public number.";
  } else if ((inventoryUp || newListingPressure) && pendingDown) {
    headline = `${city} Sellers Need Sharper Pricing in ${period}`;
    primaryQuestion = `Is it getting harder to sell a home in ${city} in ${period}?`;
    angle = "inventory competition versus pending demand";
    marketMeaning = "more competition against softer current demand";
    takeawaySentence = "The sale plan needs stronger price proof, cleaner prep, and fewer unresolved buyer objections.";
  } else if (daysLonger || supplyHigher) {
    headline = `${city} Sellers Face a Longer Launch Window in ${period}`;
    primaryQuestion = `How long will it take to sell a home in ${city} in ${period}?`;
    angle = "launch window and pricing patience";
    marketMeaning = "longer market times";
    takeawaySentence = "Longer market time makes the first two weeks, showing access, and price evidence more important.";
  } else if (priceSoftening) {
    headline = `${city} Sellers Need Stronger Price Proof in ${period}`;
    primaryQuestion = `Are ${city} home prices softening for sellers in ${period}?`;
    angle = "price proof under softer signals";
    marketMeaning = "softer price signals";
    takeawaySentence = "Do not treat softer price signals as panic; treat them as a reason to defend the number with cleaner evidence.";
  } else if (priceStrength && fastMarket) {
    headline = `${city} Sellers Still Need a Defensible ${period} Launch`;
    primaryQuestion = `Do ${city} sellers still have leverage in ${period}?`;
    angle = "seller leverage with launch discipline";
    marketMeaning = "supportive but not automatic seller leverage";
    takeawaySentence = "Supportive signals can help, but overpricing still creates stale days when the home does not match nearby alternatives.";
  } else if (activeCount && pendingCount) {
    headline = `${city} Sellers Should Price the Story in ${period}`;
    primaryQuestion = `What should ${city} sellers watch before listing in ${period}?`;
    angle = "pricing story versus active competition";
    marketMeaning = "mixed seller conditions";
    takeawaySentence = "Mixed signals make the listing story matter: price, prep, access, timing, and proof need to line up.";
  } else {
    headline = `${city} Housing Market Update for Sellers in ${period}`;
    primaryQuestion = `Should I sell my house in ${city} in ${period}?`;
    angle = "seller pricing and timing";
    marketMeaning = "mixed seller conditions";
    takeawaySentence = "Use the market as a starting point, then verify the property-level facts before choosing price or prep.";
  }

  const seoTitle = titleTagFor(city, period);
  const primaryKeyword = `${city} housing market update`;
  const activePhrase = hasMetricValue(activeInventory)
    ? `${formatMetricValue(activeInventory)} active single-family listings`
    : "the latest single-family inventory";
  const pendingPhrase = hasMetricValue(pendingSales)
    ? `${formatMetricValue(pendingSales)} pending sales`
    : "current pending-sales activity";
  const subheader = metaDescriptionFor(
    `${period} ${city} housing report uses latest completed ${dataPeriod} MLS data: ${activePhrase}, ${pendingPhrase}. ${takeawaySentence}`,
    `${city} housing market update for ${period}: ${takeawaySentence}`
  );
  const quickSummaryBullets = [
    `${period} report: the latest completed ${dataPeriod} CRMLS / InfoSparks slice shows ${hasMetricValue(activeInventory) ? `${formatMetricValue(activeInventory)} active single-family listings` : "current inventory needs verification"}.`,
    `Demand signal: ${hasMetricValue(pendingSales) ? `${formatMetricValue(pendingSales)} pending sales` : "pending-sales data needs verification"} and ${hasMetricValue(closedSales) ? `${formatMetricValue(closedSales)} closed sales` : "closed-sales data needs verification"} help separate current demand from lagging proof.`,
    `Pricing read: ${takeawaySentence}`
  ];
  const seedQueries = [
    `${city} housing market`,
    `${city} real estate market update`,
    `${city} home prices ${period}`,
    `should I sell my house in ${city}`,
    `${city} home selling market`,
    `${city} homes for sale inventory`,
    `${city} days on market`,
    `${city} listing price`,
    `${city} seller market`,
    `${city} housing market 2026`,
    `${city} market update sellers`,
    `${city} median home price`,
    `are home prices dropping in ${city}`,
    `is now a good time to sell in ${city}`
  ];
  const secondaryKeywords = [
    `${city} home prices`,
    `${city} housing market update`,
    `should I sell my house in ${city}`,
    `${city} seller market`,
    `${city} homes for sale inventory`
  ];
  const autocompletePrompts = [
    `${city} housing market`,
    `${city} home prices`,
    `${city} real estate`,
    `should I sell my house in ${city}`,
    `${city} housing market 2026`,
    `${city} housing market sellers`,
    `${city} housing market forecast`
  ];
  const peopleAlsoAskTargets = [
    `Is now a good time to sell in ${city}?`,
    `Are ${city} home prices going down?`,
    `How should I price my ${city} home?`,
    `How competitive is the ${city} housing market?`,
    `How long are homes taking to sell in ${city}?`
  ];
  const contentGaps = [
    "Ranking pages often list market stats without explaining pricing risk or launch strategy.",
    "Large portals can be current but light on seller-specific prep, timing, and buyer-objection guidance.",
    "Most generic market pages do not connect inventory, pending demand, days on market, condition, access, and price proof.",
    "Monthly pages often miss a plain-English explanation of what to verify before choosing a list price."
  ];
  const titleBrief = {
    primaryKeyword,
    secondaryKeywords,
    searchIntent: "local informational with seller pricing and listing decision support",
    titleTag: seoTitle,
    h1: headline,
    subheader,
    keyQuestionsToAnswer: peopleAlsoAskTargets,
    dataSources: ["CRMLS / InfoSparks", "Freddie Mac PMMS", "FEMA", "California Geological Survey", "county assessor records", "Census ACS"],
    internalLinks: [`/market-trends/${route.slug}/`, `/${getResourceLink("sellPrepPricing").href}`, "/sell/how-to-compare-net-proceeds-before-spending-money-on-repairs/"],
    sellerTakeaway: takeawaySentence
  };
  const keywordPlannerStatus = keywordPlannerFindings
    ? `Google Keyword Planner reviewed in Chrome on ${displayDate}; volume/CPC ranges captured for ${keywordPlannerFindings.seedMetrics.length} seed terms.`
    : "Seed seller queries prepared; authenticated Google Ads Keyword Planner review required for this city before treating volume/CPC as complete.";

  return {
    headline,
    seoTitle,
    subheader,
    reportPeriod: period,
    dataPeriod,
    primaryQuestion,
    angle,
    marketMeaning,
    seedQueries,
    secondaryKeywords,
    autocompletePrompts,
    peopleAlsoAskTargets,
    contentGaps,
    quickSummaryBullets,
    keywordPlannerFindings,
    titleBrief,
    opportunityScore: {
      searchDemand: keywordPlannerFindings ? "Google Keyword Planner shows relevant local seller-market and price-query demand." : "manual Google Keyword Planner export required",
      businessValue: 5,
      relevance: 5,
      serpWeakness: "manual SERP audit required",
      freshnessOpportunity: 5,
      localExpertiseAdvantage: 5,
      status: "partial score until manual keyword volume, CPC, autocomplete, PAA, and SERP review are attached"
    },
    manualSeoGate: {
      required: true,
      status: "manual verification required before final keyword targeting",
      keywordPlanner: "export keyword ideas, search-volume ranges, and CPC from authenticated Google Keyword Planner; Discover New Keywords accepts up to 10 seed terms per ideas pass",
      autocomplete: "record Google autocomplete suggestions for seed terms and seller modifiers",
      peopleAlsoAsk: "record recurring People Also Ask questions from the primary query set",
      serpAudit: "review top 10 results for title, URL, source type, freshness, content type, intent, weakness, and manual difficulty score",
      searchConsole: "check Search Console for high-impression, low-click, and position 8-20 market-update queries when available"
    },
    keywordPlannerStatus,
    sellerSignals: {
      activeInventory: activeCount,
      pendingSales: pendingCount,
      closedSales: closedCount,
      medianDaysOnMarket: dayCount,
      monthsSupply: supplyCount,
      signal: sellerMarketSignal(metricSummaries),
      marketMeaning
    }
  };
}

function keywordPlanForArticle(article, route, metricSummaries = []) {
  return article.internalReaderAvatar === "seller"
    ? sellerKeywordPlan(route, metricSummaries)
    : buyerKeywordPlan(route, metricSummaries);
}

function articleDisplayTitle(article, route, metricSummaries = []) {
  return keywordPlanForArticle(article, route, metricSummaries).headline;
}

function buildPulseArticles(marketIndex) {
  const routes = marketIndex.locations || [];
  const routeManifestBySlug = new Map(southBayBuyerRouteManifest.map((manifest) => [manifest.routeSlug, manifest]));
  return routes
    .filter((route) => route.kind === "city")
    .map((route, index) => {
      const manifest = routeManifestBySlug.get(route.slug) || derivedBuyerManifest(route, routes);
      return requestedAvatar === "seller"
        ? buildSellerPulseArticle(route, manifest, index + 1)
        : buildBuyerPulseArticle(route, manifest, index + 1);
    });
}

function toTitleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function keywordPlannerCacheKey(route, avatar) {
  return `${route.slug}__${avatar}`;
}

function keywordPlannerRecordKey(record) {
  const slug = record.locationSlug || record.slug || record.routeSlug;
  const avatar = record.internalReaderAvatar || record.intent || record.avatar;
  if (!slug || !avatar) return "";
  return `${slug}__${avatar}`;
}

async function loadKeywordPlannerCache() {
  if (!(await pathExists(keywordPlannerCachePath))) return { loaded: 0, path: keywordPlannerCachePath };
  const cache = await readJson(keywordPlannerCachePath);
  const entries = Array.isArray(cache.entries)
    ? cache.entries
    : Object.entries(cache).map(([key, value]) => ({ key, ...value }));
  let loaded = 0;

  for (const entry of entries) {
    const key = entry.key || keywordPlannerRecordKey(entry);
    if (!key) continue;
    keywordPlannerFindingsBySlug[key] = entry;
    loaded += 1;
  }

  return { loaded, path: keywordPlannerCachePath };
}

function keywordPlannerGateIssue(route, article, keywordPlan) {
  const avatar = article.internalReaderAvatar || requestedAvatar;
  const expectedCacheKey = keywordPlannerCacheKey(route, avatar);
  const finding = keywordPlannerFindingsFor(route, avatar);
  const issues = [];

  if (!finding) {
    issues.push(`Missing Google Keyword Planner cache entry for ${expectedCacheKey}.`);
  } else {
    if (finding.tool !== "Google Keyword Planner") {
      issues.push("Keyword research tool must be exactly Google Keyword Planner.");
    }
    if (!/chrome/i.test(finding.accessMethod || "")) {
      issues.push("Keyword Planner accessMethod must confirm Chrome browser use.");
    }
    const findingAvatar = finding.internalReaderAvatar || finding.intent || finding.avatar;
    if (findingAvatar && findingAvatar !== avatar) {
      issues.push(`Keyword Planner avatar mismatch: expected ${avatar}, got ${findingAvatar}.`);
    }
    const findingSlug = finding.locationSlug || finding.slug || finding.routeSlug;
    if (findingSlug && findingSlug !== route.slug) {
      issues.push(`Keyword Planner location mismatch: expected ${route.slug}, got ${findingSlug}.`);
    }
    if (!finding.collectedAt) {
      issues.push("Keyword Planner record must include collectedAt.");
    }
    if (!Array.isArray(finding.seedMetrics) || !finding.seedMetrics.length) {
      issues.push("Keyword Planner record must include seedMetrics from the Chrome review.");
    }
    if (Array.isArray(finding.seedMetrics) && finding.seedMetrics.some((metric) => !metric.keyword)) {
      issues.push("Each Keyword Planner seedMetrics entry must include a keyword.");
    }
  }

  if (!issues.length) return null;

  return {
    slug: route.slug,
    locationName: route.name,
    internalReaderAvatar: avatar,
    expectedCacheKey,
    cachePath: path.relative(siteRoot, keywordPlannerCachePath),
    issues,
    seedQueriesForChrome: keywordPlan.seedQueries.slice(0, 10),
    requiredChromeWorkflow: [
      "Open Google Ads Keyword Planner in Chrome.",
      "Use Discover New Keywords or Get search volume and forecasts with the listed seed queries.",
      "Capture search-volume ranges, competition, CPC/top-of-page bid ranges when shown, forecast period, geo target, and network.",
      `Save the result under key ${expectedCacheKey} in housing-market-pulse/research/keyword-planner-cache.json before rerunning the generator.`
    ]
  };
}

function sourceList(article, marketData, route) {
  const localMarketSource = {
    key: "infosparks",
    label: `CRMLS / InfoSparks: ${route.name} market data export`,
    sourceType: "local market data",
    url: marketData.location?.infosparksUrl || ""
  };
  const countySource = countySourceForRoute(route);
  const sourceItems = article.sourceKeys
    .map((key) => ({ key, ...sourceBank[key] }))
    .filter((source) => source.url);
  return [localMarketSource, ...sourceItems, countySource].filter((source) => source.url);
}

function latestNumericPoints(series) {
  return (Array.isArray(series) ? series : [])
    .filter((point) => Number.isFinite(Number(point.value)))
    .map((point) => ({ ...point, value: Number(point.value) }))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function monthOffset(dateValue, offset) {
  const date = new Date(`${dateValue}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 10);
}

function percentChange(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function trendDirection(percent) {
  if (percent === null || percent === undefined) return "no data";
  if (percent > 2.5) return "rising";
  if (percent < -2.5) return "falling";
  return "mostly flat";
}

function selectedMarketSlice(marketData) {
  const category = "Residential";
  const homeType = marketData.slices?.[category]?.["Single family"] ? "Single family" : Object.keys(marketData.slices?.[category] || {})[0] || "";
  return {
    category,
    homeType,
    label: homeType ? `${category} / ${homeType}` : category,
    metrics: marketData.slices?.[category]?.[homeType]?.metrics || marketData.metrics || {}
  };
}

function summarizeMetric(marketData, key, options = {}) {
  const metricSource = options.metrics || marketData.metrics || {};
  const sliceLabel = options.sliceLabel || "root Residential market slice";
  const metric = metricSource?.[key];
  const points = latestNumericPoints(metric?.series);
  if (!metric || !points.length) {
    return {
      key,
      label: metric?.label || toTitleCase(key),
      unit: metric?.unit || "",
      missing: true,
      missingStatus: `missing or no data in ${sliceLabel}`,
      sourceFile: `market-trends/data/${marketData.location?.name ? slugify(marketData.location.name) : "unknown"}.json`,
      sourceDate: marketData.location?.dataFrom || marketData.location?.additionalDataFrom || ""
    };
  }

  const latest = points.at(-1);
  const previous = points.at(-2);
  const yoyDate = monthOffset(latest.date, -12);
  const yearAgo = points.find((point) => point.date === yoyDate);
  const threeMonthAgoDate = monthOffset(latest.date, -3);
  const threeMonthAgo = points.find((point) => point.date === threeMonthAgoDate) || points.at(-4);
  const monthChange = previous ? latest.value - previous.value : null;
  const monthChangePercent = previous ? percentChange(latest.value, previous.value) : null;
  const yearChange = yearAgo ? latest.value - yearAgo.value : null;
  const yearChangePercent = yearAgo ? percentChange(latest.value, yearAgo.value) : null;
  const threeMonthChange = threeMonthAgo ? latest.value - threeMonthAgo.value : null;
  const threeMonthChangePercent = threeMonthAgo ? percentChange(latest.value, threeMonthAgo.value) : null;

  return {
    key,
    label: metric.label || toTitleCase(key),
    sourceMetric: metric.sourceMetric || metric.label || toTitleCase(key),
    unit: metric.unit || "",
    latestValue: latest.value,
    latestPeriod: latest.label || latest.date,
    latestDate: latest.date,
    previousMonthValue: previous?.value ?? null,
    previousMonthPeriod: previous?.label || previous?.date || "",
    monthChange,
    monthChangePercent,
    yearAgoValue: yearAgo?.value ?? null,
    yearAgoPeriod: yearAgo?.label || yearAgo?.date || "",
    yearChange,
    yearChangePercent,
    threeMonthAgoValue: threeMonthAgo?.value ?? null,
    threeMonthAgoPeriod: threeMonthAgo?.label || threeMonthAgo?.date || "",
    threeMonthChange,
    threeMonthChangePercent,
    threeMonthDirection: trendDirection(threeMonthChangePercent),
    helpsReaderDecision: helpsDecision(key),
    riskOrUncertainty: metricRisk(key),
    source: metric.source || "CRMLS / InfoSparks",
    sourceFile: `market-trends/data/${slugify(marketData.location?.name || "unknown")}.json`,
    sourceDate: metric.dataFrom || options.sourceDate || marketData.location?.additionalDataFrom || marketData.location?.dataFrom || "",
    sourceCsv: metric.sourceCsv || "",
    missing: false,
    missingStatus: ""
  };
}

function helpsDecision(key) {
  const map = {
    activeInventory: "Shows how much choice exists before deciding whether speed or patience matters more.",
    newListings: "Shows whether fresh options are expanding or shrinking.",
    pendingSales: "Acts as a current demand signal before closed sales confirm it later.",
    closedSales: "Shows liquidity, but it is a lagging signal.",
    monthsSupply: "Helps frame how balanced or tight the market feels.",
    medianDaysOnMarket: "Helps assess how quickly similar homes are moving.",
    averageDaysOnMarket: "Adds pace context when outliers may matter.",
    medianSalePrice: "Frames recent price level but does not price one property.",
    averageSalePrice: "Adds price context, especially where higher-end sales can move the average.",
    averagePpsf: "Helps compare size-adjusted pricing without replacing property-specific comps.",
    medianOriginalPrice: "Shows seller starting-price context."
  };
  return map[key] || "Use as supporting context only.";
}

function metricRisk(key) {
  const map = {
    activeInventory: "Inventory can vary sharply by pocket, property type, and price band.",
    newListings: "New supply does not prove quality or fit.",
    pendingSales: "Pending counts do not show contract terms or contingencies.",
    closedSales: "Closed sales can reflect decisions made weeks earlier.",
    monthsSupply: "Months supply can look precise even when product mix changes.",
    medianDaysOnMarket: "Small samples and unusually unique homes can distort pace.",
    averageDaysOnMarket: "A few long-running listings can stretch the average.",
    medianSalePrice: "Median price can move because the mix of homes changed.",
    averageSalePrice: "High-end outliers can move the average.",
    averagePpsf: "Price per square foot misses lot, view, condition, layout, and location differences.",
    medianOriginalPrice: "Original list price does not prove market value."
  };
  return map[key] || "Confirm property-specific context before relying on it.";
}

function currency(value) {
  if (!Number.isFinite(Number(value))) return "No data";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function numberValue(value, digits = 0) {
  if (!Number.isFinite(Number(value))) return "No data";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(Number(value));
}

function percentValue(value, digits = 1) {
  if (!Number.isFinite(Number(value))) return "No data";
  return `${Number(value).toFixed(digits)}%`;
}

function formatMetricValue(metric) {
  if (metric.missing) return "No data";
  if (metric.unit === "currency") return currency(metric.latestValue);
  if (metric.unit === "percent") {
    const pct = Math.abs(metric.latestValue) <= 2 ? metric.latestValue * 100 : metric.latestValue;
    return percentValue(pct, 1);
  }
  if (metric.key === "monthsSupply" || metric.key === "averagePpsf") return numberValue(metric.latestValue, 1);
  return numberValue(metric.latestValue, 0);
}

function formatChange(metric, field = "monthChangePercent") {
  const value = metric[field];
  if (value === null || value === undefined) return "no prior signal";
  const direction = value > 0 ? "up" : value < 0 ? "down" : "flat";
  return `${direction} ${Math.abs(value).toFixed(1)}%`;
}

function metricByKey(metrics, key) {
  return metrics.find((metric) => metric.key === key) || { key, missing: true };
}

function numericMetricValue(metric, field = "latestValue") {
  const value = Number(metric?.[field]);
  return Number.isFinite(value) ? value : null;
}

function metricPhrase(metric, label) {
  if (!metric || metric.missing) return "";
  return `${formatMetricValue(metric)} ${label}`;
}

function yearChangePhrase(metric, label) {
  const value = numericMetricValue(metric, "yearChangePercent");
  if (value === null) return "";
  if (Math.abs(value) < 0.1) return `${label} flat year over year`;
  return `${label} ${value > 0 ? "up" : "down"} ${Math.abs(value).toFixed(1)}% year over year`;
}

function sellerMarketSignal(metricSummaries = []) {
  const activeInventory = metricByKey(metricSummaries, "activeInventory");
  const pendingSales = metricByKey(metricSummaries, "pendingSales");
  const closedSales = metricByKey(metricSummaries, "closedSales");
  const monthsSupply = metricByKey(metricSummaries, "monthsSupply");
  const medianDays = metricByKey(metricSummaries, "medianDaysOnMarket");
  const medianPrice = metricByKey(metricSummaries, "medianSalePrice");
  const ppsf = metricByKey(metricSummaries, "averagePpsf");

  const activeYoy = numericMetricValue(activeInventory, "yearChangePercent");
  const pendingYoy = numericMetricValue(pendingSales, "yearChangePercent");
  const closedYoy = numericMetricValue(closedSales, "yearChangePercent");
  const daysYoy = numericMetricValue(medianDays, "yearChangePercent");
  const priceYoy = numericMetricValue(medianPrice, "yearChangePercent");
  const ppsfYoy = numericMetricValue(ppsf, "yearChangePercent");
  const supplyCount = numericMetricValue(monthsSupply);
  const dayCount = numericMetricValue(medianDays);

  const choicePressure =
    (activeYoy !== null && activeYoy >= 15) ||
    (supplyCount !== null && supplyCount >= 2.5) ||
    (dayCount !== null && dayCount >= 28) ||
    (daysYoy !== null && daysYoy >= 20);
  const demandCooling =
    (pendingYoy !== null && pendingYoy <= -10) ||
    (closedYoy !== null && closedYoy <= -10);
  const priceSoftening =
    (priceYoy !== null && priceYoy <= -2.5) ||
    (ppsfYoy !== null && ppsfYoy <= -2.5);
  const fastMarket =
    (supplyCount !== null && supplyCount <= 1.5) ||
    (dayCount !== null && dayCount <= 14) ||
    (activeYoy !== null && activeYoy <= -10);
  const priceStrength =
    (priceYoy !== null && priceYoy >= 3) ||
    (ppsfYoy !== null && ppsfYoy >= 3);

  if (choicePressure) return "choicePressure";
  if (demandCooling) return "demandCooling";
  if (priceSoftening) return "priceSoftening";
  if (fastMarket) return "fastMarket";
  if (priceStrength) return "priceStrength";
  return "balanced";
}

function sellerMetricRead(route, metricSummaries = []) {
  const activeInventory = metricByKey(metricSummaries, "activeInventory");
  const pendingSales = metricByKey(metricSummaries, "pendingSales");
  const monthsSupply = metricByKey(metricSummaries, "monthsSupply");
  const medianDays = metricByKey(metricSummaries, "medianDaysOnMarket");
  const medianPrice = metricByKey(metricSummaries, "medianSalePrice");

  const levelPhrases = [
    metricPhrase(activeInventory, "active listings"),
    metricPhrase(monthsSupply, "months of supply"),
    metricPhrase(medianDays, "median days on market")
  ].filter(Boolean);
  const trendPhrases = [
    yearChangePhrase(activeInventory, "inventory"),
    yearChangePhrase(pendingSales, "pending sales"),
    yearChangePhrase(medianPrice, "median sale price")
  ].filter(Boolean);

  const levelSentence = levelPhrases.length
    ? `${route.name} is showing ${listText(levelPhrases, "mixed market signals")}.`
    : `${route.name} has enough moving pieces that the seller read needs a property-specific check.`;
  const trendSentence = trendPhrases.length
    ? `The year-over-year read: ${listText(trendPhrases, "mixed trend signals")}.`
    : "";

  return [levelSentence, trendSentence].filter(Boolean).join(" ");
}

function sellerCtaForMarket(base, { route = {}, metricSummaries = [] } = {}) {
  const signal = sellerMarketSignal(metricSummaries);
  const promise = sellerMetricPromiseBySignal[signal] || sellerMetricPromiseBySignal.balanced;
  const metricRead = route.name ? sellerMetricRead(route, metricSummaries) : "";
  const introLead = metricRead || promise.summary;

  return {
    ...base,
    heroTitle: promise.title,
    heroIntro: `${introLead} ${promise.summary}`,
    railTitle: promise.title,
    railIntro: `${introLead} Use that read before choosing launch price, prep, timing, showing strategy, and how much to spend before going public.`,
    railButton: promise.button,
    modalIntro: `${introLead} Share the property, likely timing, condition, target range, and the seller tradeoff you are unsure about.`,
    modalSubmit: promise.button,
    metricSignal: signal,
    metricRead
  };
}

function metricRowsHtml(metrics, keys) {
  return keys
    .map((key) => {
      const metric = metricByKey(metrics, key);
      return `                    <tr>
                      <td><strong>${escapeHtml(metric.label || toTitleCase(key))}</strong></td>
                      <td>${escapeHtml(formatMetricValue(metric))}</td>
                      <td>${escapeHtml(metric.latestPeriod || "No data")}</td>
                      <td>${escapeHtml(metric.missing ? "No data" : formatChange(metric, "monthChangePercent"))}</td>
                      <td>${escapeHtml(metric.missing ? "No data" : formatChange(metric, "yearChangePercent"))}</td>
                      <td>${escapeHtml(metric.missing ? "No data" : metric.threeMonthDirection)}</td>
                    </tr>`;
    })
    .join("\n");
}

function explorerMetricsPayload(metricSource = {}) {
  return Object.fromEntries(
    explorerMetricKeys.map((key) => {
      const metric = metricSource?.[key] || {};
      return [
        key,
        {
          key,
          label: metric.label || toTitleCase(key),
          unit: metric.unit || "",
          series: latestNumericPoints(metric.series)
            .slice(-60)
            .map((point) => ({
              date: point.date,
              label: point.label || point.date,
              value: point.value
            }))
        }
      ];
    })
  );
}

function explorerSlicesPayload(marketData, allowedCategories = [], allowedHomeTypes = []) {
  const slices = {};
  const categoryEntries = Object.entries(marketData.slices || {}).filter(([category]) => {
    return !allowedCategories.length || allowedCategories.includes(category);
  });
  for (const [category, homeTypes] of categoryEntries) {
    slices[category] = {};
    const homeTypeEntries = Object.entries(homeTypes || {}).filter(([homeType]) => {
      return !allowedHomeTypes.length || allowedHomeTypes.includes(homeType);
    });
    for (const [homeType, slice] of homeTypeEntries) {
      slices[category][homeType] = explorerMetricsPayload(slice?.metrics || {});
    }
  }
  return slices;
}

function explorerLocationPayload(marketData, index, options = {}) {
  const palette = ["#005ba0", "#8f1f1f", "#6f7f24"];
  const name = marketData.location?.name || marketData.location?.zip || `Area ${index + 1}`;
  const id = marketData.location?.zip || slugify(name);
  const slices = explorerSlicesPayload(marketData, options.categories || [], options.homeTypes || []);
  const hasSlices = Object.keys(slices).some((category) => Object.keys(slices[category] || {}).length);
  const metrics = hasSlices ? {} : explorerMetricsPayload(marketData.metrics || {});

  return {
    id,
    name,
    routeSlug: marketData.location?.zip || slugify(name),
    color: palette[index] || "#334155",
    removable: index > 0,
    metrics,
    slices
  };
}

function pulseExplorerData(marketData, comparisonMarketData) {
  const defaultCategory = "Residential";
  const availableHomeTypes = (marketData.facets?.homeTypes || [])
    .filter((facet) => facet?.available !== false)
    .map((facet) => facet.label)
    .filter((label) => marketData.slices?.[defaultCategory]?.[label]?.metrics);
  const homeTypes = availableHomeTypes.length ? availableHomeTypes : Object.keys(marketData.slices?.[defaultCategory] || {});
  const defaultHomeType = homeTypes.includes("Single family") ? "Single family" : homeTypes[0] || "";

  return {
    defaultMetric: "activeInventory",
    defaultCategory,
    defaultHomeType,
    homeTypeOptions: homeTypes,
    locations: [marketData, ...comparisonMarketData].map((data, index) =>
      explorerLocationPayload(data, index, { categories: [defaultCategory], homeTypes })
    ),
    metricOptions: explorerMetricKeys.map((key) => ({
      key,
      label: marketData.metrics?.[key]?.label || toTitleCase(key),
      unit: marketData.metrics?.[key]?.unit || ""
    }))
  };
}

function pulseExplorerScript() {
  return `    <script>
(function () {
  var root = document.querySelector("[data-pulse-explorer]");
  var dataEl = document.getElementById("pulse-signal-data");
  if (!root || !dataEl) return;

  var data = JSON.parse(dataEl.textContent || "{}");
  var shareRoot = document.querySelector("[data-pulse-share-root]") || root;
  var state = {
    selectedIds: (data.locations || []).map(function (location) { return location.id; }).slice(0, 3),
    draftFilters: {
      metricKey: data.defaultMetric || "activeInventory",
      category: data.defaultCategory || "Residential",
      homeType: data.defaultHomeType || "Single family",
      chartStyle: "line",
      yearRange: "3",
      period: "Monthly"
    },
    hoverIndex: null,
    isScrubbing: false,
    trayCollapsed: false,
    searchOpen: false,
    searchTerm: "",
    shareOpen: false
  };

  var titleEl = root.querySelector("[data-pulse-title]");
  var kpiEl = root.querySelector("[data-pulse-kpi]");
  var chartEl = root.querySelector("[data-pulse-chart]");
  var chartSurface = root.querySelector("[data-chart-surface]");
  var legendEl = root.querySelector("[data-pulse-legend]");
  var chipsEl = root.querySelector("[data-pulse-chips]");
  var searchButton = root.querySelector('[data-open-search="expand"]');
  var trayToggles = root.querySelectorAll("[data-pulse-toggle-tray]");
  var searchPanel = root.querySelector("[data-pulse-search-panel]");
  var searchInput = root.querySelector("[data-search-input]");
  var searchResults = root.querySelector("[data-pulse-search-results]");
  var statusEl = document.querySelector("[data-pulse-share-status]");

  function locationById(id) {
    return (data.locations || []).find(function (location) { return location.id === id; });
  }

  function selectedLocations() {
    return state.selectedIds.map(locationById).filter(Boolean);
  }

  function metricMeta() {
    return (data.metricOptions || []).find(function (metric) { return metric.key === state.draftFilters.metricKey; }) || { label: "Metric", unit: "" };
  }

  function seriesFor(location) {
    var category = state.draftFilters.category || data.defaultCategory || "Residential";
    var homeType = state.draftFilters.homeType || data.defaultHomeType || "Single family";
    var sliceMetrics = location.slices && location.slices[category] && location.slices[category][homeType];
    var metric = sliceMetrics && sliceMetrics[state.draftFilters.metricKey];
    if (!metric && (!location.slices || !Object.keys(location.slices).length)) {
      metric = location.metrics && location.metrics[state.draftFilters.metricKey];
    }
    var series = metric && Array.isArray(metric.series) ? metric.series.slice() : [];
    if (state.draftFilters.yearRange !== "max") {
      series = series.slice(-Number(state.draftFilters.yearRange || 3) * 12);
    }
    return series;
  }

  function formatValue(value, unit) {
    if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) return "No data";
    var number = Number(value);
    if (unit === "currency") {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(number);
    }
    if (unit === "percent") {
      var percent = Math.abs(number) <= 2 ? number * 100 : number;
      return percent.toFixed(1) + "%";
    }
    if (state.draftFilters.metricKey === "monthsSupply") return number.toFixed(1);
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(number);
  }

  function changeBadge(series) {
    if (series.length < 2) return "";
    var current = Number(series[series.length - 1].value);
    var previous = Number(series[series.length - 2].value);
    if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return "";
    var change = ((current - previous) / Math.abs(previous)) * 100;
    var direction = change > 0.05 ? "up" : change < -0.05 ? "down" : "flat";
    var arrow = direction === "up" ? "&#9650;" : direction === "down" ? "&#9660;" : "";
    var label = direction === "up" ? "up" : direction === "down" ? "down" : "flat";
    return '<span class="pulse-delta pulse-delta-' + direction + '">' + arrow + " " + label + " " + Math.abs(change).toFixed(1) + "% MoM</span>";
  }

  function homeTypeLabel(value) {
    if (!value) return "selected homes";
    if (value === "Single family") return "single-family homes";
    if (value === "Condo") return "condos";
    if (value === "Townhome") return "townhomes";
    if (value === "Manufactured") return "manufactured homes";
    if (value === "Apartment") return "apartments";
    return value.toLowerCase();
  }

  function readoutContext(location, point) {
    var marketSlice = (state.draftFilters.category || "Residential").toLowerCase() + " market";
    var period = point && point.label ? point.label : "latest period";
    return location.name + " - " + marketSlice + ", " + homeTypeLabel(state.draftFilters.homeType) + " - " + period;
  }

  function renderChips() {
    if (!chipsEl) return;
    chipsEl.innerHTML = selectedLocations().map(function (location, index) {
      var remove = index === 0 ? "" : '<button type="button" aria-label="Remove ' + location.name + '" data-remove-area="' + location.id + '">x</button>';
      return '<span class="pulse-area-chip" style="--area-color: ' + location.color + '"><i></i>' + location.name + remove + "</span>";
    }).join("");
  }

  function renderSearchResults() {
    if (!searchResults) return;
    var term = state.searchTerm.trim().toLowerCase();
    var matches = (data.locations || []).filter(function (location) {
      return !term || location.name.toLowerCase().includes(term) || location.routeSlug.toLowerCase().includes(term);
    });
    searchResults.innerHTML = matches.map(function (location) {
      var selected = state.selectedIds.indexOf(location.id) !== -1;
      return '<button type="button" data-add-area="' + location.id + '"' + (selected ? " disabled" : "") + ">" + location.name + (selected ? " selected" : "") + "</button>";
    }).join("");
  }

  function optionLabel(key, value) {
    var options = root.querySelectorAll('[data-draft-filter-option="' + key + '"]');
    for (var index = 0; index < options.length; index += 1) {
      if (options[index].getAttribute("data-filter-value") === String(value)) {
        return options[index].textContent.trim();
      }
    }
    return value;
  }

  function renderKpi() {
    if (!kpiEl) return;
    var locations = selectedLocations();
    var primary = locations[0];
    var meta = metricMeta();
    if (!primary) {
      kpiEl.innerHTML = "<strong>No location selected</strong>";
      return;
    }
    var primarySeries = seriesFor(primary);
    if (!primarySeries.length) {
      kpiEl.innerHTML = '<span class="pulse-kpi-label">' + meta.label + '</span><span class="pulse-kpi-context">' + readoutContext(primary, null) + '</span><strong>No data</strong><span class="pulse-readout-note">This slice does not have enough chartable data.</span>';
      return;
    }
    if (state.hoverIndex !== null) {
      var index = Math.max(0, Math.min(state.hoverIndex, primarySeries.length - 1));
      var dateLabel = primarySeries[index] ? primarySeries[index].label : "Selected period";
      var rows = locations.map(function (location) {
        var series = seriesFor(location);
        var point = series[index] || series[series.length - 1];
        return '<span><i style="--area-color: ' + location.color + '"></i>' + location.name + '<strong>' + formatValue(point && point.value, meta.unit) + "</strong></span>";
      }).join("");
      kpiEl.innerHTML = '<span class="pulse-kpi-label">' + meta.label + " - " + dateLabel + '</span><span class="pulse-kpi-context">' + readoutContext(primary, primarySeries[index]) + '</span><div class="pulse-kpi-stack">' + rows + "</div>";
      return;
    }
    var latest = primarySeries[primarySeries.length - 1];
    kpiEl.innerHTML = '<span class="pulse-kpi-label">' + meta.label + '</span><span class="pulse-kpi-context">' + readoutContext(primary, latest) + '</span><strong>' + formatValue(latest.value, meta.unit) + "</strong>" + changeBadge(primarySeries);
  }

  function pointFor(value, min, max, index, count, plot) {
    var x = count <= 1 ? plot.left : plot.left + (index / (count - 1)) * plot.width;
    var ratio = max === min ? 0.5 : (Number(value) - min) / (max - min);
    var y = plot.top + plot.height - ratio * plot.height;
    return { x: x, y: y };
  }

  function chartPlotGeometry() {
    var rect = (chartEl || chartSurface).getBoundingClientRect();
    var viewBox = chartEl && chartEl.viewBox && chartEl.viewBox.baseVal ? chartEl.viewBox.baseVal : null;
    var viewWidth = viewBox && viewBox.width ? viewBox.width : Math.max(620, Math.round(rect.width || 760));
    var plotLeft = 44;
    var plotRight = 24;
    return {
      rect: rect,
      viewWidth: viewWidth,
      plotLeft: plotLeft,
      plotWidth: Math.max(1, viewWidth - plotLeft - plotRight)
    };
  }

  function renderChart() {
    if (!chartEl) return;
    var locations = selectedLocations();
    var meta = metricMeta();
    var seriesByLocation = locations.map(function (location) {
      return { location: location, series: seriesFor(location).filter(function (point) { return Number.isFinite(Number(point.value)); }) };
    }).filter(function (item) { return item.series.length; });
    var rect = (chartSurface || chartEl).getBoundingClientRect();
    var width = Math.max(620, Math.round(rect.width || 760));
    var height = Math.max(320, Math.round(rect.height || 360));
    var plot = {
      left: 44,
      right: 24,
      top: 30,
      bottom: 42
    };
    plot.width = width - plot.left - plot.right;
    plot.height = height - plot.top - plot.bottom;
    chartEl.setAttribute("viewBox", "0 0 " + width + " " + height);
    var allValues = [];
    seriesByLocation.forEach(function (item) {
      item.series.forEach(function (point) { allValues.push(Number(point.value)); });
    });
    if (!allValues.length) {
      chartEl.innerHTML = '<text x="44" y="120" fill="#475569">No chart data available.</text>';
      if (legendEl) legendEl.innerHTML = "";
      return;
    }
    var min = Math.min.apply(Math, allValues);
    var max = Math.max.apply(Math, allValues);
    if (min === max) {
      min = min - 1;
      max = max + 1;
    }
    var padding = (max - min) * 0.08;
    min = min - padding;
    max = max + padding;
    var html = '<rect x="0" y="0" width="' + width + '" height="' + height + '" rx="12" fill="#ffffff"></rect>';
    for (var grid = 0; grid <= 4; grid += 1) {
      var y = plot.top + (plot.height / 4) * grid;
      html += '<line x1="' + plot.left + '" y1="' + y.toFixed(1) + '" x2="' + (plot.left + plot.width) + '" y2="' + y.toFixed(1) + '" stroke="#e2e8f0"></line>';
    }
    html += '<line x1="' + plot.left + '" y1="' + (plot.top + plot.height) + '" x2="' + (plot.left + plot.width) + '" y2="' + (plot.top + plot.height) + '" stroke="#cbd5e1"></line>';
    if (state.draftFilters.chartStyle === "bar") {
      var primaryLength = seriesByLocation[0].series.length;
      var groupWidth = plot.width / Math.max(primaryLength, 1);
      var barWidth = Math.max(2, groupWidth / Math.max(seriesByLocation.length + 1, 2));
      seriesByLocation.forEach(function (item, locationIndex) {
        item.series.forEach(function (point, index) {
          var plotted = pointFor(point.value, min, max, index, item.series.length, plot);
          var baseline = plot.top + plot.height;
          var h = Math.max(1, baseline - plotted.y);
          var x = plot.left + index * groupWidth + locationIndex * barWidth;
          html += '<rect x="' + x.toFixed(1) + '" y="' + plotted.y.toFixed(1) + '" width="' + Math.max(1.5, barWidth - 1).toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + item.location.color + '" opacity="0.72"></rect>';
        });
      });
    } else {
      seriesByLocation.forEach(function (item) {
        var path = item.series.map(function (point, index) {
          var plotted = pointFor(point.value, min, max, index, item.series.length, plot);
          return (index ? "L" : "M") + plotted.x.toFixed(1) + " " + plotted.y.toFixed(1);
        }).join(" ");
        html += '<path class="mt-series" d="' + path + '" fill="none" stroke="' + item.location.color + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>';
      });
    }
    if (state.hoverIndex !== null && seriesByLocation[0]) {
      var index = Math.max(0, Math.min(state.hoverIndex, seriesByLocation[0].series.length - 1));
      var xPoint = pointFor(seriesByLocation[0].series[index].value, min, max, index, seriesByLocation[0].series.length, plot);
      html += '<line class="mt-crosshair" x1="' + xPoint.x.toFixed(1) + '" y1="' + plot.top + '" x2="' + xPoint.x.toFixed(1) + '" y2="' + (plot.top + plot.height) + '" stroke="#64748b" stroke-dasharray="5 6"></line>';
      seriesByLocation.forEach(function (item) {
        var point = item.series[Math.min(index, item.series.length - 1)];
        var plotted = pointFor(point.value, min, max, Math.min(index, item.series.length - 1), item.series.length, plot);
        html += '<circle cx="' + plotted.x.toFixed(1) + '" cy="' + plotted.y.toFixed(1) + '" r="5" fill="' + item.location.color + '" stroke="#fff" stroke-width="2"></circle>';
      });
    }
    html += '<rect class="mt-chart-hit" x="' + plot.left + '" y="' + plot.top + '" width="' + plot.width + '" height="' + plot.height + '" fill="transparent"></rect>';
    chartEl.innerHTML = html;
    if (legendEl) {
      legendEl.innerHTML = seriesByLocation.map(function (item) {
        return '<span><i style="--area-color: ' + item.location.color + '"></i>' + item.location.name + "</span>";
      }).join("");
    }
    chartEl.setAttribute("aria-label", meta.label + " chart for " + locations.map(function (location) { return location.name; }).join(", "));
  }

  function renderShareModal() {
    if (!shareRoot) return;
    if (!state.shareOpen) {
      shareRoot.innerHTML = "";
      return;
    }
    var title = document.title || "Housing Market Pulse";
    var pageUrl = window.location.href.split("#")[0];
    shareRoot.innerHTML = '<div class="mt-modal-backdrop" data-pulse-share-close></div>' +
      '<div class="mt-share-modal" role="dialog" aria-modal="true" aria-labelledby="pulse-share-title">' +
      '<div class="mt-share-header"><div><p>Share this market read</p><h2 id="pulse-share-title">Send this Pulse read</h2></div><button type="button" data-pulse-share-close aria-label="Close share options">x</button></div>' +
      '<div class="mt-share-options-grid">' +
      '<button type="button" data-pulse-share-action="copy"><span class="mt-share-icon btn-copy">Copy</span><strong>Copy link</strong></button>' +
      '<button type="button" data-pulse-share-action="email"><span class="mt-share-icon btn-email">Email</span><strong>Email</strong></button>' +
      '<button type="button" data-pulse-share-action="message"><span class="mt-share-icon btn-message">Text</span><strong>Text</strong></button>' +
      '<button type="button" data-pulse-share-action="facebook"><span class="mt-share-icon btn-facebook">f</span><strong>Facebook</strong></button>' +
      '<button type="button" data-pulse-share-action="linkedin"><span class="mt-share-icon btn-linkedin">in</span><strong>LinkedIn</strong></button>' +
      '<button type="button" data-pulse-share-action="pinterest"><span class="mt-share-icon btn-pinterest">P</span><strong>Pinterest</strong></button>' +
      '<button type="button" data-pulse-share-action="reddit"><span class="mt-share-icon btn-reddit">r</span><strong>Reddit</strong></button>' +
      '</div><p class="mt-share-status" data-pulse-share-modal-status></p></div>';
    shareRoot.dataset.shareTitle = title;
    shareRoot.dataset.shareUrl = pageUrl;
  }

  function setShareStatus(message) {
    var modalStatus = shareRoot ? shareRoot.querySelector("[data-pulse-share-modal-status]") : null;
    if (modalStatus) modalStatus.textContent = message;
    if (statusEl) statusEl.textContent = message;
  }

  function openShareWindow(url) {
    window.open(url, "_blank", "noopener,noreferrer,width=760,height=640");
  }

  function handleShareAction(action) {
    var title = shareRoot.dataset.shareTitle || document.title || "Housing Market Pulse";
    var pageUrl = shareRoot.dataset.shareUrl || window.location.href.split("#")[0];
    var encodedUrl = encodeURIComponent(pageUrl);
    var encodedTitle = encodeURIComponent(title);
    if (action === "copy") {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pageUrl).then(function () { setShareStatus("Link copied."); });
      } else {
        setShareStatus(pageUrl);
      }
      return;
    }
    if (action === "email") {
      window.location.href = "mailto:?subject=" + encodedTitle + "&body=" + encodedUrl;
      return;
    }
    if (action === "message") {
      window.location.href = "sms:?&body=" + encodedTitle + "%20" + encodedUrl;
      return;
    }
    if (action === "facebook") openShareWindow("https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl);
    if (action === "linkedin") openShareWindow("https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl);
    if (action === "pinterest") openShareWindow("https://pinterest.com/pin/create/button/?url=" + encodedUrl + "&description=" + encodedTitle);
    if (action === "reddit") openShareWindow("https://www.reddit.com/submit?url=" + encodedUrl + "&title=" + encodedTitle);
  }

  function syncControls() {
    root.querySelectorAll("[data-draft-filter]").forEach(function (control) {
      var key = control.getAttribute("data-draft-filter");
      if (key && state.draftFilters[key]) control.value = state.draftFilters[key];
    });
    root.querySelectorAll("[data-filter-current]").forEach(function (current) {
      var key = current.getAttribute("data-filter-current");
      if (key && state.draftFilters[key]) current.textContent = optionLabel(key, state.draftFilters[key]);
    });
    root.querySelectorAll("[data-draft-filter-option]").forEach(function (option) {
      var key = option.getAttribute("data-draft-filter-option");
      var selected = key && String(state.draftFilters[key]) === option.getAttribute("data-filter-value");
      option.classList.toggle("is-selected", !!selected);
      option.setAttribute("aria-selected", selected ? "true" : "false");
    });
  }

  function render() {
    root.classList.toggle("is-tray-hidden", state.trayCollapsed);
    trayToggles.forEach(function (toggle) {
      toggle.textContent = state.trayCollapsed ? "Show filters" : "Hide filters";
      toggle.setAttribute("aria-expanded", state.trayCollapsed ? "false" : "true");
    });
    syncControls();
    if (titleEl) titleEl.textContent = metricMeta().label;
    renderChips();
    renderSearchResults();
    renderKpi();
    renderChart();
    renderShareModal();
  }

  root.addEventListener("change", function (event) {
    var filter = event.target && event.target.getAttribute("data-draft-filter");
    if (!filter) return;
    state.draftFilters[filter] = event.target.value;
    state.hoverIndex = null;
    render();
  });

  root.addEventListener("click", function (event) {
    var toggleTray = event.target && event.target.closest ? event.target.closest("[data-pulse-toggle-tray]") : null;
    var removeId = event.target && event.target.getAttribute("data-remove-area");
    var addId = event.target && event.target.getAttribute("data-add-area");
    var filterOption = event.target && event.target.closest ? event.target.closest("[data-draft-filter-option]") : null;
    if (filterOption) {
      var filterKey = filterOption.getAttribute("data-draft-filter-option");
      var filterValue = filterOption.getAttribute("data-filter-value");
      if (filterKey && filterValue !== null) {
        state.draftFilters[filterKey] = filterValue;
        state.hoverIndex = null;
        var menu = filterOption.closest("[data-filter-menu]");
        if (menu) menu.open = false;
        render();
      }
      return;
    }
    if (toggleTray) {
      state.trayCollapsed = !state.trayCollapsed;
      render();
      return;
    }
    if (removeId) {
      state.selectedIds = state.selectedIds.filter(function (id, index) { return index === 0 || id !== removeId; });
      render();
    }
    if (addId && state.selectedIds.indexOf(addId) === -1 && state.selectedIds.length < 3) {
      state.selectedIds.push(addId);
      state.searchOpen = false;
      if (searchPanel) searchPanel.hidden = true;
      render();
    }
  });

  document.addEventListener("click", function (event) {
    var openButton = event.target && event.target.closest ? event.target.closest("[data-pulse-share-open]") : null;
    var closeButton = event.target && event.target.closest ? event.target.closest("[data-pulse-share-close]") : null;
    var actionButton = event.target && event.target.closest ? event.target.closest("[data-pulse-share-action]") : null;
    if (openButton) {
      state.shareOpen = true;
      renderShareModal();
    }
    var flipCard = event.target && event.target.closest ? event.target.closest("[data-pulse-flip-card]") : null;
    if (flipCard) {
      var expanded = flipCard.getAttribute("aria-expanded") === "true";
      flipCard.classList.toggle("is-flipped", !expanded);
      flipCard.setAttribute("aria-expanded", expanded ? "false" : "true");
    }
    if (closeButton) {
      state.shareOpen = false;
      renderShareModal();
    }
    if (actionButton) {
      handleShareAction(actionButton.getAttribute("data-pulse-share-action"));
    }
  });

  if (searchButton && searchPanel) {
    searchButton.addEventListener("click", function () {
      state.searchOpen = !state.searchOpen;
      searchPanel.hidden = !state.searchOpen;
      if (state.searchOpen && searchInput) searchInput.focus();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.searchTerm = searchInput.value || "";
      renderSearchResults();
    });
  }
  if (chartSurface) {
    function updateHover(event) {
      var primary = selectedLocations()[0];
      var series = primary ? seriesFor(primary) : [];
      if (!series.length) return;
      var geometry = chartPlotGeometry();
      var xInViewBox = ((event.clientX - geometry.rect.left) / Math.max(geometry.rect.width, 1)) * geometry.viewWidth;
      var ratio = Math.max(0, Math.min(1, (xInViewBox - geometry.plotLeft) / geometry.plotWidth));
      state.hoverIndex = Math.round(ratio * (series.length - 1));
      renderKpi();
      renderChart();
    }
    chartSurface.addEventListener("pointerdown", function (event) {
      state.isScrubbing = true;
      if (chartSurface.setPointerCapture) chartSurface.setPointerCapture(event.pointerId);
      updateHover(event);
    });
    chartSurface.addEventListener("pointermove", function (event) {
      if (event.pointerType === "mouse" || state.isScrubbing) updateHover(event);
    });
    chartSurface.addEventListener("pointerup", function (event) {
      state.isScrubbing = false;
      if (chartSurface.releasePointerCapture) chartSurface.releasePointerCapture(event.pointerId);
    });
    chartSurface.addEventListener("pointerleave", function () {
      if (state.isScrubbing) return;
      state.hoverIndex = null;
      renderKpi();
      renderChart();
    });
  }
  root.querySelectorAll("[data-filter-menu]").forEach(function (menu) {
    menu.addEventListener("toggle", function () {
      if (!menu.open) return;
      root.querySelectorAll("[data-filter-menu]").forEach(function (otherMenu) {
        if (otherMenu !== menu) otherMenu.open = false;
      });
    });
  });
  window.addEventListener("resize", function () {
    renderChart();
  });
  syncControls();
  render();
})();
    </script>`;
}

function filterAccordionHtml({ label, key, options, selectedValue = "" }) {
  const selectedOption = options.find((option) => option.value === selectedValue) || options[0] || { value: "", label: "" };
  const optionButtons = options
    .map((option) => {
      return `                          <button type="button" role="option" data-draft-filter-option="${escapeHtml(key)}" data-filter-value="${escapeHtml(option.value)}" aria-selected="false">${escapeHtml(option.label)}</button>`;
    })
    .join("\n");

  return `                      <div class="pulse-filter-field">
                        <span class="pulse-filter-label">${escapeHtml(label)}</span>
                        <details class="pulse-filter-menu" data-filter-menu data-filter-key="${escapeHtml(key)}">
                          <summary><span data-filter-current="${escapeHtml(key)}">${escapeHtml(selectedOption.label)}</span><i aria-hidden="true"></i></summary>
                          <div class="pulse-filter-options" role="listbox" aria-label="${escapeHtml(label)}">
${optionButtons}
                          </div>
                        </details>
                      </div>`;
}

function pulseSignalExplorerHtml(route, marketData, comparisonMarketData, metricSummaries) {
  const data = pulseExplorerData(marketData, comparisonMarketData);
  const metricOptions = explorerMetricKeys.map((key) => {
    const metric = metricByKey(metricSummaries, key);
    return { value: key, label: metric.label || toTitleCase(key) };
  });
  const homeTypeOptions = data.homeTypeOptions.map((homeType) => ({ value: homeType, label: homeType }));
  const filterControls = [
    filterAccordionHtml({ label: "Metric", key: "metricKey", selectedValue: data.defaultMetric, options: metricOptions }),
    filterAccordionHtml({ label: "Property type", key: "category", selectedValue: data.defaultCategory, options: [{ value: "Residential", label: "Residential" }] }),
    filterAccordionHtml({ label: "Home type", key: "homeType", selectedValue: data.defaultHomeType, options: homeTypeOptions }),
    filterAccordionHtml({
      label: "Chart type",
      key: "chartStyle",
      selectedValue: "line",
      options: [
        { value: "line", label: "Line" },
        { value: "bar", label: "Bar" }
      ]
    }),
    filterAccordionHtml({
      label: "Years",
      key: "yearRange",
      selectedValue: "3",
      options: [
        { value: "1", label: "1 Year" },
        { value: "3", label: "3 Years" },
        { value: "5", label: "5 Years" },
        { value: "max", label: "Max" }
      ]
    }),
    filterAccordionHtml({ label: "Period", key: "period", selectedValue: "Monthly", options: [{ value: "Monthly", label: "Monthly" }] })
  ].join("\n");

  return `              <div class="pulse-market-card" data-pulse-explorer>
                <div class="pulse-market-toolbar">
                  <div class="pulse-current-metric"><span>Current view</span><strong data-pulse-title>Active Listings</strong></div>
                  <div class="pulse-market-actions">
                    <a class="button button-secondary pulse-full-dashboard" href="../../market-trends/${escapeHtml(route.slug)}/">Open full dashboard</a>
                    <button class="button button-secondary pulse-toggle-tray pulse-show-filters" type="button" data-pulse-toggle-tray aria-expanded="true" aria-controls="pulse-filter-tray">Hide filters</button>
                  </div>
                </div>
                <div class="mt-expanded-body pulse-market-expanded">
                  <aside class="mt-expanded-sidebar pulse-market-sidebar" id="pulse-filter-tray" aria-label="Market chart controls">
                    <div class="pulse-tray-header">
                      <span>Filters</span>
                      <button class="pulse-tray-toggle" type="button" data-pulse-toggle-tray aria-expanded="true" aria-controls="pulse-filter-tray">Hide filters</button>
                    </div>
                    <button class="pulse-search-button" type="button" data-open-search="expand">Search to compare</button>
                    <div class="pulse-compare-panel" data-pulse-search-panel hidden>
                      <label>Compare city or ZIP
                        <input data-search-input type="search" placeholder="Search city or ZIP">
                      </label>
                      <div class="pulse-search-results" data-pulse-search-results></div>
                    </div>
                    <div class="pulse-area-chips mt-expanded-chips" data-pulse-chips aria-label="Selected comparison areas"></div>
                    <div class="pulse-filter-stack mt-expanded-controls-stack">
${filterControls}
                    </div>
                  </aside>
                  <div class="mt-expanded-main pulse-market-main">
                    <div class="mt-readout-box pulse-kpi" data-pulse-kpi aria-live="polite"></div>
                    <div class="mt-expanded-chart-panel pulse-chart-panel">
                      <div class="mt-chart-container mt-expanded-chart-container pulse-chart-shell" data-chart-surface>
                        <svg class="mt-chart-svg" data-pulse-chart role="img" viewBox="0 0 760 500" preserveAspectRatio="none"></svg>
                      </div>
                      <p class="pulse-chart-source">Source: CRMLS / InfoSparks</p>
                    </div>
                    <div class="mt-chart-legend pulse-chart-legend" data-pulse-legend></div>
                    <button class="button button-secondary pulse-share-chart" type="button" data-pulse-share-open>Share chart</button>
                  </div>
                </div>
              </div>
              <div data-pulse-share-root></div>
              <script type="application/json" id="pulse-signal-data">${escapeJsonForHtml(data)}</script>
${pulseExplorerScript()}`;
}

function profileSocialLinksHtml() {
  return `                <nav class="profile-social-links article-profile-social" aria-label="Follow Israel Hernandez">
                  <a class="profile-social-link profile-social-instagram" href="https://www.instagram.com/homesbyisraelhe/" target="_blank" rel="me noopener" aria-label="Instagram @homesbyisraelhe"><span>Instagram</span></a>
                  <a class="profile-social-link profile-social-linkedin" href="https://www.linkedin.com/in/homesbyisraelhe" target="_blank" rel="me noopener" aria-label="LinkedIn @homesbyisraelhe"><span>LinkedIn</span></a>
                  <a class="profile-social-link profile-social-substack" href="https://substack.com/@homesbyisraelhe" target="_blank" rel="me noopener" aria-label="Substack @homesbyisraelhe"><span>Substack</span></a>
                  <a class="profile-social-link profile-social-youtube" href="https://www.youtube.com/@HomesByIsraelHE" target="_blank" rel="me noopener" aria-label="YouTube @homesbyisraelhe"><span>YouTube</span></a>
                  <a class="profile-social-link profile-social-google" href="https://share.google/xhxJ8YSkY9kaVwpRt" target="_blank" rel="noopener" aria-label="Google Business Profile"><span>Google Business</span></a>
                  <button class="profile-social-link article-social-share" type="button" data-pulse-share-open aria-label="Share this market update"><span>Share</span></button>
                </nav>`;
}

function sourceNotesHtml(sources, intro) {
  return `            <details class="source-notes">
              <summary>
                <span class="source-notes-title">See sources used</span>
                <span class="source-notes-meta">${sources.length} source notes</span>
              </summary>
              <div class="source-notes-content">
                <p>${escapeHtml(intro)}</p>
                <ul>
${sources.map((source) => `                  <li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join("\n")}
                </ul>
              </div>
            </details>`;
}

function heroCtaHtml(cta) {
  if (cta.heroTitle || cta.heroIntro) {
    return `              <div class="article-share article-guide-cta" aria-label="Article actions">
                <div class="article-guide-cta-copy">
                  <strong>${escapeHtml(cta.heroTitle || cta.articleOffer)}</strong>
                  <span>${escapeHtml(cta.heroIntro || "")}</span>
                </div>
                <button type="button" data-open-lead>${escapeHtml(cta.articleOffer)}</button>
                <span class="visually-hidden" data-pulse-share-status aria-live="polite"></span>
              </div>`;
  }
  return `              <div class="article-share" aria-label="Article actions">
                <button type="button" data-open-lead>${escapeHtml(cta.articleOffer)}</button>
                <span class="visually-hidden" data-pulse-share-status aria-live="polite"></span>
              </div>`;
}

function leadModalFieldsHtml(article, route) {
  const avatar = article.internalReaderAvatar || "buyer";
  if (avatar === "buyer") {
    return `            <input type="hidden" name="intent" value="Housing Market Pulse">
            <input type="hidden" name="source" value="pulse-${escapeHtml(route.slug)}">
            <input type="hidden" name="lead_type" value="Buyer">
            <input type="hidden" name="lead_asset" value="Buyer Market Timing Kit">
            <input type="hidden" name="lead_tags" value="buyer-guide,market-update-reader,city:${escapeHtml(route.slug)},article:${escapeHtml(route.slug)}">
            <label>First name
              <input name="first_name" autocomplete="given-name" required>
            </label>
            <label>Email
              <input name="email" type="email" autocomplete="email" required>
            </label>
            <label>Phone <span class="optional-label">Optional</span>
              <input name="phone" type="tel" autocomplete="tel">
            </label>
            <label class="phone-consent" data-phone-consent hidden>
              <input name="phone_consent" type="checkbox" value="yes">
              <span>I agree that Israel Hernandez may call or text me about my real estate question. Message/data rates may apply.</span>
            </label>
            <fieldset class="lead-choice-group">
              <legend>Where are you in the process?</legend>
              <div class="lead-choice-grid">
                <label><input type="radio" name="buyer_stage" value="Just researching" checked><span>Just researching</span></label>
                <label><input type="radio" name="buyer_stage" value="Touring soon"><span>Touring soon</span></label>
                <label><input type="radio" name="buyer_stage" value="Need financing"><span>Need financing</span></label>
                <label><input type="radio" name="buyer_stage" value="Ready to offer"><span>Ready to offer</span></label>
              </div>
            </fieldset>`;
  }
  return `            <input type="hidden" name="intent" value="Housing Market Pulse">
            <input type="hidden" name="source" value="pulse-${escapeHtml(route.slug)}">
            <input type="hidden" name="lead_type" value="Seller">
            <input type="hidden" name="lead_asset" value="Seller Market Read">
            <input type="hidden" name="lead_tags" value="seller-market-read,market-update-reader,city:${escapeHtml(route.slug)},article:${escapeHtml(route.slug)}">
            <label>First name
              <input name="first_name" autocomplete="given-name" required>
            </label>
            <label>Email
              <input name="email" type="email" autocomplete="email" required>
            </label>
            <label>Phone <span class="optional-label">Optional</span>
              <input name="phone" type="tel" autocomplete="tel">
            </label>
            <label class="phone-consent" data-phone-consent hidden>
              <input name="phone_consent" type="checkbox" value="yes">
              <span>I agree that Israel Hernandez may call or text me about my real estate question. Message/data rates may apply.</span>
            </label>
            <fieldset class="lead-choice-group">
              <legend>What do you want pressure-tested?</legend>
              <div class="lead-choice-grid">
                <label><input type="radio" name="seller_focus" value="Price" checked><span>Price</span></label>
                <label><input type="radio" name="seller_focus" value="Prep"><span>Prep</span></label>
                <label><input type="radio" name="seller_focus" value="Timing"><span>Timing</span></label>
                <label><input type="radio" name="seller_focus" value="Net proceeds"><span>Net proceeds</span></label>
              </div>
            </fieldset>`;
}

function homebotWidgetHtml(avatar) {
  const config = homebotWidgetConfigs[avatar] || homebotWidgetConfigs.buyer;
  if (!config) return "";
  const modeArgument = config.mode ? `,{'mode':'${escapeJsString(config.mode)}'}` : "";
  const label = "Private planning tool";
  const heading =
    avatar === "seller"
      ? "Check your home value before choosing a next step."
      : "Check the payment range before the offer conversation.";
  const copy =
    avatar === "seller"
      ? "Use this as a starting point only, then confirm pricing, timing, and net proceeds with a property-specific review."
      : "Use this as a starting point only, then confirm loan terms, payment comfort, and offer strategy with the right professionals.";
  return `            <section class="pulse-homebot-card" aria-label="Homebot buyer and seller planning tool">
              <div class="pulse-homebot-copy">
                <p class="article-category-label">${escapeHtml(label)}</p>
                <h2>${escapeHtml(heading)}</h2>
                <p>${escapeHtml(copy)}</p>
              </div>
              <div class="pulse-homebot-widget-shell">
                <div id="${escapeHtml(config.elementId)}"></div>
              </div>
            </section>
            <script>
              (function (h,b) {
                var w = window, d = document, s = 'script', x, y;
                w['__hb_namespace'] = h;
                w[h] = w[h] || function () { (w[h].q=w[h].q||[]).push(arguments) };
                y = d.createElement(s);
                x = d.getElementsByTagName(s)[0];
                y.async = 1;
                y.src = b;
                x.parentNode.insertBefore(y,x);
              })('Homebot','https://embed.homebotapp.com/lgw/v1/widget.js');
              Homebot('#${escapeJsString(config.elementId)}', '${escapeJsString(config.token)}'${modeArgument});
            </script>`;
}

function supportingCtasHtml(cta, depth) {
  if (!cta.supportLinks?.length) return "";
  return `            <section class="rail-card pulse-supporting-cta-card" aria-label="${escapeHtml(cta.supportLabel)}">
              <p class="article-category-label">${escapeHtml(cta.supportLabel)}</p>
              <div class="rail-list">
${cta.supportLinks.map((link) => `                <a href="${depth}${escapeHtml(link.href)}"><strong>${escapeHtml(link.title)}</strong><span>${escapeHtml(link.text)}</span></a>`).join("\n")}
              </div>
            </section>`;
}

function simpleNav(depth) {
  return renderPrimaryNav(depth);
}

function mobileMenu(depth) {
  return renderMobileMenu(depth);
}

function headerHtml(depth, searchLabel = "Search local market guidance") {
  return `    <header class="site-header" id="top">
      <div class="header-top">
        <a class="brand-lockup" href="${depth}index.html" aria-label="Israel Hernandez homepage">
          <img class="brand-headshot" src="${depth}assets/israel-hernandez-headshot.jpg" alt="Israel Hernandez">
          <span class="brand-copy">
            <strong>Israel Hernandez</strong>
            <span>Think Boutiq Real Estate | DRE 02148476</span>
            <em>Buy or Sell Without The Guesswork</em>
          </span>
        </a>
        <form class="header-search desktop-search" role="search" aria-label="${escapeHtml(searchLabel)}" data-article-header-search>
          <label class="visually-hidden" for="desktop-search-input">Search</label>
          <input id="desktop-search-input" name="q" type="search" placeholder="Search city, ZIP, market timing">
          <button type="submit">Search</button>
        </form>
        <a class="header-contact" href="${depth}index.html#contact-israel">Contact Israel</a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-menu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <form class="mobile-search" role="search" aria-label="Mobile market guidance search" data-article-header-search>
        <label class="visually-hidden" for="mobile-search-input">Search</label>
        <input id="mobile-search-input" name="q" type="search" placeholder="Search market guidance">
        <button type="submit">Go</button>
      </form>
${simpleNav(depth)}
    </header>
${mobileMenu(depth)}`;
}

function searchPanelHtml(depth) {
  return `    <div class="search-panel" id="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title" hidden>
      <div class="search-dialog">
        <div class="overlay-bar">
          <h2 id="search-title">Search local guidance</h2>
          <button class="plain-close" type="button" data-close-search>Close</button>
        </div>
        <form class="search-overlay-form" role="search" aria-label="Search local real estate guidance" data-overlay-search>
          <label class="visually-hidden" for="overlay-search-input">Search query</label>
          <input id="overlay-search-input" name="q" type="search" placeholder="Try a city, offer timing, inventory, inspection">
          <button type="submit">Search</button>
        </form>
        <div class="search-results" id="search-results" aria-live="polite"></div>
      </div>
    </div>`;
}

function footerHtml(depth) {
  return `    <footer class="site-footer library-footer">
      <div class="footer-brand">
        <div class="footer-identity">
          <img class="footer-headshot" src="${depth}assets/israel-hernandez-headshot.jpg" alt="Israel Hernandez">
          <div><strong>Israel Hernandez</strong><span>Think Boutiq Real Estate</span><span>DRE 02148476</span><em>Buy or Sell Without The Guesswork</em><p><a href="tel:+14242431233">(424) 243-1233</a> | <a href="mailto:Homesbyisraelhe@gmail.com">Homesbyisraelhe@gmail.com</a></p></div>
        </div>
        <img src="${depth}assets/think-boutiq-logo-dark.png" alt="Think Boutiq Real Estate">
      </div>
      <div class="footer-taxonomy">
        <section><h2>Buying</h2><a href="${depth}buy/#article-library">Plan the search</a><a href="${depth}buy/#article-library">Compare areas</a><a href="${depth}index.html#contact-israel">Ask a question</a></section>
        <section><h2>Selling</h2><a href="${depth}sell/#article-library">Prep and pricing</a><a href="${depth}sell/#article-library">Repair tradeoffs</a><a href="${depth}index.html#contact-israel">Private sale question</a></section>
        <section><h2>Moving / Relocation</h2><a href="${depth}move-relocate/#article-library">Move sequence</a><a href="${depth}move-relocate/#article-library">Timing and commute</a><a href="${depth}index.html#contact-israel">Timing question</a></section>
        <section><h2>Market Trends</h2><a href="${depth}market-trends/#article-library">Search city market trends</a><a href="${depth}market-trends/?mode=pulse#article-library">Find Housing Market Pulse</a><a href="${depth}market-trends/?view=zip#article-library">Search by ZIP</a></section>
        <section><h2>Credentials / Compliance</h2><span>Think Boutiq Real Estate</span><span>Israel Hernandez | DRE 02148476</span><span>Equal Housing Opportunity.</span><span>Information is for general guidance, not legal, tax, lending, or insurance advice.</span></section>
      </div>
      <div class="footer-market-disclaimer">
        <p>Market data is sourced from CRMLS / InfoSparks and is deemed reliable but not guaranteed. The market charts use InfoSparks-fed MLS data that can refresh over time; figures may change, may reflect different property-type or time-period filters, and should be independently confirmed before you rely on them.</p>
        <p>This site is for general real estate education and decision support only. It is not legal, tax, lending, appraisal, insurance, investment, or financial advice, and it is not a guarantee of price, value, market direction, eligibility, terms, or property condition.</p>
      </div>
      <div class="footer-bottom"><p>Serving real estate decisions across the South Bay, Long Beach Area, Gateway Cities, Los Angeles County, Orange County, and nearby Southern California communities.</p><p>Copyright 2026 Israel Hernandez. Real estate services provided through Think Boutiq Real Estate. Israel Hernandez, DRE 02148476.</p></div>
    </footer>`;
}

function buildResearchPacket(article, route, marketData, metricSummaries, sources) {
  const missing = metricSummaries.filter((metric) => metric.missing);
  const available = metricSummaries.filter((metric) => !metric.missing);
  const keywordPlan = keywordPlanForArticle(article, route, metricSummaries);
  const isSeller = article.internalReaderAvatar === "seller";
  const countyPropertySourceLabel =
    route.county === "Orange" ? "Orange County Assessor records" : "Los Angeles County Assessor records";
  const businessGoal = isSeller
    ? "Convert local market-update readers into a private pricing, prep, timing, and launch-readiness conversation."
    : "Convert local market-update readers into an offer-readiness conversation or buyer consultation.";
  const searchIntent = isSeller
    ? "local informational query with seller pricing and listing decision support"
    : "local informational query with buyer decision support";
  const readerSpecificFindings = isSeller
    ? [
        "Active inventory, new listings, pending sales, closed sales, months supply, days on market, price per square foot, and sale price movement were reviewed before drafting.",
        `Active inventory and new listings were treated as public competition signals for a ${route.name} sale plan.`,
        "Pending sales were read as a leading demand signal, while closed sales were treated as lagging proof.",
        "Days-on-market and months-supply data were used to frame launch-window risk, not to promise a price outcome.",
        "The article asks the reader to verify condition, staging, access, permits, HOA documents if applicable, required local reports, insurance questions, disclosure issues, and competing listings before choosing a list price.",
        "The copy avoids future price claims, ROI claims, and any statement that a citywide metric proves what one specific home should list for."
      ]
    : [
        "Active inventory, new listings, pending sales, closed sales, months supply, days on market, price per square foot, and sale price movement were reviewed before drafting.",
        `More inventory can give ${route.name} buyers comparison room, but pending and closed activity must be checked before assuming broad weakness.`,
        "Days-on-market and months-supply data can support patience only after checking property type, condition, pocket, price band, and showing activity.",
        "Price-per-square-foot movement helps orient the search, but the article avoids using it as a shortcut for valuing one home.",
        "The article asks the reader to verify school boundaries, city jurisdiction, inspection scope, appraisal support, permits, flood/seismic overlays, HOA documents, and insurance before shortening protections."
      ];
  const manualVerificationNeeded = isSeller
    ? [
        keywordPlan.keywordPlannerFindings
          ? "Google Keyword Planner seed metrics were captured for this page; still review autocomplete, People Also Ask, and the live SERP before treating the headline as final."
          : "Review the generated seller seed queries in Google Keyword Planner for search volume, close variants, and local phrasing before treating the headline as a final keyword target.",
        "Verify current MLS status, active competition, recent pendings, showing activity, listing history, and property-level comparable sales before choosing a list price.",
        "Verify required local reports, permit history, disclosure issues, HOA restrictions, insurance availability, flood and seismic overlays by address.",
        "Confirm net proceeds, payoff questions, tax questions, and timing constraints with the right professionals before relying on a sale plan.",
        "Review condition, staging, repair, and pre-listing inspection questions with the appropriate professionals before spending money or going public."
      ]
    : [
        keywordPlan.keywordPlannerFindings
          ? "Google Keyword Planner seed metrics were captured for this page; still review autocomplete, People Also Ask, and the live SERP before treating the headline as final."
          : "Review the generated seed queries in Google Keyword Planner for search volume, close variants, and local phrasing before treating the headline as a final keyword target.",
        "Verify current MLS status, listing history, showing activity, and property-level comparable sales before writing an offer.",
        "Verify school boundary, permits, residential building report, HOA rules, insurance availability, flood and seismic overlays by address.",
        "Confirm loan terms, rate, credits, appraisal risk, and monthly payment with the lender before relying on payment assumptions.",
        "Review disclosures and inspection findings with the appropriate professionals before waiving or shortening protections."
      ];
  return {
    slug: route.slug,
    locationName: route.name,
    locationType: route.kind,
    county: route.county,
    internalReaderAvatar: article.internalReaderAvatar,
    publicAngle: keywordPlan.primaryQuestion,
    visibleAvatarLabelsAllowed: false,
    keywordResearchUsed: {
      businessGoal,
      searchIntent,
      coreEntityMap: {
        location: route.name,
        market: `${route.name} housing market`,
        reportPeriod: keywordPlan.reportPeriod,
        sourceDataPeriod: keywordPlan.dataPeriod,
        metrics: [
          "median sale price",
          "active inventory",
          "new listings",
          "pending sales",
          "closed sales",
          "days on market",
          "months supply",
          "price per square foot",
          "mortgage rates"
        ],
        relatedEntities: [
          "CRMLS",
          "InfoSparks",
          "Freddie Mac PMMS",
          `${route.county} County records`,
          "FEMA flood maps",
          "California Geological Survey",
          "local schools",
          "major employers",
          "neighborhoods",
          "property type"
        ]
      },
      tool: "Google Keyword Planner",
      keywordPlannerGate: {
        status: "passed",
        requiredTool: "Google Keyword Planner",
        requiredAccessMethod: "Chrome browser",
        cacheKey: keywordPlannerCacheKey(route, article.internalReaderAvatar),
        accessMethod: keywordPlan.keywordPlannerFindings?.accessMethod || "",
        collectedAt: keywordPlan.keywordPlannerFindings?.collectedAt || "",
        seedMetricCount: keywordPlan.keywordPlannerFindings?.seedMetrics?.length || 0
      },
      status: keywordPlan.keywordPlannerStatus,
      keywordPlannerFindings: keywordPlan.keywordPlannerFindings,
      seedQueries: keywordPlan.seedQueries,
      secondaryKeywords: keywordPlan.secondaryKeywords,
      autocompletePrompts: keywordPlan.autocompletePrompts,
      peopleAlsoAskTargets: keywordPlan.peopleAlsoAskTargets,
      manualSeoGate: keywordPlan.manualSeoGate,
      manualSerpAuditTemplate: {
        topResultsToReview: 10,
        fields: ["page title", "URL", "source type", "freshness", "content type", "search intent", "weakness", "manual difficulty score"],
        difficultyScale: {
          "1": "easy: weak local blogs, outdated posts, low-quality pages, no clear answer",
          "2": "moderate: local competitors but thin or stale content",
          "3": "competitive: portals plus some strong local pages",
          "4": "hard: national portals, news sites, strong brokerages, fresh content",
          "5": "very hard: major authority sites dominate and intent is not article-friendly"
        }
      },
      contentGapsToBeat: keywordPlan.contentGaps,
      opportunityScore: keywordPlan.opportunityScore,
      titleBrief: keywordPlan.titleBrief,
      primaryNaturalLanguageQuestion: keywordPlan.primaryQuestion,
      titleChosen: keywordPlan.headline,
      manualVerificationNeeded: keywordPlan.keywordPlannerFindings
        ? "Review Google autocomplete, People Also Ask, and a manual SERP audit before treating the headline as final."
        : "Run the seed queries through authenticated Google Ads Keyword Planner before treating the headline as a final paid-search or high-volume SEO target."
    },
    researchFocus: article.researchFocus,
    marketDataUsed: available.map((metric) => ({
      key: metric.key,
      label: metric.label,
      latestValue: metric.latestValue,
      latestPeriod: metric.latestPeriod,
      previousMonthChange: metric.monthChangePercent,
      yearOverYearChange: metric.yearChangePercent,
      threeMonthDirection: metric.threeMonthDirection,
      sourceFile: metric.sourceFile,
      sourceDate: metric.sourceDate
    })),
    marketMetricsUsed: available,
    macroContextUsed: [
      {
        source: "Freddie Mac PMMS",
        finding: `The national 30-year fixed-rate mortgage average was 6.43% as of July 2, 2026, keeping payment sensitivity relevant for ${route.name} ${isSeller ? "pricing and buyer-demand decisions" : "offer decisions"}.`,
        url: sourceBank.freddieMacPmms.url
      }
    ],
    readerSpecificFindings,
    investorEconomicFindings: [],
    investorSupplyDemandFindings: [],
    investorDemographicFindings: [],
    investorLegalFrameworkFindings: [],
    locationSpecificFindings: [
      ...(article.locationSpecificFindings || []),
      "FEMA's Map Service Center is the official public source for NFIP flood hazard information; coastal, low-lying, and flood-map questions should be checked by address.",
      "The California Geological Survey earthquake-zone app should be used for address-level seismic hazard screening.",
      `${countyPropertySourceLabel} and city or county permit resources should be checked by address before relying on public descriptions or listing copy.`,
      "School-boundary, HOA, insurance, permit, and local-report requirements can be address-specific and should not be assumed from citywide market data."
    ],
    sourceUrls: sources.map((source) => source.url),
    sourceNotes: sources.map((source) => ({
      label: source.label,
      url: source.url,
      sourceType: source.sourceType
    })),
    claimsSupported: [
      `${route.name} market interpretation is based on CRMLS / InfoSparks data collected from the local market JSON.`,
      `The public report period is ${keywordPlan.reportPeriod}; the latest completed local metric period used in the article is ${keywordPlan.dataPeriod}, with source dates carried from the local market JSON where available.`,
      "Freddie Mac PMMS is used only as brief mortgage-rate context, not as a forecast.",
      `Local due-diligence claims are tied to CRMLS / InfoSparks, FEMA, CGS, California DRE, CFPB, Census, ${countyPropertySourceLabel}, and address-level verification sources.`
    ],
    claimsAvoided: [
      "No appreciation forecast.",
      "No claim that one citywide metric proves a specific home's value.",
      isSeller ? "No promise that a faster or slower metric guarantees a sale price or sale timeline." : "No promise that a slower metric guarantees negotiation leverage.",
      "No lending, legal, tax, insurance, school assignment, flood, seismic, or HOA advice.",
      "No claim that mortgage rates will move in a specific direction."
    ],
    missingData: [
      ...missing.map((metric) => ({
        key: metric.key,
        label: metric.label,
        status: metric.missingStatus,
        sourceFile: metric.sourceFile,
        sourceDate: metric.sourceDate
      })),
      {
        key: "priceReductions",
        label: "Price reductions",
        status: marketData.location?.metricsMissing || "not exposed in the current InfoSparks CRMLS metric config",
        sourceFile: `market-trends/data/${route.slug}.json`,
        sourceDate: marketData.location?.dataFrom || ""
      }
    ],
    manualVerificationNeeded,
    citationGaps: [
      "CRMLS / InfoSparks export is local market proof but is not a public government source.",
      "Price reduction counts are not available in the current market JSON.",
      "Property-level hazard, school, permit, HOA, and insurance conclusions require address-specific verification."
    ],
    collectedAt: today
  };
}

function metaForArticle(article, route, marketData, metricSummaries, sources) {
  const cta = pulseCtaForAvatar(article.internalReaderAvatar, { route, metricSummaries });
  const regionLabel = route.subregion || route.regionGroup || `${route.county} County`;
  const comparisonAreas = [regionLabel, ...(article.comparisonSlugs || [])].filter(Boolean);
  const keywordPlan = keywordPlanForArticle(article, route, metricSummaries);
  const displayTitle = keywordPlan.headline;
  const isSeller = article.internalReaderAvatar === "seller";
  return {
    topicId: `pulse-${route.slug}-${article.internalReaderAvatar}`,
    status: "live",
    intent: "housing-market-pulse",
    slug: route.slug,
    title: keywordPlan.seoTitle,
    seoTitle: keywordPlan.seoTitle,
    displayTitle,
    summary: keywordPlan.subheader,
    href: `housing-market-pulse/${route.slug}/`,
    type: "Market Pulse",
    category: "Housing Market Pulse",
    stage: article.stage,
    year: 2026,
    priority: article.priority,
    visitorIntent: isSeller
      ? `I want to understand ${route.name} market pace, buyer demand, competition, and pricing risk before choosing a list price or launch plan.`
      : `I want to understand ${route.name} market pace, pricing, and risk before deciding how to write an offer.`,
    visitorQuestion: keywordPlan.primaryQuestion,
    primaryAreas: [route.name],
    comparisonAreas,
    tags: [
      "Housing Market Pulse",
      "Market update",
      route.name,
      regionLabel,
      "Inventory",
      isSeller ? "Seller pricing" : "Offer timing",
      "Market data",
      "Due diligence"
    ],
    areas: [route.name, regionLabel, `${route.county} County`, ...comparisonAreas],
    searchKeywords: [
      ...keywordPlan.seedQueries,
      `${route.name} housing market update`,
      `${route.name} market pulse`,
      `${route.name} inventory`,
      `${route.name} homes for sale market`,
      `${regionLabel} market data`,
      isSeller ? `${route.name} listing strategy` : `${route.name} offer timing`
    ],
    image: "assets/portal/additional resource photos/real estate market concept.png",
    imageAlt: "Real estate market concept visual representing local inventory, pricing, and offer timing",
    imageContext: "Existing site market concept visual used for local market interpretation articles.",
    heroCaption: article.heroCaption,
    sourceNoteIntro: `This Pulse uses CRMLS / InfoSparks data for ${route.name}, with the article read and chart defaulting to the Residential / Single family live MLS slice sourced from ${marketData.location?.additionalDataFrom || marketData.location?.dataFrom || "the local market export"}. The broader Residential export is also available from ${marketData.location?.dataFrom || "the local market export"}. It also uses official city, school, federal, state, and consumer sources for local due-diligence context. Use this as orientation, not a property valuation, legal opinion, lending quote, insurance opinion, school assignment, or forecast.`,
    primaryCta: cta.articleOffer,
    secondaryCta: "Search Housing Market Pulse",
    leadCaptureOffer: cta.articleOffer,
    researchFolder: `housing-market-pulse/research/${route.slug}__${article.internalReaderAvatar}.json`,
    researchDatabaseKeys: [route.slug, ...(article.comparisonSlugs || []), article.internalReaderAvatar],
    preferredPhotoSource: "Existing HomesByIsraelHE market concept visual",
    videoPlaylists: [],
    relatedTopicIds: article.relatedTopicIds,
    sourceUrls: sources.map((source) => source.url),
    sourceNotes: sources.map((source) => ({
      label: source.label,
      url: source.url,
      sourceType: source.sourceType
    })),
    createdDate: today,
    updatedDate: today,
    notes: [
      "Housing Market Pulse generated from structured manifest.",
      `Keyword intent angle: ${keywordPlan.angle}. Primary keyword: ${keywordPlan.titleBrief.primaryKeyword}. Google Keyword Planner seed queries: ${keywordPlan.seedQueries.join("; ")}.`,
      `Keyword Planner hard gate passed via ${keywordPlan.keywordPlannerFindings?.accessMethod || "Chrome browser"} for cache key ${keywordPlannerCacheKey(route, article.internalReaderAvatar)}.`,
      "Research packet records editorial context. Visible avatar labels are prohibited and were not used in public page headings, badges, or category labels.",
      `Market metrics reviewed: ${metricSummaries.filter((metric) => !metric.missing).map((metric) => metric.key).join(", ")}.`,
      `Missing/no-data metrics: ${metricSummaries.filter((metric) => metric.missing).map((metric) => metric.key).join(", ") || "none"}.`
    ].join(" ")
  };
}

function articleHtml(article, route, marketData, comparisonMarketData, metricSummaries, sources) {
  const depth = "../../";
  const locationName = route.name;
  const keywordPlan = keywordPlanForArticle(article, route, metricSummaries);
  const isSeller = article.internalReaderAvatar === "seller";
  const displayTitle = keywordPlan.headline;
  const periodLabel = keywordPlan.reportPeriod;
  const latestCompletedPeriod = keywordPlan.dataPeriod;
  const activeInventory = metricByKey(metricSummaries, "activeInventory");
  const newListings = metricByKey(metricSummaries, "newListings");
  const pendingSales = metricByKey(metricSummaries, "pendingSales");
  const closedSales = metricByKey(metricSummaries, "closedSales");
  const monthsSupply = metricByKey(metricSummaries, "monthsSupply");
  const medianDays = metricByKey(metricSummaries, "medianDaysOnMarket");
  const medianPrice = metricByKey(metricSummaries, "medianSalePrice");
  const ppsf = metricByKey(metricSummaries, "averagePpsf");
  const marketSlice = selectedMarketSlice(marketData);
  const comparisonNames = comparisonMarketData.map((data) => data.location?.name || data.location?.zip).filter(Boolean);
  const comparisonText = listText(comparisonNames);
  const localRiskText = article.localRiskText || "property type, condition, commute, school-boundary assumptions, insurance, permits, and neighborhood-level fit";
  const thinSample = Number(closedSales.latestValue || 0) < 8 || Number(pendingSales.latestValue || 0) < 5;
  const sampleCaveat = thinSample
    ? `Because ${locationName} is showing a thinner current sample, read each signal as directional and confirm it with property-specific comps before leaning on it.`
    : isSeller
      ? "Because product mix can change quickly, read each signal against the actual homes competing with yours before choosing price or prep."
      : "Because product mix can change quickly, read each signal against the actual homes competing with the one you want.";
  const guideHref = localAreaGuideHref(article, route, depth);
  const guideTitle = localAreaGuideTitle(article, route);
  const sourceIntro = `Market data is from CRMLS / InfoSparks for ${locationName}. This ${periodLabel} report reads the latest completed ${latestCompletedPeriod} ${marketSlice.label} live MLS slice from ${marketData.location?.additionalDataFrom || marketData.location?.dataFrom || "the latest local export"}; the broader Residential export is dated ${marketData.location?.dataFrom || "the latest local export"}. Public context comes from official federal, state, county, Census, DRE, CFPB, FEMA, CGS, Freddie Mac, and address-level verification sources.`;
  const faqItems = isSeller
    ? [
        {
          question: `Is now a good time to sell in ${locationName}?`,
          answer: `Use the market as a pricing and timing check, not a yes-or-no answer. Active inventory is ${formatMetricValue(activeInventory)}, pending sales are ${formatMetricValue(pendingSales)}, and months supply is ${formatMetricValue(monthsSupply)}. Read those with condition, access, showing activity, and nearby competition before choosing a launch plan.`
        },
        {
          question: `Can I price aggressively in ${locationName} right now?`,
          answer: `Only if the home can defend the number. Median sale price is ${formatMetricValue(medianPrice)}, average price per square foot is ${formatMetricValue(ppsf)}, and median days active in MLS is ${formatMetricValue(medianDays)}. Those are starting points; the list price still needs recent comparable sales, condition proof, and a clean buyer-confidence story.`
        },
        {
          question: `Are closed sales hiding a softer current ${locationName} market?`,
          answer: `They can. Closed sales are ${formatMetricValue(closedSales)}, but closings usually reflect decisions made weeks earlier. Compare them with pending sales, active inventory, new listings, and days on market before relying on closed-sale strength alone.`
        },
        {
          question: "What should I fix or document before listing?",
          answer: `Start with the items most likely to create buyer hesitation: condition, access, permits, required local reports, HOA documents if applicable, insurance questions, disclosure issues, and anything affected by ${localRiskText}.`
        },
        {
          question: "What should I watch before choosing a list price?",
          answer: "Watch active competition, recent pendings, the last 30-60 days of closed sales, days on market, showing activity, buyer objections, price reductions where available, and the gap between your timing needs and the market's current pace."
        }
      ]
    : [
        {
          question: `Are ${locationName} home prices going down in ${periodLabel}?`,
          answer: `The price signal needs a careful read. Median sale price is ${formatMetricValue(medianPrice)}, while average price per square foot is ${formatMetricValue(ppsf)}. Those numbers can move because the mix of homes changed, so use them as orientation and verify property-level comparable sales before deciding what to offer.`
        },
        {
          question: `Is ${locationName} a buyer's market in ${periodLabel}?`,
          answer: `Do not decide from one label. Active inventory is ${formatMetricValue(activeInventory)}, pending sales are ${formatMetricValue(pendingSales)}, and months supply is ${formatMetricValue(monthsSupply)}. Read those together with days on market, condition, location, and showing activity before assuming full buyer leverage.`
        },
        {
          question: `How competitive is the ${locationName} housing market right now?`,
          answer: `Competition depends on the specific home. Median days active in MLS is ${formatMetricValue(medianDays)}, but a clean, well-priced home can still move faster than the citywide pace. Compare the home against current alternatives before choosing speed or patience.`
        },
        {
          question: "Can I use price per square foot to decide what to offer?",
          answer: `Use it as a rough comparison tool only. In ${locationName}, ${localRiskText} can make two homes with the same square footage behave very differently.`
        },
        {
          question: "What should I verify before shortening protections?",
          answer: "Verify inspection scope, appraisal support, loan terms, HOA documents if applicable, permit history, any city or county transfer report that applies, school boundary, insurance availability, flood and seismic map overlays, and any property-specific disclosure issue."
        }
      ];
  const quickVerificationBullet = isSeller
    ? "Verify active competition, recent pendings, condition, access, required reports, permit questions, disclosure package, likely buyer objections, and net-proceeds/timing pressure before relying on any citywide signal."
    : "Verify the specific address, property type, disclosure package, inspection scope, appraisal support, and monthly payment before relying on any citywide signal.";
  const keySignalsIntro = isSeller
    ? `Here is the current July read from the ${locationName} ${marketSlice.label} live MLS slice, using the latest completed ${latestCompletedPeriod} InfoSparks data. These numbers help frame price, prep, timing, and buyer-demand risk, but they do not replace property-specific comparable sales, condition, access, or neighborhood-level review.`
    : `Here is the current July read from the ${locationName} ${marketSlice.label} live MLS slice, using the latest completed ${latestCompletedPeriod} InfoSparks data. These numbers are useful for orientation, but they do not replace property-specific comparable sales, condition, terms, or neighborhood-level review.`;
  const narrativeHtml = isSeller
    ? `              <p>Active inventory is ${escapeHtml(formatMetricValue(activeInventory))} in ${escapeHtml(activeInventory.latestPeriod || "the latest period")}, ${escapeHtml(formatChange(activeInventory, "yearChangePercent"))} from a year earlier. That is the public competition set your launch has to sit inside, especially if buyers are also comparing ${escapeHtml(locationName)} with ${escapeHtml(comparisonText)}.</p>
              <p>Demand needs a leading and lagging read. Pending sales are ${escapeHtml(formatMetricValue(pendingSales))}, and closed sales are ${escapeHtml(formatMetricValue(closedSales))}. Pending activity shows what buyers are choosing now; closed sales prove what already happened. Price, prep, access, and showing strategy should respond to both.</p>
              <p>Pricing needs more than a headline number. The median sale price is ${escapeHtml(formatMetricValue(medianPrice))}, while average price per square foot is ${escapeHtml(formatMetricValue(ppsf))}. Those are useful anchors, but ${escapeHtml(locationName)} can shift quickly by ${escapeHtml(localRiskText)}. ${escapeHtml(sampleCaveat)}</p>`
    : `              <p>Active inventory is ${escapeHtml(formatMetricValue(activeInventory))} in ${escapeHtml(activeInventory.latestPeriod || "the latest period")}, ${escapeHtml(formatChange(activeInventory, "yearChangePercent"))} from a year earlier. That gives you a starting read on choice, especially if you are comparing ${escapeHtml(locationName)} with ${escapeHtml(comparisonText)}.</p>
              <p>Choice does not automatically mean broad weakness. Pending sales are ${escapeHtml(formatMetricValue(pendingSales))}, and closed sales are ${escapeHtml(formatMetricValue(closedSales))}. Those are demand and liquidity signals, so the practical read is balanced: move quickly for a well-priced, well-located, well-documented home, but do not ignore negotiation, inspection, or appraisal questions just because the address is desirable.</p>
              <p>Pricing needs a careful read. The median sale price is ${escapeHtml(formatMetricValue(medianPrice))}, while average price per square foot is ${escapeHtml(formatMetricValue(ppsf))}. Those are useful anchors, but ${escapeHtml(locationName)} can shift quickly by ${escapeHtml(localRiskText)}. ${escapeHtml(sampleCaveat)}</p>`;
  const decisionHtml = isSeller
    ? `            <section class="article-section">
              <h2>The decision in front of you</h2>
              <p>If current demand is keeping up with inventory, a clean, well-priced launch can still earn attention. If inventory is rising, days are stretching, or buyer payment pressure is showing up, the listing needs sharper price proof, cleaner prep, stronger access, and fewer unanswered objections.</p>
              <div class="article-callout">
                <strong>Best next step:</strong>
                <p>Before listing, compare your home against active alternatives, recent pendings, the last 30-60 days of closed sales, condition gaps, buyer objections, required reports or permit questions, and your real timing and net-proceeds goals.</p>
              </div>
            </section>`
    : `            <section class="article-section">
              <h2>The decision in front of you</h2>
              <p>If the home is fresh, clean, easy to show, properly documented, and priced against current competition, you may still need to be decisive. If it has longer market time, unresolved inspection questions, HOA friction, insurance uncertainty, or an ambitious price, the data gives you permission to slow down and ask better questions.</p>
              <div class="article-callout">
                <strong>Best next step:</strong>
                <p>Before writing, compare the property against active alternatives, recent pendings if available, the last 30-60 days of closed sales, inspection risk, appraisal support, HOA or permit issues, and your real payment at today's quoted loan terms.</p>
              </div>
            </section>`;
  const scenarioHtml = isSeller
    ? `            <section class="article-section pulse-scenario-section">
              <h2>Decision scenarios</h2>
              <p>Hover or tap a card to pressure-test the decision in front of you.</p>
              <div class="pulse-insight-grid" aria-label="${escapeHtml(locationName)} decision scenario insights">
                <button class="pulse-insight-card" type="button" data-pulse-flip-card aria-expanded="false">
                  <span class="pulse-insight-card-inner">
                    <span class="pulse-insight-face pulse-insight-front">
                      <span class="pulse-insight-label">Price confidence</span>
                      <strong>You want the highest defensible price</strong>
                      <span>Use recent comps, current active competition, condition, access, and buyer objections before choosing the public number.</span>
                      <em>Tap to pressure-test this</em>
                    </span>
                    <span class="pulse-insight-face pulse-insight-back">
                      <span class="pulse-insight-label">Advisor insight</span>
                      <strong>Ambition needs evidence.</strong>
                      <span>The right number is the highest price your proof can defend before days on market start working against you.</span>
                      <em>Ask: What proves the price?</em>
                    </span>
                  </span>
                </button>
                <button class="pulse-insight-card" type="button" data-pulse-flip-card aria-expanded="false">
                  <span class="pulse-insight-card-inner">
                    <span class="pulse-insight-face pulse-insight-front">
                      <span class="pulse-insight-label">Prep tradeoff</span>
                      <strong>The home needs prep or documentation</strong>
                      <span>Separate cosmetic polish from buyer-confidence issues such as permits, reports, inspection flags, HOA friction, or insurance questions.</span>
                      <em>Tap to pressure-test this</em>
                    </span>
                    <span class="pulse-insight-face pulse-insight-back">
                      <span class="pulse-insight-label">Advisor insight</span>
                      <strong>Prep should remove doubt.</strong>
                      <span>Spend where it makes buyers safer, faster, or more confident. Skip work that only makes the seller feel busier.</span>
                      <em>Ask: What objection disappears?</em>
                    </span>
                  </span>
                </button>
                <button class="pulse-insight-card" type="button" data-pulse-flip-card aria-expanded="false">
                  <span class="pulse-insight-card-inner">
                    <span class="pulse-insight-face pulse-insight-front">
                      <span class="pulse-insight-label">Launch timing</span>
                      <strong>You need timing control</strong>
                      <span>Compare market pace with your move timeline, showing access, prep calendar, next-home pressure, and buyer financing risk.</span>
                      <em>Tap to pressure-test this</em>
                    </span>
                    <span class="pulse-insight-face pulse-insight-back">
                      <span class="pulse-insight-label">Advisor insight</span>
                      <strong>The launch window is leverage.</strong>
                      <span>A clean first two weeks gives buyers fewer reasons to wait, discount, or test your urgency.</span>
                      <em>Ask: What timing is real?</em>
                    </span>
                  </span>
                </button>
              </div>
            </section>`
    : `            <section class="article-section pulse-scenario-section">
              <h2>Decision scenarios</h2>
              <p>Hover or tap a card to pressure-test the decision in front of you.</p>
              <div class="pulse-insight-grid" aria-label="${escapeHtml(locationName)} decision scenario insights">
                <button class="pulse-insight-card" type="button" data-pulse-flip-card aria-expanded="false">
                  <span class="pulse-insight-card-inner">
                    <span class="pulse-insight-face pulse-insight-front">
                      <span class="pulse-insight-label">Decision speed</span>
                      <strong>You found a strong new listing</strong>
                      <span>Use speed, clean terms, and clear lender communication if the price is already aligned with current competition.</span>
                      <em>Tap to pressure-test this</em>
                    </span>
                    <span class="pulse-insight-face pulse-insight-back">
                      <span class="pulse-insight-label">Advisor insight</span>
                      <strong>Fast only works when risk is small.</strong>
                      <span>If the price fits the comps, protect the unknowns: inspection, appraisal, HOA, permits, and payment.</span>
                      <em>Ask: What could cost me later?</em>
                    </span>
                  </span>
                </button>
                <button class="pulse-insight-card" type="button" data-pulse-flip-card aria-expanded="false">
                  <span class="pulse-insight-card-inner">
                    <span class="pulse-insight-face pulse-insight-front">
                      <span class="pulse-insight-label">Negotiation room</span>
                      <strong>The home has been sitting</strong>
                      <span>Use the extra market time to understand whether the issue is price, condition, access, HOA, insurance, layout, or seller expectations.</span>
                      <em>Tap to pressure-test this</em>
                    </span>
                    <span class="pulse-insight-face pulse-insight-back">
                      <span class="pulse-insight-label">Advisor insight</span>
                      <strong>Days on market explain, not discount.</strong>
                      <span>Find why it sat before cutting price: access, condition, insurance, HOA, or stale seller expectations.</span>
                      <em>Ask: What proves the lower offer?</em>
                    </span>
                  </span>
                </button>
                <button class="pulse-insight-card" type="button" data-pulse-flip-card aria-expanded="false">
                  <span class="pulse-insight-card-inner">
                    <span class="pulse-insight-face pulse-insight-front">
                      <span class="pulse-insight-label">Area tradeoff</span>
                      <strong>You are comparing nearby areas</strong>
                      <span>Compare ${escapeHtml(locationName)} against ${escapeHtml(comparisonText)} by property type, condition, payment, and daily-life fit.</span>
                      <em>Tap to pressure-test this</em>
                    </span>
                    <span class="pulse-insight-face pulse-insight-back">
                      <span class="pulse-insight-label">Advisor insight</span>
                      <strong>The better market fits the tradeoff.</strong>
                      <span>A cheaper area can lose its edge once commute, parking, schools, HOA, repairs, or payment changes daily life.</span>
                      <em>Ask: Which tradeoff still works later?</em>
                    </span>
                  </span>
                </button>
              </div>
            </section>`;
  const advisorHtml = isSeller
    ? `            <section class="article-section">
              <h2>Advisor note</h2>
              <p>${escapeHtml(locationName)} is a place where ${escapeHtml(localRiskText)} can change the entire launch read. I would use the market data as a pressure test, then set the pricing, prep, access, and timing plan property by property.</p>
              <p>The safest posture is neither panic nor overconfidence. Know what the current numbers say, know what your home can prove, and remove the objections buyers are most likely to use against the price.</p>
            </section>`
    : `            <section class="article-section">
              <h2>Advisor note</h2>
              <p>${escapeHtml(locationName)} is a place where ${escapeHtml(localRiskText)} can change the entire read. I would use the market data as a pressure test, then make the offer decision property by property.</p>
              <p>The safest posture is neither panic nor overconfidence. Know what the current numbers say, know what the specific home is hiding or proving, and keep enough protection in the offer to verify the parts the market data cannot see.</p>
            </section>`;
  const relatedRailThirdLink = isSeller
    ? `<a href="${resourceHref("sellPrepPricing", depth)}"><strong>Review seller prep and pricing timing</strong><span>Use the seller planning hub before choosing a launch plan.</span></a>`
    : `<a href="${depth}buy/how-to-use-days-on-market-and-price-reductions-before-making-an-offer/"><strong>Use days on market before offering</strong><span>Turn listing history into offer context.</span></a>`;
  const cta = pulseCtaForAvatar(article.internalReaderAvatar, { route, metricSummaries });
  const canonicalUrl = `https://homesbyisraelhe.com/housing-market-pulse/${route.slug}/`;
  const imageUrl = "https://homesbyisraelhe.com/assets/portal/additional%20resource%20photos/real%20estate%20market%20concept.png";
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": "https://homesbyisraelhe.com/#real-estate-agent",
        name: "Israel Hernandez",
        url: "https://homesbyisraelhe.com/",
        telephone: "+1-424-243-1233",
        email: "Homesbyisraelhe@gmail.com",
        brand: {
          "@type": "Brand",
          name: "Think Boutiq Real Estate"
        }
      },
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: displayTitle,
        description: keywordPlan.subheader,
        image: imageUrl,
        datePublished: today,
        dateModified: today,
        author: {
          "@id": "https://homesbyisraelhe.com/#real-estate-agent"
        },
        publisher: {
          "@id": "https://homesbyisraelhe.com/#real-estate-agent"
        },
        mainEntityOfPage: canonicalUrl,
        articleSection: "Housing Market Pulse",
        about: [
          `${route.name} housing market`,
          `${marketSlice.label} market data`,
          isSeller ? "seller pricing" : "buyer offer timing",
          isSeller ? "listing timing" : "offer risk"
        ],
        citation: sources.map((source) => ({
          "@type": "CreativeWork",
          name: source.label,
          url: source.url
        }))
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://homesbyisraelhe.com/"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Housing Market Pulse",
            item: "https://homesbyisraelhe.com/housing-market-pulse/"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: route.name,
            item: canonicalUrl
          }
        ]
      }
    ]
  };

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(keywordPlan.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(keywordPlan.subheader)}">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <link rel="stylesheet" href="${depth}styles.css">
    <link rel="stylesheet" href="${depth}market-trends/market-destination.css">
    <link rel="stylesheet" href="${depth}article.css?v=buyer-kit-20260707h">
    <script type="application/ld+json">${escapeJsonForHtml(articleSchema)}</script>
  </head>
  <body data-article-slug="${escapeHtml(route.slug)}" data-article-title="${escapeHtml(displayTitle)}" data-article-offer="${escapeHtml(cta.articleOffer)}" data-article-intent-label="Housing Market Pulse" data-pulse-avatar="${escapeHtml(article.internalReaderAvatar)}">
    <a class="skip-link" href="#main">Skip to main content</a>
${headerHtml(depth)}
${searchPanelHtml(depth)}

    <main id="main" class="article-main">
      <article class="article-wrap">
        <div class="article-top-band">
          <nav class="article-breadcrumb" aria-label="Breadcrumb">
            <a href="${depth}index.html">Home</a>
            <span aria-hidden="true">/</span>
            <a href="../">Housing Market Pulse</a>
            <span aria-hidden="true">/</span>
            <span>${escapeHtml(route.name)}</span>
          </nav>

          <header class="article-hero">
            <div>
              <p class="article-kicker">Housing Market Pulse</p>
              <h1 class="article-title">${escapeHtml(displayTitle)}</h1>
              <p class="article-dek">${escapeHtml(keywordPlan.subheader)}</p>
              <div class="article-meta">
                <span>By <strong>Israel Hernandez</strong></span>
                <span>Updated ${displayDate}</span>
                <span>${escapeHtml(route.county)} County</span>
                <span>${escapeHtml(periodLabel)} report</span>
                <span>Latest MLS period: ${escapeHtml(latestCompletedPeriod)}</span>
              </div>
${heroCtaHtml(cta)}
${profileSocialLinksHtml()}
            </div>
            <figure class="article-hero-media">
              <img src="${depth}assets/portal/additional resource photos/real estate market concept.png" alt="Real estate market concept visual representing local inventory, pricing, and offer timing">
              <figcaption class="article-hero-caption">${escapeHtml(article.heroCaption)}</figcaption>
            </figure>
          </header>
        </div>

        <div class="article-shell">
          <div class="article-body">
            <p class="lead-paragraph">${escapeHtml(article.leadParagraph)}</p>

            <section class="answer-first" aria-labelledby="answer-first-${escapeHtml(route.slug)}">
              <p class="article-category-label">Quick answer</p>
              <h2 id="answer-first-${escapeHtml(route.slug)}">Quick answer</h2>
              <ul>
${keywordPlan.quickSummaryBullets.map((bullet) => `                <li>${escapeHtml(bullet)}</li>`).join("\n")}
                <li>Use the live dashboard for the raw charts: <a href="${depth}market-trends/${escapeHtml(route.slug)}/">${escapeHtml(locationName)} market trends</a>.</li>
                <li>${escapeHtml(quickVerificationBullet)}</li>
              </ul>
              <p class="answer-first-updated">Updated ${displayDate}</p>
            </section>

            <section class="article-section">
              <h2>${escapeHtml(periodLabel)} key market signals</h2>
              <p>${escapeHtml(keySignalsIntro)}</p>
${pulseSignalExplorerHtml(route, marketData, comparisonMarketData, metricSummaries)}
            </section>

            <section class="article-section">
              <h2>The narrative behind the numbers</h2>
${narrativeHtml}
            </section>

${decisionHtml}

${scenarioHtml}

${advisorHtml}

            <section class="article-section">
              <h2>FAQ</h2>
              <div class="pulse-faq-list">
${faqItems
  .map(
    (item) => `                <details class="pulse-faq-item">
                  <summary>${escapeHtml(item.question)}</summary>
                  <p>${escapeHtml(item.answer)}</p>
                </details>`
  )
  .join("\n")}
              </div>
            </section>

${sourceNotesHtml(sources, sourceIntro)}
${homebotWidgetHtml(article.internalReaderAvatar)}
          </div>

          <aside class="article-rail" aria-label="Related market routes">
            <section class="rail-card">
              <h2>Related decisions</h2>
              <div class="rail-list">
                <a href="${depth}market-trends/${escapeHtml(route.slug)}/"><strong>Open the ${escapeHtml(locationName)} dashboard</strong><span>Use the charts behind this Pulse read.</span></a>
                <a href="${escapeHtml(guideHref)}"><strong>${escapeHtml(guideTitle)}</strong><span>Compare daily-life fit, local context, and nearby alternatives.</span></a>
                ${relatedRailThirdLink}
              </div>
            </section>
            <section class="rail-card article-intake-card" id="contact-israel" aria-labelledby="article-intake-title">
              <p class="article-category-label">${escapeHtml(cta.railLabel)}</p>
              <h2 id="article-intake-title">${escapeHtml(cta.railTitle)}</h2>
              <p>${escapeHtml(cta.railIntro)}</p>
              <button class="button button-primary" type="button" data-open-lead>${escapeHtml(cta.railButton)}</button>
${cta.railSecondary ? `              <button class="article-intake-secondary" type="button" data-open-lead>${escapeHtml(cta.railSecondary)}</button>` : ""}
            </section>
${supportingCtasHtml(cta, depth)}
          </aside>
        </div>
      </article>
    </main>

${footerHtml(depth)}

    <div class="article-lead-modal" id="article-lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-title" hidden>
      <div class="lead-backdrop" data-close-lead></div>
      <div class="lead-dialog">
        <button class="lead-close" type="button" aria-label="Close lead form" data-close-lead>x</button>
        <div class="lead-dialog-copy">
          <p class="article-category-label">${escapeHtml(cta.modalLabel)}</p>
          <h2 id="lead-title">${escapeHtml(cta.modalTitle)}</h2>
          <p>${escapeHtml(cta.modalIntro)}</p>
        </div>
        <div class="lead-dialog-form">
          <form class="lead-form">
${leadModalFieldsHtml(article, route)}
            <button class="button button-primary" type="submit">${escapeHtml(cta.modalSubmit)}</button>
            <button class="keep-reading" type="button" data-close-lead>${article.internalReaderAvatar === "buyer" ? "Keep reading" : "No thanks, keep reading"}</button>
          </form>
        </div>
      </div>
    </div>
    <script src="${depth}library-data.js"></script>
    <script src="${depth}guidance-search.js"></script>
    <script src="${depth}lead-client.js?v=lead-routing-20260702"></script>
    <script src="${depth}article.js?v=nav-routing-20260708c"></script>
  </body>
</html>
`;
}

function indexHtml(generatedArticles) {
  const depth = "../";
  const cards = generatedArticles
    .map(
      ({ article, route }) => `              <a href="./${escapeHtml(route.slug)}/" data-topic-id="pulse-${escapeHtml(route.slug)}-${escapeHtml(article.internalReaderAvatar)}">
                <img src="${depth}assets/portal/additional resource photos/real estate market concept.png" alt="Market data visual for ${escapeHtml(route.name)}">
                <span class="related-card-meta"><span class="article-category">Housing Market Pulse</span></span>
                <strong>${escapeHtml(article.displayTitle || article.title)}</strong>
              </a>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Housing Market Pulse | HomesByIsraelHE</title>
    <meta name="description" content="Plain-English local housing market updates by city and ZIP, built from CRMLS / InfoSparks data and local due-diligence context.">
    <link rel="stylesheet" href="${depth}styles.css">
    <link rel="stylesheet" href="${depth}article.css?v=buyer-kit-20260707h">
  </head>
  <body data-article-slug="housing-market-pulse" data-article-title="Housing Market Pulse" data-article-offer="Ask a market timing question" data-article-intent-label="Housing Market Pulse">
    <a class="skip-link" href="#main">Skip to main content</a>
${headerHtml(depth)}
${searchPanelHtml(depth)}

    <main id="main" class="article-main">
      <article class="article-wrap">
        <div class="article-top-band">
          <nav class="article-breadcrumb" aria-label="Breadcrumb">
            <a href="${depth}index.html">Home</a>
            <span aria-hidden="true">/</span>
            <span>Housing Market Pulse</span>
          </nav>
          <header class="article-hero">
            <div>
              <p class="article-kicker">Housing Market Pulse</p>
              <h1 class="article-title">Local market reads before the decision gets loud.</h1>
              <p class="article-dek">Use CRMLS / InfoSparks market data, local due-diligence context, and plain-English interpretation before deciding how to act in a city or ZIP.</p>
              <div class="article-meta">
                <span>By <strong>Israel Hernandez</strong></span>
                <span>Updated ${displayDate}</span>
                <span>Los Angeles County, Orange County, and nearby Southern California</span>
              </div>
            </div>
            <figure class="article-hero-media">
              <img src="${depth}assets/portal/additional resource photos/real estate market concept.png" alt="Real estate market concept visual for Housing Market Pulse">
              <figcaption class="article-hero-caption">Start with the signal, then pressure-test the specific property.</figcaption>
            </figure>
          </header>
        </div>
        <div class="article-shell">
          <div class="article-body">
            <section class="answer-first" aria-labelledby="pulse-index-answer">
              <p class="article-category-label">Quick answer</p>
              <h2 id="pulse-index-answer">Choose a city or ZIP, then read the market through the decision.</h2>
              <ul>
                <li>Pulse pages use the same branded article shell, source notes, metadata, tracker flow, and citation audit as the existing guide library.</li>
                <li>Each Pulse read keeps the decision framing inside the copy instead of using public audience badges or labels.</li>
                <li>For raw charts, use the <a href="${depth}market-trends/">Market Trends finder</a>.</li>
              </ul>
              <p class="answer-first-updated">Updated ${displayDate}</p>
            </section>
            <section class="related-grid-section" id="article-library" aria-labelledby="pulse-library-title">
              <h2 id="pulse-library-title">Latest Housing Market Pulse reads</h2>
              <div class="related-article-grid">
${cards || `                <a href="${depth}market-trends/?mode=pulse#article-library"><strong>Choose a location from the market finder</strong></a>`}
              </div>
            </section>
          </div>
          <aside class="article-rail" aria-label="Housing Market Pulse support">
            <section class="rail-card">
              <h2>Use the live finder</h2>
              <div class="rail-list">
                <a href="${depth}market-trends/?mode=pulse#article-library"><strong>Find a Pulse by city or ZIP</strong><span>Use the Market Trends hub route picker.</span></a>
                <a href="${depth}market-trends/#article-library"><strong>Open raw market trends</strong><span>Inspect inventory, price, pace, and activity charts.</span></a>
              </div>
            </section>
          </aside>
        </div>
      </article>
    </main>
${footerHtml(depth)}
    <script src="${depth}library-data.js"></script>
    <script src="${depth}guidance-search.js"></script>
    <script src="${depth}lead-client.js?v=lead-routing-20260702"></script>
    <script src="${depth}article.js?v=nav-routing-20260708c"></script>
  </body>
</html>
`;
}

async function generate() {
  const keywordPlannerCache = await loadKeywordPlannerCache();
  const marketIndex = await readJson(marketIndexPath);
  const pulseArticles = buildPulseArticles(marketIndex);
  const prepared = [];
  const keywordPlannerGaps = [];
  const generated = [];
  const skipped = [];

  await fs.mkdir(pulseRoot, { recursive: true });
  await fs.mkdir(researchRoot, { recursive: true });

  for (const article of pulseArticles) {
    const route = (marketIndex.locations || []).find((location) => location.slug === article.routeSlug);
    if (!route) {
      skipped.push({ slug: article.routeSlug, reason: "Route not found in market-index.json." });
      continue;
    }

    const marketDataPath = path.join(marketDataRoot, `${route.slug}.json`);
    if (!(await pathExists(marketDataPath))) {
      skipped.push({ slug: route.slug, reason: `Missing market data file at ${path.relative(siteRoot, marketDataPath)}.` });
      continue;
    }

    const marketData = await readJson(marketDataPath);
    const comparisonMarketData = [];
    for (const comparisonSlug of article.comparisonSlugs || []) {
      const comparisonPath = path.join(marketDataRoot, `${comparisonSlug}.json`);
      if (await pathExists(comparisonPath)) {
        comparisonMarketData.push(await readJson(comparisonPath));
      }
    }
    const marketSlice = selectedMarketSlice(marketData);
    const metricSummaries = requiredMetricKeys.map((key) =>
      summarizeMetric(marketData, key, {
        metrics: marketSlice.metrics,
        sliceLabel: `${marketSlice.label} live MLS slice`,
        sourceDate: marketData.location?.additionalDataFrom || marketData.location?.dataFrom || ""
      })
    );
    const sources = sourceList(article, marketData, route);
    const keywordPlan = keywordPlanForArticle(article, route, metricSummaries);
    const keywordPlannerGap = keywordPlannerGateIssue(route, article, keywordPlan);
    if (keywordPlannerGap) keywordPlannerGaps.push(keywordPlannerGap);

    prepared.push({
      article,
      route,
      marketData,
      comparisonMarketData,
      metricSummaries,
      sources
    });
  }

  if (keywordPlannerGaps.length) {
    console.error(
      JSON.stringify(
        {
          generatedAt: today,
          routeFamily: "/housing-market-pulse/",
          status: "blocked",
          reason: "Google Keyword Planner hard gate failed. No Housing Market Pulse pages were written.",
          requestedAvatar,
          keywordPlannerCache: {
            path: path.relative(siteRoot, keywordPlannerCache.path),
            entriesLoaded: keywordPlannerCache.loaded
          },
          requiredTool: "Google Keyword Planner",
          requiredAccessMethod: "Chrome browser",
          missingOrInvalidCount: keywordPlannerGaps.length,
          missingOrInvalidKeywordPlannerRecords: keywordPlannerGaps
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  for (const { article, route, marketData, comparisonMarketData, metricSummaries, sources } of prepared) {
    const articleDir = path.join(pulseRoot, route.slug);

    await fs.mkdir(articleDir, { recursive: true });
    await fs.writeFile(
      path.join(articleDir, "index.html"),
      articleHtml(article, route, marketData, comparisonMarketData, metricSummaries, sources)
    );
    await writeJson(path.join(articleDir, "article.meta.json"), metaForArticle(article, route, marketData, metricSummaries, sources));
    await writeJson(
      path.join(researchRoot, `${route.slug}__${article.internalReaderAvatar}.json`),
      buildResearchPacket(article, route, marketData, metricSummaries, sources)
    );

    generated.push({
      article: {
        ...article,
        displayTitle: articleDisplayTitle(article, route, metricSummaries)
      },
      route,
      files: [
        path.relative(siteRoot, path.join(articleDir, "index.html")),
        path.relative(siteRoot, path.join(articleDir, "article.meta.json")),
        path.relative(siteRoot, path.join(researchRoot, `${route.slug}__${article.internalReaderAvatar}.json`))
      ],
      missingMetrics: metricSummaries.filter((metric) => metric.missing).map((metric) => metric.key)
    });
  }

  await fs.writeFile(path.join(pulseRoot, "index.html"), indexHtml(generated));

  console.log(
    JSON.stringify(
      {
        generatedAt: today,
        routeFamily: "/housing-market-pulse/",
        generatedPages: generated.map((item) => `/housing-market-pulse/${item.route.slug}/`),
        generatedFiles: [
          "housing-market-pulse/index.html",
          ...generated.flatMap((item) => item.files)
        ],
        skipped,
        scopedBatch: {
          requestedAvatar,
          requestedLocation: "All city routes in market-index.json",
          routeSource: "market-index.json locations where kind is city",
          note: `Generated one ${requestedAvatar}-centered Housing Market Pulse article for each city route in the market index.`
        },
        keywordPlannerGate: {
          status: "passed",
          requiredTool: "Google Keyword Planner",
          requiredAccessMethod: "Chrome browser",
          cachePath: path.relative(siteRoot, keywordPlannerCache.path),
          entriesLoaded: keywordPlannerCache.loaded
        },
        missingMetricsByPage: Object.fromEntries(generated.map((item) => [item.route.slug, item.missingMetrics]))
      },
      null,
      2
    )
  );
}

await generate();
