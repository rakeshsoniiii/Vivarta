"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineLocationOn } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { HiArrowRight } from "react-icons/hi";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --red: #e11d48; --red-dim: #9f1239;
    --red-glow: rgba(225,29,72,.38);
    --white: #f8fafc; --white-dim: rgba(248,250,252,.65); --white-muted: rgba(248,250,252,.36);
    --black: #080808; --gray: #2a2a2a;
  }

  /* ── Background ── */
  .ev-bg-grid {
    position:fixed; inset:0; pointer-events:none; z-index:0;
    background-image: linear-gradient(rgba(225,29,72,.035) 1px,transparent 1px), linear-gradient(90deg,rgba(225,29,72,.035) 1px,transparent 1px);
    background-size:48px 48px;
    mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);
  }
  .ev-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; filter:blur(90px); opacity:.14; }
  .ev-orb-1 { width:520px; height:520px; top:-100px; left:-100px; background:var(--red); animation:eorbA 16s ease-in-out infinite; }
  .ev-orb-2 { width:380px; height:380px; bottom:10%; right:-80px; background:var(--red-dim); animation:eorbB 20s ease-in-out infinite; }
  @keyframes eorbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,40px)} }
  @keyframes eorbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,-60px)} }
  .ev-scan { position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.35; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px); }

  .ev-section { background:var(--black); color:var(--white); font-family:'DM Sans',sans-serif; position:relative; overflow:hidden; min-height:100vh; }
  .ev-inner { max-width:1280px; margin:0 auto; padding:3rem 1.25rem 5rem; position:relative; z-index:1; }

  /* ── Scroll reveal ── */
  .rv      { opacity:0; transform:translateY(40px); transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1); }
  .rv.vis  { opacity:1; transform:none; }
  .rv-s    { opacity:0; transform:scale(.88); transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1); }
  .rv-s.vis{ opacity:1; transform:scale(1); }
  .sg > * { opacity:0; transform:translateY(28px) scale(.97); transition:opacity .5s cubic-bezier(.22,1,.36,1),transform .5s cubic-bezier(.22,1,.36,1); }
  .sg.vis > *:nth-child(1){opacity:1;transform:none;transition-delay:.04s}
  .sg.vis > *:nth-child(2){opacity:1;transform:none;transition-delay:.10s}
  .sg.vis > *:nth-child(3){opacity:1;transform:none;transition-delay:.16s}
  .sg.vis > *:nth-child(4){opacity:1;transform:none;transition-delay:.22s}
  .sg.vis > *:nth-child(5){opacity:1;transform:none;transition-delay:.28s}
  .sg.vis > *:nth-child(6){opacity:1;transform:none;transition-delay:.34s}
  .sg.vis > *:nth-child(n+7){opacity:1;transform:none;transition-delay:.40s}

  /* ── HERO ── */
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

  /* ── STATS ── */
  .ev-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:18px; margin-bottom:4rem; padding:1.5rem 1.4rem; background:rgba(255,255,255,.022); border:1px solid rgba(225,29,72,.16); border-radius:16px; }
  .ev-stat { text-align:center; }
  .ev-stat-n { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.8rem,4vw,2.8rem); color:var(--red); line-height:1; }
  .ev-stat-l { font-family:'DM Sans',sans-serif; font-size:.7rem; color:var(--white-muted); letter-spacing:.1em; text-transform:uppercase; margin-top:4px; }

  /* ── DOMAIN SECTION ── */
  .dom-section { margin-bottom:4rem; }
  .dom-header { display:flex; align-items:center; gap:16px; margin-bottom:1.8rem; }
  .dom-header::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--gray),transparent); }
  .dom-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; }
  .dom-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(1.8rem,4vw,2.6rem); letter-spacing:.05em; color:var(--white); }
  .dom-count { font-family:'Rajdhani',sans-serif; font-size:.72rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; padding:4px 12px; border-radius:100px; white-space:nowrap; }

  /* ── EVENT GRID ── */
  .ev-grid { display:grid; gap:16px; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); }
  @media(max-width:640px){ .ev-grid{ grid-template-columns:1fr; gap:12px; } }

  /* ── EVENT CARD ── */
  .ec {
    position:relative; border-radius:16px; overflow:hidden;
    display:flex; flex-direction:column;
    transform-style:preserve-3d;
    transition:box-shadow .4s cubic-bezier(.22,1,.36,1), border-color .4s ease, transform .4s cubic-bezier(.22,1,.36,1);
    will-change:transform;
    cursor:default;
  }
  .ec::after { content:''; position:absolute; inset:0; border-radius:16px; background:linear-gradient(145deg,rgba(255,255,255,.04) 0%,transparent 50%); pointer-events:none; z-index:1; }

  /* Image wrapper */
  .ec-img { position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; flex-shrink:0; }
  .ec-img img { transition:transform .55s cubic-bezier(.22,1,.36,1),filter .55s ease !important; filter:brightness(.88) saturate(1.1); }
  .ec:hover .ec-img img { transform:scale(1.08) !important; filter:brightness(1.02) saturate(1.2); }
  /* Gradient overlay on image */
  .ec-img::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,transparent 40%,rgba(8,8,8,.85) 100%); }

  /* Card body */
  .ec-body { padding:18px 18px 20px; display:flex; flex-direction:column; flex:1; position:relative; z-index:2; }

  /* Top shimmer */
  .ec::before { content:''; position:absolute; top:0; left:15%; right:15%; height:1px; border-radius:1px; opacity:.7; z-index:2; }

  .ec-title { font-family:'Rajdhani',sans-serif; font-size:1.05rem; font-weight:700; letter-spacing:.03em; color:var(--white); line-height:1.3; margin-bottom:8px; text-transform:uppercase; }
  .ec-desc { font-family:'DM Sans',sans-serif; font-size:.8rem; line-height:1.65; color:var(--white-muted); margin-bottom:14px; flex:1;
    display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
  }
  .ec-meta { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
  .ec-meta-row { display:flex; align-items:center; gap:7px; font-family:'DM Sans',sans-serif; font-size:.75rem; color:var(--white-muted); }
  .ec-meta-row svg { flex-shrink:0; opacity:.7; }

  .ec-rsvp {
    display:inline-flex; align-items:center; gap:7px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.82rem; letter-spacing:.08em; text-transform:uppercase;
    padding:9px 18px; border-radius:8px; border:1px solid; text-decoration:none;
    transition:background .25s ease, box-shadow .25s ease, transform .2s ease;
    align-self:flex-start;
  }
  .ec-rsvp:hover { transform:translateY(-2px); }
  .ec-rsvp svg { transition:transform .2s ease; }
  .ec-rsvp:hover svg { transform:translateX(4px); }

  .ec-no-rsvp {
    display:inline-flex; align-items:center; gap:7px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.78rem; letter-spacing:.08em; text-transform:uppercase;
    padding:9px 18px; border-radius:8px;
    background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
    color:rgba(248,250,252,.35);
  }

  /* ── Domain color variants ── */
  /* Mechmania – red */
  .ec-mechmania { background:linear-gradient(158deg,#1c0a0d 0%,#0e0e0e 55%,#1a0809 100%); border:1px solid rgba(225,29,72,.24); box-shadow:0 4px 20px rgba(225,29,72,.06); }
  .ec-mechmania::before { background:linear-gradient(90deg,transparent,rgba(225,29,72,.65),transparent); }
  .ec-mechmania:hover { border-color:rgba(225,29,72,.7); box-shadow:0 18px 52px rgba(225,29,72,.2),0 0 0 1px rgba(225,29,72,.28); }
  .ec-mechmania .ec-rsvp { background:rgba(225,29,72,.15); border-color:rgba(225,29,72,.5); color:#fca5a5; }
  .ec-mechmania .ec-rsvp:hover { background:rgba(225,29,72,.28); box-shadow:0 6px 24px rgba(225,29,72,.3); }

  /* Robotics – blue */
  .ec-robotics { background:linear-gradient(158deg,#080e1c 0%,#0e0e0e 55%,#091018 100%); border:1px solid rgba(56,189,248,.2); box-shadow:0 4px 20px rgba(56,189,248,.05); }
  .ec-robotics::before { background:linear-gradient(90deg,transparent,rgba(56,189,248,.6),transparent); }
  .ec-robotics:hover { border-color:rgba(56,189,248,.6); box-shadow:0 18px 52px rgba(56,189,248,.16),0 0 0 1px rgba(56,189,248,.24); }
  .ec-robotics .ec-rsvp { background:rgba(56,189,248,.12); border-color:rgba(56,189,248,.45); color:#7dd3fc; }
  .ec-robotics .ec-rsvp:hover { background:rgba(56,189,248,.24); box-shadow:0 6px 24px rgba(56,189,248,.28); }

  /* Fun Events – green */
  .ec-fun { background:linear-gradient(158deg,#081408 0%,#0e0e0e 55%,#091209 100%); border:1px solid rgba(74,222,128,.2); box-shadow:0 4px 20px rgba(74,222,128,.05); }
  .ec-fun::before { background:linear-gradient(90deg,transparent,rgba(74,222,128,.6),transparent); }
  .ec-fun:hover { border-color:rgba(74,222,128,.6); box-shadow:0 18px 52px rgba(74,222,128,.16),0 0 0 1px rgba(74,222,128,.24); }
  .ec-fun .ec-rsvp { background:rgba(74,222,128,.12); border-color:rgba(74,222,128,.42); color:#86efac; }
  .ec-fun .ec-rsvp:hover { background:rgba(74,222,128,.24); box-shadow:0 6px 24px rgba(74,222,128,.26); }

  /* Gaming – purple */
  .ec-gaming { background:linear-gradient(158deg,#100a1a 0%,#0e0e0e 55%,#120c1c 100%); border:1px solid rgba(192,132,252,.2); box-shadow:0 4px 20px rgba(192,132,252,.05); }
  .ec-gaming::before { background:linear-gradient(90deg,transparent,rgba(192,132,252,.6),transparent); }
  .ec-gaming:hover { border-color:rgba(192,132,252,.6); box-shadow:0 18px 52px rgba(192,132,252,.16),0 0 0 1px rgba(192,132,252,.24); }
  .ec-gaming .ec-rsvp { background:rgba(192,132,252,.12); border-color:rgba(192,132,252,.42); color:#d8b4fe; }
  .ec-gaming .ec-rsvp:hover { background:rgba(192,132,252,.24); box-shadow:0 6px 24px rgba(192,132,252,.26); }

  /* Innovation – orange */
  .ec-innovation { background:linear-gradient(158deg,#160c04 0%,#0e0e0e 55%,#140b04 100%); border:1px solid rgba(251,146,60,.2); box-shadow:0 4px 20px rgba(251,146,60,.05); }
  .ec-innovation::before { background:linear-gradient(90deg,transparent,rgba(251,146,60,.6),transparent); }
  .ec-innovation:hover { border-color:rgba(251,146,60,.6); box-shadow:0 18px 52px rgba(251,146,60,.16),0 0 0 1px rgba(251,146,60,.24); }
  .ec-innovation .ec-rsvp { background:rgba(251,146,60,.12); border-color:rgba(251,146,60,.42); color:#fdba74; }
  .ec-innovation .ec-rsvp:hover { background:rgba(251,146,60,.24); box-shadow:0 6px 24px rgba(251,146,60,.26); }

  /* Computing – cyan */
  .ec-computing { background:linear-gradient(158deg,#061414 0%,#0e0e0e 55%,#071414 100%); border:1px solid rgba(45,212,191,.2); box-shadow:0 4px 20px rgba(45,212,191,.05); }
  .ec-computing::before { background:linear-gradient(90deg,transparent,rgba(45,212,191,.6),transparent); }
  .ec-computing:hover { border-color:rgba(45,212,191,.6); box-shadow:0 18px 52px rgba(45,212,191,.16),0 0 0 1px rgba(45,212,191,.24); }
  .ec-computing .ec-rsvp { background:rgba(45,212,191,.12); border-color:rgba(45,212,191,.42); color:#5eead4; }
  .ec-computing .ec-rsvp:hover { background:rgba(45,212,191,.24); box-shadow:0 6px 24px rgba(45,212,191,.26); }

  /* Designing – pink */
  .ec-designing { background:linear-gradient(158deg,#18060e 0%,#0e0e0e 55%,#16060c 100%); border:1px solid rgba(244,114,182,.2); box-shadow:0 4px 20px rgba(244,114,182,.05); }
  .ec-designing::before { background:linear-gradient(90deg,transparent,rgba(244,114,182,.6),transparent); }
  .ec-designing:hover { border-color:rgba(244,114,182,.6); box-shadow:0 18px 52px rgba(244,114,182,.16),0 0 0 1px rgba(244,114,182,.24); }
  .ec-designing .ec-rsvp { background:rgba(244,114,182,.12); border-color:rgba(244,114,182,.42); color:#f9a8d4; }
  .ec-designing .ec-rsvp:hover { background:rgba(244,114,182,.24); box-shadow:0 6px 24px rgba(244,114,182,.26); }

  /* ── Domain badge pills ── */
  .badge-mechmania   { background:rgba(225,29,72,.14);  border:1px solid rgba(225,29,72,.35);  color:#fca5a5; }
  .badge-robotics    { background:rgba(56,189,248,.12); border:1px solid rgba(56,189,248,.35); color:#7dd3fc; }
  .badge-fun         { background:rgba(74,222,128,.12); border:1px solid rgba(74,222,128,.35); color:#86efac; }
  .badge-gaming      { background:rgba(192,132,252,.12);border:1px solid rgba(192,132,252,.35);color:#d8b4fe; }
  .badge-innovation  { background:rgba(251,146,60,.12); border:1px solid rgba(251,146,60,.35); color:#fdba74; }
  .badge-computing   { background:rgba(45,212,191,.12); border:1px solid rgba(45,212,191,.35); color:#5eead4; }
  .badge-designing   { background:rgba(244,114,182,.12);border:1px solid rgba(244,114,182,.35);color:#f9a8d4; }

  /* icon bg */
  .icon-mechmania  { background:rgba(225,29,72,.15);  }
  .icon-robotics   { background:rgba(56,189,248,.12); }
  .icon-fun        { background:rgba(74,222,128,.12); }
  .icon-gaming     { background:rgba(192,132,252,.12);}
  .icon-innovation { background:rgba(251,146,60,.12); }
  .icon-computing  { background:rgba(45,212,191,.12); }
  .icon-designing  { background:rgba(244,114,182,.12);}

  /* Section divider */
  .ev-divider { display:flex; align-items:center; gap:12px; margin:3rem 0 2rem; }
  .ev-divider::before,.ev-divider::after { content:''; flex:1; height:1px; background:var(--gray); }
  .ev-divider-dot { width:8px; height:8px; border-radius:50%; background:var(--red); box-shadow:0 0 10px var(--red-glow); }

  /* Section title */
  .sec-wrap { text-align:center; margin-bottom:1.8rem; }
  .sec-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,5vw,3.2rem); letter-spacing:.06em; color:var(--white); display:inline-block; }
  .sec-title::after { content:''; display:block; height:3px; border-radius:2px; margin-top:6px; background:linear-gradient(90deg,transparent,var(--red),transparent); }

  /* Image badge overlay */
  .ec-date-badge {
    position:absolute; top:10px; right:10px; z-index:5;
    font-family:'Rajdhani',sans-serif; font-size:.68rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    background:rgba(8,8,8,.82); border:1px solid rgba(255,255,255,.12);
    backdrop-filter:blur(6px); padding:4px 10px; border-radius:8px; color:var(--white-dim);
  }
`;

// ─── Types & Data ─────────────────────────────────────────────────────────────
interface Event {
  _id: string; title: string; date: string; shortDescription: string;
  venue: string; time: string; image: string; rsvplink: string; domain: string;
}

const events: Event[] = [
  // ── Mechmania ──
  {
    _id: "m1", title: "POSEIDON: The Ultimate Battle Beneath the Waves",
    date: "Mar 8–9, 2025",
    shortDescription: "Get ready for the most innovative and thrilling competition of the year: POSEIDON — the Aqua Robot Soccer War. Register with your team (2 members). Bots for the event will be provided to each team.", venue: "Techno India University", time: "9 AM onwards", image: "/temp/29.jpeg",
    rsvplink: "https://forms.gle/K6qyX4hRTD7qMwww9",
    domain: "Mechmania"
  },
  { _id: "m2", title: "POWER TRUSS: Building Bridges to Success", date: "Mar 8–9, 2025", shortDescription: "Harness the power of innovation and construction as you design, build, and test your very own bridge capable of supporting heavy loads. Teams of 2 use ice cream sticks, glue, and feviquick.", venue: "Techno India University", time: "12 PM onwards", image: "/temp/30.jpeg", rsvplink: "https://forms.gle/PuKjbGWrf7QHehPQ7", domain: "Mechmania" },
  { _id: "m3", title: "Blast Off! The Ultimate Water Bottle Rocket Event", date: "Mar 10, 2025", shortDescription: "Get ready to launch your creativity sky-high as we delve into the thrilling world of DIY rocket science. Whether you're a novice or seasoned rocketeer, prepare for an unforgettable experience as we count down to lift-off!", venue: "Techno India University", time: "12 PM onwards", image: "/temp/31.jpeg", rsvplink: "https://forms.gle/McxZmZ1dfDfdrdfx8", domain: "Mechmania" },

  // ── Robotics ──
  { _id: "r1", title: "RoboWar 15kg: The Ultimate Battle of Steel and Strategy", date: "Mar 8–9, 2025", shortDescription: "Prepare for RoboWar 2025, where engineering meets destruction in the most intense robotic showdown! Watch as custom-built combat bots clash in a high-stakes battle of power, precision, and strategy.", venue: "Techno India University", time: "12 PM onwards", image: "/temp/36.png", rsvplink: "https://forms.gle/jiYCQT8eHngnQhKm8", domain: "Robotics" },
  { _id: "r2", title: "DOGE WAR: Forged in Steel, Tested in Battle! (8 kg)", date: "Mar 8–9, 2025", shortDescription: "Where Metal Clashes, Sparks Fly, and Champions Rise! Step into the ultimate battleground where engineering meets adrenaline and robots engage in a high-octane spectacle of destruction.", venue: "Techno India University", time: "12 PM onwards", image: "/temp/42.jpeg", rsvplink: "https://forms.gle/jiYCQT8eHngnQhKm8", domain: "Robotics" },
  { _id: "r3", title: "RoboSoccer: Where Innovation Meets the Game", date: "Mar 8–9, 2025", shortDescription: "Step onto the future of sports, where cutting-edge robotics and high-energy competition collide! Watch autonomous robots dribble, pass, and score with unmatched precision and lightning speed.", venue: "Techno India University", time: "12 PM onwards", image: "/temp/35.png", rsvplink: "https://forms.gle/jiYCQT8eHngnQhKm8", domain: "Robotics" },
  { _id: "r4", title: "Line Follower: Precision in Motion!", date: "Mar 9, 2025", shortDescription: "Watch as autonomous robots navigate intricate paths with flawless precision, guided by advanced sensors and lightning-fast reflexes. The result of months of innovation, programming, and problem-solving — in real-time.", venue: "Techno India University", time: "12 PM onwards", image: "/temp/43.jpeg", rsvplink: "https://forms.gle/jiYCQT8eHngnQhKm8", domain: "Robotics" },
  { _id: "r5", title: "Death Race: Pushing the Limits of Innovation and Speed", date: "Mar 9, 2025", shortDescription: "Where Velocity Meets Strategy in the Ultimate Battle of Machines! Autonomous bots race through a relentless gauntlet — navigating sharp turns, leaping over obstacles, and dodging unforeseen challenges.", venue: "Techno India University", time: "12 PM onwards", image: "/temp/34.png", rsvplink: "https://forms.gle/jiYCQT8eHngnQhKm8", domain: "Robotics" },

  // ── Fun Events ──
  { _id: "f1", title: "Scavenger Hunt: A Fun-Filled Adventure!", date: "Mar 8, 2025", shortDescription: "Join us for an exciting scavenger hunt! Put your problem-solving skills to the test as you race against the clock to find hidden clues and complete challenges. Gather your team and be prepared for a day of adventure.", venue: "Techno India University", time: "11 AM onwards", image: "/temp/20.jpeg", rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSdkRFR-T8sV58Zyu3kcD_XDctb1WA09AbLQ2-5Yn-adO7BqWQ/viewform", domain: "Fun Events" },
  { _id: "f2", title: "Ultimate Food Eating Challenge!", date: "Mar 10, 2025", shortDescription: "Are You Hungry Enough to Be the Champion? Think you can devour more than the competition? Eat as much as you can within the time limit. No leftovers, no mercy — every bite counts!", venue: "Techno India University", time: "12 PM onwards", image: "/temp/21.jpeg", rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLScSR5lCKDNxqafEa5zxRNkiFGRLkPuvZflL5m9n9-IyDFUELw/viewform", domain: "Fun Events" },
  { _id: "f3", title: "LIVE LUDO SHOWDOWN!", date: "Mar 9, 2025", shortDescription: "Roll the dice, make your moves, and outsmart your opponents in the ultimate Live Ludo Challenge! Fast-paced, high-energy battles with exciting prizes for winners. Win exciting cash prizes!", venue: "Techno India University", time: "1 PM onwards", image: "/temp/23.jpg", rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLScZNiDp5xat-GKZSwtjRhuMN9ZSB_155rPv8Sa2RwT3I_maPg/viewform", domain: "Fun Events" },
  { _id: "f4", title: "Superbike Showcase", date: "Mar 10, 2025", shortDescription: "Get up close with the finest superbikes, where engineering meets adrenaline! Witness sleek designs, cutting-edge technology, and the raw power that defines the ultimate riding experience.", venue: "Techno India University", time: "1 PM onwards", image: "/temp/22.jpg", rsvplink: "", domain: "Fun Events" },

  // ── Innovation and Management ──
  { _id: "i1", title: "Pitch to Deck: Turn Ideas into Investments!", date: "Mar 9, 2025", shortDescription: "Have a game-changing startup idea? Pitch to Deck is your chance to present it to top CEOs, investors, and industry leaders. Impress the judges, win exciting cash prizes, and network with experts!", venue: "Techno India University", time: "11 AM onwards", image: "/temp/26.jpeg", rsvplink: "https://forms.gle/EFs9WxEwBmwit5X69", domain: "Innovation" },

  // ── Gaming ──
  { _id: "g1", title: "Chess", date: "Mar 8–9, 2025", shortDescription: "Step into the arena of intellect and strategy — where every move counts and only the sharpest minds prevail! Join the Ultimate Chess Tournament and prove your mastery over the board.", venue: "Techno India University", time: "11 AM onwards", image: "/temp/25.jpeg", rsvplink: "https://forms.gle/6sb7NFdvrEzjj1eB9", domain: "Gaming" },
  { _id: "g2", title: "FC'25", date: "Mar 8–10, 2025", shortDescription: "Step into the arena of intellect and strategy in the virtual football pitch. High-stakes battles with skill and teamwork deciding the champion. Compete against the best in real-time.", venue: "Techno India University", time: "11 AM onwards", image: "/temp/28.jpeg", rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSedjOYpg5ebu4PVxmPe15FITzX0FdpC9rTvFJnliFlGW5pl3Q/viewform", domain: "Gaming" },
  { _id: "g3", title: "BGMI", date: "Mar 8–10, 2025", shortDescription: "Battlegrounds Mobile India: Survive, Conquer, Dominate! Gear up, drop in, and battle your way to victory in the ultimate BGMI Tournament. Intense battle royale action — squad up and take your shot!", venue: "Techno India University", time: "11 AM onwards", image: "/temp/37.jpeg", rsvplink: "https://docs.google.com/forms/d/1Redi0zt980RhLk8Teh5IcxnT_HoLg_T79ZpoZMgf1cg/edit", domain: "Gaming" },
  { _id: "g4", title: "Valorant", date: "Mar 8–10, 2025", shortDescription: "VALORANT: Aim. Strategize. Dominate! Assemble your squad, lock in your agents, and prepare for an intense tournament. Precision, teamwork, and strategy will decide who controls the battlefield.", venue: "Techno India University", time: "11 AM onwards", image: "/temp/27.jpeg", rsvplink: "https://docs.google.com/forms/d/e/1FAIpQLSc0VDnlZwGQ0jEh2DZUVAy_2UZ6YxTrE3ry1ExXyH_Wz7gxug/viewform", domain: "Gaming" },
  { _id: "g5", title: "Road To Valor", date: "Mar 9, 2025", shortDescription: "The battlefield awaits! Summon your army, devise your strategy, and lead your forces to glory in the ultimate Road to Valor Tournament. Only the strongest commanders will rise.", venue: "Techno India University", time: "11 AM onwards", image: "/temp/41.jpeg", rsvplink: "https://forms.gle/Ps5MxEfma7Y11ZCx7", domain: "Gaming" },
  { _id: "g6", title: "Real Cricket 24", date: "Mar 8, 2025", shortDescription: "Step onto the virtual pitch and showcase your batting brilliance and bowling mastery! Precision, strategy, and quick reflexes will decide the true champion. Are you ready to dominate?", venue: "Techno India University", time: "11 AM onwards", image: "/temp/40.jpeg", rsvplink: "https://forms.gle/rKSxkXFBquE49MFv8", domain: "Gaming" },
  { _id: "g7", title: "Bullet Echo", date: "Mar 9, 2025", shortDescription: "Stealth, Strategy, Survival! Step into the shadows, team up, and eliminate your enemies. Use tactics, precision, and teamwork to outplay your opponents and be the last one standing.", venue: "Techno India University", time: "11 AM onwards", image: "/temp/39.jpeg", rsvplink: "https://forms.gle/WHXcZWd5WBivesrdA", domain: "Gaming" },
  { _id: "g8", title: "Cookie Run", date: "Mar 8, 2025", shortDescription: "Dash, Dodge & Dominate! Get ready to run, jump, and outpace the competition. Speed, strategy, and quick reflexes will determine who takes the lead and claims victory!", venue: "Techno India University", time: "11 AM onwards", image: "/temp/38.jpeg", rsvplink: "https://forms.gle/igFAmSveq9RVHJnW6", domain: "Gaming" },

  // ── Computing ──
  { _id: "c1", title: "Hackquest", date: "Mar 8–9, 2025", shortDescription: "Solve real-world problems in Healthcare, AI, Cybersecurity, Education, Blockchain, and more! Team size: 1–4 members. Tackle impactful challenges, network with industry experts, and showcase your skills.", venue: "Techno India University", time: "12 PM onwards", image: "/temp/24.png", rsvplink: "https://lemonade.social/e/AigjXHfi", domain: "Computing" },
  { _id: "c2", title: "Webyard", date: "Mar 8, 2025", shortDescription: "Think You Can Turn Designs into Reality? Join the frontend making contest organized by Takshila. 2 hours to code 2 webpages from given designs. Show off your dev skills and compete with the best!", venue: "Techno India University", time: "11 AM onwards", image: "/temp/32.jpeg", rsvplink: "https://forms.gle/qgfGRCpK8rv9tsaa8", domain: "Computing" },
  { _id: "c3", title: "Codex", date: "Mar 9, 2025", shortDescription: "Think You've Got What It Takes to Crack the Code? 2 hours, 4 challenging questions. Put your problem-solving skills to the test, compete with the best, and prove you've got the brains!", venue: "Techno India University", time: "11 AM onwards", image: "/temp/33.jpeg", rsvplink: "https://forms.gle/qgfGRCpK8rv9tsaa8", domain: "Computing" },

  // ── Designing ──
  { _id: "d1", title: "Cosplay", date: "Mar 10, 2025", shortDescription: "Step into a world where fantasy meets reality! From iconic heroes to legendary villains, witness stunning transformations as cosplayers bring their favourite characters to life with passion and creativity.", venue: "Techno India University", time: "11 AM onwards", image: "/cosplay.jpg", rsvplink: "", domain: "Designing" },
];

const domainConfig: Record<string, { icon: string; cardClass: string; badgeClass: string; iconClass: string; titleColor: string }> = {
  Mechmania: { icon: "⚙️", cardClass: "ec-mechmania", badgeClass: "badge-mechmania", iconClass: "icon-mechmania", titleColor: "#fca5a5" },
  Robotics: { icon: "🤖", cardClass: "ec-robotics", badgeClass: "badge-robotics", iconClass: "icon-robotics", titleColor: "#7dd3fc" },
  "Fun Events": { icon: "🎉", cardClass: "ec-fun", badgeClass: "badge-fun", iconClass: "icon-fun", titleColor: "#86efac" },
  Innovation: { icon: "💡", cardClass: "ec-innovation", badgeClass: "badge-innovation", iconClass: "icon-innovation", titleColor: "#fdba74" },
  Gaming: { icon: "🎮", cardClass: "ec-gaming", badgeClass: "badge-gaming", iconClass: "icon-gaming", titleColor: "#d8b4fe" },
  Computing: { icon: "💻", cardClass: "ec-computing", badgeClass: "badge-computing", iconClass: "icon-computing", titleColor: "#5eead4" },
  Designing: { icon: "🎨", cardClass: "ec-designing", badgeClass: "badge-designing", iconClass: "icon-designing", titleColor: "#f9a8d4" },
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

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
    };
    const onLeave = () => { el.style.transform = `perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0px)`; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, []);
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

// ─── EventCard ────────────────────────────────────────────────────────────────
function EventCard({ event }: { event: Event }) {
  const cfg = domainConfig[event.domain] ?? domainConfig["Mechmania"];
  const tiltRef = useTilt();
  return (
    <div ref={tiltRef} className={`ec ${cfg.cardClass}`}>
      <div className="ec-img">
        <Image src={event.image} alt={event.title} fill sizes="(max-width:640px) 100vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
        <div className="ec-date-badge"><BsCalendar3 size={9} style={{ display: 'inline', marginRight: 4 }} />{event.date}</div>
      </div>
      <div className="ec-body">
        <div className="ec-title">{event.title}</div>
        <div className="ec-desc">{event.shortDescription}</div>
        <div className="ec-meta">
          <div className="ec-meta-row"><MdOutlineLocationOn size={13} />{event.venue}</div>
          <div className="ec-meta-row"><BiTime size={13} />{event.time}</div>
        </div>
        {event.rsvplink ? (
          <Link href={event.rsvplink} target="_blank" rel="noopener noreferrer" className="ec-rsvp">
            RSVP Now <HiArrowRight size={13} />
          </Link>
        ) : (
          <div className="ec-no-rsvp">Registration Closed</div>
        )}
      </div>
    </div>
  );
}

// ─── DomainBlock ──────────────────────────────────────────────────────────────
function DomainBlock({ domain }: { domain: string }) {
  const headerRef = useReveal(0.1);
  const gridRef = useReveal(0.07);
  const cfg = domainConfig[domain];
  const domEvents = events.filter(e => e.domain === domain);
  if (!domEvents.length) return null;
  return (
    <div className="dom-section">
      <div ref={headerRef} className="rv dom-header">
        <div className={`dom-icon ${cfg.iconClass}`}>{cfg.icon}</div>
        <div className="dom-title" style={{ color: cfg.titleColor }}>{domain === "Innovation" ? "Innovation & Management" : domain}</div>
        <div className={`dom-count ${cfg.badgeClass}`}>{domEvents.length} event{domEvents.length > 1 ? 's' : ''}</div>
      </div>
      <div ref={gridRef} className="sg ev-grid">
        {domEvents.map(ev => <EventCard key={ev._id} event={ev} />)}
      </div>
    </div>
  );
}

// ─── Events Page ──────────────────────────────────────────────────────────────
function Events() {
  const heroRef = useReveal(0.04);
  const statsRef = useReveal(0.08);

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
              Join us for hands-on workshops, thrilling competitions, and high-energy tournaments across robotics, gaming, innovation, and more. Reserve your spot and be part of this exciting journey!
            </p>
          </div>

          {/* STATS */}
          <div ref={statsRef} className="rv ev-stats">
            <Counter end={25} label="Total Events" />
            <Counter end={7} label="Domains" />
            <Counter end={3} label="Days" />
            <Counter end={100} label="+ Participants" />
          </div>

          {/* DOMAIN SECTIONS */}
          {domainOrder.map((d, i) => (
            <div key={d}>
              {i > 0 && <div className="ev-divider"><div className="ev-divider-dot" /></div>}
              <DomainBlock domain={d} />
            </div>
          ))}

        </div>
      </div>
    </>
  );
}

export default Events;
