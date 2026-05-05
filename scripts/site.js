(() => {
  "use strict";

  // ---------- DOM helpers ----------
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // el(tag, attrs?, ...children) — build an HTMLElement.
  // attrs: 'class' → className; 'text' → textContent; everything else via setAttribute.
  // children: strings become text nodes; nodes are appended as-is; null/false/undefined skipped.
  // Boolean attribute values: true → setAttribute(name, ""), false/null/undefined → omitted.
  const el = (tag, attrs = {}, ...kids) => {
    const e = document.createElement(tag);
    for (const k in attrs) {
      const v = attrs[k];
      if (v === false || v === null || v === undefined) continue;
      if (k === "class")      e.className = String(v);
      else if (k === "text")  e.textContent = String(v);
      else if (v === true)    e.setAttribute(k, "");
      else                    e.setAttribute(k, String(v));
    }
    for (const k of kids.flat()) {
      if (k === null || k === false || k === undefined) continue;
      if (typeof k === "string" || typeof k === "number") {
        e.appendChild(document.createTextNode(String(k)));
      } else {
        e.appendChild(k);
      }
    }
    return e;
  };

  // SVG variant.
  const SVG_NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, ...kids) => {
    const e = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) e.setAttribute(k, String(attrs[k]));
    for (const k of kids.flat()) if (k) e.appendChild(k);
    return e;
  };

  // Replace all children of a node.
  const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); };
  const setText = (node, txt) => { node.textContent = String(txt ?? ""); };

  // ---------- Video URL helpers ----------
  const VIDEO_DIR = "videos/";
  const fileURL = (name) => VIDEO_DIR + String(name).split("/").map(encodeURIComponent).join("/");
  const tileURL = (name) => fileURL(name) + "#t=0.5";   // mid-clip poster
  const pad2 = (n) => String(n).padStart(2, "0");

  // ---------- Manifest fetch (cached promise) ----------
  let _manifestPromise = null;
  function loadManifest() {
    if (_manifestPromise) return _manifestPromise;
    _manifestPromise = fetch("videos.json", { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error("manifest " + r.status);
      return r.json();
    });
    return _manifestPromise;
  }

  // ---------- Footer year ----------
  const yearNode = $("[data-current-year]");
  if (yearNode) setText(yearNode, new Date().getFullYear());

  // ---------- Page-fade overlay ----------
  const fade = $("[data-page-fade]");
  function revealPage() {
    if (!fade) return;
    fade.classList.add("is-hidden");
  }

  // ---------- Smooth scroll for in-page #anchors ----------
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest("a[href^='#']");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    ev.preventDefault();
    const startY = window.scrollY;
    const endY = Math.max(0, target.getBoundingClientRect().top + startY);
    const dist = endY - startY;
    if (Math.abs(dist) < 2) { window.scrollTo(0, endY); return; }
    const duration = Math.min(1400, Math.max(700, Math.abs(dist) * 0.6));
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, startY + dist * easeOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
      else history.pushState(null, "", href);
    };
    requestAnimationFrame(step);
  });

  // ---------- Sticky-nav pinned state ----------
  const nav = $("[data-nav]");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-pinned", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- Expose ----------
  window.WJY = {
    $, $$, el, svgEl, clear, setText,
    fileURL, tileURL,
    pad2,
    loadManifest,
    revealPage
  };

  document.documentElement.classList.add("is-ready");
})();
