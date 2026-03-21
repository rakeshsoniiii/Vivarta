"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { BiSolidBookOpen, BiSolidGroup, BiTime } from "react-icons/bi"
import { MdExplore, MdOutlineLocationOn } from "react-icons/md"
import { HiArrowRight } from "react-icons/hi"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ─── CSS ─────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  :root {
    --red:#e11d48; --red-dim:#9f1239;
    --red-glow:rgba(225,29,72,.4);
    --white:#f8fafc; --white-dim:rgba(248,250,252,.65); --white-muted:rgba(248,250,252,.34);
    --black:#080808; --gray:#1e1e1e; --gray-2:#2a2a2a;
  }

  /* ── Page base ── */
  .hp-root { background:var(--black); color:var(--white); font-family:'DM Sans',sans-serif; overflow-x:hidden; }

  /* ── Fixed background effects ── */
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
  .rv { opacity:0; transform:translateY(44px); transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1); }
  .rv.vis { opacity:1; transform:none; }
  .rv-l { opacity:0; transform:translateX(-44px); transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1); }
  .rv-l.vis { opacity:1; transform:none; }
  .rv-s { opacity:0; transform:scale(.86); transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1); }
  .rv-s.vis { opacity:1; transform:scale(1); }
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
    text-align:center; padding:0 1.25rem;
    overflow:hidden;
  }

  /* Animated scanlines overlay */
  .hero-scan {
    position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 6px);
    animation:scanMove 12s linear infinite;
    opacity:.5;
  }
  @keyframes scanMove { from{background-position:0 0} to{background-position:0 100px} }

  /* Big decorative red circle behind title */
  .hero-ring {
    position:absolute;
    width:min(700px,90vw); height:min(700px,90vw);
    border-radius:50%;
    border:1px solid rgba(225,29,72,.14);
    top:50%; left:50%; transform:translate(-50%,-50%);
    pointer-events:none;
    animation:ringPulse 4s ease-in-out infinite;
  }
  .hero-ring-2 {
    position:absolute;
    width:min(520px,70vw); height:min(520px,70vw);
    border-radius:50%;
    border:1px solid rgba(225,29,72,.08);
    top:50%; left:50%; transform:translate(-50%,-50%);
    pointer-events:none;
    animation:ringPulse 4s ease-in-out infinite reverse;
  }
  @keyframes ringPulse { 0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.03)} }

  /* Eyebrow */
  .hero-eyebrow {
    display:inline-flex; align-items:center; gap:10px;
    font-family:'Rajdhani',sans-serif; font-size:.78rem; font-weight:700;
    letter-spacing:.26em; text-transform:uppercase; color:var(--red);
    margin-bottom:1.4rem; position:relative; z-index:2;
    animation:fadeSlideDown .8s cubic-bezier(.22,1,.36,1) both;
  }
  .hero-eyebrow::before,.hero-eyebrow::after { content:''; width:22px; height:1px; background:var(--red); }
  @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:none} }

  /* Main headline */
  .hero-h1 {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(4.5rem,14vw,11rem);
    line-height:.88; letter-spacing:.01em;
    color:var(--white); position:relative; z-index:2;
    animation:heroH1In 1s cubic-bezier(.22,1,.36,1) .15s both;
  }
  @keyframes heroH1In { from{opacity:0;transform:scale(.82)} to{opacity:1;transform:scale(1)} }
  .hero-h1 .red { color:var(--red); }
  .hero-h1 .outline {
    -webkit-text-stroke:2px var(--white);
    color:transparent;
  }

  /* Subtitle */
  .hero-sub {
    font-family:'DM Sans',sans-serif; font-size:clamp(1rem,2.2vw,1.18rem);
    line-height:1.72; color:var(--white-muted);
    max-width:540px; margin:1.6rem auto 2.4rem;
    position:relative; z-index:2;
    animation:fadeSlideUp .9s cubic-bezier(.22,1,.36,1) .35s both;
  }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }

  /* CTA buttons */
  .hero-ctas {
    display:flex; gap:14px; flex-wrap:wrap; justify-content:center;
    position:relative; z-index:2;
    animation:fadeSlideUp .9s cubic-bezier(.22,1,.36,1) .5s both;
  }
  .cta-primary {
    display:inline-flex; align-items:center; gap:9px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.92rem;
    letter-spacing:.12em; text-transform:uppercase; text-decoration:none;
    padding:14px 32px; border-radius:10px;
    background:var(--red); color:#fff; border:1px solid var(--red);
    transition:transform .24s ease, box-shadow .24s ease, background .24s ease;
  }
  .cta-primary:hover { transform:translateY(-3px); box-shadow:0 12px 36px var(--red-glow); background:#c91a3f; }
  .cta-primary svg { transition:transform .22s ease; }
  .cta-primary:hover svg { transform:translateX(4px); }

  .cta-secondary {
    display:inline-flex; align-items:center; gap:9px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.92rem;
    letter-spacing:.12em; text-transform:uppercase; text-decoration:none;
    padding:14px 32px; border-radius:10px;
    background:transparent; color:var(--white); border:1px solid rgba(255,255,255,.22);
    transition:transform .24s ease, border-color .24s ease, background .24s ease;
  }
  .cta-secondary:hover { transform:translateY(-3px); border-color:rgba(255,255,255,.55); background:rgba(255,255,255,.06); }

  /* Scroll hint */
  .hero-scroll {
    position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
    z-index:2; display:flex; flex-direction:column; align-items:center; gap:6px;
    font-family:'Rajdhani',sans-serif; font-size:.68rem; letter-spacing:.18em;
    text-transform:uppercase; color:var(--white-muted);
    animation:fadeSlideUp 1s cubic-bezier(.22,1,.36,1) .9s both;
  }
  .hero-scroll-line {
    width:1px; height:44px; background:linear-gradient(to bottom,var(--red),transparent);
    animation:scrollDrop 2s ease-in-out infinite;
  }
  @keyframes scrollDrop { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }

  /* Stats bar in hero */
  .hero-stats {
    display:flex; gap:2.5rem; flex-wrap:wrap; justify-content:center;
    margin-top:3.5rem; position:relative; z-index:2;
    animation:fadeSlideUp .9s cubic-bezier(.22,1,.36,1) .65s both;
  }
  .hero-stat { text-align:center; }
  .hero-stat-n { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,5vw,2.8rem); color:var(--red); line-height:1; }
  .hero-stat-l { font-family:'DM Sans',sans-serif; font-size:.68rem; color:var(--white-muted); letter-spacing:.12em; text-transform:uppercase; margin-top:2px; }
  .hero-stat-div { width:1px; background:var(--gray-2); align-self:stretch; }

  /* ══════════════════════════════════
     SECTION SHARED
  ══════════════════════════════════ */
  .hp-section { position:relative; z-index:1; padding:5rem 1.25rem; }
  .hp-section-inner { max-width:1240px; margin:0 auto; }
  .hp-section-label {
    display:inline-flex; align-items:center; gap:10px;
    font-family:'Rajdhani',sans-serif; font-size:.72rem; font-weight:700;
    letter-spacing:.22em; text-transform:uppercase; color:var(--red);
    margin-bottom:1rem;
  }
  .hp-section-label::before { content:''; width:22px; height:1px; background:var(--red); }
  .hp-section-h2 {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(2.4rem,6vw,4rem); letter-spacing:.04em;
    color:var(--white); margin-bottom:.6rem; line-height:1;
  }
  .hp-section-h2 span { color:var(--red); }
  .hp-section-sub { font-size:.98rem; color:var(--white-muted); line-height:1.75; max-width:540px; }

  /* Section divider */
  .hp-divider { display:flex; align-items:center; gap:12px; margin:0 auto; max-width:1240px; padding:0 1.25rem; }
  .hp-divider::before,.hp-divider::after { content:''; flex:1; height:1px; background:var(--gray-2); }
  .hp-divider-dot { width:8px; height:8px; border-radius:50%; background:var(--red); box-shadow:0 0 10px var(--red-glow); }

  /* ══════════════════════════════════
     PILLARS (Explore/Learn/Connect)
  ══════════════════════════════════ */
  .pillars-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; margin-top:3rem; }
  .pillar-card {
    position:relative; border-radius:16px; padding:32px 28px;
    background:linear-gradient(145deg,#141414,#0e0e0e);
    border:1px solid var(--gray-2); overflow:hidden;
    transition:transform .35s cubic-bezier(.22,1,.36,1), border-color .35s ease, box-shadow .35s ease;
    cursor:default;
  }
  .pillar-card::before {
    content:''; position:absolute; top:0; left:12%; right:12%; height:1px;
    background:linear-gradient(90deg,transparent,var(--red),transparent); opacity:.6;
  }
  .pillar-card:hover { transform:translateY(-8px); border-color:rgba(225,29,72,.5); box-shadow:0 20px 50px rgba(225,29,72,.16); }
  .pillar-icon { font-size:2rem; margin-bottom:16px; display:block; }
  .pillar-title { font-family:'Bebas Neue',sans-serif; font-size:1.6rem; letter-spacing:.06em; color:var(--white); margin-bottom:10px; }
  .pillar-desc { font-size:.88rem; line-height:1.72; color:var(--white-muted); }

  /* ══════════════════════════════════
     ABOUT SECTIONS
  ══════════════════════════════════ */
  .about-block {
    display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center;
    margin-bottom:5rem;
  }
  @media(max-width:768px){ .about-block{ grid-template-columns:1fr; gap:28px; } }

  .about-img-wrap {
    position:relative; border-radius:18px; overflow:hidden;
    aspect-ratio:4/3;
    border:1px solid var(--gray-2);
  }
  .about-img-wrap::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(225,29,72,.12) 0%,transparent 60%);
    pointer-events:none;
  }
  .about-img-wrap img { object-fit:cover; object-position:center; transition:transform .6s ease; }
  .about-img-wrap:hover img { transform:scale(1.04); }

  .about-tag {
    display:inline-block; font-family:'Rajdhani',sans-serif; font-weight:700;
    font-size:.68rem; letter-spacing:.18em; text-transform:uppercase;
    color:var(--red); margin-bottom:.8rem;
  }
  .about-h3 { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,4.5vw,3rem); letter-spacing:.04em; color:var(--white); margin-bottom:1.2rem; line-height:1; }
  .about-p { font-size:.92rem; line-height:1.82; color:var(--white-muted); margin-bottom:1rem; }

  /* ══════════════════════════════════
     LEADERS
  ══════════════════════════════════ */
  .leaders-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:18px; margin-top:3rem; }
  .leader-card {
    position:relative; border-radius:16px; overflow:hidden;
    padding:24px 16px 20px;
    background:linear-gradient(158deg,#141414,#0e0e0e);
    border:1px solid var(--gray-2); text-align:center;
    transition:transform .35s cubic-bezier(.22,1,.36,1), border-color .35s ease, box-shadow .35s ease;
    cursor:default;
  }
  .leader-card:hover { transform:translateY(-8px) scale(1.02); border-color:rgba(225,29,72,.45); box-shadow:0 18px 48px rgba(225,29,72,.14); }
  .leader-img-wrap {
    width:110px; height:110px; border-radius:50%; overflow:hidden; margin:0 auto 14px;
    border:2px solid rgba(225,29,72,.35);
    transition:box-shadow .35s ease;
  }
  .leader-card:hover .leader-img-wrap { box-shadow:0 0 0 4px rgba(225,29,72,.8),0 0 24px rgba(225,29,72,.45); }
  .leader-img-wrap img { object-fit:cover; object-position:center; transition:transform .45s ease; }
  .leader-card:hover .leader-img-wrap img { transform:scale(1.1); }
  .leader-name { font-family:'Rajdhani',sans-serif; font-size:.95rem; font-weight:700; letter-spacing:.04em; color:var(--white); text-transform:uppercase; margin-bottom:4px; }
  .leader-role { font-family:'DM Sans',sans-serif; font-size:.72rem; color:rgba(225,29,72,.75); line-height:1.4; }

  /* ══════════════════════════════════
     DOMAINS
  ══════════════════════════════════ */
  .domains-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px; margin-top:3rem; }
  .domain-card {
    position:relative; border-radius:14px; padding:26px 22px;
    border:1px solid var(--gray-2); overflow:hidden; cursor:default;
    transition:transform .35s cubic-bezier(.22,1,.36,1), border-color .35s ease, box-shadow .35s ease;
  }
  .domain-card::after { content:''; position:absolute; inset:0; border-radius:14px; background:linear-gradient(145deg,rgba(255,255,255,.025) 0%,transparent 55%); pointer-events:none; }
  .domain-card:hover { transform:translateY(-6px); }
  .domain-icon { font-size:1.6rem; margin-bottom:12px; }
  .domain-name { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; letter-spacing:.06em; margin-bottom:8px; }
  .domain-desc { font-size:.8rem; line-height:1.68; color:var(--white-muted); }

  /* Domain colours */
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
  .event-card {
    position:relative; border-radius:16px; overflow:hidden;
    background:linear-gradient(158deg,#141414,#0e0e0e);
    border:1px solid var(--gray-2);
    display:flex; flex-direction:column;
    transition:transform .35s cubic-bezier(.22,1,.36,1), border-color .35s ease, box-shadow .35s ease;
  }
  .event-card::before { content:''; position:absolute; top:0; left:12%; right:12%; height:1px; background:linear-gradient(90deg,transparent,var(--red),transparent); opacity:.65; z-index:1; }
  .event-card:hover { transform:translateY(-7px); border-color:rgba(225,29,72,.55); box-shadow:0 20px 52px rgba(225,29,72,.18); }
  .event-img { position:relative; aspect-ratio:16/9; overflow:hidden; flex-shrink:0; }
  .event-img img { object-fit:cover; object-position:center; transition:transform .5s ease,filter .5s ease; filter:brightness(.88) saturate(1.1); }
  .event-card:hover .event-img img { transform:scale(1.08); filter:brightness(1.02) saturate(1.2); }
  .event-img::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,transparent 45%,rgba(8,8,8,.88) 100%); }
  .event-body { padding:18px 18px 22px; flex:1; display:flex; flex-direction:column; }
  .event-title { font-family:'Rajdhani',sans-serif; font-size:1.05rem; font-weight:700; letter-spacing:.03em; color:var(--white); text-transform:uppercase; line-height:1.3; margin-bottom:8px; }
  .event-meta { display:flex; flex-direction:column; gap:4px; margin-bottom:14px; }
  .event-meta-row { display:flex; align-items:center; gap:6px; font-size:.75rem; color:var(--white-muted); }
  .event-meta-row svg { opacity:.65; flex-shrink:0; }
  .event-rsvp {
    display:inline-flex; align-items:center; gap:7px; align-self:flex-start;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.8rem; letter-spacing:.1em; text-transform:uppercase;
    padding:9px 18px; border-radius:8px; text-decoration:none; margin-top:auto;
    background:rgba(225,29,72,.16); border:1px solid rgba(225,29,72,.45); color:#fca5a5;
    transition:background .22s ease, box-shadow .22s ease, transform .22s ease;
  }
  .event-rsvp:hover { background:rgba(225,29,72,.3); box-shadow:0 6px 22px rgba(225,29,72,.32); transform:translateY(-2px); }
  .event-rsvp svg { transition:transform .2s ease; }
  .event-rsvp:hover svg { transform:translateX(4px); }

  /* View all events */
  .view-all-wrap { text-align:center; margin-top:2.5rem; }
  .view-all-btn {
    display:inline-flex; align-items:center; gap:8px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.88rem; letter-spacing:.14em; text-transform:uppercase;
    padding:13px 30px; border-radius:10px; text-decoration:none;
    background:transparent; color:var(--white); border:1px solid rgba(255,255,255,.2);
    transition:border-color .24s ease, background .24s ease, transform .24s ease;
  }
  .view-all-btn:hover { border-color:rgba(255,255,255,.55); background:rgba(255,255,255,.05); transform:translateY(-2px); }
  .view-all-btn svg { transition:transform .22s ease; }
  .view-all-btn:hover svg { transform:translateX(4px); }

  /* ══════════════════════════════════
     CONNECT / FOOTER CARDS
  ══════════════════════════════════ */
  .connect-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; margin-top:3rem; }
  .connect-card {
    border-radius:16px; padding:28px 24px;
    background:linear-gradient(145deg,#141414,#0e0e0e);
    border:1px solid var(--gray-2);
    transition:border-color .3s ease, box-shadow .3s ease;
  }
  .connect-card:hover { border-color:rgba(225,29,72,.4); box-shadow:0 14px 40px rgba(225,29,72,.1); }
  .connect-title { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:.06em; color:var(--white); margin-bottom:10px; }
  .connect-desc { font-size:.84rem; color:var(--white-muted); line-height:1.7; margin-bottom:18px; }
  .connect-link {
    display:inline-flex; align-items:center; gap:6px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.8rem; letter-spacing:.12em; text-transform:uppercase;
    color:var(--red); text-decoration:none;
    transition:gap .2s ease;
  }
  .connect-link:hover { gap:10px; }

  /* Email form */
  .email-form { display:flex; gap:8px; flex-wrap:wrap; }
  .email-input {
    flex:1; min-width:160px; padding:10px 14px; border-radius:8px;
    background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12);
    color:var(--white); font-family:'DM Sans',sans-serif; font-size:.84rem;
    outline:none; transition:border-color .22s ease;
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

  /* ══════════════════════════════════
     MOBILE
  ══════════════════════════════════ */
  @media(max-width:640px){
    .hero-stats { gap:1.5rem; }
    .hero-stat-div { display:none; }
    .leaders-grid { grid-template-columns:repeat(2,1fr); }
    .domains-grid { grid-template-columns:1fr; }
    .events-grid { grid-template-columns:1fr; }
    .about-block { gap:20px; }
    .hp-section { padding:3.5rem 1rem; }
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

// ─── Data ─────────────────────────────────────────────────────────────────────
const leaders = [
  { name:"Prof. Samiran Chattopadhyay", role:"Pro Vice Chancellor, Techno India University", img:"/samiran.jpeg" },
  { name:"Dr. Sujoy Biswas",            role:"CEO, Techno India Group",                     img:"/sujoy.jpg"    },
  { name:"Dr. Rina Paladhi",            role:"Director, Techno India Group",                img:"/rina.jpg"     },
  { name:"Dr. Ishan Ghosh",             role:"Associate Dean of Student Affairs",           img:"/ishan.jpg"    },
  { name:"Dr. Ashoke Kumar Paul",       role:"Convener, Techno Vivarta",                    img:"/ashoke.jpeg"  },
]

const domains = [
  { icon:"💻", name:"Computing",            cls:"dc-computing",  desc:"From AI to software dev — explore the full spectrum of digital creation and problem-solving." },
  { icon:"🤖", name:"Robotics",             cls:"dc-robotics",   desc:"Build bots, compete, and push the boundaries of what machines can do." },
  { icon:"🎮", name:"Gaming",               cls:"dc-gaming",     desc:"Game design, eSports, and everything in between — level up in your own way." },
  { icon:"⚙️", name:"Mechmania",            cls:"dc-mechmania",  desc:"Engineering meets innovation: design and build real-world mechanical solutions." },
  { icon:"💡", name:"Innovation & Mgmt",    cls:"dc-innovation", desc:"Think creatively, lead teams, and turn ideas into impact." },
  { icon:"🎨", name:"Designing",            cls:"dc-designing",  desc:"UX, graphic design, visual storytelling — make things beautiful and functional." },
  { icon:"🎉", name:"Fun Events",           cls:"dc-fun",        desc:"Tech-themed adventures, community events, and memories that last a lifetime." },
]

const events = [
  { _id:"1", title:"Scavenger Hunt: A Fun-Filled Adventure!", date:"Mar 8, 2025", shortDescription:"Race against the clock, find hidden clues, and complete team challenges in this high-energy adventure.", venue:"Techno India University", time:"11 AM onwards", image:"/temp/20.jpeg", rsvplink:"https://docs.google.com/forms/d/e/1FAIpQLSdkRFR-T8sV58Zyu3kcD_XDctb1WA09AbLQ2-5Yn-adO7BqWQ/viewform" },
  { _id:"2", title:"Ultimate Food Eating Challenge!", date:"Mar 10, 2025", shortDescription:"Eat as much as you can within the time limit. No leftovers, no mercy — every bite counts!", venue:"Techno India University", time:"12 PM onwards", image:"/temp/21.jpeg", rsvplink:"https://docs.google.com/forms/d/e/1FAIpQLScSR5lCKDNxqafEa5zxRNkiFGRLkPuvZflL5m9n9-IyDFUELw/viewform" },
  { _id:"3", title:"Hackquest", date:"Mar 8–9, 2025", shortDescription:"Solve real-world problems in Healthcare, AI, Cybersecurity, and more. Team size: 1–4. Limited spots!", venue:"Techno India University", time:"12 PM onwards", image:"/temp/24.png", rsvplink:"https://lemonade.social/e/AigjXHfi" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const pillarsRef  = useReveal(0.08)
  const aboutRef1   = useReveal(0.1)
  const aboutRef2   = useReveal(0.1)
  const aboutRef3   = useReveal(0.1)
  const leadersRef  = useReveal(0.07)
  const domainsRef  = useReveal(0.07)
  const eventsRef   = useReveal(0.07)
  const connectRef  = useReveal(0.08)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbxMnihMfCeeGsPAic8waMfMwmr0XUHKgx1Q57BCjzYclEkJWBgSwHaEW9Qqq7hd2EHI0g/exec", { method:"POST", body:formData })
      if (res.ok) alert("Thanks for subscribing!")
    } catch(e) { console.error(e) }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="hp-root">
        <div className="hp-bg-grid"/>
        <div className="hp-orb hp-orb-1"/>
        <div className="hp-orb hp-orb-2"/>

        {/* ══ HERO ══════════════════════════════════════════════ */}
        <section className="hero">
          <div className="hero-scan"/>
          <div className="hero-ring"/>
          <div className="hero-ring-2"/>

          <div className="hero-eyebrow">Techno India University</div>

          <h1 className="hero-h1">
            <span className="outline">Techno</span><br/>
            <span className="red">Vivarta</span>
          </h1>

          <p className="hero-sub">
            Where innovation meets community. Join a thriving ecosystem of builders, thinkers, and creators pushing the boundaries of technology.
          </p>

          <div className="hero-ctas">
            <Link href="/events" className="cta-primary">
              Explore Events <HiArrowRight size={15}/>
            </Link>
            <Link href="#learn-more" className="cta-secondary">
              Learn More
            </Link>
          </div>

          <div className="hero-stats">
            <Counter end={500} label="Members"/>
            <div className="hero-stat-div"/>
            <Counter end={25} label="Events"/>
            <div className="hero-stat-div"/>
            <Counter end={8} label="Domains"/>
            <div className="hero-stat-div"/>
            <Counter end={9} label="Years"/>
          </div>

          <div className="hero-scroll">
            Scroll
            <div className="hero-scroll-line"/>
          </div>
        </section>

        {/* ══ PILLARS ═══════════════════════════════════════════ */}
        <section className="hp-section" id="learn-more">
          <div className="hp-section-inner">
            <div className="rv" ref={useReveal() as React.RefObject<HTMLDivElement>}>
              <div className="hp-section-label">What we offer</div>
              <h2 className="hp-section-h2">A community where <span>you</span></h2>
            </div>
            <div ref={pillarsRef} className="sg pillars-grid">
              {[
                { icon:"🔭", title:"Explore", desc:"Unlock your potential with hands-on technology workshops — from coding to robotics, for all skill levels." },
                { icon:"📖", title:"Learn",   desc:"Continuous learning opportunities to acquire new skills, advance your career, and feed your curiosity." },
                { icon:"🤝", title:"Connect", desc:"Meet people who share your passion. Attend tech talks, hackathons, and forge lasting connections." },
              ].map(p=>(
                <div key={p.title} className="pillar-card">
                  <span className="pillar-icon">{p.icon}</span>
                  <div className="pillar-title">{p.title}</div>
                  <div className="pillar-desc">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="hp-divider"><div className="hp-divider-dot"/></div>

        {/* ══ ABOUT ═════════════════════════════════════════════ */}
        <section className="hp-section">
          <div className="hp-section-inner">
            <div className="rv" ref={useReveal() as React.RefObject<HTMLDivElement>}>
              <div className="hp-section-label">About us</div>
              <h2 className="hp-section-h2">Our <span>story</span></h2>
            </div>

            <div ref={aboutRef1} className="rv-l about-block" style={{marginTop:'2.5rem'}}>
              <div className="about-img-wrap">
                <Image src="/who-are-we.jpg" alt="Who Are We" fill style={{objectFit:'cover'}}/>
              </div>
              <div>
                <div className="about-tag">Who are we</div>
                <h3 className="about-h3">More than a tech club</h3>
                <p className="about-p">Techno Vivarta is the beating heart of innovation within Techno India University — a tightly-knit community where individuals from all backgrounds converge, bound by their shared passion for technology.</p>
                <p className="about-p">Our core objective is to equip students with the tools, insights, and experiences needed for excelling in the rapidly shifting landscape of technology.</p>
              </div>
            </div>

            <div ref={aboutRef2} className="rv-l about-block">
              <div className="about-img-wrap">
                <Image src="/our-story.jpg" alt="Our Story" fill style={{objectFit:'cover'}}/>
              </div>
              <div>
                <div className="about-tag">Our story</div>
                <h3 className="about-h3">Born from a conversation</h3>
                <p className="about-p">Founded in 2016, Techno Vivarta began with a simple conversation among a handful of visionary students in a dimly lit dorm room — pondering the potential of technology to reshape the world.</p>
                <p className="about-p">With unwavering determination, they created a community where talent could be nurtured, celebrated, and channelled into real impact.</p>
              </div>
            </div>

            <div ref={aboutRef3} className="rv-l about-block">
              <div className="about-img-wrap">
                <Image src="/our-mission.jpg" alt="Our Mission" fill style={{objectFit:'cover'}}/>
              </div>
              <div>
                <div className="about-tag">Our mission</div>
                <h3 className="about-h3">Empowering the next generation</h3>
                <p className="about-p">We are here to empower students with the knowledge and experiences needed not only to survive but to thrive in the ever-evolving technology landscape.</p>
                <p className="about-p">We stand as a guiding beacon — opening doors across a wide spectrum of tech domains, ensuring every member finds their unique path to flourish.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="hp-divider"><div className="hp-divider-dot"/></div>

        {/* ══ LEADERS ═══════════════════════════════════════════ */}
        <section className="hp-section">
          <div className="hp-section-inner">
            <div className="rv" ref={useReveal() as React.RefObject<HTMLDivElement>}>
              <div className="hp-section-label">Leadership</div>
              <h2 className="hp-section-h2">Our <span>leaders</span></h2>
            </div>
            <div ref={leadersRef} className="sg leaders-grid">
              {leaders.map(l=>(
                <div key={l.name} className="leader-card">
                  <div className="leader-img-wrap">
                    <Image src={l.img} alt={l.name} fill style={{objectFit:'cover'}}/>
                  </div>
                  <div className="leader-name">{l.name}</div>
                  <div className="leader-role">{l.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="hp-divider"><div className="hp-divider-dot"/></div>

        {/* ══ DOMAINS ═══════════════════════════════════════════ */}
        <section className="hp-section">
          <div className="hp-section-inner">
            <div className="rv" ref={useReveal() as React.RefObject<HTMLDivElement>}>
              <div className="hp-section-label">What we do</div>
              <h2 className="hp-section-h2">Discover your <span>interests</span></h2>
              <p className="hp-section-sub">Seven domains, one community. Find your place in the tech ecosystem.</p>
            </div>
            <div ref={domainsRef} className="sg domains-grid">
              {domains.map(d=>(
                <div key={d.name} className={`domain-card ${d.cls}`}>
                  <div className="domain-icon">{d.icon}</div>
                  <div className="domain-name">{d.name}</div>
                  <div className="domain-desc">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="hp-divider"><div className="hp-divider-dot"/></div>

        {/* ══ EVENTS PREVIEW ════════════════════════════════════ */}
        <section className="hp-section">
          <div className="hp-section-inner">
            <div className="rv" ref={useReveal() as React.RefObject<HTMLDivElement>}>
              <div className="hp-section-label">Upcoming</div>
              <h2 className="hp-section-h2">Featured <span>events</span></h2>
              <p className="hp-section-sub">Reserve your spot and be part of the action.</p>
            </div>
            <div ref={eventsRef} className="sg events-grid">
              {events.map(ev=>(
                <div key={ev._id} className="event-card">
                  <div className="event-img">
                    <Image src={ev.image} alt={ev.title} fill sizes="(max-width:640px) 100vw, 33vw" style={{objectFit:'cover'}}/>
                  </div>
                  <div className="event-body">
                    <div className="event-title">{ev.title}</div>
                    <div className="event-meta">
                      <div className="event-meta-row"><BiTime size={12}/>{ev.time} · {ev.date}</div>
                      <div className="event-meta-row"><MdOutlineLocationOn size={13}/>{ev.venue}</div>
                    </div>
                    <Link href={ev.rsvplink} target="_blank" rel="noopener noreferrer" className="event-rsvp">
                      RSVP Now <HiArrowRight size={12}/>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all-wrap">
              <Link href="/events" className="view-all-btn">
                View All Events <HiArrowRight size={14}/>
              </Link>
            </div>
          </div>
        </section>

        <div className="hp-divider"><div className="hp-divider-dot"/></div>

        {/* ══ CONNECT ═══════════════════════════════════════════ */}
        <section className="hp-section">
          <div className="hp-section-inner">
            <div className="rv" ref={useReveal() as React.RefObject<HTMLDivElement>}>
              <div className="hp-section-label">Stay connected</div>
              <h2 className="hp-section-h2">Join the <span>community</span></h2>
            </div>
            <div ref={connectRef} className="sg connect-grid">
              <div className="connect-card">
                <div className="connect-title">Newsletter</div>
                <div className="connect-desc">Get the latest updates, events, and tech insights delivered to your inbox.</div>
                <form onSubmit={handleSubmit} className="email-form">
                  <input type="email" name="Email" placeholder="your@email.com" required className="email-input"/>
                  <button type="submit" className="email-submit">Subscribe</button>
                </form>
              </div>
              <div className="connect-card">
                <div className="connect-title">Blogs</div>
                <div className="connect-desc">Learn in-depth tech from our exclusive blogs written by domain experts and members.</div>
                <Link href="/blogs" className="connect-link">Read Now <HiArrowRight size={13}/></Link>
              </div>
              <div className="connect-card">
                <div className="connect-title">Feedback</div>
                <div className="connect-desc">Share your valuable feedback and help us improve the experience for everyone.</div>
                <Link href="/contact" className="connect-link">Share Feedback <HiArrowRight size={13}/></Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
