"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BiTime } from "react-icons/bi"
import { MdOutlineLocationOn } from "react-icons/md"
import { HiArrowRight } from "react-icons/hi"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  :root {
    --red:#e11d48; --red-dim:#9f1239;
    --red-glow:rgba(225,29,72,.40);
    --white:#f8fafc; --white-dim:rgba(248,250,252,.65); --white-muted:rgba(248,250,252,.34);
    --black:#080808; --gray:#1e1e1e; --gray-2:#2a2a2a;
  }

  .hp-root { background:var(--black); color:var(--white); font-family:'DM Sans',sans-serif; overflow-x:hidden; }

  /* ── Background ── */
  .hp-bg-grid {
    position:fixed; inset:0; pointer-events:none; z-index:0;
    background-image:
      linear-gradient(rgba(225,29,72,.038) 1px,transparent 1px),
      linear-gradient(90deg,rgba(225,29,72,.038) 1px,transparent 1px);
    background-size:52px 52px;
    mask-image:radial-gradient(ellipse 80% 80% at 50% 20%,black 30%,transparent 100%);
  }
  .hp-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; filter:blur(110px); }
  .hp-orb-1 { width:600px; height:600px; top:-160px; left:-160px; background:var(--red); opacity:.12; animation:orbA 18s ease-in-out infinite; }
  .hp-orb-2 { width:440px; height:440px; bottom:-80px; right:-100px; background:var(--red-dim); opacity:.10; animation:orbB 22s ease-in-out infinite; }
  @keyframes orbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(80px,60px)} }
  @keyframes orbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,-80px)} }

  /* ── Scroll reveal ── */
  .rv  { opacity:0; transform:translateY(44px); transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1); }
  .rv.vis { opacity:1; transform:none; }
  .rv-l{ opacity:0; transform:translateX(-44px); transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1); }
  .rv-l.vis{ opacity:1; transform:none; }
  .sg > * { opacity:0; transform:translateY(32px); transition:opacity .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1); }
  .sg.vis > *:nth-child(1){opacity:1;transform:none;transition-delay:.05s}
  .sg.vis > *:nth-child(2){opacity:1;transform:none;transition-delay:.12s}
  .sg.vis > *:nth-child(3){opacity:1;transform:none;transition-delay:.19s}
  .sg.vis > *:nth-child(4){opacity:1;transform:none;transition-delay:.26s}
  .sg.vis > *:nth-child(5){opacity:1;transform:none;transition-delay:.33s}
  .sg.vis > *:nth-child(6){opacity:1;transform:none;transition-delay:.40s}
  .sg.vis > *:nth-child(7){opacity:1;transform:none;transition-delay:.47s}
  .sg.vis > *:nth-child(n+8){opacity:1;transform:none;transition-delay:.54s}

  /* ══════════════════════════════════
     HERO
  ══════════════════════════════════ */
  .hero {
    position:relative; z-index:1;
    min-height:100vh;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; padding:0 1.25rem 5rem;
    overflow:hidden;
  }

  /* Animated scanlines */
  .hero-scan {
    position:absolute; inset:0; pointer-events:none; opacity:.45;
    background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.05) 3px,rgba(0,0,0,.05) 6px);
    animation:scanMove 14s linear infinite;
  }
  @keyframes scanMove { from{background-position:0 0} to{background-position:0 120px} }

  /* Pulsing rings */
  .hero-ring {
    position:absolute; border-radius:50%;
    top:50%; left:50%;
    pointer-events:none; animation:ringPulse 4s ease-in-out infinite;
  }
  .hero-ring-1 { width:min(740px,92vw); height:min(740px,92vw); transform:translate(-50%,-54%); border:1px solid rgba(225,29,72,.13); }
  .hero-ring-2 { width:min(540px,72vw); height:min(540px,72vw); transform:translate(-50%,-54%); border:1px solid rgba(225,29,72,.08); animation-direction:reverse; }
  .hero-ring-3 { width:min(340px,52vw); height:min(340px,52vw); transform:translate(-50%,-54%); border:1px solid rgba(225,29,72,.06); animation-delay:.8s; }
  @keyframes ringPulse { 0%,100%{opacity:.6;scale:1} 50%{opacity:1;scale:1.032} }

  /* Floating particles */
  .hero-particle {
    position:absolute; border-radius:50%; pointer-events:none;
    background:var(--red); opacity:0;
    animation:particleFloat linear infinite;
  }
  @keyframes particleFloat {
    0%   { opacity:0; transform:translateY(0) scale(0); }
    10%  { opacity:.7; }
    90%  { opacity:.4; }
    100% { opacity:0; transform:translateY(-120px) scale(1.4); }
  }

  /* Hero text */
  .hero-eyebrow {
    display:inline-flex; align-items:center; gap:10px;
    font-family:'Rajdhani',sans-serif; font-size:.78rem; font-weight:700;
    letter-spacing:.28em; text-transform:uppercase; color:var(--red);
    margin-bottom:1.5rem; position:relative; z-index:2;
    animation:fadeDown .8s cubic-bezier(.22,1,.36,1) both;
  }
  .hero-eyebrow::before,.hero-eyebrow::after { content:''; width:24px; height:1px; background:var(--red); }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:none} }

  .hero-h1 {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(5rem,15vw,12rem);
    line-height:.87; letter-spacing:.01em;
    position:relative; z-index:2;
    animation:heroScale 1s cubic-bezier(.22,1,.36,1) .12s both;
  }
  @keyframes heroScale { from{opacity:0;transform:scale(.78) translateY(20px)} to{opacity:1;transform:none} }
  .hero-h1 .word-solid { color:var(--white); display:block; }
  .hero-h1 .word-outline {
    display:block;
    color:transparent;
    -webkit-text-stroke:2px var(--red);
    filter:drop-shadow(0 0 28px rgba(225,29,72,.55));
  }

  .hero-tagline {
    font-family:'Rajdhani',sans-serif; font-size:clamp(.9rem,2vw,1.1rem); font-weight:500;
    letter-spacing:.08em; color:var(--white-muted);
    margin-top:1rem; margin-bottom:2.4rem; position:relative; z-index:2;
    max-width:520px;
    animation:fadeUp .9s cubic-bezier(.22,1,.36,1) .32s both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }

  /* CTA row */
  .hero-ctas {
    display:flex; gap:14px; flex-wrap:wrap; justify-content:center;
    position:relative; z-index:2;
    animation:fadeUp .9s cubic-bezier(.22,1,.36,1) .48s both;
  }
  .btn-red {
    display:inline-flex; align-items:center; gap:9px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.92rem; letter-spacing:.12em; text-transform:uppercase;
    padding:14px 32px; border-radius:10px; text-decoration:none;
    background:var(--red); color:#fff; border:1px solid var(--red);
    transition:transform .24s ease, box-shadow .24s ease, background .24s ease;
    position:relative; overflow:hidden;
  }
  .btn-red::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 60%); pointer-events:none; }
  .btn-red:hover { transform:translateY(-3px); box-shadow:0 14px 38px var(--red-glow); background:#c91a3f; }
  .btn-red svg { transition:transform .22s ease; }
  .btn-red:hover svg { transform:translateX(4px); }
  .btn-ghost {
    display:inline-flex; align-items:center; gap:9px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.92rem; letter-spacing:.12em; text-transform:uppercase;
    padding:14px 32px; border-radius:10px; text-decoration:none;
    background:transparent; color:var(--white); border:1px solid rgba(255,255,255,.2);
    transition:transform .24s ease, border-color .24s ease, background .24s ease;
  }
  .btn-ghost:hover { transform:translateY(-3px); border-color:rgba(255,255,255,.5); background:rgba(255,255,255,.06); }

  /* Stat strip */
  .hero-stats {
    display:flex; gap:0; flex-wrap:wrap; justify-content:center;
    margin-top:4rem; position:relative; z-index:2;
    border:1px solid rgba(255,255,255,.07); border-radius:14px;
    background:rgba(255,255,255,.025); backdrop-filter:blur(6px);
    overflow:hidden;
    animation:fadeUp .9s cubic-bezier(.22,1,.36,1) .62s both;
  }
  .hero-stat {
    padding:16px 28px; text-align:center;
    border-right:1px solid rgba(255,255,255,.07);
  }
  .hero-stat:last-child { border-right:none; }
  .hero-stat-n { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.8rem,4vw,2.6rem); color:var(--red); line-height:1; }
  .hero-stat-l { font-family:'DM Sans',sans-serif; font-size:.66rem; color:var(--white-muted); letter-spacing:.12em; text-transform:uppercase; margin-top:2px; }

  /* Scroll indicator */
  .hero-scroll {
    position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
    z-index:2; display:flex; flex-direction:column; align-items:center; gap:6px;
    font-family:'Rajdhani',sans-serif; font-size:.65rem; letter-spacing:.2em; text-transform:uppercase; color:var(--white-muted);
    animation:fadeUp 1s cubic-bezier(.22,1,.36,1) .9s both;
  }
  .hero-scroll-bar {
    width:1px; height:46px;
    background:linear-gradient(to bottom,var(--red),transparent);
    animation:scrollBar 2.2s ease-in-out infinite;
  }
  @keyframes scrollBar { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }

  /* ══════════════════════════════════
     SHARED SECTION
  ══════════════════════════════════ */
  .hp-section { position:relative; z-index:1; padding:5rem 1.25rem; }
  .hp-inner { max-width:1240px; margin:0 auto; }
  .sec-label {
    display:inline-flex; align-items:center; gap:10px;
    font-family:'Rajdhani',sans-serif; font-size:.72rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--red);
    margin-bottom:.9rem;
  }
  .sec-label::before { content:''; width:22px; height:1px; background:var(--red); }
  .sec-h2 { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.2rem,6vw,3.8rem); letter-spacing:.04em; color:var(--white); line-height:1; margin-bottom:.6rem; }
  .sec-h2 span { color:var(--red); }
  .sec-sub { font-size:.96rem; color:var(--white-muted); line-height:1.75; max-width:520px; margin-bottom:0; }

  /* Divider */
  .hp-div { display:flex; align-items:center; gap:12px; max-width:1240px; margin:0 auto; padding:0 1.25rem; }
  .hp-div::before,.hp-div::after { content:''; flex:1; height:1px; background:var(--gray-2); }
  .hp-div-dot { width:8px; height:8px; border-radius:50%; background:var(--red); box-shadow:0 0 10px var(--red-glow); flex-shrink:0; }

  /* ══════════════════════════════════
     PILLARS
  ══════════════════════════════════ */
  .pillars-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; margin-top:3rem; }
  .pillar-card {
    position:relative; border-radius:16px; padding:32px 28px;
    background:linear-gradient(145deg,#141414,#0e0e0e); border:1px solid var(--gray-2);
    overflow:hidden; cursor:default;
    transform-style:preserve-3d;
    transition:box-shadow .38s cubic-bezier(.22,1,.36,1), border-color .38s ease;
    will-change:transform;
  }
  .pillar-card::before { content:''; position:absolute; top:0; left:12%; right:12%; height:1px; background:linear-gradient(90deg,transparent,var(--red),transparent); opacity:.6; }
  .pillar-card::after  { content:''; position:absolute; inset:0; background:linear-gradient(145deg,rgba(255,255,255,.04) 0%,transparent 55%); pointer-events:none; }
  .pillar-card:hover { border-color:rgba(225,29,72,.5); box-shadow:0 22px 54px rgba(225,29,72,.16); }
  .pillar-icon { font-size:2rem; margin-bottom:16px; display:block; }
  .pillar-title { font-family:'Bebas Neue',sans-serif; font-size:1.6rem; letter-spacing:.06em; color:var(--white); margin-bottom:10px; }
  .pillar-desc { font-size:.87rem; line-height:1.74; color:var(--white-muted); }

  /* ══════════════════════════════════
     ABOUT
  ══════════════════════════════════ */
  .about-block { display:grid; grid-template-columns:1fr 1fr; gap:52px; align-items:center; margin-bottom:5rem; }
  @media(max-width:768px){ .about-block{ grid-template-columns:1fr; gap:24px; } }
  .about-img {
    position:relative; border-radius:18px; overflow:hidden; aspect-ratio:4/3;
    border:1px solid var(--gray-2);
    transition:box-shadow .4s ease;
  }
  .about-img::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(225,29,72,.1) 0%,transparent 60%); z-index:1; pointer-events:none; }
  .about-img:hover { box-shadow:0 20px 56px rgba(225,29,72,.14); }
  .about-img img { object-fit:cover; object-position:center; transition:transform .6s ease; }
  .about-img:hover img { transform:scale(1.04); }
  .about-tag { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.68rem; letter-spacing:.18em; text-transform:uppercase; color:var(--red); margin-bottom:.7rem; display:block; }
  .about-h3 { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.8rem,4vw,2.8rem); letter-spacing:.04em; color:var(--white); line-height:1; margin-bottom:1.1rem; }
  .about-p { font-size:.91rem; line-height:1.84; color:var(--white-muted); margin-bottom:.9rem; }

  /* ══════════════════════════════════
     LEADERS — 3D tilt cards
  ══════════════════════════════════ */
  .leaders-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(195px,1fr)); gap:18px; margin-top:3rem; }
  @media(max-width:640px){ .leaders-grid{ grid-template-columns:repeat(2,1fr); gap:12px; } }

  .leader-card {
    position:relative; border-radius:18px; overflow:hidden;
    padding:26px 16px 22px; text-align:center; cursor:default;
    background:linear-gradient(158deg,#141414 0%,#0e0e0e 55%,#121212 100%);
    border:1px solid var(--gray-2);
    transform-style:preserve-3d;
    transition:box-shadow .4s cubic-bezier(.22,1,.36,1), border-color .4s ease;
    will-change:transform;
  }
  /* shimmer top line */
  .leader-card::before { content:''; position:absolute; top:0; left:10%; right:10%; height:1px; background:linear-gradient(90deg,transparent,rgba(225,29,72,.7),transparent); opacity:.7; }
  /* gloss overlay */
  .leader-card::after  { content:''; position:absolute; inset:0; background:linear-gradient(145deg,rgba(255,255,255,.05) 0%,transparent 55%); pointer-events:none; }

  .leader-card:hover { border-color:rgba(225,29,72,.6); box-shadow:0 22px 54px rgba(225,29,72,.2), 0 0 0 1px rgba(225,29,72,.28); }

  /* photo ring */
  .leader-photo {
    width:120px; height:120px; border-radius:50%; overflow:hidden;
    margin:0 auto 16px; border:2px solid rgba(225,29,72,.35); flex-shrink:0;
    transition:box-shadow .4s ease;
    position:relative; z-index:1;
  }
  .leader-card:hover .leader-photo { box-shadow:0 0 0 4px rgba(225,29,72,.85), 0 0 28px rgba(225,29,72,.5); }
  .leader-photo img { object-fit:cover; object-position:center top; transition:transform .5s cubic-bezier(.22,1,.36,1); }
  .leader-card:hover .leader-photo img { transform:scale(1.12); }

  /* shimmer on photo */
  .leader-photo::after { content:''; position:absolute; inset:0; border-radius:50%; background:linear-gradient(135deg,rgba(255,255,255,.2) 0%,transparent 55%); opacity:0; transition:opacity .35s ease; pointer-events:none; }
  .leader-card:hover .leader-photo::after { opacity:1; }

  .leader-name { font-family:'Rajdhani',sans-serif; font-size:.95rem; font-weight:700; letter-spacing:.04em; color:var(--white); text-transform:uppercase; line-height:1.2; margin-bottom:5px; position:relative; z-index:1; }
  .leader-role { font-family:'DM Sans',sans-serif; font-size:.72rem; color:rgba(225,29,72,.8); line-height:1.45; position:relative; z-index:1; }

  /* Social row on hover */
  .leader-socials { display:flex; justify-content:center; gap:0; margin-top:12px; opacity:0; transform:translateY(7px); transition:opacity .3s ease, transform .3s ease; position:relative; z-index:1; }
  .leader-card:hover .leader-socials { opacity:1; transform:translateY(0); }

  /* ══════════════════════════════════
     DOMAINS
  ══════════════════════════════════ */
  .domains-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(255px,1fr)); gap:14px; margin-top:3rem; }
  .domain-card {
    position:relative; border-radius:14px; padding:26px 22px;
    border:1px solid var(--gray-2); overflow:hidden; cursor:default;
    transform-style:preserve-3d;
    transition:box-shadow .38s cubic-bezier(.22,1,.36,1), border-color .38s ease;
    will-change:transform;
  }
  .domain-card::after { content:''; position:absolute; inset:0; border-radius:14px; background:linear-gradient(145deg,rgba(255,255,255,.03) 0%,transparent 55%); pointer-events:none; }
  .domain-icon { font-size:1.6rem; margin-bottom:12px; }
  .domain-name { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; letter-spacing:.06em; margin-bottom:8px; }
  .domain-desc { font-size:.8rem; line-height:1.68; color:var(--white-muted); }
  .dc-computing  { background:linear-gradient(145deg,#06121a,#0e0e0e); border-color:rgba(56,189,248,.2); }
  .dc-computing:hover  { border-color:rgba(56,189,248,.6); box-shadow:0 16px 44px rgba(56,189,248,.14); }
  .dc-computing .domain-name  { color:#7dd3fc; }
  .dc-robotics   { background:linear-gradient(145deg,#0a0810,#0e0e0e); border-color:rgba(192,132,252,.2); }
  .dc-robotics:hover   { border-color:rgba(192,132,252,.6); box-shadow:0 16px 44px rgba(192,132,252,.14); }
  .dc-robotics .domain-name   { color:#d8b4fe; }
  .dc-gaming     { background:linear-gradient(145deg,#0a0a16,#0e0e0e); border-color:rgba(129,140,248,.2); }
  .dc-gaming:hover     { border-color:rgba(129,140,248,.6); box-shadow:0 16px 44px rgba(129,140,248,.14); }
  .dc-gaming .domain-name     { color:#a5b4fc; }
  .dc-mechmania  { background:linear-gradient(145deg,#1a0a0d,#0e0e0e); border-color:rgba(225,29,72,.2); }
  .dc-mechmania:hover  { border-color:rgba(225,29,72,.6); box-shadow:0 16px 44px rgba(225,29,72,.14); }
  .dc-mechmania .domain-name  { color:#fca5a5; }
  .dc-innovation { background:linear-gradient(145deg,#150d04,#0e0e0e); border-color:rgba(251,146,60,.2); }
  .dc-innovation:hover { border-color:rgba(251,146,60,.6); box-shadow:0 16px 44px rgba(251,146,60,.14); }
  .dc-innovation .domain-name { color:#fdba74; }
  .dc-designing  { background:linear-gradient(145deg,#170610,#0e0e0e); border-color:rgba(244,114,182,.2); }
  .dc-designing:hover  { border-color:rgba(244,114,182,.6); box-shadow:0 16px 44px rgba(244,114,182,.14); }
  .dc-designing .domain-name  { color:#f9a8d4; }
  .dc-fun        { background:linear-gradient(145deg,#081408,#0e0e0e); border-color:rgba(74,222,128,.2); }
  .dc-fun:hover        { border-color:rgba(74,222,128,.6); box-shadow:0 16px 44px rgba(74,222,128,.14); }
  .dc-fun .domain-name        { color:#86efac; }

  /* ══════════════════════════════════
     EVENTS PREVIEW
  ══════════════════════════════════ */
  .events-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; margin-top:3rem; }
  @media(max-width:640px){ .events-grid{ grid-template-columns:1fr; } }
  .event-card {
    position:relative; border-radius:16px; overflow:hidden;
    background:linear-gradient(158deg,#141414,#0e0e0e); border:1px solid var(--gray-2);
    display:flex; flex-direction:column;
    transition:transform .38s cubic-bezier(.22,1,.36,1), border-color .38s ease, box-shadow .38s ease;
  }
  .event-card::before { content:''; position:absolute; top:0; left:12%; right:12%; height:1px; background:linear-gradient(90deg,transparent,var(--red),transparent); opacity:.65; z-index:1; }
  .event-card:hover { transform:translateY(-7px); border-color:rgba(225,29,72,.55); box-shadow:0 20px 52px rgba(225,29,72,.18); }
  .event-img { position:relative; aspect-ratio:16/9; overflow:hidden; flex-shrink:0; }
  .event-img img { object-fit:cover; transition:transform .5s ease,filter .5s ease; filter:brightness(.88) saturate(1.1); }
  .event-card:hover .event-img img { transform:scale(1.08); filter:brightness(1.02) saturate(1.2); }
  .event-img::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,transparent 45%,rgba(8,8,8,.88) 100%); }
  .event-body { padding:18px 18px 22px; flex:1; display:flex; flex-direction:column; }
  .event-title { font-family:'Rajdhani',sans-serif; font-size:1.05rem; font-weight:700; letter-spacing:.03em; color:var(--white); text-transform:uppercase; line-height:1.3; margin-bottom:8px; }
  .event-meta { display:flex; flex-direction:column; gap:4px; margin-bottom:14px; }
  .event-meta-row { display:flex; align-items:center; gap:6px; font-size:.75rem; color:var(--white-muted); }
  .event-meta-row svg { opacity:.65; flex-shrink:0; }
  .event-rsvp {
    display:inline-flex; align-items:center; gap:7px; align-self:flex-start; margin-top:auto;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.8rem; letter-spacing:.1em; text-transform:uppercase;
    padding:9px 18px; border-radius:8px; text-decoration:none;
    background:rgba(225,29,72,.16); border:1px solid rgba(225,29,72,.45); color:#fca5a5;
    transition:background .22s ease, box-shadow .22s ease, transform .22s ease;
  }
  .event-rsvp:hover { background:rgba(225,29,72,.3); box-shadow:0 6px 22px rgba(225,29,72,.32); transform:translateY(-2px); }
  .event-rsvp svg { transition:transform .2s ease; }
  .event-rsvp:hover svg { transform:translateX(4px); }
  .view-all-wrap { text-align:center; margin-top:2.5rem; }
  .view-all-btn {
    display:inline-flex; align-items:center; gap:8px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.88rem; letter-spacing:.14em; text-transform:uppercase;
    padding:13px 30px; border-radius:10px; text-decoration:none;
    background:transparent; color:var(--white); border:1px solid rgba(255,255,255,.2);
    transition:border-color .24s ease, background .24s ease, transform .24s ease;
  }
  .view-all-btn:hover { border-color:rgba(255,255,255,.5); background:rgba(255,255,255,.05); transform:translateY(-2px); }
  .view-all-btn svg { transition:transform .22s ease; }
  .view-all-btn:hover svg { transform:translateX(4px); }

  /* ══════════════════════════════════
     CONNECT
  ══════════════════════════════════ */
  .connect-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(255px,1fr)); gap:16px; margin-top:3rem; }
  .connect-card {
    border-radius:16px; padding:28px 24px;
    background:linear-gradient(145deg,#141414,#0e0e0e); border:1px solid var(--gray-2);
    transition:border-color .3s ease, box-shadow .3s ease;
  }
  .connect-card:hover { border-color:rgba(225,29,72,.4); box-shadow:0 14px 40px rgba(225,29,72,.1); }
  .connect-title { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:.06em; color:var(--white); margin-bottom:10px; }
  .connect-desc { font-size:.84rem; color:var(--white-muted); line-height:1.72; margin-bottom:18px; }
  .connect-link {
    display:inline-flex; align-items:center; gap:6px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.8rem; letter-spacing:.12em; text-transform:uppercase;
    color:var(--red); text-decoration:none; transition:gap .2s ease;
  }
  .connect-link:hover { gap:10px; }
  .email-form { display:flex; gap:8px; flex-wrap:wrap; }
  .email-input {
    flex:1; min-width:150px; padding:10px 14px; border-radius:8px;
    background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12);
    color:var(--white); font-family:'DM Sans',sans-serif; font-size:.84rem; outline:none;
    transition:border-color .22s ease;
  }
  .email-input::placeholder { color:var(--white-muted); }
  .email-input:focus { border-color:rgba(225,29,72,.6); }
  .email-submit {
    padding:10px 20px; border-radius:8px; border:none; cursor:pointer;
    background:var(--red); color:#fff;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.82rem; letter-spacing:.1em; text-transform:uppercase;
    transition:background .22s ease, transform .22s ease;
  }
  .email-submit:hover { background:#c91a3f; transform:translateY(-2px); }

  /* ── Mobile ── */
  @media(max-width:640px){
    .hero-stats { flex-wrap:wrap; }
    .hero-stat { padding:12px 20px; flex:1 1 calc(50% - 2px); }
    .hero-stat:nth-child(2),.hero-stat:nth-child(4) { border-right:none; }
    .pillars-grid { grid-template-columns:1fr; }
    .domains-grid { grid-template-columns:1fr; }
    .hp-section { padding:3.5rem 1rem; }
    .hero-h1 { font-size:clamp(4rem,18vw,6rem); }
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { el.classList.add('vis'); obs.unobserve(el) }
        }, { threshold })
        obs.observe(el); return () => obs.disconnect()
    }, [threshold])
    return ref
}

// 3D tilt for cards
function useTilt(strength = 12) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const onMove = (e: MouseEvent) => {
            const r = el.getBoundingClientRect()
            const x = (e.clientX - r.left) / r.width - .5
            const y = (e.clientY - r.top) / r.height - .5
            el.style.transform = `perspective(700px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(8px)`
        }
        const onLeave = () => { el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0px)' }
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)
        return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
    }, [strength])
    return ref
}

// Counter component
function Counter({ end, label }: { end: number; label: string }) {
    const [val, setVal] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return
            let cur = 0
            const step = () => { cur += Math.max(1, Math.ceil((end - cur) / 16)); if (cur >= end) { setVal(end); return } setVal(cur); requestAnimationFrame(step) }
            requestAnimationFrame(step); obs.unobserve(el)
        }, { threshold: .5 })
        obs.observe(el); return () => obs.disconnect()
    }, [end])
    return (
        <div ref={ref} className="hero-stat">
            <div className="hero-stat-n">{val}+</div>
            <div className="hero-stat-l">{label}</div>
        </div>
    )
}

// Floating particles in hero

function HeroParticles() {
    return (
        <>
            {[...Array(8)].map((_, i) => (
                <div key={i} className="hero-particle" style={{
                    width: `${5 + (i % 5) * 2}px`, height: `${5 + (i % 5) * 2}px`,
                    left: `${10 + i * 11}%`, bottom: `${15 + (i % 4) * 8}%`,
                    animationDuration: `${3 + i * .7}s`,
                    animationDelay: `${i * .5}s`,
                    filter: `blur(${i % 2}px)`,
                }} />
            ))}
        </>
    )
}

// Leader card with 3D tilt
function LeaderCard({ name, role, img, fit = 'cover' }: { name: string; role: string; img: string; fit?: 'cover' | 'contain' }) {
    const tilt = useTilt(10)
    return (
        <div ref={tilt} className="leader-card">
            <div className="leader-photo">
                <Image src={img} alt={name} fill style={{ objectFit: fit, objectPosition: 'center top' }} sizes="120px" />
            </div>
            <div className="leader-name">{name}</div>
            <div className="leader-role">{role}</div>
        </div>
    )
}

// Pillar card with 3D tilt
function PillarCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    const tilt = useTilt(8)
    return (
        <div ref={tilt} className="pillar-card">
            <span className="pillar-icon">{icon}</span>
            <div className="pillar-title">{title}</div>
            <div className="pillar-desc">{desc}</div>
        </div>
    )
}

// Domain card with 3D tilt
function DomainCard({ icon, name, cls, desc }: { icon: string; name: string; cls: string; desc: string }) {
    const tilt = useTilt(9)
    return (
        <div ref={tilt} className={`domain-card ${cls}`}>
            <div className="domain-icon">{icon}</div>
            <div className="domain-name">{name}</div>
            <div className="domain-desc">{desc}</div>
        </div>
    )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const leaders = [
    { name: "Prof. Samiran Chattopadhyay", role: "Pro Vice Chancellor, Techno India University", img: "/samiran.jpeg", fit: "contain" as const },
    { name: "Dr. Sujoy Biswas", role: "CEO, Techno India Group", img: "/sujoy.jpg", fit: "cover" as const },
    { name: "Dr. Rina Paladhi", role: "Director, Techno India Group", img: "/rina.jpg", fit: "contain" as const },
    { name: "Dr. Ishan Ghosh", role: "Associate Dean of Student Affairs, Techno India University", img: "/ishan.jpg", fit: "contain" as const },
    { name: "Dr. Ashoke Kumar Paul", role: "Convener, Techno Vivarta", img: "/ashoke.jpeg", fit: "cover" as const },
]

const domains = [
    { icon: "💻", name: "Computing", cls: "dc-computing", desc: "From AI to software dev — explore the full digital spectrum." },
    { icon: "🤖", name: "Robotics", cls: "dc-robotics", desc: "Build bots, compete, and push the limits of what machines can do." },
    { icon: "🎮", name: "Gaming", cls: "dc-gaming", desc: "Game design, eSports, and everything in between." },
    { icon: "⚙️", name: "Mechmania", cls: "dc-mechmania", desc: "Engineering meets innovation: design real-world mechanical solutions." },
    { icon: "💡", name: "Innovation & Mgmt", cls: "dc-innovation", desc: "Think creatively, lead teams, and turn ideas into impact." },
    { icon: "🎨", name: "Designing", cls: "dc-designing", desc: "UX, graphic, visual — make things beautiful and functional." },
    { icon: "🎉", name: "Fun Events", cls: "dc-fun", desc: "Tech-themed adventures and memories that last a lifetime." },
]

const events = [
    { _id: "1", title: "Scavenger Hunt: A Fun-Filled Adventure!", date: "Mar 8, 2025", venue: "Techno India University", time: "11 AM onwards", image: "/temp/20.jpeg", rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSdkRFR-T8sV58Zyu3kcD_XDctb1WA09AbLQ2-5Yn-adO7BqWQ/viewform" },
    { _id: "2", title: "Ultimate Food Eating Challenge!", date: "Mar 10, 2025", venue: "Techno India University", time: "12 PM onwards", image: "/temp/21.jpeg", rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLScSR5lCKDNxqafEa5zxRNkiFGRLkPuvZflL5m9n9-IyDFUELw/viewform" },
    { _id: "3", title: "Hackquest", date: "Mar 8–9, 2025", venue: "Techno India University", time: "12 PM onwards", image: "/temp/24.png", rsvplink: "https://lemonade.social/e/AigjXHfi" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const pillarsRef = useReveal(0.08)
    const aboutRef1 = useReveal(0.1)
    const aboutRef2 = useReveal(0.1)
    const aboutRef3 = useReveal(0.1)
    const leadersRef = useReveal(0.07)
    const domainsRef = useReveal(0.07)
    const eventsRef = useReveal(0.07)
    const connectRef = useReveal(0.08)
    const h1Ref = useReveal(0.05)
    const pillarsHdr = useReveal(0.1)
    const aboutHdr = useReveal(0.1)
    const leadersHdr = useReveal(0.1)
    const domainsHdr = useReveal(0.1)
    const eventsHdr = useReveal(0.1)
    const connectHdr = useReveal(0.1)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        try {
            const res = await fetch("https://script.google.com/macros/s/AKfycbxMnihMfCeeGsPAic8waMfMwmr0XUHKgx1Q57BCjzYclEkJWBgSwHaEW9Qqq7hd2EHI0g/exec", { method: "POST", body: formData })
            if (res.ok) alert("Thanks for subscribing!")
        } catch (err) { console.error(err) }
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <div className="hp-root">
                <div className="hp-bg-grid" />
                <div className="hp-orb hp-orb-1" />
                <div className="hp-orb hp-orb-2" />

                {/* ══ HERO ══ */}
                <section className="hero">
                    <div className="hero-scan" />
                    <div className="hero-ring hero-ring-1" />
                    <div className="hero-ring hero-ring-2" />
                    <div className="hero-ring hero-ring-3" />

                    <HeroParticles />

                    <div className="hero-eyebrow">Techno India University</div>

                    <h1 className="hero-h1" ref={h1Ref as React.RefObject<HTMLHeadingElement>}>
                        <span className="word-solid">Techno</span>
                        <span className="word-outline">Vivarta</span>
                    </h1>

                    <p className="hero-tagline">
                        Where innovation meets community — builders, thinkers &amp; creators pushing the boundaries of technology.
                    </p>

                    <div className="hero-ctas">
                        <Link href="/events" className="btn-red">Explore Events <HiArrowRight size={15} /></Link>
                        <Link href="#about" className="btn-ghost">Learn More</Link>
                    </div>

                </section>

                {/* ══ PILLARS ══ */}
                <section className="hp-section" id="learn-more">
                    <div className="hp-inner">
                        <div ref={pillarsHdr} className="rv">
                            <div className="sec-label">What we offer</div>
                            <h2 className="sec-h2">A community where <span>you</span></h2>
                        </div>
                        <div ref={pillarsRef} className="sg pillars-grid">
                            <PillarCard icon="🔭" title="Explore" desc="Unlock your potential with hands-on technology workshops — from coding to robotics, for every skill level." />
                            <PillarCard icon="📖" title="Learn" desc="Continuous learning to acquire new skills, advance your career, and feed your intellectual curiosity." />
                            <PillarCard icon="🤝" title="Connect" desc="Meet people who share your passion. Attend tech talks, hackathons, and forge lasting industry connections." />
                        </div>
                    </div>
                </section>

                <div className="hp-div"><div className="hp-div-dot" /></div>

                {/* ══ ABOUT ══ */}
                <section className="hp-section" id="about">
                    <div className="hp-inner">
                        <div ref={aboutHdr} className="rv">
                            <div className="sec-label">About us</div>
                            <h2 className="sec-h2">Our <span>story</span></h2>
                        </div>

                        <div ref={aboutRef1} className="rv-l about-block" style={{ marginTop: '2.5rem' }}>
                            <div className="about-img">
                                <Image src="/who-are-we.jpg" alt="Who Are We" fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                                <span className="about-tag">Who are we</span>
                                <h3 className="about-h3">More than a tech club</h3>
                                <p className="about-p">Techno Vivarta is the beating heart of innovation within Techno India University — a tightly-knit community where individuals from all backgrounds converge, bound by their shared passion for technology and pioneering ideas.</p>
                                <p className="about-p">Our core objective is to equip students with the tools, insights, and experiences indispensable for excelling in the rapidly shifting landscape of technology.</p>
                            </div>
                        </div>

                        <div ref={aboutRef2} className="rv-l about-block">
                            <div className="about-img">
                                <Image src="/our-story.jpg" alt="Our Story" fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                                <span className="about-tag">Our story</span>
                                <h3 className="about-h3">Born from a conversation</h3>
                                <p className="about-p">Founded in 2016, Techno Vivarta began with a simple conversation among a handful of visionary students — pondering the potential of technology to reshape the world.</p>
                                <p className="about-p">With unwavering determination, they created a community where talent could be nurtured, celebrated, and channelled into real impact that extends beyond the classroom.</p>
                            </div>
                        </div>

                        <div ref={aboutRef3} className="rv-l about-block">
                            <div className="about-img">
                                <Image src="/our-mission.jpg" alt="Our Mission" fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                                <span className="about-tag">Our mission</span>
                                <h3 className="about-h3">Empowering the next generation</h3>
                                <p className="about-p">We are here to empower students with the knowledge and experiences needed not only to survive but to thrive in the ever-evolving technology landscape.</p>
                                <p className="about-p">We open doors to a wide spectrum of tech domains, ensuring that every member — no matter their background — discovers their unique path to flourish.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="hp-div"><div className="hp-div-dot" /></div>

                {/* ══ LEADERS ══ */}
                <section className="hp-section">
                    <div className="hp-inner">
                        <div ref={leadersHdr} className="rv">
                            <div className="sec-label">Leadership</div>
                            <h2 className="sec-h2">Our <span>leaders</span></h2>
                            <p className="sec-sub">The visionaries who guide Techno Vivarta forward.</p>
                        </div>
                        <div ref={leadersRef} className="sg leaders-grid">
                            {leaders.map(l => (
                                <LeaderCard key={l.name} name={l.name} role={l.role} img={l.img} fit={l.fit} />
                            ))}
                        </div>
                    </div>
                </section>

                <div className="hp-div"><div className="hp-div-dot" /></div>

                {/* ══ DOMAINS ══ */}
                <section className="hp-section">
                    <div className="hp-inner">
                        <div ref={domainsHdr} className="rv">
                            <div className="sec-label">What we do</div>
                            <h2 className="sec-h2">Discover your <span>interests</span></h2>
                            <p className="sec-sub">Seven domains, one community. Find your place in the tech ecosystem.</p>
                        </div>
                        <div ref={domainsRef} className="sg domains-grid">
                            {domains.map(d => <DomainCard key={d.name} {...d} />)}
                        </div>
                    </div>
                </section>

                <div className="hp-div"><div className="hp-div-dot" /></div>

                {/* ══ EVENTS PREVIEW ══ */}
                <section className="hp-section">
                    <div className="hp-inner">
                        <div ref={eventsHdr} className="rv">
                            <div className="sec-label">Upcoming</div>
                            <h2 className="sec-h2">Featured <span>events</span></h2>
                            <p className="sec-sub">Reserve your spot and be part of the action.</p>
                        </div>
                        <div ref={eventsRef} className="sg events-grid">
                            {events.map(ev => (
                                <div key={ev._id} className="event-card">
                                    <div className="event-img">
                                        <Image src={ev.image} alt={ev.title} fill sizes="(max-width:640px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div className="event-body">
                                        <div className="event-title">{ev.title}</div>
                                        <div className="event-meta">
                                            <div className="event-meta-row"><BiTime size={12} />{ev.time} · {ev.date}</div>
                                            <div className="event-meta-row"><MdOutlineLocationOn size={13} />{ev.venue}</div>
                                        </div>
                                        <Link href={ev.rsvplink} target="_blank" rel="noopener noreferrer" className="event-rsvp">
                                            RSVP Now <HiArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="view-all-wrap">
                            <Link href="/events" className="view-all-btn">View All Events <HiArrowRight size={14} /></Link>
                        </div>
                    </div>
                </section>

                <div className="hp-div"><div className="hp-div-dot" /></div>

                {/* ══ CONNECT ══ */}
                <section className="hp-section">
                    <div className="hp-inner">
                        <div ref={connectHdr} className="rv">
                            <div className="sec-label">Stay connected</div>
                            <h2 className="sec-h2">Join the <span>community</span></h2>
                        </div>
                        <div ref={connectRef} className="sg connect-grid">
                            <div className="connect-card">
                                <div className="connect-title">Newsletter</div>
                                <div className="connect-desc">Get the latest updates, events, and tech insights delivered straight to your inbox.</div>
                                <form onSubmit={handleSubmit} className="email-form">
                                    <input type="email" name="Email" placeholder="your@email.com" required className="email-input" />
                                    <button type="submit" className="email-submit">Subscribe</button>
                                </form>
                            </div>
                            <div className="connect-card">
                                <div className="connect-title">Blogs</div>
                                <div className="connect-desc">Learn in-depth tech from exclusive blogs written by our domain experts and members.</div>
                                <Link href="/blogs" className="connect-link">Read Now <HiArrowRight size={13} /></Link>
                            </div>
                            <div className="connect-card">
                                <div className="connect-title">Feedback</div>
                                <div className="connect-desc">Share your valuable feedback and help us build a better experience for everyone.</div>
                                <Link href="/contact" className="connect-link">Share Feedback <HiArrowRight size={13} /></Link>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </>
    )
}
