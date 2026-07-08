(() => {
  const DEFAULT_ENDPOINT = "/api/leads";
  const DEFAULT_TIMEOUT_MS = 4500;

  function clean(value, max = 1000) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
  }

  function locationValue() {
    try {
      return window.location.href;
    } catch {
      return "";
    }
  }

  function collectAttribution() {
    const params = new URLSearchParams(window.location.search || "");
    const attribution = {
      referrer: document.referrer || "",
      landing_url: locationValue()
    };
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_owner"].forEach((key) => {
      attribution[key] = clean(params.get(key), 200);
    });
    return attribution;
  }

  function pageContext(extra = {}) {
    return {
      url: locationValue(),
      path: window.location.pathname || "",
      title: document.title || "",
      ...extra
    };
  }

  function formDataObject(formData) {
    const output = {};
    for (const [key, value] of formData.entries()) {
      if (output[key]) {
        output[key] = Array.isArray(output[key]) ? output[key].concat(value) : [output[key], value];
      } else {
        output[key] = value;
      }
    }
    return output;
  }

  function normalizePayload(payload) {
    const routeKey = clean(payload.routeKey || "owned_site_inquiry", 120);
    const idempotencyKey =
      payload.idempotencyKey ||
      (window.crypto?.randomUUID ? window.crypto.randomUUID() : `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const page = pageContext(payload.page || {});
    const attribution = {
      ...collectAttribution(),
      ...(payload.attribution || {})
    };
    return {
      ...payload,
      version: "2026-07-02",
      idempotencyKey,
      routeKey,
      sourceSystem: "homesbyisraelhe.com",
      submittedAt: new Date().toISOString(),
      page,
      attribution
    };
  }

  function pushDataLayer(eventName, params = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params
    });
  }

  function showLeadNotice(message, type = "success") {
    let notice = document.querySelector("[data-lead-capture-notice]");
    if (!notice) {
      notice = document.createElement("div");
      notice.className = "lead-capture-notice";
      notice.setAttribute("role", type === "error" ? "alert" : "status");
      notice.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
      notice.dataset.leadCaptureNotice = "";
      document.body.append(notice);
    }
    window.clearTimeout(notice._hbiTimer);
    notice.className = `lead-capture-notice is-${type}`;
    notice.textContent = message;
    notice.hidden = false;
    if (type !== "error") {
      notice._hbiTimer = window.setTimeout(() => {
        notice.hidden = true;
      }, 6500);
    }
  }

  async function submitLead(payload, options = {}) {
    const normalized = normalizePayload(payload || {});
    const endpoint = options.endpoint || window.HBI_LEAD_ENDPOINT || DEFAULT_ENDPOINT;
    const timeoutMs = Number(options.timeoutMs || DEFAULT_TIMEOUT_MS);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);

    pushDataLayer("owned_lead_submit_attempt", {
      route_key: normalized.routeKey,
      form_type: normalized.formType || "",
      cta_location: normalized.formLocation || ""
    });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-HBI-Lead-Route": normalized.routeKey
        },
        body: JSON.stringify(normalized),
        credentials: "same-origin",
        signal: controller.signal
      });
      const text = await response.text();
      const body = text ? JSON.parse(text) : {};
      if (!response.ok || body.ok === false) {
        throw new Error(body.error || `lead_endpoint_${response.status}`);
      }
      pushDataLayer("owned_lead_submit_success", {
        route_key: normalized.routeKey,
        lead_id: body.leadId || "",
        dry_run: Boolean(body.dryRun)
      });
      return { ok: true, body };
    } catch (error) {
      pushDataLayer("owned_lead_submit_error", {
        route_key: normalized.routeKey,
        error: error instanceof Error ? error.message : String(error)
      });
      if (options.continueOnFailure) {
        return { ok: false, fallback: "continue" };
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  window.HBILeadClient = {
    submitLead,
    collectAttribution,
    formDataObject,
    pageContext,
    showLeadNotice
  };
})();
