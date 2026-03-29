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
