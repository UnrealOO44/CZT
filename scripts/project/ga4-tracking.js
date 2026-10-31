/**
 * GA4 / GTM measurement for "Secrets of Czechia - The Golem Unleashed".
 * Implements CZEC601_Implementation_brief_TGU_300726 (Martin Neuschl / Neuschl2).
 *
 * SELF-CONTAINED: this one file installs the CookieScript CMP snippet and the GTM
 * container snippet (in that order - CMP must load first so consent state exists
 * before any tag fires), AND exposes the window.ga4.* functions below. You do not
 * need to hand-edit index.html for any of this - just include this file and it does
 * the rest at load time.
 *
 * HOW TO INCLUDE (do this once, in the Construct project, not in exported output):
 *   - Add this file to the project (Construct 3: Project Bar -> Files, or a "Scripts"
 *     folder depending on your project's setup) so it gets bundled on export.
 *   - Reference it as an ordinary <script src="ga4-tracking.js"></script> as EARLY as
 *     possible in <head> - before any other game scripts, so window.ga4 exists before
 *     anything tries to call it. In Construct 3 this is usually done by adding it as a
 *     "global script" / external file included on every page, or via the project's
 *     "Head HTML" injection setting if one exists - ask whoever owns the export step
 *     if unsure. Nothing about placement is engine-specific; it's a plain <script>.
 *   - Then call window.ga4.<method>(...) from event sheets at the moments described
 *     below - e.g. Construct's "Browser: Execute JavaScript" (or equivalent) action,
 *     passing something like: window.ga4.levelStart(1)
 *
 * WHAT NOT TO CHANGE: this script owns dataLayer/GTM/CookieScript/consent entirely.
 * Never gate a window.ga4 call on consent state yourselves - always call it
 * unconditionally at the described moment; consent gating happens inside GTM.
 *
 * LOCATION IDS (used throughout - pass the number, the name is resolved for you):
 *   1 charles_bridge        4 kafka_monument
 *   2 old_town_square       5 old_jewish_cemetery
 *   3 crucifix_bastion      6 old_new_synagogue  (no resume code - it's the last one)
 */

(function () {
  'use strict';

  var GTM_CONTAINER_ID = 'GTM-KTF4K4R7';
  var COOKIESCRIPT_SRC = '//cdn.cookie-script.com/s/7c9f4d4f5550ccfa843b332c11498f34.js';

  // ---- 1. CookieScript CMP (must be first) --------------------------------------
  var cmp = document.createElement('script');
  cmp.type = 'text/javascript';
  cmp.charset = 'UTF-8';
  cmp.src = COOKIESCRIPT_SRC;
  document.head.appendChild(cmp);

  // ---- 2. GTM container -----------------------------------------------------------
  window.dataLayer = window.dataLayer || [];
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GTM_CONTAINER_ID);

  // GTM's <noscript> fallback iframe needs a <body> to attach to. If this script runs
  // before <body> exists (it should, since it's meant to load early in <head>), wait
  // for it; if <body> already exists (script included late), insert immediately.
  function insertNoscriptFallback() {
    var ns = document.createElement('noscript');
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + GTM_CONTAINER_ID;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    ns.appendChild(iframe);
    document.body.insertBefore(ns, document.body.firstChild);
  }
  if (document.body) {
    insertNoscriptFallback();
  } else {
    document.addEventListener('DOMContentLoaded', insertNoscriptFallback);
  }

  // ---- 3. Tracking API --------------------------------------------------------------
  var LOCATIONS = {
    1: 'charles_bridge',
    2: 'old_town_square',
    3: 'crucifix_bastion',
    4: 'kafka_monument',
    5: 'old_jewish_cemetery',
    6: 'old_new_synagogue'
  };

  function locationName(locationId) {
    var name = LOCATIONS[locationId];
    if (!name) {
      console.warn('[ga4-tracking] unrecognized location id: ' + locationId + ' (expected 1-6)');
    }
    return name;
  }

  var attemptCounts = {};

  window.ga4 = {
    /** Low-level: push any event with a ga4_data payload. Prefer the named
     * helpers below where one exists - they enforce the brief's exact shape. */
    push: function (event, data) {
      window.dataLayer.push({ event: event, ga4_data: data || {} });
    },

    /** Call once, when the initial instructions screen auto-displays on load.
     * Do NOT call again if the player reopens instructions from a menu. */
    tutorialView: function () {
      window.ga4.push('tutorial_view', {});
    },

    /** Call when a location's scene/puzzle becomes active - all 6 locations,
     * including re-entering one via a valid resume code. */
    levelStart: function (locationId) {
      window.ga4.push('level_start', {
        location_id: locationId,
        location_name: locationName(locationId)
      });
    },

    /** Call every time the player submits a puzzle answer, success or fail.
     * Tracks attempt_number per location automatically (starts at 1, increments
     * each call for that location this session) - don't count it yourselves.
     * On success this also fires level_complete with the matching attempts_total,
     * so you only need this one call for both events. */
    puzzleAttempt: function (locationId, success) {
      var n = (attemptCounts[locationId] || 0) + 1;
      attemptCounts[locationId] = n;
      window.ga4.push('puzzle_attempt', {
        location_id: locationId,
        location_name: locationName(locationId),
        attempt_number: n,
        result: success ? 'success' : 'fail'
      });
      if (success) {
        window.ga4.push('level_complete', {
          location_id: locationId,
          location_name: locationName(locationId),
          attempts_total: n
        });
      }
    },

    /** Call every time the player opens the contextual hint (top-left help icon). */
    hintOpen: function (locationId) {
      window.ga4.push('hint_open', {
        location_id: locationId,
        location_name: locationName(locationId)
      });
    },

    /** Call when a location's return code is displayed after solving it.
     * Only locations 1-5 have a code (6 is the last location, nothing to resume to). */
    resumeCodeView: function (locationId) {
      window.ga4.push('resume_code_view', {
        location_id: locationId,
        location_name: locationName(locationId)
      });
    },

    /** Call when the side menu opens (top-right icon). */
    menuOpen: function () {
      window.ga4.push('menu_open', {});
    },

    /** Call right before opening a visitczechia.com link.
     * placement: 'side_menu' or 'puzzle_success'. */
    outboundClick: function (placement, url) {
      window.ga4.push('outbound_click', {
        link_placement: placement,
        link_url: url
      });
    },

    /** Call once, when the player reaches the final screen after solving
     * location 6 (Old-New Synagogue). */
    gameComplete: function () {
      window.ga4.push('game_complete', {});
    },

    /** Call only after a successful newsletter email submit on the final screen -
     * not on button click, not on failed validation. */
    newsletterSignup: function () {
      window.ga4.push('newsletter_signup', {});
    }
  };
})();
