"use client"
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineLocationOn } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { HiArrowRight } from "react-icons/hi";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --red:#e11d48; --red-dim:#9f1239;
    --red-glow:rgba(225,29,72,.38);
    --white:#f8fafc; --white-dim:rgba(248,250,252,.65); --white-muted:rgba(248,250,252,.36);
    --black:#080808; --gray:#2a2a2a;
  }

  .ev-bg-grid {
    position:fixed; inset:0; pointer-events:none; z-index:0;
    background-image:linear-gradient(rgba(225,29,72,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(225,29,72,.035) 1px,transparent 1px);
    background-size:48px 48px;
    mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);
  }
  .ev-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; filter:blur(90px); opacity:.14; }
  .ev-orb-1 { width:520px; height:520px; top:-100px; left:-100px; background:var(--red); animation:eorbA 16s ease-in-out infinite; }
  .ev-orb-2 { width:380px; height:380px; bottom:10%; right:-80px; background:var(--red-dim); animation:eorbB 20s ease-in-out infinite; }
  @keyframes eorbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,40px)} }
  @keyframes eorbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,-60px)} }
  .ev-scan { position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.35;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px); }

  .ev-section { background:var(--black); color:var(--white); font-family:'DM Sans',sans-serif; position:relative; overflow:hidden; min-height:100vh; }
  .ev-inner { max-width:1280px; margin:0 auto; padding:3rem 1.25rem 5rem; position:relative; z-index:1; }

  /* Scroll reveal */
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

  /* Hero */
  .ev-hero { margin-bottom:3.5rem; }
  .ev-eyebrow { display:inline-flex; align-items:center; gap:10px; font-family:'Rajdhani',sans-serif; font-size:.78rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--red); margin-bottom:1.1rem; }
  .ev-eyebrow::before { content:''; width:28px; height:2px; background:var(--red); display:block; }
  .ev-h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(4rem,11vw,8.5rem); line-height:.9; letter-spacing:.02em; color:var(--white); margin:0 0 .4rem; }
  .ev-h1 span { color:var(--red); }
  .ev-rule { display:flex; align-items:center; gap:14px; margin:1.4rem 0 1.6rem; }
  .ev-rule::before { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--red),transparent); }
  .ev-rule-dot { width:7px; height:7px; border-radius:50%; background:var(--red); flex-shrink:0; animation:pulseDot 2.2s ease-in-out infinite; }
  @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 var(--red-glow)} 50%{box-shadow:0 0 0 10px transparent} }
  .ev-hero-p { font-size:clamp(.94rem,2vw,1.06rem); line-height:1.8; color:var(--white-muted); max-width:620px; }

  /* Stats */
  .ev-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:18px; margin-bottom:4rem; padding:1.5rem 1.4rem; background:rgba(255,255,255,.022); border:1px solid rgba(225,29,72,.16); border-radius:16px; }
  .ev-stat { text-align:center; }
  .ev-stat-n { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.8rem,4vw,2.8rem); color:var(--red); line-height:1; }
  .ev-stat-l { font-family:'DM Sans',sans-serif; font-size:.7rem; color:var(--white-muted); letter-spacing:.1em; text-transform:uppercase; margin-top:4px; }

  /* Domain section */
  .dom-section { margin-bottom:4rem; }
  .dom-header { display:flex; align-items:center; gap:16px; margin-bottom:1.8rem; }
  .dom-header::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--gray),transparent); }
  .dom-icon { width:58px; height:58px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; padding:6px; }
  .dom-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.8rem,4vw,2.6rem); letter-spacing:.05em; }
  .dom-count { font-family:'Rajdhani',sans-serif; font-size:.72rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; padding:4px 12px; border-radius:100px; white-space:nowrap; }


  /* Event grid */
  .ev-grid { display:grid; gap:16px; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); }
  @media(max-width:640px){ .ev-grid{ grid-template-columns:1fr; gap:12px; } }

  /* ──────────────────────────────────────────────
     EVENT CARD — collapsed (thumbnail) state
  ────────────────────────────────────────────── */
  .ec-wrap {
    position:relative;
    border-radius:16px;
    cursor:pointer;
    transition:z-index 0s;
  }
  /* push hovered card above siblings */
  .ev-grid:has(.ec-wrap:hover) .ec-wrap { z-index:1; }
  .ev-grid .ec-wrap:hover { z-index:10; }

  .ec {
    position:relative; border-radius:16px; overflow:hidden;
    display:flex; flex-direction:column;
    transition:
      box-shadow .42s cubic-bezier(.22,1,.36,1),
      border-color .42s ease;
    will-change:transform;
    height:100%;
  }
  .ec::after { content:''; position:absolute; inset:0; border-radius:16px; background:linear-gradient(145deg,rgba(255,255,255,.04) 0%,transparent 50%); pointer-events:none; z-index:1; }
  .ec::before { content:''; position:absolute; top:0; left:15%; right:15%; height:1px; border-radius:1px; opacity:.7; z-index:2; }

  .ec-img { position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; flex-shrink:0; }
  .ec-img img { transition:transform .55s cubic-bezier(.22,1,.36,1),filter .55s ease !important; filter:brightness(.88) saturate(1.1); }
  .ec-img::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,transparent 40%,rgba(8,8,8,.85) 100%); }

  .ec-body { padding:16px 16px 18px; display:flex; flex-direction:column; flex:1; position:relative; z-index:2; }
  .ec-title { font-family:'Rajdhani',sans-serif; font-size:1rem; font-weight:700; letter-spacing:.03em; color:var(--white); line-height:1.3; margin-bottom:6px; text-transform:uppercase; }
  .ec-desc-short { font-family:'DM Sans',sans-serif; font-size:.78rem; line-height:1.6; color:var(--white-muted); margin-bottom:10px; flex:1;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .ec-meta-row { display:flex; align-items:center; gap:6px; font-family:'DM Sans',sans-serif; font-size:.72rem; color:var(--white-muted); margin-bottom:4px; }
  .ec-meta-row svg { flex-shrink:0; opacity:.65; }

  .ec-date-badge {
    position:absolute; top:10px; right:10px; z-index:5;
    font-family:'Rajdhani',sans-serif; font-size:.66rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    background:rgba(8,8,8,.84); border:1px solid rgba(255,255,255,.12);
    backdrop-filter:blur(6px); padding:4px 10px; border-radius:8px; color:var(--white-dim);
  }

  /* Divider */
  .ev-divider { display:flex; align-items:center; gap:12px; margin:3rem 0 2rem; }
  .ev-divider::before,.ev-divider::after { content:''; flex:1; height:1px; background:var(--gray); }
  .ev-divider-dot { width:8px; height:8px; border-radius:50%; background:var(--red); box-shadow:0 0 10px var(--red-glow); }

  /* Domain base colours */
  .ec-mechmania  { background:linear-gradient(158deg,#1c0a0d 0%,#0e0e0e 55%,#1a0809 100%); border:1px solid rgba(225,29,72,.24); box-shadow:0 4px 20px rgba(225,29,72,.06); }
  .ec-mechmania::before  { background:linear-gradient(90deg,transparent,rgba(225,29,72,.65),transparent); }
  .ec-robotics   { background:linear-gradient(158deg,#080e1c 0%,#0e0e0e 55%,#091018 100%); border:1px solid rgba(56,189,248,.2);  box-shadow:0 4px 20px rgba(56,189,248,.05); }
  .ec-robotics::before   { background:linear-gradient(90deg,transparent,rgba(56,189,248,.6),transparent); }
  .ec-fun        { background:linear-gradient(158deg,#081408 0%,#0e0e0e 55%,#091209 100%); border:1px solid rgba(74,222,128,.2);  box-shadow:0 4px 20px rgba(74,222,128,.05); }
  .ec-fun::before        { background:linear-gradient(90deg,transparent,rgba(74,222,128,.6),transparent); }
  .ec-gaming     { background:linear-gradient(158deg,#100a1a 0%,#0e0e0e 55%,#120c1c 100%); border:1px solid rgba(192,132,252,.2); box-shadow:0 4px 20px rgba(192,132,252,.05); }
  .ec-gaming::before     { background:linear-gradient(90deg,transparent,rgba(192,132,252,.6),transparent); }
  .ec-innovation { background:linear-gradient(158deg,#160c04 0%,#0e0e0e 55%,#140b04 100%); border:1px solid rgba(251,146,60,.2);  box-shadow:0 4px 20px rgba(251,146,60,.05); }
  .ec-innovation::before { background:linear-gradient(90deg,transparent,rgba(251,146,60,.6),transparent); }
  .ec-computing  { background:linear-gradient(158deg,#061414 0%,#0e0e0e 55%,#071414 100%); border:1px solid rgba(45,212,191,.2);  box-shadow:0 4px 20px rgba(45,212,191,.05); }
  .ec-computing::before  { background:linear-gradient(90deg,transparent,rgba(45,212,191,.6),transparent); }
  .ec-designing  { background:linear-gradient(158deg,#18060e 0%,#0e0e0e 55%,#16060c 100%); border:1px solid rgba(244,114,182,.2); box-shadow:0 4px 20px rgba(244,114,182,.05); }
  .ec-designing::before  { background:linear-gradient(90deg,transparent,rgba(244,114,182,.6),transparent); }

  /* Domain badges */
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

  /* ══════════════════════════════════════════════════
     DESKTOP HOVER EXPAND — fixed centred panel
     image LEFT  |  details RIGHT
  ══════════════════════════════════════════════════ */

  .ev-expand-backdrop {
    position:fixed; inset:0; z-index:900;
    background:rgba(0,0,0,0); backdrop-filter:blur(0px);
    pointer-events:none;
    transition:background .38s ease, backdrop-filter .38s ease;
  }
  .ev-expand-backdrop.active {
    background:rgba(0,0,0,.75);
    backdrop-filter:blur(18px) saturate(.5);
  }

  .ev-expand {
    position:fixed; top:50%; left:50%;
    transform:translate(-50%,-50%) scale(.9);
    z-index:901;
    width:min(940px, 94vw);
    max-height:90vh;
    border-radius:22px; overflow:hidden;
    display:flex; flex-direction:row;
    opacity:0; pointer-events:none;
    transition:opacity .38s cubic-bezier(.22,1,.36,1), transform .38s cubic-bezier(.22,1,.36,1);
    box-shadow:0 48px 110px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.07);
  }
  .ev-expand.active {
    opacity:1; transform:translate(-50%,-50%) scale(1); pointer-events:all;
  }

  /* ── Left: image fills its half entirely ── */
  .ev-expand-img {
    position:relative; width:50%; flex-shrink:0; overflow:hidden;
    min-height:420px;
  }
  .ev-expand-img img {
    transition:transform .55s cubic-bezier(.22,1,.36,1) !important;
    object-position:center;
  }
  .ev-expand.active .ev-expand-img img { transform:scale(1.05) !important; }
  /* subtle right-edge fade into info panel */
  .ev-expand-img::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(to right, transparent 65%, rgba(8,8,8,.96) 100%);
  }

  /* ── Right: scrollable info ── */
  .ev-expand-info {
    flex:1; padding:32px 30px 32px 28px;
    overflow-y:auto; display:flex; flex-direction:column;
    background:var(--black);
    scrollbar-width:thin; scrollbar-color:rgba(255,255,255,.1) transparent;
  }

  /* ══════════════════════════════════════════════════
     MOBILE FULLSCREEN MODAL
     image TOP full-width → details scroll below
  ══════════════════════════════════════════════════ */

  /* Full-screen backdrop */
  .ev-modal-overlay {
    position:fixed; inset:0; z-index:9000;
    background:rgba(0,0,0,0);
    pointer-events:none;
    transition:background .36s ease;
  }
  .ev-modal-overlay.active {
    background:rgba(0,0,0,.92);
    pointer-events:all;
  }

  /* The sheet — slides up from bottom, fills almost full screen */
  .ev-modal {
    position:fixed; bottom:0; left:0; right:0;
    height:92vh;                       /* tall enough to show image + scroll details */
    background:var(--black);
    border-radius:22px 22px 0 0;
    display:flex; flex-direction:column;
    transform:translateY(100%);
    transition:transform .44s cubic-bezier(.22,1,.36,1);
    overflow:hidden;                   /* clip children, NOT the modal itself */
    z-index:9001;
  }
  .ev-modal.active { transform:translateY(0); }

  /* drag handle */
  .ev-modal-handle {
    width:48px; height:4px; border-radius:2px;
    background:rgba(255,255,255,.22);
    margin:12px auto 0; flex-shrink:0;
  }

  /* Image — full width */
  .ev-modal-img {
    position:relative;
    width:100%;
    height:52vw;          /* ~16:9 on most phones, never too tall */
    min-height:180px;
    max-height:260px;
    flex-shrink:0;
    overflow:hidden;
    margin-top:10px;
  }
  .ev-modal-img img { object-fit:cover; object-position:center; }
  .ev-modal-img::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(to bottom, transparent 50%, rgba(8,8,8,.88) 100%);
  }

  /* Scrollable details area */
  .ev-modal-body {
    flex:1;
    overflow-y:auto;
    overflow-x:hidden;
    padding:18px 20px 40px;
    display:flex; flex-direction:column;
    scrollbar-width:none;
    -webkit-overflow-scrolling:touch;
  }
  .ev-modal-body::-webkit-scrollbar { display:none; }

  /* close button */
  .ev-modal-close {
    position:absolute; top:14px; right:14px; z-index:10;
    width:34px; height:34px; border-radius:50%;
    background:rgba(8,8,8,.85); border:1px solid rgba(255,255,255,.18);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:var(--white-dim);
    transition:background .2s ease, transform .2s ease;
  }
  .ev-modal-close:hover,
  .ev-modal-close:active { background:var(--red); transform:scale(1.1); }

  /* ── Shared detail styles (used by both desktop panel & mobile modal) ── */
  .ev-expand-tag {
    display:inline-flex; align-items:center; gap:6px;
    font-family:'Rajdhani',sans-serif; font-size:.68rem; font-weight:700;
    letter-spacing:.16em; text-transform:uppercase;
    padding:4px 12px; border-radius:100px; margin-bottom:14px;
    align-self:flex-start;
  }
  .ev-expand-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(1.5rem,4vw,2.1rem);
    letter-spacing:.02em; color:var(--white);
    line-height:1.08; margin-bottom:14px;
  }
  .ev-expand-desc {
    font-family:'DM Sans',sans-serif; font-size:.88rem;
    line-height:1.78; color:rgba(248,250,252,.72);
    margin-bottom:20px; white-space:pre-line; flex:1;
  }
  .ev-expand-meta { display:flex; flex-direction:column; gap:8px; margin-bottom:24px; }
  .ev-expand-meta-row {
    display:flex; align-items:center; gap:8px;
    font-family:'DM Sans',sans-serif; font-size:.8rem; color:var(--white-dim);
    background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
    padding:8px 14px; border-radius:10px;
  }
  .ev-expand-meta-row svg { opacity:.65; flex-shrink:0; }
  .ev-expand-rsvp {
    display:inline-flex; align-items:center; gap:8px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.9rem;
    letter-spacing:.1em; text-transform:uppercase;
    padding:13px 28px; border-radius:10px; border:1px solid;
    text-decoration:none; align-self:flex-start;
    transition:transform .22s ease, box-shadow .22s ease, background .22s ease;
  }
  .ev-expand-rsvp:hover { transform:translateY(-2px); }
  .ev-expand-rsvp svg { transition:transform .2s ease; }
  .ev-expand-rsvp:hover svg { transform:translateX(4px); }
  .ev-expand-no-rsvp {
    display:inline-flex; align-items:center; justify-content:center;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.86rem;
    letter-spacing:.1em; text-transform:uppercase;
    padding:13px 28px; border-radius:10px;
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09);
    color:rgba(248,250,252,.28); align-self:flex-start;
  }

  /* full-width RSVP on mobile */
  @media(max-width:767px){
    .ev-expand-rsvp { align-self:stretch; justify-content:center; width:100%; }
    .ev-expand-no-rsvp { align-self:stretch; justify-content:center; width:100%; }
    .ev-expand-meta-row { font-size:.82rem; }
    .ev-expand-title { font-size:1.5rem; }
    .ev-expand-desc { font-size:.86rem; }
  }

  /* RSVP colours */
  .rsvp-mechmania  { background:rgba(225,29,72,.16);  border-color:rgba(225,29,72,.55);  color:#fca5a5; }
  .rsvp-mechmania:hover  { background:rgba(225,29,72,.3);  box-shadow:0 8px 28px rgba(225,29,72,.35); }
  .rsvp-robotics   { background:rgba(56,189,248,.13); border-color:rgba(56,189,248,.52); color:#7dd3fc; }
  .rsvp-robotics:hover   { background:rgba(56,189,248,.27); box-shadow:0 8px 28px rgba(56,189,248,.32); }
  .rsvp-fun        { background:rgba(74,222,128,.13); border-color:rgba(74,222,128,.5);  color:#86efac; }
  .rsvp-fun:hover        { background:rgba(74,222,128,.27); box-shadow:0 8px 28px rgba(74,222,128,.3); }
  .rsvp-gaming     { background:rgba(192,132,252,.13);border-color:rgba(192,132,252,.5); color:#d8b4fe; }
  .rsvp-gaming:hover     { background:rgba(192,132,252,.27);box-shadow:0 8px 28px rgba(192,132,252,.3); }
  .rsvp-innovation { background:rgba(251,146,60,.13); border-color:rgba(251,146,60,.5);  color:#fdba74; }
  .rsvp-innovation:hover { background:rgba(251,146,60,.27); box-shadow:0 8px 28px rgba(251,146,60,.3); }
  .rsvp-computing  { background:rgba(45,212,191,.13); border-color:rgba(45,212,191,.5);  color:#5eead4; }
  .rsvp-computing:hover  { background:rgba(45,212,191,.27); box-shadow:0 8px 28px rgba(45,212,191,.3); }
  .rsvp-designing  { background:rgba(244,114,182,.13);border-color:rgba(244,114,182,.5); color:#f9a8d4; }
  .rsvp-designing:hover  { background:rgba(244,114,182,.27);box-shadow:0 8px 28px rgba(244,114,182,.3); }

  /* lock body scroll when modal open */
  body.ev-locked { overflow:hidden; }
`;

// ─── Types & Data ─────────────────────────────────────────────────────────────
interface Event {
  _id: string; title: string; date: string; shortDescription: string;
  venue: string; time: string; image: string; rsvplink: string; domain: string;
}

const events: Event[] = [
  {
    _id: "m1",
    title: "SKY BLAST: Launch Into The Future",
    date: "Apr 17-18, 2026",
    shortDescription: "Sky Blast is an exciting projectile theory-based competition that challenges participants’\n\n understanding of aerodynamics, projectile motion, precision, coordination, and strategy.",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/SKY BLAST.jpeg",
    rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLScfX7utk6ACVBwYwAGXrO8m7Rte1K1irpDBtU0RB9kVCCprXw/viewform",
    domain: "Mechmania"
  },

  {
    _id: "m2",
    title: "SPLASH LEAGUE: Score the Waves",
    date: "Apr 17-18, 2026",
    shortDescription: "Splash League is an exciting water-based competition where teams showcase speed, precision, coordination, and strategy using remotely operated boats in a controlled environment.",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/SPLASH LEAGUE.jpeg",
    rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSeX6fcfyJbvWdpOfRoOsSgrUiZqfvzpUPjEh-X5TEOZRIrtDA/viewform",
    domain: "Mechmania"
  },

  {
    _id: "m3",
    title: "MECHNOVATE: The Ultimate Tech Expo 2026",
    date: "Apr 17-18, 2026",
    shortDescription: "howcase your innovation. Compete with the best. Build the future!",
    venue: "Techno India University",
    time: "10 AM onwards",
    image: "/temp/MECHNOVATE.jpeg",
    rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSfo5OKEc-ifWpCoG9yOcMZo9UbP09PVLpAqw_I82MY7CvMLCQ/viewform",
    domain: "Mechmania"
  },

  {
    _id: "r1",
    title: "RoboWar 15kg: The Ultimate Battle of Steel and Strategy",
    date: "April 17-18, 2026",
    shortDescription: "Prepare for RoboWar 2025 — where engineering meets destruction in the most intense robotic showdown!\n\nCustom-built combat bots clash in a high-stakes battle of power, precision, and strategy. Only the toughest will withstand the chaos.",
    venue: "Techno India University",
    time: "10 AM onwards",
    image: "/temp/R-15kg.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1FBy12bCEIRD8ETH46hfYHpxKPggLS2BevY4e3YTiok0/viewform?edit_requested=true",
    domain: "Robotics"
  },

  {
    _id: "r2",
    title: "DOGE WAR: Forged in Steel, Tested in Battle! (8 kg)",
    date: "April 17-18, 2026",
    shortDescription: "Where Metal Clashes, Sparks Fly, and Champions Rise!\n\nStep into the ultimate battleground where engineering meets adrenaline. Feel the thunderous roar of motors and witness the precision of strategic robot combat.",
    venue: "Techno India University",
    time: "10 AM onwards",
    image: "/temp/R-8kg.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1FBy12bCEIRD8ETH46hfYHpxKPggLS2BevY4e3YTiok0/viewform?edit_requested=true",
    domain: "Robotics"
  },

  {
    _id: "r3",
    title: "RoboSoccer: Where Innovation Meets the Game",
    date: "April 17-18, 2026",
    shortDescription: "Step onto the future of sports where cutting-edge robotics and high-energy competition collide!\n\nWatch autonomous robots dribble, pass, and score with unmatched precision and lightning speed.",
    venue: "Techno India University",
    time: "10 AM onwards",
    image: "/temp/R-Soccer.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1FBy12bCEIRD8ETH46hfYHpxKPggLS2BevY4e3YTiok0/viewform?edit_requested=true",
    domain: "Robotics"
  },

  {
    _id: "r4",
    title: "Line Follower: Precision in Motion!",
    date: "April 17-18, 2026",
    shortDescription: "Watch autonomous robots navigate intricate paths with flawless precision, guided by advanced sensors and lightning-fast reflexes.\n\nThe result of months of innovation, programming, and problem-solving — in real-time competition.",
    venue: "Techno India University",
    time: "10 AM onwards",
    image: "/temp/R-Line.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1FBy12bCEIRD8ETH46hfYHpxKPggLS2BevY4e3YTiok0/viewform?edit_requested=true",
    domain: "Robotics"
  },

  {
    _id: "r5",
    title: "Death Race: Pushing the Limits of Innovation and Speed",
    date: "April 17-18, 2026",
    shortDescription: "Where Velocity Meets Strategy in the Ultimate Battle of Machines!\n\nAutonomous bots race through a relentless gauntlet — navigating sharp turns, leaping over obstacles, and dodging unforeseen challenges with split-second precision.",
    venue: "Techno India University",
    time: "10 AM onwards",
    image: "/temp/R-DR.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1FBy12bCEIRD8ETH46hfYHpxKPggLS2BevY4e3YTiok0/viewform?edit_requested=true",
    domain: "Robotics"
  },

  {
    _id: "f1",
    title: "Scavenger Hunt: A Fun-Filled Adventure!",
    date: "April 18, 2026",
    shortDescription: "Race against the clock to find hidden clues and complete challenges!\n\nGather your team, wear your competitive shoes, and be prepared for a day of adventure and fun. The clock is ticking — can you solve it all?",
    venue: "Techno India University",
    time: "10 AM onwards",
    image: "/temp/FE-SH.jpeg",
    rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSfsu76Zu8wjz4vuFayYmWEPgL5eD7wl610AHI6va0BwH4lKKw/viewform",
    domain: "Fun Events"
  },

  {
    _id: "f2",
    title: "Ultimate Food Eating Challenge!",
    date: "April 18,19 2026",
    shortDescription: "Are You Hungry Enough to Be the Champion?\n\nEat as much as you can within the time limit. No leftovers, no mercy — every bite counts. Tap out, and you're out!",
    venue: "Techno India University",
    time: "10 AM onwards",
    image: "/temp/F-FE.jpeg",
    rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSebbcKtnf03x6E3rmNEAboIKd8SNLamI8F_x8yTWF4Lah-5fw/viewform",
    domain: "Fun Events"
  },

  {
    _id: "f3",
    title: "Error 404: where logic fades… and instincts take over",
    date: "April 17, 2026",
    shortDescription: "Fun Events invites you into a space where thinking isn’t enough — you need clarity, control, and calm under pressure.",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/FE-E404.jpeg",
    rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSe3biFoDgGPpBSGfhfvqLycmNzaNqB_nxnWxGcAUSBtS5bOQw/viewform",
    domain: "Fun Events"
  },

  {
    _id: "f4",
    title: "Superbike Showcase",
    date: "April 18, 2026",
    shortDescription: "Get up close with the finest superbikes, where engineering meets adrenaline!\n\nWitness sleek designs, cutting-edge technology, and the raw power that defines the ultimate riding experience.",
    venue: "Techno India University",
    time: "3 PM onwards",
    image: "/temp/F-SB.jpeg",
    rsvplink: "",
    domain: "Fun Events"
  },

  {
    _id: "i1",
    title: "Pitch to Deck: Turn Ideas into Investments!",
    date: "17th-19th April, 2026",
    shortDescription: "Have a game-changing startup idea? Pitch to Deck is your chance to present it to top CEOs, investors, and industry leaders.\n\nImpress the judges, win exciting cash prizes, and network with experts. Bring your vision to life!",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/26.jpeg",
    rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSc9xzHkOAgT1oipSJKSPMQET7psNIrRYdha5AD0PbnH2lPI3g/viewform",
    domain: "Innovation"
  },

  {
    _id: "i2",
    title: "CXO Round Table",
    date: "19th April, 2026",
    shortDescription: "The CXO Round Table is a dynamic team-based strategic simulation where participants step into the roles of top executives like CEO, CFO, CMO, and more.\n\nTeams will analyze real-world business scenarios, tackle challenges, and make high-stakes decisions that shape the future of their company. It’s a test of leadership, teamwork, and strategic thinking under pressure.",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/CXO Round Table.jpeg",
    rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSewo86U0d0T7No7W1dQqj5sr_gb3T1UFE1R-HdpanGogcTrXQ/viewform",
    domain: "Innovation"
  },
  {
    _id: "i3",
    title: "TRADE UP: Rise Through Smart Moves!",
    date: "19th April, 2026",
    shortDescription: "nnovation & Management presents TRADE UP, an intense solo challenge where strategy, timing, and decision-making define your success. Step into the world of trading and compete against others as you make calculated moves to grow your position.\n\nEach round brings new opportunities and risks. Analyze quickly, adapt your strategy, and make bold choices to stay ahead. The smarter your decisions, the higher you climb.",
    venue: "Techno India University",
    time: "9:00 AM – 3:30 PM",
    image: "/temp/26.1.jpeg",
    rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSfb8k8xXL5CQYzWQG60JY-Q3WrjtN0nRv4qeuMUlTJbH7gLEw/viewform",
    domain: "Innovation"
  },

  {
    _id: "g1",
    title: "Chess",
    date: "17th April, 2026",
    shortDescription: "Step into the arena of intellect and strategy — where every move counts and only the sharpest minds prevail!\n\nJoin the Ultimate Chess Tournament and prove your mastery over the board in high-stakes battles of wit.",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/G-CHESS.jpeg",
    rsvplink: "",
    domain: "Gaming"
  },

  {
    _id: "g2",
    title: "FC'25",
    date: "17-18th April, 2026",
    shortDescription: "Step onto the virtual football pitch for high-stakes battles where skill and teamwork decide the champion.\n\nCompete against the best in real-time FIFA action. Do you have what it takes to lift the virtual trophy?",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/G-FC.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1UV6r3hu2XGXrfR8IgqC3P4cezviTyMN71df6iOSrmT8/viewform?ts=69c438f4&edit_requested=true",
    domain: "Gaming"
  },

  {
    _id: "g3",
    title: "BGMI",
    date: "17th-19th April, 2026",
    shortDescription: "Battlegrounds Mobile India: Survive, Conquer, Dominate!\n\nGear up, drop in, and battle your way to victory. Intense battle royale action — compete against the toughest squads and be the last one standing!",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/G-BGMI.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1ugkX3tqfpnSqDP1BSXkIyWfsaw8aSbc33FHfYg_CoEk/viewform?ts=69c78ace&edit_requested=true",
    domain: "Gaming"
  },

  {
    _id: "g4",
    title: "Valorant",
    date: "17th-19th April, 2026",
    shortDescription: "VALORANT: Aim. Strategize. Dominate!\n\nAssemble your squad, lock in your agents, and prepare for intense tactical 5v5 combat. Precision, teamwork, and strategy decide who controls the battlefield.",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/G-Valo.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1vi4w1xpPnf29RsSfOv9k9VpKnQW3T5V71OWHeLhiNNg/viewform?ts=69c433de&edit_requested=true",
    domain: "Gaming"
  },



  {
    _id: "g6",
    title: "FREE FIRE",
    date: "17th-19th April, 2026",
    shortDescription: "Gear up for intense battle royale action!\n\nAssemble your squad, drop in, and outplay your rivals in fast-paced, adrenaline-pumping matches. Strategy, skill, and survival decide the ultimate champion.",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/G-FF.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1vyJOw5Y4q9IS0R8Ou249Irei_-8AZ8e1fuypFK5JbSg/viewform?ts=69c7885d&edit_requested=true",
    domain: "Gaming"
  },

  {
    _id: "g7",
    title: "EFOOTBALL SHOWDOWN",
    date: "17th-19th April, 2026",
    shortDescription: "EFOOTBALL SHOWDOWN: Rule the Pitch!\n\nExperience the thrill of professional football in this intense 1v1 tournament. Master skills, make split-second decisions, and dominate the competition to claim victory!",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/G-EF.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1qqbizVsYbzHzfoxcY9R666qjHb8cPyMAeCclzd1D_u0/viewform?ts=69c57ed1&edit_requested=true",
    domain: "Gaming"
  },

  {
    _id: "g8",
    title: "CONTRA",
    date: "17th-19th April, 2026",
    shortDescription: "CONTRA: The Ultimate Showdown!\n\nExperience intense 1v1 combat where precision, strategy, and quick reflexes determine the winner. Outplay your opponents and claim victory in this thrilling showdown!",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/G-CONTRA.jpeg",
    rsvplink: "",
    domain: "Gaming"
  },

  {
    _id: "g9",
    title: "PACMAN",
    date: "17th-19th April, 2026",
    shortDescription: "PACMAN: The Ultimate Showdown!\n\nExperience intense 1v1 combat where precision, strategy, and quick reflexes determine the winner. Outplay your opponents and claim victory in this thrilling showdown!",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/G-PM.jpeg",
    rsvplink: "",
    domain: "Gaming"
  },

  {
    _id: "g10",
    title: "MORTAL KOMBAT",
    date: "17th-19th April, 2026",
    shortDescription: "MORTAL KOMBAT: The Ultimate Showdown!\n\nExperience intense 1v1 combat where precision, strategy, and quick reflexes determine the winner. Outplay your opponents and claim victory in this thrilling showdown!",
    venue: "Techno India Unive  rsity",
    time: "11 AM onwards",
    image: "/temp/G-MK.jpeg",
    rsvplink: "https://docs.google.com/forms/d/13OBX5V8FqunhIGF-wQ6U88x9AoF9VJy7818cP92b6KE/viewform?ts=69c75df1&edit_requested=true",
    domain: "Gaming"
  },

  {
    _id: "g11",
    title: "PHASMOPHOBIA",
    date: "18th-19th April, 2026",
    shortDescription: "PHASMOPHOBIA: ENTER A DARK, IMMERSIVE ENVIRONMENT WHERE YOU WILL INVESTIGATE PARANORMAL ACTIVITY, IDENTIFY THE GHOST, AND TRY TO SURVIVE THE HUNT. THIS IS NOT JUST A GAME—IT’S A LIVE HORROR EXPERIENCE FILLED WITH TENSION AND UNEXPECTED JUMPSCARES!",
    venue: "Techno India Unive  rsity",
    time: "11 AM onwards",
    image: "/temp/G-P.jpeg",
    rsvplink: "https://docs.google.com/forms/d/1yofLydTS7TcaK8JenA57OKxNvV3TaqhkXHI4all9zfw/viewform?ts=69c43417&edit_requested=true",
    domain: "Gaming"
  },




  {
    _id: "C1",
    title: "Ship or Sink",
    date: "17th-19th April, 2026",
    shortDescription: "Ship or Sink: Navigate the Storm!\n\nTest your strategy and nerve in this thrilling survival challenge. Make critical decisions to keep your ship afloat while outsmarting opponents. Every choice matters — sink or sail to victory!",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/temp/G-SOS.jpeg",
    rsvplink: "https://luma.com/ebif34tr",
    domain: "Computing"
  },





  {
    _id: "d1",
    title: "Cosplay",
    date: "Mar 10, 2025",
    shortDescription: "Step into a world where fantasy meets reality!\n\nFrom iconic heroes to legendary villains, witness stunning transformations as cosplayers bring their favourite characters to life with passion, creativity, and incredible craftsmanship.",
    venue: "Techno India University",
    time: "11 AM onwards",
    image: "/cosplay.jpg",
    rsvplink: "",
    domain: "Designing"
  },
];

// Domain logo

const domainConfig: Record<string,

  {
    icon: string; cardClass: string;
    badgeClass: string; iconClass: string;
    titleColor: string;
    rsvpClass: string
  }> = {

  Mechmania: {
    icon: "/domain logo/Mechmania.png",
    cardClass: "ec-mechmania",
    badgeClass: "badge-mechmania",
    iconClass: "icon-mechmania",
    titleColor: "#fca5a5",
    rsvpClass: "rsvp-mechmania"
  },

  Robotics: {
    icon: "/domain logo/Robotics.png",
    cardClass: "ec-robotics",
    badgeClass: "badge-robotics",
    iconClass: "icon-robotics",
    titleColor: "#7dd3fc",
    rsvpClass: "rsvp-robotics"
  },

  "Fun Events": {
    icon: "/domain logo/Fun_Events.png",
    cardClass: "ec-fun",
    badgeClass: "badge-fun",
    iconClass: "icon-fun",
    titleColor: "#86efac",
    rsvpClass: "rsvp-fun"
  },

  Innovation: {
    icon: "/domain logo/I_M_Logo.png",
    cardClass: "ec-innovation",
    badgeClass: "badge-innovation",
    iconClass: "icon-innovation",
    titleColor: "#fdba74",
    rsvpClass: "rsvp-innovation"
  },

  Gaming: {
    icon: "/domain logo/BlackBirds.png",
    cardClass: "ec-gaming",
    badgeClass: "badge-gaming",
    iconClass: "icon-gaming",
    titleColor: "#d8b4fe",
    rsvpClass: "rsvp-gaming"
  },

  Computing: {
    icon: "/domain logo/COMPUTING LOGO.png",
    cardClass: "ec-computing",
    badgeClass: "badge-computing",
    iconClass: "icon-computing",
    titleColor: "#5eead4",
    rsvpClass: "rsvp-computing"
  },

  Designing: {
    icon: "/domain logo/GD_Logo_3.png",
    cardClass: "ec-designing",
    badgeClass: "badge-designing",
    iconClass: "icon-designing",
    titleColor: "#f9a8d4",
    rsvpClass: "rsvp-designing"
  },
};

const domainOrder = ["Mechmania", "Robotics", "Fun Events", "Innovation", "Gaming", "Computing", "Designing"];

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
    <div ref={ref} className="ev-stat">
      <div className="ev-stat-n">{val}+</div>
      <div className="ev-stat-l">{label}</div>
    </div>
  );
}

// ─── Shared detail block (used by both desktop panel & mobile modal) ──────────
function EventDetail({ event, cfg }: { event: Event; cfg: typeof domainConfig[string] }) {
  return (
    <>
      <div className={`ev-expand-tag ${cfg.badgeClass}`}>
        <Image src={cfg.icon} alt={event.domain} width={16} height={16} style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }} />
        {event.domain === "Innovation" ? "Innovation & Management" : event.domain}
      </div>
      <div className="ev-expand-title">{event.title}</div>
      <div className="ev-expand-desc">{event.shortDescription}</div>
      <div className="ev-expand-meta">
        <div className="ev-expand-meta-row"><BsCalendar3 size={13} />{event.date}</div>
        <div className="ev-expand-meta-row"><BiTime size={13} />{event.time}</div>
        <div className="ev-expand-meta-row"><MdOutlineLocationOn size={14} />{event.venue}</div>
      </div>
      {event.rsvplink
        ? <Link href={event.rsvplink} target="_blank" rel="noopener noreferrer" className={`ev-expand-rsvp ${cfg.rsvpClass}`}>RSVP Now <HiArrowRight size={14} /></Link>
        : <div className="ev-expand-no-rsvp">Registration Closed</div>
      }
    </>
  );
}

// ─── Desktop hover expand panel ───────────────────────────────────────────────
function ExpandPanel({ event, onPanelEnter, onPanelLeave }: {
  event: Event | null;
  onPanelEnter: () => void;
  onPanelLeave: () => void;
}) {
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState<Event | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (event) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCurrent(event);
      requestAnimationFrame(() => requestAnimationFrame(() => setActive(true)));
    } else {
      setActive(false);
      timerRef.current = setTimeout(() => setCurrent(null), 420);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [event]);

  const cfg = current ? (domainConfig[current.domain] ?? domainConfig["Mechmania"]) : null;

  return (
    <>
      <div className={`ev-expand-backdrop ${active ? 'active' : ''}`} />
      <div className={`ev-expand ${active ? 'active' : ''}`} onMouseEnter={onPanelEnter} onMouseLeave={onPanelLeave}>
        {current && cfg && (
          <>
            {/* LEFT — full image */}
            <div className="ev-expand-img">
              <Image src={current.image} alt={current.title} fill sizes="470px"
                style={{ objectFit: 'cover', objectPosition: 'center' }} />
            </div>
            {/* RIGHT — scrollable details */}
            <div className="ev-expand-info">
              <EventDetail event={current} cfg={cfg} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Mobile fullscreen modal ───────────────────────────────────────────────────
// Full-width image fixed at top, all details scrollable below
function MobileModal({ event, onClose }: { event: Event | null; onClose: () => void }) {
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState<Event | null>(null);
  const cfg = current ? (domainConfig[current.domain] ?? domainConfig["Mechmania"]) : null;

  useEffect(() => {
    if (event) {
      setCurrent(event);
      document.body.classList.add('ev-locked');
      requestAnimationFrame(() => requestAnimationFrame(() => setActive(true)));
    } else {
      setActive(false);
      setTimeout(() => { setCurrent(null); document.body.classList.remove('ev-locked'); }, 450);
    }
    return () => document.body.classList.remove('ev-locked');
  }, [event]);

  const close = useCallback(() => {
    setActive(false);
    setTimeout(onClose, 450);
  }, [onClose]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [close]);

  if (!current || !cfg) return null;

  return (
    <>
      {/* Backdrop — separate from modal so clicking it closes */}
      <div
        className={`ev-modal-overlay ${active ? 'active' : ''}`}
        onClick={close}
      />
      {/* Modal sheet */}
      <div className={`ev-modal ${active ? 'active' : ''}`}>
        {/* Drag handle */}
        <div className="ev-modal-handle" />
        {/* Close button */}
        <button className="ev-modal-close" onClick={close} aria-label="Close">✕</button>
        {/* Full-width image — always visible at top */}
        <div className="ev-modal-img">
          <Image
            src={current.image} alt={current.title} fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        {/* All details scroll below */}
        <div className="ev-modal-body">
          <EventDetail event={current} cfg={cfg} />
        </div>
      </div>
    </>
  );
}

// ─── EventCard ────────────────────────────────────────────────────────────────
function EventCard({ event, onHover, onLeave, onTap }: {
  event: Event;
  onHover: (e: Event) => void;
  onLeave: () => void;
  onTap: (e: Event) => void;
}) {
  const cfg = domainConfig[event.domain] ?? domainConfig["Mechmania"];
  return (
    <div
      className="ec-wrap"
      onMouseEnter={() => onHover(event)}
      onMouseLeave={onLeave}
      onClick={() => onTap(event)}
    >
      <div className={`ec ${cfg.cardClass}`}>
        <div className="ec-img">
          <Image src={event.image} alt={event.title} fill sizes="(max-width:640px) 100vw, 33vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }} />
          <div className="ec-date-badge"><BsCalendar3 size={9} style={{ display: 'inline', marginRight: 4 }} />{event.date}</div>
        </div>
        <div className="ec-body">
          <div className="ec-title">{event.title}</div>
          <div className="ec-desc-short">{event.shortDescription.split('\n')[0]}</div>
          <div className="ec-meta-row"><MdOutlineLocationOn size={13} />{event.venue}</div>
          <div className="ec-meta-row"><BiTime size={12} />{event.time}</div>
        </div>
      </div>
    </div>
  );
}

// ─── DomainBlock ──────────────────────────────────────────────────────────────
function DomainBlock({ domain, onHover, onLeave, onTap }: {
  domain: string;
  onHover: (e: Event) => void;
  onLeave: () => void;
  onTap: (e: Event) => void;
}) {
  const headerRef = useReveal(0.1);
  const gridRef = useReveal(0.07);
  const cfg = domainConfig[domain];
  const domEvents = events.filter(e => e.domain === domain);
  if (!domEvents.length) return null;
  return (
    <div className="dom-section">
      <div ref={headerRef} className="rv dom-header">
        <div className={`dom-icon ${cfg.iconClass}`}>
          <Image src={cfg.icon} alt={domain} width={26} height={26} style={{ objectFit: 'contain' }} />
        </div>
        <div className="dom-title" style={{ color: cfg.titleColor }}>{domain === "Innovation" ? "Innovation & Management" : domain}</div>
        <div className={`dom-count ${cfg.badgeClass}`}>{domEvents.length} event{domEvents.length > 1 ? 's' : ''}</div>
      </div>
      <div ref={gridRef} className="sg ev-grid">
        {domEvents.map(ev => (
          <EventCard key={ev._id} event={ev} onHover={onHover} onLeave={onLeave} onTap={onTap} />
        ))}
      </div>
    </div>
  );
}

// ─── Events Page ──────────────────────────────────────────────────────────────
function Events() {
  const heroRef = useReveal(0.04);
  const statsRef = useReveal(0.08);

  // Desktop hover state — debounced so moving mouse card→panel doesn't flicker
  const [hovered, setHovered] = useState<Event | null>(null);
  const [tapped, setTapped] = useState<Event | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch(window.matchMedia('(hover:none)').matches); }, []);

  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLeave = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
  }, []);

  const scheduleLeave = useCallback(() => {
    cancelLeave();
    leaveTimer.current = setTimeout(() => setHovered(null), 80);
  }, [cancelLeave]);

  const handleHover = useCallback((ev: Event) => { if (isTouch) return; cancelLeave(); setHovered(ev); }, [isTouch, cancelLeave]);
  const handleLeave = useCallback(() => { if (!isTouch) scheduleLeave(); }, [isTouch, scheduleLeave]);
  const handlePanelEnter = useCallback(() => { cancelLeave(); }, [cancelLeave]);
  const handlePanelLeave = useCallback(() => { scheduleLeave(); }, [scheduleLeave]);
  const handleTap = useCallback((ev: Event) => { if (isTouch) setTapped(ev); }, [isTouch]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="ev-section">
        <div className="ev-bg-grid" />
        <div className="ev-orb ev-orb-1" />
        <div className="ev-orb ev-orb-2" />
        <div className="ev-scan" />

        <div className="ev-inner">
          {/* HERO */}
          <div ref={heroRef} className="rv ev-hero">
            <div className="ev-eyebrow">Techno Vivarta</div>
            <h1 className="ev-h1">Our<br /><span>Events.</span></h1>
            <div className="ev-rule"><div className="ev-rule-dot" /></div>
            <p className="ev-hero-p">
              Thrilling competitions across Robotics, Gaming, Innovation, and more.
            </p>
          </div>



          {/* DOMAIN SECTIONS */}
          {domainOrder.map((d, i) => (
            <div key={d}>
              {i > 0 && <div className="ev-divider"><div className="ev-divider-dot" /></div>}
              <DomainBlock domain={d} onHover={handleHover} onLeave={handleLeave} onTap={handleTap} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop hover expand — panel keeps hover alive via onPanelEnter/Leave */}
      {!isTouch && <ExpandPanel event={hovered} onPanelEnter={handlePanelEnter} onPanelLeave={handlePanelLeave} />}

      {/* Mobile tap modal — full image top, details below */}
      {isTouch && <MobileModal event={tapped} onClose={() => setTapped(null)} />}
    </>
  );
}

export default Events;
