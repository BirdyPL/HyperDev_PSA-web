/* =====================================================================
   HYPERDEV — landing page interactions
   Theme toggle · mobile nav · scroll reveal · i18n (EN/PL)
   ===================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- Theme toggle (persisted) ---------- */
  const THEME_KEY = "hyperdev-theme";
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById("header");
  const onScroll = function () {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- i18n (EN / PL) ---------- */
  const LANG_KEY = "hyperdev-lang";
  const dicts = (window.HD_I18N = window.HD_I18N || {}); // PL etc. from translations.js

  function applyTranslations(dict) {
    if (!dict) return;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
  }

  function setLangButtons(lang) {
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
  }

  function loadLang(lang) {
    if (lang !== "en" && !dicts[lang]) lang = "en"; // graceful fallback
    root.setAttribute("lang", lang);
    setLangButtons(lang);
    localStorage.setItem(LANG_KEY, lang);
    applyTranslations(dicts[lang] || dicts.en);
  }

  // Snapshot the baked-in EN copy so we can switch back without a reload.
  (function snapshotEn() {
    const en = {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      en[el.getAttribute("data-i18n")] = el.textContent;
    });
    dicts.en = en;
  })();

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { loadLang(b.getAttribute("data-lang")); });
  });

  const startLang = localStorage.getItem(LANG_KEY) || "en";
  if (startLang !== "en") loadLang(startLang);
  else setLangButtons("en");
})();
