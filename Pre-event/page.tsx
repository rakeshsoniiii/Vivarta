"use client"
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineLocationOn } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { BsCalendar3, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { HiArrowRight, HiX } from "react-icons/hi";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --red:#e11d48; --red-dim:#9f1239;
    --red-glow:rgba(225,29,72,.38);
    --white:#f8fafc; --white-dim:rgba(248,250,252,.65); --white-muted:rgba(248,250,252,.36);
    --black:#080808; --gray:#2a2a2a;
  }

  /* ── Background ── */
  .pe-bg-grid {
    position:fixed; inset:0; pointer-events:none; z-index:0;
    background-image:linear-gradient(rgba(225,29,72,.035) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(225,29,72,.035) 1px,transparent 1px);
    background-size:48px 48px;
    mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);
  }
  .pe-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; filter:blur(90px); opacity:.14; }
  .pe-orb-1 { width:520px; height:520px; top:-100px; left:-100px; background:var(--red); animation:peOrbA 16s ease-in-out infinite; }
  .pe-orb-2 { width:380px; height:380px; bottom:10%; right:-80px; background:var(--red-dim); animation:peOrbB 20s ease-in-out infinite; }
  @keyframes peOrbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,40px)} }
  @keyframes peOrbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,-60px)} }
  .pe-scan { position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.35;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px); }

  .pe-section { background:var(--black); color:var(--white); font-family:'DM Sans',sans-serif; position:relative; overflow:hidden; min-height:100vh; }
  .pe-inner { max-width:1280px; margin:0 auto; padding:3rem 1.25rem 5rem; position:relative; z-index:1; }

  /* ── Scroll reveal ── */
  .rv     { opacity:0; transform:translateY(40px); transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1); }
  .rv.vis { opacity:1; transform:none; }
  .sg > * { opacity:0; transform:translateY(28px) scale(.97); transition:opacity .5s cubic-bezier(.22,1,.36,1),transform .5s cubic-bezier(.22,1,.36,1); }
  .sg.vis > *:nth-child(1){opacity:1;transform:none;transition-delay:.04s}
  .sg.vis > *:nth-child(2){opacity:1;transform:none;transition-delay:.10s}
  .sg.vis > *:nth-child(3){opacity:1;transform:none;transition-delay:.16s}
  .sg.vis > *:nth-child(4){opacity:1;transform:none;transition-delay:.22s}
  .sg.vis > *:nth-child(5){opacity:1;transform:none;transition-delay:.28s}
  .sg.vis > *:nth-child(6){opacity:1;transform:none;transition-delay:.34s}
  .sg.vis > *:nth-child(n+7){opacity:1;transform:none;transition-delay:.40s}

  /* ── HERO ── */
  .pe-hero { margin-bottom:3.5rem; }
  .pe-eyebrow { display:inline-flex; align-items:center; gap:10px; font-family:'Rajdhani',sans-serif; font-size:.78rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--red); margin-bottom:1.1rem; }
  .pe-eyebrow::before { content:''; width:28px; height:2px; background:var(--red); display:block; }
  .pe-h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(4rem,11vw,8.5rem); line-height:.9; letter-spacing:.02em; color:var(--white); margin:0 0 .4rem; }
  .pe-h1 span { color:var(--red); }
  .pe-rule { display:flex; align-items:center; gap:14px; margin:1.4rem 0 1.6rem; }
  .pe-rule::before { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--red),transparent); }
  .pe-rule-dot { width:7px; height:7px; border-radius:50%; background:var(--red); flex-shrink:0; animation:pulseDot 2.2s ease-in-out infinite; }
  @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 var(--red-glow)} 50%{box-shadow:0 0 0 10px transparent} }
  .pe-hero-p { font-size:clamp(.94rem,2vw,1.06rem); line-height:1.8; color:var(--white-muted); max-width:620px; }

  /* ── STATS ── */
  .pe-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:18px; margin-bottom:4rem; padding:1.5rem 1.4rem; background:rgba(255,255,255,.022); border:1px solid rgba(225,29,72,.16); border-radius:16px; }
  .pe-stat { text-align:center; }
  .pe-stat-n { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.8rem,4vw,2.8rem); color:var(--red); line-height:1; }
  .pe-stat-l { font-family:'DM Sans',sans-serif; font-size:.7rem; color:var(--white-muted); letter-spacing:.1em; text-transform:uppercase; margin-top:4px; }

  /* ── Domain header ── */
  .dom-section { margin-bottom:4rem; }
  .dom-header { display:flex; align-items:center; gap:16px; margin-bottom:1.8rem; }
  .dom-header::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--gray),transparent); }
  .dom-icon-box { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; }
  .dom-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.8rem,4vw,2.6rem); letter-spacing:.05em; }
  .dom-count { font-family:'Rajdhani',sans-serif; font-size:.72rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; padding:4px 12px; border-radius:100px; white-space:nowrap; }

  /* ── Divider ── */
  .pe-divider { display:flex; align-items:center; gap:12px; margin:3rem 0 2rem; }
  .pe-divider::before,.pe-divider::after { content:''; flex:1; height:1px; background:var(--gray); }
  .pe-divider-dot { width:8px; height:8px; border-radius:50%; background:var(--red); box-shadow:0 0 10px var(--red-glow); }

  /* ────────────────────────────────────
     PRE-EVENT CARD
     Image area = slideshow
  ──────────────────────────────────── */
  .pe-grid { display:grid; gap:18px; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); }
  @media(max-width:640px){ .pe-grid{ grid-template-columns:1fr; gap:14px; } }

  .pec {
    position:relative; border-radius:18px; overflow:hidden;
    display:flex; flex-direction:column; cursor:default;
    transform-style:preserve-3d; will-change:transform;
    transition:box-shadow .42s cubic-bezier(.22,1,.36,1), border-color .42s ease;
  }
  .pec::after  { content:''; position:absolute; inset:0; border-radius:18px; background:linear-gradient(145deg,rgba(255,255,255,.04) 0%,transparent 50%); pointer-events:none; z-index:1; }
  .pec::before { content:''; position:absolute; top:0; left:13%; right:13%; height:1px; border-radius:1px; opacity:.75; z-index:2; }

  /* ── SLIDESHOW WRAPPER ── */
  .pec-slides {
    position:relative; width:100%; aspect-ratio:16/9;
    overflow:hidden; flex-shrink:0;
  }
  /* individual slide */
  .pec-slide {
    position:absolute; inset:0;
    opacity:0; transition:opacity .6s cubic-bezier(.22,1,.36,1);
    pointer-events:none;
  }
  .pec-slide.active { opacity:1; pointer-events:all; }
  .pec-slide img { object-fit:cover; object-position:center; transition:transform .55s cubic-bezier(.22,1,.36,1), filter .55s ease; filter:brightness(.88) saturate(1.1); }
  .pec:hover .pec-slide.active img { transform:scale(1.07); filter:brightness(1.02) saturate(1.18); }
  /* bottom gradient */
  .pec-slides::after { content:''; position:absolute; inset:0; z-index:2; background:linear-gradient(to bottom,transparent 40%,rgba(8,8,8,.8) 100%); pointer-events:none; }

  /* Prev / Next buttons */
  .pec-btn {
    position:absolute; top:50%; z-index:5;
    width:30px; height:30px; border-radius:50%; transform:translateY(-50%);
    background:rgba(8,8,8,.72); border:1px solid rgba(255,255,255,.14);
    backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    color:var(--white-dim); cursor:pointer;
    opacity:0; transition:opacity .25s ease, background .22s ease, transform .22s ease;
  }
  .pec-btn-prev { left:8px; }
  .pec-btn-next { right:8px; }
  .pec:hover .pec-btn { opacity:1; }
  .pec-btn:hover { background:rgba(225,29,72,.45); color:#fff; transform:translateY(-50%) scale(1.12); }

  /* Dot indicators */
  .pec-dots {
    position:absolute; bottom:10px; left:50%; transform:translateX(-50%);
    z-index:5; display:flex; gap:5px; align-items:center;
  }
  .pec-dot {
    width:5px; height:5px; border-radius:50%;
    background:rgba(255,255,255,.35);
    transition:background .3s ease, transform .3s ease;
    cursor:pointer;
  }
  .pec-dot.active { background:var(--red); transform:scale(1.4); }

  /* Count badge top-left */
  .pec-img-count {
    position:absolute; top:10px; left:10px; z-index:5;
    font-family:'Rajdhani',sans-serif; font-size:.66rem; font-weight:700; letter-spacing:.1em;
    background:rgba(8,8,8,.82); border:1px solid rgba(255,255,255,.12);
    backdrop-filter:blur(6px); padding:4px 10px; border-radius:8px; color:var(--white-dim);
  }

  /* ── CARD BODY ── */
  .pec-body { padding:16px 18px 20px; display:flex; flex-direction:column; flex:1; position:relative; z-index:2; }
  .pec-title { font-family:'Rajdhani',sans-serif; font-size:1.05rem; font-weight:700; letter-spacing:.03em; color:var(--white); line-height:1.3; margin-bottom:8px; text-transform:uppercase; }
  .pec-desc { font-family:'DM Sans',sans-serif; font-size:.79rem; line-height:1.65; color:var(--white-muted); margin-bottom:12px; flex:1;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .pec-meta { display:flex; flex-direction:column; gap:4px; margin-bottom:14px; }
  .pec-meta-row { display:flex; align-items:center; gap:6px; font-family:'DM Sans',sans-serif; font-size:.72rem; color:var(--white-muted); }
  .pec-meta-row svg { flex-shrink:0; opacity:.65; }

  /* Expand / more info hint */
  .pec-expand-hint {
    display:inline-flex; align-items:center; gap:5px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.72rem; letter-spacing:.1em; text-transform:uppercase;
    opacity:.45; margin-top:4px;
  }

  /* ── Domain colour variants (card) ── */
  .pec-mechmania  { background:linear-gradient(158deg,#1c0a0d 0%,#0e0e0e 55%,#1a0809 100%); border:1px solid rgba(225,29,72,.24);  box-shadow:0 4px 20px rgba(225,29,72,.06); }
  .pec-mechmania::before  { background:linear-gradient(90deg,transparent,rgba(225,29,72,.65),transparent); }
  .pec-mechmania:hover  { border-color:rgba(225,29,72,.7);  box-shadow:0 20px 54px rgba(225,29,72,.22),0 0 0 1px rgba(225,29,72,.3); }
  .pec-robotics   { background:linear-gradient(158deg,#080e1c 0%,#0e0e0e 55%,#091018 100%); border:1px solid rgba(56,189,248,.2);  box-shadow:0 4px 20px rgba(56,189,248,.05); }
  .pec-robotics::before   { background:linear-gradient(90deg,transparent,rgba(56,189,248,.6),transparent); }
  .pec-robotics:hover   { border-color:rgba(56,189,248,.6); box-shadow:0 20px 54px rgba(56,189,248,.16),0 0 0 1px rgba(56,189,248,.24); }
  .pec-fun        { background:linear-gradient(158deg,#081408 0%,#0e0e0e 55%,#091209 100%); border:1px solid rgba(74,222,128,.2);  box-shadow:0 4px 20px rgba(74,222,128,.05); }
  .pec-fun::before        { background:linear-gradient(90deg,transparent,rgba(74,222,128,.6),transparent); }
  .pec-fun:hover        { border-color:rgba(74,222,128,.6); box-shadow:0 20px 54px rgba(74,222,128,.16),0 0 0 1px rgba(74,222,128,.24); }
  .pec-gaming     { background:linear-gradient(158deg,#100a1a 0%,#0e0e0e 55%,#120c1c 100%); border:1px solid rgba(192,132,252,.2); box-shadow:0 4px 20px rgba(192,132,252,.05); }
  .pec-gaming::before     { background:linear-gradient(90deg,transparent,rgba(192,132,252,.6),transparent); }
  .pec-gaming:hover     { border-color:rgba(192,132,252,.6);box-shadow:0 20px 54px rgba(192,132,252,.16),0 0 0 1px rgba(192,132,252,.24); }
  .pec-innovation { background:linear-gradient(158deg,#160c04 0%,#0e0e0e 55%,#140b04 100%); border:1px solid rgba(251,146,60,.2);  box-shadow:0 4px 20px rgba(251,146,60,.05); }
  .pec-innovation::before { background:linear-gradient(90deg,transparent,rgba(251,146,60,.6),transparent); }
  .pec-innovation:hover { border-color:rgba(251,146,60,.6); box-shadow:0 20px 54px rgba(251,146,60,.16),0 0 0 1px rgba(251,146,60,.24); }
  .pec-computing  { background:linear-gradient(158deg,#061414 0%,#0e0e0e 55%,#071414 100%); border:1px solid rgba(45,212,191,.2);  box-shadow:0 4px 20px rgba(45,212,191,.05); }
  .pec-computing::before  { background:linear-gradient(90deg,transparent,rgba(45,212,191,.6),transparent); }
  .pec-computing:hover  { border-color:rgba(45,212,191,.6); box-shadow:0 20px 54px rgba(45,212,191,.16),0 0 0 1px rgba(45,212,191,.24); }
  .pec-designing  { background:linear-gradient(158deg,#18060e 0%,#0e0e0e 55%,#16060c 100%); border:1px solid rgba(244,114,182,.2); box-shadow:0 4px 20px rgba(244,114,182,.05); }
  .pec-designing::before  { background:linear-gradient(90deg,transparent,rgba(244,114,182,.6),transparent); }
  .pec-designing:hover  { border-color:rgba(244,114,182,.6);box-shadow:0 20px 54px rgba(244,114,182,.16),0 0 0 1px rgba(244,114,182,.24); }

  /* domain colour tokens */
  .badge-mechmania  { background:rgba(225,29,72,.14);  border:1px solid rgba(225,29,72,.35);  color:#fca5a5; }
  .badge-robotics   { background:rgba(56,189,248,.12); border:1px solid rgba(56,189,248,.35); color:#7dd3fc; }
  .badge-fun        { background:rgba(74,222,128,.12); border:1px solid rgba(74,222,128,.35); color:#86efac; }
  .badge-gaming     { background:rgba(192,132,252,.12);border:1px solid rgba(192,132,252,.35);color:#d8b4fe; }
  .badge-innovation { background:rgba(251,146,60,.12); border:1px solid rgba(251,146,60,.35); color:#fdba74; }
  .badge-computing  { background:rgba(45,212,191,.12); border:1px solid rgba(45,212,191,.35); color:#5eead4; }
  .badge-designing  { background:rgba(244,114,182,.12);border:1px solid rgba(244,114,182,.35);color:#f9a8d4; }

  .icon-mechmania  { background:rgba(225,29,72,.15); }
  .icon-robotics   { background:rgba(56,189,248,.12); }
  .icon-fun        { background:rgba(74,222,128,.12); }
  .icon-gaming     { background:rgba(192,132,252,.12);}
  .icon-innovation { background:rgba(251,146,60,.12); }
  .icon-computing  { background:rgba(45,212,191,.12); }
  .icon-designing  { background:rgba(244,114,182,.12);}

  /* ══════════════════════════════════
     LIGHTBOX (hover expand — desktop)
     Image LEFT · Details RIGHT
  ══════════════════════════════════ */
  .lb-backdrop {
    position:fixed; inset:0; z-index:900;
    background:rgba(0,0,0,0); backdrop-filter:blur(0px);
    pointer-events:none;
    transition:background .38s ease, backdrop-filter .38s ease;
  }
  .lb-backdrop.active {
    background:rgba(0,0,0,.78);
    backdrop-filter:blur(18px) saturate(.5);
  }

  .lb-panel {
    position:fixed; top:50%; left:50%;
    transform:translate(-50%,-50%) scale(.88);
    z-index:901; width:min(900px,92vw); max-height:88vh;
    border-radius:20px; overflow:hidden;
    display:flex; opacity:0; pointer-events:none;
    transition:opacity .38s cubic-bezier(.22,1,.36,1), transform .38s cubic-bezier(.22,1,.36,1);
    box-shadow:0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06);
  }
  .lb-panel.active { opacity:1; transform:translate(-50%,-50%) scale(1); pointer-events:all; }

  /* Left: slideshow fullscreen */
  .lb-slides {
    position:relative; width:48%; flex-shrink:0; overflow:hidden;
  }
  .lb-slide {
    position:absolute; inset:0;
    opacity:0; transition:opacity .55s cubic-bezier(.22,1,.36,1);
  }
  .lb-slide.active { opacity:1; }
  .lb-slide img { object-fit:cover; object-position:center; }
  .lb-slides::after { content:''; position:absolute; inset:0; background:linear-gradient(to right,transparent 62%,rgba(8,8,8,.96) 100%); pointer-events:none; z-index:1; }

  /* prev/next in lightbox */
  .lb-btn {
    position:absolute; top:50%; z-index:5; transform:translateY(-50%);
    width:34px; height:34px; border-radius:50%;
    background:rgba(8,8,8,.75); border:1px solid rgba(255,255,255,.15);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:var(--white-dim);
    transition:background .22s ease, transform .22s ease;
  }
  .lb-btn-prev { left:10px; }
  .lb-btn-next { right:10px; }
  .lb-btn:hover { background:rgba(225,29,72,.5); color:#fff; transform:translateY(-50%) scale(1.1); }

  .lb-slide-dots { position:absolute; bottom:12px; left:50%; transform:translateX(-50%); z-index:5; display:flex; gap:5px; }
  .lb-slide-dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,.3); cursor:pointer; transition:background .3s ease, transform .3s ease; }
  .lb-slide-dot.active { background:var(--red); transform:scale(1.5); }

  /* Right: info panel */
  .lb-info { flex:1; padding:28px 28px 28px 24px; overflow-y:auto; display:flex; flex-direction:column; background:var(--black); scrollbar-width:thin; scrollbar-color:rgba(255,255,255,.1) transparent; }

  .lb-tag { display:inline-flex; align-items:center; gap:6px; font-family:'Rajdhani',sans-serif; font-size:.68rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; padding:4px 12px; border-radius:100px; margin-bottom:14px; align-self:flex-start; }
  .lb-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.5rem,3.5vw,2.1rem); letter-spacing:.02em; color:var(--white); line-height:1.08; margin-bottom:14px; }
  .lb-desc { font-family:'DM Sans',sans-serif; font-size:.86rem; line-height:1.78; color:rgba(248,250,252,.72); margin-bottom:20px; white-space:pre-line; flex:1; }
  .lb-meta { display:flex; flex-direction:column; gap:8px; margin-bottom:24px; }
  .lb-meta-row { display:flex; align-items:center; gap:8px; font-family:'DM Sans',sans-serif; font-size:.8rem; color:var(--white-dim); background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); padding:8px 14px; border-radius:10px; }
  .lb-meta-row svg { opacity:.65; flex-shrink:0; }
  .lb-rsvp { display:inline-flex; align-items:center; gap:8px; font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.9rem; letter-spacing:.1em; text-transform:uppercase; padding:12px 26px; border-radius:10px; border:1px solid; text-decoration:none; align-self:flex-start; transition:transform .22s ease, box-shadow .22s ease, background .22s ease; }
  .lb-rsvp:hover { transform:translateY(-2px); }
  .lb-rsvp svg { transition:transform .2s ease; }
  .lb-rsvp:hover svg { transform:translateX(4px); }
  .lb-no-rsvp { display:inline-flex; align-items:center; font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.86rem; letter-spacing:.1em; text-transform:uppercase; padding:12px 26px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); color:rgba(248,250,252,.28); }

  /* RSVP colours */
  .rsvp-mechmania  { background:rgba(225,29,72,.16);  border-color:rgba(225,29,72,.55);  color:#fca5a5; }
  .rsvp-mechmania:hover  { background:rgba(225,29,72,.3);  box-shadow:0 8px 28px rgba(225,29,72,.35); }
  .rsvp-robotics   { background:rgba(56,189,248,.14); border-color:rgba(56,189,248,.52); color:#7dd3fc; }
  .rsvp-robotics:hover   { background:rgba(56,189,248,.28); box-shadow:0 8px 28px rgba(56,189,248,.32); }
  .rsvp-fun        { background:rgba(74,222,128,.14); border-color:rgba(74,222,128,.5);  color:#86efac; }
  .rsvp-fun:hover        { background:rgba(74,222,128,.28); box-shadow:0 8px 28px rgba(74,222,128,.3); }
  .rsvp-gaming     { background:rgba(192,132,252,.14);border-color:rgba(192,132,252,.5); color:#d8b4fe; }
  .rsvp-gaming:hover     { background:rgba(192,132,252,.28);box-shadow:0 8px 28px rgba(192,132,252,.3); }
  .rsvp-innovation { background:rgba(251,146,60,.14); border-color:rgba(251,146,60,.5);  color:#fdba74; }
  .rsvp-innovation:hover { background:rgba(251,146,60,.28); box-shadow:0 8px 28px rgba(251,146,60,.3); }
  .rsvp-computing  { background:rgba(45,212,191,.14); border-color:rgba(45,212,191,.5);  color:#5eead4; }
  .rsvp-computing:hover  { background:rgba(45,212,191,.28); box-shadow:0 8px 28px rgba(45,212,191,.3); }
  .rsvp-designing  { background:rgba(244,114,182,.14);border-color:rgba(244,114,182,.5); color:#f9a8d4; }
  .rsvp-designing:hover  { background:rgba(244,114,182,.28);box-shadow:0 8px 28px rgba(244,114,182,.3); }

  /* ══════════════════════════════════
     MOBILE BOTTOM SHEET
  ══════════════════════════════════ */
  .mob-overlay {
    position:fixed; inset:0; z-index:9000;
    background:rgba(0,0,0,0); pointer-events:none;
    transition:background .36s ease;
  }
  .mob-overlay.active { background:rgba(0,0,0,.88); pointer-events:all; }

  .mob-sheet {
    position:fixed; bottom:0; left:0; right:0; z-index:9001;
    height:92vh; border-radius:20px 20px 0 0;
    background:var(--black); display:flex; flex-direction:column;
    transform:translateY(100%); overflow:hidden;
    transition:transform .44s cubic-bezier(.22,1,.36,1);
  }
  .mob-sheet.active { transform:translateY(0); }

  .mob-handle { width:44px; height:4px; border-radius:2px; background:rgba(255,255,255,.2); margin:12px auto 0; flex-shrink:0; }

  /* Slideshow inside mobile sheet */
  .mob-slides { position:relative; width:100%; height:52vw; min-height:180px; max-height:260px; flex-shrink:0; overflow:hidden; margin-top:10px; }
  .mob-slide { position:absolute; inset:0; opacity:0; transition:opacity .55s ease; }
  .mob-slide.active { opacity:1; }
  .mob-slide img { object-fit:cover; object-position:center; }
  .mob-slides::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,transparent 50%,rgba(8,8,8,.88) 100%); pointer-events:none; }

  .mob-body { flex:1; overflow-y:auto; padding:18px 20px 40px; display:flex; flex-direction:column; scrollbar-width:none; -webkit-overflow-scrolling:touch; }
  .mob-body::-webkit-scrollbar { display:none; }

  .mob-close { position:absolute; top:14px; right:14px; z-index:10; width:34px; height:34px; border-radius:50%; background:rgba(8,8,8,.85); border:1px solid rgba(255,255,255,.18); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--white-dim); transition:background .2s ease; }
  .mob-close:active,.mob-close:hover { background:var(--red); }

  /* mob nav btns */
  .mob-nav { position:absolute; top:50%; z-index:5; transform:translateY(-50%); width:28px; height:28px; border-radius:50%; background:rgba(8,8,8,.75); border:1px solid rgba(255,255,255,.14); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--white-dim); }
  .mob-nav-prev { left:8px; }
  .mob-nav-next { right:8px; }
  .mob-nav:active { background:rgba(225,29,72,.5); }

  body.pe-locked { overflow:hidden; }

  @media(max-width:640px){ .pe-inner{ padding:3rem 1rem 4rem; } }
`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface PreEvent {
    _id: string;
    title: string;
    date: string;
    description: string;
    venue: string;
    time: string;
    images: string[];   // 1–7 images — slideshow
    rsvplink: string;
    domain: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const preEvents: PreEvent[] = [

    // Robotics
    {
        _id: "pr1", domain: "Robotics",
        title: "ROBOKRITI: Where Innovation Meets Reality",
        date: "Nov 22, 2025", time: "10 AM onwards", venue: "Techno India University",
        description: "Robokriti is not just an event, it’s a platform for innovators to rise.\n\nStudents showcase real-world solutions through Robotics, IoT, and AI.\n\nIt brings together creativity, technology, and teamwork in one place.\nA true festival where ideas turn into impactful innovations.",
        images: ["/temp/ROBOKRITI_1.jpeg", "/temp/ROBOKRITI_2.jpeg", "/temp/ROBOKRITI_3.jpeg", "/temp/ROBOKRITI_4.jpeg", "/temp/ROBOKRITI_5.jpeg", "/temp/ROBOKRITI_6.jpeg", "/temp/ROBOKRITI_7.jpeg"],
        rsvplink: "",
    },

    {
        _id: "pr2", domain: "Robotics",
        title: "ROBOTICS WORKSHOP BLAKBIRD : Building Skills, Powering Innovation",
        date: "Dec 16, 2025", time: "12 PM onwards", venue: "Techno India University",
        description: "A hands-on robotics workshop where students explored real-world technologies and practical learning.\nIn collaboration with Blackbird Robotix, it inspired innovation, creativity, and technical growth.",
        images: ["/temp/RoboticsWorkshop-1.jpeg", "/temp/RoboticsWorkshop-2.jpeg", "/temp/RoboticsWorkshop-3.jpeg", "/temp/RoboticsWorkshop-4.jpeg", "/temp/RoboticsWorkshop-5.jpeg"],
        rsvplink: "",
    },

    // Mechmania
    {
        _id: "pm1", domain: "Mechmania",
        title: "SKY BLAST: Bottle Rocket Challenge",
        date: "Nov 20, 2025", time: "12 PM onwards", venue: "Techno India University",
        description: "Get ready to blast into the skies!\n\nMechmania, under Takshila 2025, presents SKY BLAST\n\nan electrifying bottle rocket launch event where creativity and engineering take flight!",
        images: ["/temp/SKY BLAST.jpeg"],
        rsvplink: "",
    },
    // Fun Events
    {
        _id: "pf1", domain: "Fun Events",
        title: "LIVE LUDO: Where every roll decides your fate!",
        date: "Nov 17, 2025", time: "11 AM onwards", venue: "Techno India University",
        description: "Get ready to roll the dice & rule the board at our action-packed Live Ludo Event\n\nfull of thrill, teamwork, and head-to-head excitement!",
        images: ["/temp/LIVE LUDO 2025.jpeg"],
        rsvplink: "",
    },

    // Gaming
    {
        _id: "pg1", domain: "Gaming",
        title: "ROVER",
        date: "Mar 8–10, 2025", time: "11 AM onwards", venue: "Techno India University",
        description: "Two of the biggest titles, one arena.\n\nGear up for BGMI — Survive, Conquer, Dominate — then lock in your agents for a Valorant 5v5 tactical battle. Precision, teamwork, and strategy decide who controls both battlefields.\n\nSquad up — it's game time.",
        images: ["/temp/37.jpeg", "/temp/27.jpeg", "/temp/28.jpeg", "/temp/25.jpeg", "/temp/38.jpeg"],
        rsvplink: "https://docs.google.com/forms/d/1Redi0zt980RhLk8Teh5IcxnT_HoLg_T79ZpoZMgf1cg/edit",
    },

    // Computing
    {
        _id: "pc1", domain: "Computing",
        title: "Hackquest: 24-Hour Innovation Sprint",
        date: "Mar 8–9, 2025", time: "12 PM onwards", venue: "Techno India University",
        description: "Solve real-world problems in Healthcare, AI, Cybersecurity, Education, Blockchain, and more!\n\nTeam size: 1–4 members. Select 1 Problem Statement and compete for exciting prizes. Network with industry experts, tackle impactful challenges, and showcase your skills.\n\nOpen to all students, professionals, and innovators. Limited spots!",
        images: ["/temp/24.png", "/temp/32.jpeg", "/temp/33.jpeg"],
        rsvplink: "https://lemonade.social/e/AigjXHfi",
    },
    {
        _id: "pc2", domain: "Computing",
        title: "Webyard + Codex: Code & Design Sprint",
        date: "Mar 8–9, 2025", time: "11 AM onwards", venue: "Techno India University",
        description: "Two contests, one focus: your skills.\n\nWebyard — 2 hours to build 2 webpages from given designs. Codex — 2 hours, 4 challenging coding questions.\n\nProve you've got the brains and the fingers to beat the toughest challenges on campus.",
        images: ["/temp/32.jpeg", "/temp/33.jpeg", "/temp/24.png"],
        rsvplink: "https://forms.gle/qgfGRCpK8rv9tsaa8",
    },
    // Innovation
    {
        _id: "pi1", domain: "Innovation",
        title: "THE ESCAPE: Ideathon Phase is here!",
        date: "Nov 17-18, 2025", time: "11 AM onwards", venue: "Techno India University",
        description: "Form a team, pitch your startup idea on 17th or 18th Nov, and impress the judges.\n\nThe Top 10 teams will enter our 4-week incubation to turn their idea into a real product",
        images: ["/temp/THE ESCAPE.jpeg"],
        rsvplink: "",
    },
    {
        _id: "pi2", domain: "Innovation",
        title: "IDEA CHAIN: Where Ideas Spark & Connect!",
        date: "Dec 8, 2025", time: "11 AM onwards", venue: "Techno India University",
        description: "Innovation & Management brings you IDEA CHAIN, a high-energy creativity sprint where every idea fuels the next.\n\nTeams race through connected stages, think fast, build smarter, and turn raw thoughts into a sharp final pitch.\n\nIf you love speed, strategy, and out-of-the-box thinking, this is your arena",
        images: ["/temp/IDEA CHAIN.jpeg"],
        rsvplink: "",
    },

];

const domainConfig: Record<string, { icon: string; cardClass: string; badgeClass: string; iconClass: string; titleColor: string; rsvpClass: string }> = {

    Robotics: { icon: "🤖", cardClass: "pec-robotics", badgeClass: "badge-robotics", iconClass: "icon-robotics", titleColor: "#7dd3fc", rsvpClass: "rsvp-robotics" },
    Mechmania: { icon: "⚙️", cardClass: "pec-mechmania", badgeClass: "badge-mechmania", iconClass: "icon-mechmania", titleColor: "#fca5a5", rsvpClass: "rsvp-mechmania" },
    "Fun Events": { icon: "🎉", cardClass: "pec-fun", badgeClass: "badge-fun", iconClass: "icon-fun", titleColor: "#86efac", rsvpClass: "rsvp-fun" },
    Innovation: { icon: "💡", cardClass: "pec-innovation", badgeClass: "badge-innovation", iconClass: "icon-innovation", titleColor: "#fdba74", rsvpClass: "rsvp-innovation" },
    Gaming: { icon: "🎮", cardClass: "pec-gaming", badgeClass: "badge-gaming", iconClass: "icon-gaming", titleColor: "#d8b4fe", rsvpClass: "rsvp-gaming" },
    Computing: { icon: "💻", cardClass: "pec-computing", badgeClass: "badge-computing", iconClass: "icon-computing", titleColor: "#5eead4", rsvpClass: "rsvp-computing" },
    Designing: { icon: "🎨", cardClass: "pec-designing", badgeClass: "badge-designing", iconClass: "icon-designing", titleColor: "#f9a8d4", rsvpClass: "rsvp-designing" },
};
const domainOrder = ["Robotics", "Mechmania", "Fun Events", "Innovation", "Gaming", "Computing", "Designing"];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.unobserve(el); } }, { threshold });
        obs.observe(el); return () => obs.disconnect();
    }, [threshold]);
    return ref;
}

function useTilt(strength = 10) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const mv = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            el.style.transform = `perspective(700px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(8px)`;
        };
        const lv = () => { el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)'; };
        el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', lv);
        return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv); };
    }, [strength]);
    return ref;
}

function Counter({ end, label }: { end: number; label: string }) {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            let cur = 0;
            const step = () => { cur += Math.max(1, Math.ceil((end - cur) / 14)); if (cur >= end) { setVal(end); return; } setVal(cur); requestAnimationFrame(step); };
            requestAnimationFrame(step); obs.unobserve(el);
        }, { threshold: .5 });
        obs.observe(el); return () => obs.disconnect();
    }, [end]);
    return (
        <div ref={ref} className="pe-stat">
            <div className="pe-stat-n">{val}+</div>
            <div className="pe-stat-l">{label}</div>
        </div>
    );
}

// ─── Slideshow (used in both card and lightbox) ───────────────────────────────
function Slideshow({ images, prefix, sizes = "33vw" }: { images: string[]; prefix: string; sizes?: string }) {
    const [idx, setIdx] = useState(0);
    const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
    const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

    // auto-advance every 3.5s
    useEffect(() => {
        if (images.length <= 1) return;
        const t = setInterval(() => setIdx(i => (i + 1) % images.length), 3500);
        return () => clearInterval(t);
    }, [images.length]);

    return (
        <>
            {images.map((src, i) => (
                <div key={i} className={`${prefix}-slide${i === idx ? ' active' : ''}`}>
                    <Image src={src} alt="" fill sizes={sizes} style={{ objectFit: 'cover', objectPosition: 'center' }} />
                </div>
            ))}
            {images.length > 1 && (
                <>
                    <button className={`${prefix}-btn ${prefix}-btn-prev`} onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous">
                        <BsChevronLeft size={13} />
                    </button>
                    <button className={`${prefix}-btn ${prefix}-btn-next`} onClick={e => { e.stopPropagation(); next(); }} aria-label="Next">
                        <BsChevronRight size={13} />
                    </button>
                    <div className={`${prefix}-dots`}>
                        {images.map((_, i) => (
                            <div key={i} className={`${prefix}-dot${i === idx ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setIdx(i); }} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

// ─── Desktop Expand Panel ─────────────────────────────────────────────────────
function ExpandPanel({ event, onPanelEnter, onPanelLeave }: {
    event: PreEvent | null; onPanelEnter: () => void; onPanelLeave: () => void;
}) {
    const [active, setActive] = useState(false);
    const [cur, setCur] = useState<PreEvent | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (event) {
            if (timer.current) clearTimeout(timer.current);
            setCur(event);
            requestAnimationFrame(() => requestAnimationFrame(() => setActive(true)));
        } else {
            setActive(false);
            timer.current = setTimeout(() => setCur(null), 420);
        }
        return () => { if (timer.current) clearTimeout(timer.current); };
    }, [event]);

    const cfg = cur ? (domainConfig[cur.domain] ?? domainConfig["Mechmania"]) : null;

    return (
        <>
            <div className={`lb-backdrop${active ? ' active' : ''}`} />
            <div className={`lb-panel${active ? ' active' : ''}`} onMouseEnter={onPanelEnter} onMouseLeave={onPanelLeave}>
                {cur && cfg && (
                    <>
                        <div className="lb-slides">
                            <Slideshow images={cur.images} prefix="lb-slide" sizes="430px" />
                        </div>
                        <div className="lb-info">
                            <div className={`lb-tag ${cfg.badgeClass}`}>{cfg.icon} {cur.domain}</div>
                            <div className="lb-title">{cur.title}</div>
                            <div className="lb-desc">{cur.description}</div>
                            <div className="lb-meta">
                                <div className="lb-meta-row"><BsCalendar3 size={13} />{cur.date}</div>
                                <div className="lb-meta-row"><BiTime size={13} />{cur.time}</div>
                                <div className="lb-meta-row"><MdOutlineLocationOn size={14} />{cur.venue}</div>
                            </div>
                            {cur.rsvplink
                                ? <Link href={cur.rsvplink} target="_blank" rel="noopener noreferrer" className={`lb-rsvp ${cfg.rsvpClass}`}>RSVP Now <HiArrowRight size={14} /></Link>
                                : <div className="lb-no-rsvp">Registration Closed</div>
                            }
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

// ─── Mobile Sheet ─────────────────────────────────────────────────────────────
function MobileSheet({ event, onClose }: { event: PreEvent | null; onClose: () => void }) {
    const [active, setActive] = useState(false);
    const [cur, setCur] = useState<PreEvent | null>(null);
    const cfg = cur ? (domainConfig[cur.domain] ?? domainConfig["Mechmania"]) : null;

    useEffect(() => {
        if (event) {
            setCur(event);
            document.body.classList.add('pe-locked');
            requestAnimationFrame(() => requestAnimationFrame(() => setActive(true)));
        } else {
            setActive(false);
            setTimeout(() => { setCur(null); document.body.classList.remove('pe-locked'); }, 440);
        }
        return () => document.body.classList.remove('pe-locked');
    }, [event]);

    const close = useCallback(() => { setActive(false); setTimeout(onClose, 440); }, [onClose]);
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
        window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
    }, [close]);

    if (!cur || !cfg) return null;
    return (
        <>
            <div className={`mob-overlay${active ? ' active' : ''}`} onClick={close} />
            <div className={`mob-sheet${active ? ' active' : ''}`}>
                <div className="mob-handle" />
                <button className="mob-close" onClick={close} aria-label="Close"><HiX size={14} /></button>
                <div className="mob-slides">
                    <Slideshow images={cur.images} prefix="mob-slide" sizes="100vw" />
                </div>
                <div className="mob-body">
                    <div className={`lb-tag ${cfg.badgeClass}`} style={{ marginBottom: 12 }}>{cfg.icon} {cur.domain}</div>
                    <div className="lb-title">{cur.title}</div>
                    <div className="lb-desc">{cur.description}</div>
                    <div className="lb-meta">
                        <div className="lb-meta-row"><BsCalendar3 size={13} />{cur.date}</div>
                        <div className="lb-meta-row"><BiTime size={13} />{cur.time}</div>
                        <div className="lb-meta-row"><MdOutlineLocationOn size={14} />{cur.venue}</div>
                    </div>
                    {cur.rsvplink
                        ? <Link href={cur.rsvplink} target="_blank" rel="noopener noreferrer" className={`lb-rsvp ${cfg.rsvpClass}`}>RSVP Now <HiArrowRight size={14} /></Link>
                        : <div className="lb-no-rsvp">Registration Closed</div>
                    }
                </div>
            </div>
        </>
    );
}

// ─── PreEvent Card ────────────────────────────────────────────────────────────
function PreEventCard({ event, onHover, onLeave, onTap }: {
    event: PreEvent; onHover: (e: PreEvent) => void; onLeave: () => void; onTap: (e: PreEvent) => void;
}) {
    const cfg = domainConfig[event.domain] ?? domainConfig["Mechmania"];
    const tilt = useTilt(9);
    return (
        <div ref={tilt} className={`pec ${cfg.cardClass}`}
            onMouseEnter={() => onHover(event)}
            onMouseLeave={onLeave}
            onClick={() => onTap(event)}
        >
            {/* Slideshow image area */}
            <div className="pec-slides">
                <Slideshow images={event.images} prefix="pec" sizes="(max-width:640px) 100vw, 33vw" />
                <div className="pec-img-count">
                    <BsCalendar3 size={9} style={{ display: 'inline', marginRight: 4 }} />{event.date}
                </div>
            </div>

            {/* Body */}
            <div className="pec-body">
                <div className="pec-title">{event.title}</div>
                <div className="pec-desc">{event.description.split('\n')[0]}</div>
                <div className="pec-meta">
                    <div className="pec-meta-row"><MdOutlineLocationOn size={13} />{event.venue}</div>
                    <div className="pec-meta-row"><BiTime size={12} />{event.time}</div>
                </div>

            </div>
        </div>
    );
}

// ─── Domain Section ───────────────────────────────────────────────────────────
function DomainSection({ domain, onHover, onLeave, onTap }: {
    domain: string;
    onHover: (e: PreEvent) => void;
    onLeave: () => void;
    onTap: (e: PreEvent) => void;
}) {
    const headerRef = useReveal(0.1);
    const gridRef = useReveal(0.07);
    const cfg = domainConfig[domain];
    const items = preEvents.filter(e => e.domain === domain);
    if (!items.length) return null;
    return (
        <div className="dom-section">
            <div ref={headerRef} className="rv dom-header">
                <div className={`dom-icon-box ${cfg.iconClass}`}>{cfg.icon}</div>
                <div className="dom-title" style={{ color: cfg.titleColor }}>{domain === "Innovation" ? "Innovation & Management" : domain}</div>
                <div className={`dom-count ${cfg.badgeClass}`}>{items.length} event{items.length > 1 ? 's' : ''}</div>
            </div>
            <div ref={gridRef} className="sg pe-grid">
                {items.map(ev => (
                    <PreEventCard key={ev._id} event={ev} onHover={onHover} onLeave={onLeave} onTap={onTap} />
                ))}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function PreEvents() {
    const heroRef = useReveal(0.04);
    const statsRef = useReveal(0.08);

    // hover expand (desktop) — 1 second delay before opening
    const [hovered, setHovered] = useState<PreEvent | null>(null);
    const [tapped, setTapped] = useState<PreEvent | null>(null);
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => { setIsTouch(window.matchMedia('(hover:none)').matches); }, []);

    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelLeave = useCallback(() => { if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; } }, []);
    const cancelEnter = useCallback(() => { if (enterTimer.current) { clearTimeout(enterTimer.current); enterTimer.current = null; } }, []);
    const scheduleLeave = useCallback(() => { cancelEnter(); cancelLeave(); leaveTimer.current = setTimeout(() => setHovered(null), 100); }, [cancelEnter, cancelLeave]);

    const handleHover = useCallback((ev: PreEvent) => { if (isTouch) return; cancelLeave(); cancelEnter(); enterTimer.current = setTimeout(() => setHovered(ev), 1000); }, [isTouch, cancelLeave, cancelEnter]);
    const handleLeave = useCallback(() => { if (!isTouch) scheduleLeave(); }, [isTouch, scheduleLeave]);
    const handlePanelEnter = useCallback(() => { cancelLeave(); }, [cancelLeave]);
    const handlePanelLeave = useCallback(() => { scheduleLeave(); }, [scheduleLeave]);
    const handleTap = useCallback((ev: PreEvent) => { if (isTouch) setTapped(ev); }, [isTouch]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <div className="pe-section">
                <div className="pe-bg-grid" />
                <div className="pe-orb pe-orb-1" />
                <div className="pe-orb pe-orb-2" />
                <div className="pe-scan" />

                <div className="pe-inner">

                    {/* HERO */}
                    <div ref={heroRef} className="rv pe-hero">
                        <div className="pe-eyebrow">Techno Vivarta</div>
                        <h1 className="pe-h1">Pre<br /><span>Events.</span></h1>
                        <div className="pe-rule"><div className="pe-rule-dot" /></div>
                        <p className="pe-hero-p">
                            The warmup before the main event — get registered, get hyped, and get ready.
                        </p>
                    </div>


                    {/* DOMAIN SECTIONS */}
                    {domainOrder.map((d, i) => (
                        <div key={d}>
                            {i > 0 && <div className="pe-divider"><div className="pe-divider-dot" /></div>}
                            <DomainSection domain={d} onHover={handleHover} onLeave={handleLeave} onTap={handleTap} />
                        </div>
                    ))}

                </div>
            </div>

            {/* Desktop hover expand */}
            {!isTouch && <ExpandPanel event={hovered} onPanelEnter={handlePanelEnter} onPanelLeave={handlePanelLeave} />}

            {/* Mobile tap sheet */}
            {isTouch && <MobileSheet event={tapped} onClose={() => setTapped(null)} />}
        </>
    );
}

export default PreEvents;
