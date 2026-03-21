"use client"
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --red: #e11d48; --red-dim: #9f1239;
    --red-glow: rgba(225,29,72,.38); --red-soft: rgba(225,29,72,.12);
    --white: #f8fafc; --white-dim: rgba(248,250,252,.65); --white-muted: rgba(248,250,252,.36);
    --black: #080808; --gray: #2a2a2a;
  }
  .tv-bg-grid {
    position:fixed; inset:0; pointer-events:none; z-index:0;
    background-image: linear-gradient(rgba(225,29,72,.04) 1px,transparent 1px), linear-gradient(90deg,rgba(225,29,72,.04) 1px,transparent 1px);
    background-size:48px 48px;
    mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);
  }
  .tv-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; filter:blur(90px); opacity:.16; }
  .tv-orb-1 { width:520px; height:520px; top:-130px; left:-110px; background:var(--red); animation:orbA 15s ease-in-out infinite; }
  .tv-orb-2 { width:400px; height:400px; bottom:8%; right:-90px; background:var(--red-dim); animation:orbB 19s ease-in-out infinite; }
  @keyframes orbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(70px,50px)} }
  @keyframes orbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,-70px)} }
  .tv-scan { position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.4; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.07) 2px,rgba(0,0,0,.07) 4px); }
  .tv-section { background:var(--black); color:var(--white); font-family:'DM Sans',sans-serif; position:relative; overflow:hidden; }
  .tv-inner { max-width:1220px; margin:0 auto; padding:3rem 1.25rem 5rem; position:relative; z-index:1; }

  .rv      { opacity:0; transform:translateY(42px); transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1); }
  .rv.vis  { opacity:1; transform:none; }
  .rv-s    { opacity:0; transform:scale(.88); transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1); }
  .rv-s.vis{ opacity:1; transform:scale(1); }

  .sg > * { opacity:0; transform:translateY(30px) scale(.96); transition:opacity .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1); }
  .sg.vis > *:nth-child(1){opacity:1;transform:none;transition-delay:.04s}
  .sg.vis > *:nth-child(2){opacity:1;transform:none;transition-delay:.10s}
  .sg.vis > *:nth-child(3){opacity:1;transform:none;transition-delay:.16s}
  .sg.vis > *:nth-child(4){opacity:1;transform:none;transition-delay:.22s}
  .sg.vis > *:nth-child(5){opacity:1;transform:none;transition-delay:.28s}
  .sg.vis > *:nth-child(6){opacity:1;transform:none;transition-delay:.34s}
  .sg.vis > *:nth-child(7){opacity:1;transform:none;transition-delay:.40s}
  .sg.vis > *:nth-child(8){opacity:1;transform:none;transition-delay:.46s}
  .sg.vis > *:nth-child(n+9){opacity:1;transform:none;transition-delay:.52s}

  .tv-hero { margin-bottom:3.5rem; }
  .tv-eyebrow { display:inline-flex; align-items:center; gap:10px; font-family:'Rajdhani',sans-serif; font-size:.78rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--red); margin-bottom:1.1rem; }
  .tv-eyebrow::before { content:''; width:28px; height:2px; background:var(--red); display:block; }
  .tv-h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(4.5rem,12vw,9rem); line-height:.9; letter-spacing:.02em; color:var(--white); margin:0 0 .4rem; }
  .tv-h1 span { color:var(--red); }
  .tv-rule { display:flex; align-items:center; gap:14px; margin:1.4rem 0 1.6rem; }
  .tv-rule::before { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--red),transparent); }
  .tv-rule-dot { width:7px; height:7px; border-radius:50%; background:var(--red); flex-shrink:0; animation:pulseDot 2.2s ease-in-out infinite; }
  @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 var(--red-glow)} 50%{box-shadow:0 0 0 10px transparent} }
  .tv-hero-p { font-size:clamp(.94rem,2vw,1.06rem); line-height:1.8; color:var(--white-muted); max-width:600px; }

  .tv-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:20px; margin-bottom:4rem; padding:1.6rem 1.4rem; background:rgba(255,255,255,.022); border:1px solid rgba(225,29,72,.16); border-radius:16px; }
  .tv-stat { text-align:center; }
  .tv-stat-n { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,5vw,3rem); color:var(--red); line-height:1; }
  .tv-stat-l { font-family:'DM Sans',sans-serif; font-size:.72rem; color:var(--white-muted); letter-spacing:.1em; text-transform:uppercase; margin-top:4px; }

  .sec-wrap { text-align:center; margin-bottom:1.8rem; }
  .sec-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(2rem,5vw,3.2rem); letter-spacing:.06em; color:var(--white); display:inline-block; position:relative; }
  .sec-title::after { content:''; display:block; height:3px; border-radius:2px; margin-top:6px; background:linear-gradient(90deg,transparent,var(--red),transparent); }

  .sub-label { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.72rem; letter-spacing:.2em; text-transform:uppercase; color:var(--red); text-align:center; margin-bottom:1rem; display:flex; align-items:center; justify-content:center; gap:10px; }
  .sub-label::before,.sub-label::after { content:''; flex:1; max-width:60px; height:1px; background:var(--red-dim); }

  .legend { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-bottom:1.8rem; }
  .leg-item { display:flex; align-items:center; gap:7px; font-family:'DM Sans',sans-serif; font-size:.76rem; color:var(--white-muted); }
  .leg-dot { width:8px; height:8px; border-radius:50%; }

  .tv-divider { display:flex; align-items:center; gap:12px; margin:2rem 0 1.8rem; }
  .tv-divider::before,.tv-divider::after { content:''; flex:1; height:1px; background:var(--gray); }
  .tv-divider-dot { width:8px; height:8px; border-radius:50%; background:var(--red); box-shadow:0 0 10px var(--red-glow); }

  .tc { position:relative; border-radius:18px; display:flex; flex-direction:column; align-items:center; padding:24px 14px 18px; cursor:default; transform-style:preserve-3d; transition:box-shadow .4s cubic-bezier(.22,1,.36,1),border-color .4s ease; will-change:transform; overflow:hidden; }
  .tc::before { content:''; position:absolute; top:0; left:12%; right:12%; height:1px; border-radius:1px; opacity:.7; }
  .tc::after { content:''; position:absolute; inset:0; border-radius:18px; background:linear-gradient(145deg,rgba(255,255,255,.05) 0%,transparent 52%); pointer-events:none; }

  .tc-lead { background:linear-gradient(158deg,#1c0a0d 0%,#0e0e0e 55%,#1a0809 100%); border:1px solid rgba(225,29,72,.26); box-shadow:0 4px 22px rgba(225,29,72,.07); }
  .tc-lead::before { background:linear-gradient(90deg,transparent,rgba(225,29,72,.7),transparent); }
  .tc-lead:hover { border-color:rgba(225,29,72,.72); box-shadow:0 20px 56px rgba(225,29,72,.22),0 0 0 1px rgba(225,29,72,.3); }

  .tc-poc { background:linear-gradient(158deg,#1a1204 0%,#0e0e0e 55%,#161008 100%); border:1px solid rgba(245,158,11,.24); box-shadow:0 4px 22px rgba(245,158,11,.06); }
  .tc-poc::before { background:linear-gradient(90deg,transparent,rgba(245,158,11,.65),transparent); }
  .tc-poc:hover { border-color:rgba(245,158,11,.68); box-shadow:0 20px 56px rgba(245,158,11,.2),0 0 0 1px rgba(245,158,11,.28); }

  .tc-core { background:linear-gradient(158deg,#100a1c 0%,#0e0e0e 55%,#11081c 100%); border:1px solid rgba(167,139,250,.2); box-shadow:0 4px 20px rgba(167,139,250,.05); }
  .tc-core::before { background:linear-gradient(90deg,transparent,rgba(167,139,250,.6),transparent); }
  .tc-core:hover { border-color:rgba(167,139,250,.62); box-shadow:0 20px 56px rgba(167,139,250,.18),0 0 0 1px rgba(167,139,250,.26); }

  .pw { position:relative; border-radius:50%; overflow:hidden; flex-shrink:0; margin-bottom:13px; transition:box-shadow .4s ease; }
  .pw-sm { width:148px; height:148px; }
  .pw-lg { width:166px; height:166px; }
  @media(max-width:600px){ .pw-sm,.pw-lg { width:112px !important; height:112px !important; } }

  .tc-lead .pw { box-shadow:0 0 0 3px rgba(225,29,72,.4); }
  .tc-lead:hover .pw { box-shadow:0 0 0 4px rgba(225,29,72,.9),0 0 30px rgba(225,29,72,.5); }
  .tc-poc  .pw { box-shadow:0 0 0 3px rgba(245,158,11,.38); }
  .tc-poc:hover  .pw { box-shadow:0 0 0 4px rgba(245,158,11,.9),0 0 30px rgba(245,158,11,.48); }
  .tc-core .pw { box-shadow:0 0 0 3px rgba(167,139,250,.32); }
  .tc-core:hover .pw { box-shadow:0 0 0 4px rgba(167,139,250,.85),0 0 30px rgba(167,139,250,.42); }

  .pw img { transition:transform .5s cubic-bezier(.22,1,.36,1),filter .5s ease !important; filter:brightness(.9) saturate(1.1); }
  .tc:hover .pw img { transform:scale(1.13) !important; filter:brightness(1.08) saturate(1.22); }
  .pw::after { content:''; position:absolute; inset:0; border-radius:50%; background:linear-gradient(135deg,rgba(255,255,255,.22) 0%,transparent 55%); opacity:0; transition:opacity .35s ease; pointer-events:none; }
  .tc:hover .pw::after { opacity:1; }

  .cn { font-family:'Rajdhani',sans-serif; font-size:1rem; font-weight:700; letter-spacing:.05em; color:var(--white); text-align:center; margin-bottom:3px; line-height:1.2; text-transform:uppercase; }
  .cd { font-family:'DM Sans',sans-serif; font-size:.72rem; text-align:center; }
  .tc-lead .cd { color:rgba(225,29,72,.75); }
  .tc-poc  .cd { color:rgba(245,158,11,.78); }
  .tc-core .cd { color:rgba(167,139,250,.78); }

  .sr { display:flex; gap:10px; margin-top:11px; justify-content:center; opacity:0; transform:translateY(8px); transition:opacity .3s ease,transform .3s ease; }
  .tc:hover .sr { opacity:1; transform:translateY(0); }
  @media(hover:none){ .sr{ opacity:1; transform:none; } }

  .si { display:flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:50%; color:var(--white-dim); border:1px solid rgba(255,255,255,.1); transition:transform .22s ease,background .22s ease,border-color .22s ease,color .22s ease; }
  .tc-lead .si:hover { background:rgba(225,29,72,.25); border-color:rgba(225,29,72,.65); color:#fca5a5; transform:scale(1.2) rotate(-5deg); }
  .tc-poc  .si:hover { background:rgba(245,158,11,.22); border-color:rgba(245,158,11,.65); color:#fcd34d; transform:scale(1.2) rotate(-5deg); }
  .tc-core .si:hover { background:rgba(167,139,250,.22); border-color:rgba(167,139,250,.65); color:#c4b5fd; transform:scale(1.2) rotate(-5deg); }

  .tg    { display:grid; gap:15px; grid-template-columns:repeat(auto-fill,minmax(195px,1fr)); margin-bottom:2.6rem; }
  .tg-lg { grid-template-columns:repeat(auto-fill,minmax(215px,1fr)); }

  @media(max-width:600px){
    .tg,.tg-lg { grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:2rem; }
    .tc { padding:16px 8px 13px; }
    .cn { font-size:.84rem; }
    .cd { font-size:.68rem; }
  }
  @media(max-width:340px){ .tg,.tg-lg { grid-template-columns:1fr; } }

  .dom-badge { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; padding:5px 18px; border-radius:100px; display:table; margin:0 auto 1.1rem; }
`;

interface TeamMember {
  _id: string; name: string; designation: string; domain: string;
  image: string; linkedin?: string; facebook?: string; instagram?: string; featured: boolean;
}

const domainColors: Record<string, { text: string; bg: string; border: string }> = {
  'Robotics': { text: '#60a5fa', bg: 'rgba(59,130,246,.11)', border: 'rgba(96,165,250,.3)' },
  'Fun Events': { text: '#4ade80', bg: 'rgba(34,197,94,.11)', border: 'rgba(74,222,128,.3)' },
  'Gaming': { text: '#c084fc', bg: 'rgba(168,85,247,.11)', border: 'rgba(192,132,252,.3)' },
  'Innovation and Management': { text: '#fb923c', bg: 'rgba(249,115,22,.11)', border: 'rgba(251,146,60,.3)' },
  'Mechmania': { text: '#f87171', bg: 'rgba(239,68,68,.11)', border: 'rgba(248,113,113,.3)' },
  'Designing': { text: '#f472b6', bg: 'rgba(236,72,153,.11)', border: 'rgba(244,114,182,.3)' },
  'Public & Relations': { text: '#2dd4bf', bg: 'rgba(20,184,166,.11)', border: 'rgba(45,212,191,.3)' },
  'Computing': { text: '#38bdf8', bg: 'rgba(14,165,233,.11)', border: 'rgba(56,189,248,.3)' },
};

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
      el.style.transform = `perspective(650px) rotateY(${x * 13}deg) rotateX(${-y * 13}deg) translateZ(10px)`;
    };
    const onLeave = () => { el.style.transform = `perspective(650px) rotateY(0deg) rotateX(0deg) translateZ(0px)`; };
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
      const step = () => { cur += Math.max(1, Math.ceil((end - cur) / 12)); if (cur >= end) { setVal(end); return; } setVal(cur); requestAnimationFrame(step); };
      requestAnimationFrame(step); obs.unobserve(el);
    }, { threshold: .5 });
    obs.observe(el); return () => obs.disconnect();
  }, [end]);
  return (
    <div ref={ref} className="tv-stat">
      <div className="tv-stat-n">{val}+</div>
      <div className="tv-stat-l">{label}</div>
    </div>
  );
}

function MemberCard({ member, variant, large }: { member: TeamMember; variant: 'lead' | 'poc' | 'core'; large?: boolean }) {
  const cls = variant === 'lead' ? 'tc-lead' : variant === 'poc' ? 'tc-poc' : 'tc-core';
  const tiltRef = useTilt();
  return (
    <div ref={tiltRef} className={`tc ${cls}`}>
      <div className={`pw ${large ? 'pw-lg' : 'pw-sm'}`}>
        <Image src={member.image} alt={member.name} fill sizes="(max-width:600px) 112px, 166px" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
      </div>
      <div className="cn">{member.name}</div>
      <div className="cd">{member.designation}</div>
      <div className="sr">
        {member.linkedin && <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="si"><FaLinkedinIn size={13} /></Link>}
        {member.facebook && <Link href={member.facebook} target="_blank" rel="noopener noreferrer" className="si"><FaFacebook size={13} /></Link>}
        {member.instagram && <Link href={member.instagram} target="_blank" rel="noopener noreferrer" className="si"><FaInstagram size={13} /></Link>}
      </div>
    </div>
  );
}

function DomainSection({ domain, members }: { domain: string; members: TeamMember[] }) {
  const ref = useReveal(0.07);
  if (!members.length) return null;
  const col = domainColors[domain] ?? { text: '#94a3b8', bg: 'rgba(148,163,184,.1)', border: 'rgba(148,163,184,.28)' };
  return (
    <div style={{ marginBottom: '2.2rem' }}>
      <div className="dom-badge" style={{ color: col.text, background: col.bg, border: `1px solid ${col.border}` }}>{domain}</div>
      <div ref={ref} className="sg tg">
        {members.map(m => {
          const isPoc = /point of contact|poc/i.test(m.designation);
          return <MemberCard key={m._id} member={m} variant={isPoc ? 'poc' : 'lead'} />;
        })}
      </div>
    </div>
  );
}

function Team() {
  const heroRef = useReveal(0.04);
  const statsRef = useReveal(0.08);
  const mgmtLabel = useReveal(0.1);
  const mgmtGrid = useReveal(0.07);
  const execLabel = useReveal(0.1);
  const execGrid = useReveal(0.07);
  const domTitle = useReveal(0.1);
  const coreTitle = useReveal(0.1);
  const coreGrid = useReveal(0.07);

  const teams: TeamMember[] = [
    { _id: '1', name: 'SHRUTI SHRIVASTAVA', designation: 'Management Lead', domain: 'Management', image: '/Shruti Shrivastava.JPEG', instagram: 'https://www.instagram.com/shrutishri04', linkedin: 'https://www.linkedin.com/in/shruti-shrivastava-a10774288/', featured: true },
    { _id: '3', name: 'HREETAM SENGUPTA', designation: 'Management Lead', domain: 'Management', image: '/Hreetam Sengupta.JPEG', linkedin: 'https://www.linkedin.com/in/hreetam-sengupta-122739373/', instagram: 'https://www.instagram.com/_hreetam_07', featured: true },
    { _id: '4', name: 'DIVYANSHI PRIYA', designation: 'Management Lead', domain: 'Management', image: '/DIVYANSHI PRIYA.jpeg', instagram: 'https://www.instagram.com/divyanshi_kaushik', linkedin: 'https://www.linkedin.com/in/divyanshi-priya-730a6727b/', featured: true },
    { _id: '5', name: 'ARYAN CHETTRI', designation: 'Management Lead', domain: 'Management', image: '/ARYAN CHETTRI.JPEG', linkedin: 'https://www.linkedin.com/in/your1copywriter/', instagram: 'https://www.instagram.com/_.chettri_/', featured: true },
    { _id: '6', name: 'VIKASH KUMAR SAHU', designation: 'Executive Lead', domain: 'Executive', image: '/VIKASH KUMAR SAHU.JPEG', linkedin: 'https://www.linkedin.com/in/vikash-kumar-sahu-379240320/', instagram: 'https://www.instagram.com/vikashkumarsahu_', featured: false },
    { _id: '7', name: 'ISTUTI SHARMA', designation: 'Executive Lead', domain: 'Executive', image: '/ISTUTI SHARMA.JPEG', instagram: 'https://www.instagram.com/istuti_25_11', featured: false },
    { _id: '9', name: 'RAKESH SONI', designation: 'Robotics Lead', domain: 'Robotics', image: '/RAKESH SONI.JPG', instagram: 'https://www.instagram.com/rakeshsoniiii/', linkedin: 'https://www.linkedin.com/in/rakeshsoniiii/', featured: false },
    { _id: '19', name: 'SHIBAM JOARDAR', designation: 'Point of Contact', domain: 'Robotics', image: '/SHIBAM JOARDAR.jpeg', instagram: 'https://www.instagram.com/shibamjoardar', featured: false },
    { _id: '10', name: 'DHRITIMAN SARKAR', designation: 'Domain Lead', domain: 'Fun Events', image: '/DHRITIMAN SARKAR.jpeg', linkedin: 'https://www.linkedin.com/in/dhritiman-sarkar-7861032b4/', instagram: 'https://www.instagram.com/dhriti2342', featured: false },
    { _id: '11', name: 'KRISHNA GOPAL BARIK', designation: 'Domain Lead', domain: 'Fun Events', image: '/KRISHNA GOPAL BARIK.jpeg', instagram: 'https://www.instagram.com/itz_krishna.x03', featured: false },
    { _id: '12', name: 'SHRAYAN MISHRA', designation: 'Domain Lead', domain: 'Gaming', image: '/SHRAYAN MISHRA.jpeg', instagram: 'https://www.instagram.com/shrayan._.music', featured: false },
    { _id: '13', name: 'SUPRODIPTO DAS', designation: 'Domain Lead', domain: 'Gaming', image: '/Suprodipto Das.jpeg', instagram: 'https://www.instagram.com/sup_is_pro', featured: false },
    { _id: '14', name: 'SHAMARTHI BASU', designation: 'Domain Lead', domain: 'Innovation and Management', image: '/SHAMARTHI BASU.jpeg', instagram: 'https://www.instagram.com/_shamarthi_', featured: false },
    { _id: '15', name: 'KHUSHI KUMARI', designation: 'Point of Contact', domain: 'Innovation and Management', image: '/KHUSHI KUMARI.jpeg', instagram: 'https://www.instagram.com/khushi.__.s', featured: false },
    { _id: '16', name: 'DEBJIT PAUL', designation: 'Domain Lead', domain: 'Mechmania', image: '/Debjit Paul.jpeg', instagram: 'https://www.instagram.com/_pdeb.9304', featured: false },
    { _id: '17', name: 'ARUNANGSHU HALDER', designation: 'Point of Contact', domain: 'Mechmania', image: '/ARUNANGSHU HALDER.jpeg', instagram: 'https://www.instagram.com/_mr_greyyy', featured: false },
    { _id: '20', name: 'ZAYDAN ASAD', designation: 'Point of Contact', domain: 'Designing', image: '/Zaydan Asad.jpeg', instagram: 'https://www.instagram.com/jet__skiii', featured: false },
    { _id: '20.1', name: 'SAYAK PAUL', designation: 'Point of Contact', domain: 'Designing', image: '/SAYAK PAUL.jpeg', instagram: 'https://www.instagram.com/alor_filament_', featured: false },
    { _id: '21', name: 'SHREYOSEE DHAR', designation: 'Domain Lead', domain: 'Public & Relations', image: '/Shreyosee.jpg', instagram: 'https://www.instagram.com/paintmyclouds', featured: false },
    { _id: '21.1', name: 'RAUNAK DUTTA', designation: 'Point of Contact', domain: 'Public & Relations', image: '/RAUNAK DUTTA.jpeg', instagram: 'https://www.instagram.com/raunak_dutta10', featured: false },
    { _id: '25', name: 'ADARSH GUPTA', designation: 'Point of Contact', domain: 'Computing', image: '/ADARSH GUPTA.jpeg', instagram: 'https://www.instagram.com/aaryan._.khan', featured: false },
  ];

  const CoreTeams: TeamMember[] = [
    { _id: 'ct1', name: 'OLIVIA SAHA', designation: 'Member', domain: 'Core Team', image: '/Olivia Saha.jpeg', instagram: 'https://www.instagram.com/olivia_saha_03', featured: false },
    { _id: 'ct2', name: 'DEBASISH CHOWDHURY', designation: 'Member', domain: 'Core Team', image: '/Debasish Chowdhury.jpeg', instagram: 'https://www.instagram.com/debasish.chowdhury.3367174', featured: false },
    { _id: 'ct3', name: 'RAJ KUMAR', designation: 'Member', domain: 'Core Team', image: '/RAJ KUMARR.jpeg', instagram: 'https://www.instagram.com/raaaaj.k', featured: false },
    { _id: 'ct4', name: 'SATTWIK PANJA', designation: 'Member', domain: 'Core Team', image: '/SATTWIK PANJA.jpeg', instagram: 'https://www.instagram.com/_shush_blitz_', featured: false },
    { _id: 'ct5', name: 'RABISANKAR MAITY', designation: 'Member', domain: 'Core Team', image: '/RABISANKAR MAITY.jpeg', instagram: 'https://www.instagram.com/rabisankarmaityofficial', featured: false },
    { _id: 'ct6', name: 'SAPTARSHI KUMAR GUHA', designation: 'Member', domain: 'Core Team', image: '/SAPTARSHI KUMAR GUHA.jpeg', instagram: 'https://www.instagram.com/sappy.7/', featured: false },
  ];

  const managementLeads = teams.filter(m => m.domain === 'Management');
  const executiveLeads = teams.filter(m => m.domain === 'Executive');
  const domainOrder = ['Robotics', 'Fun Events', 'Gaming', 'Innovation and Management', 'Mechmania', 'Designing', 'Public & Relations', 'Computing'];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="tv-section">
        <div className="tv-bg-grid" />
        <div className="tv-orb tv-orb-1" />
        <div className="tv-orb tv-orb-2" />
        <div className="tv-scan" />
        <div className="tv-inner">

          {/* HERO */}
          <div ref={heroRef} className="rv tv-hero">
            <div className="tv-eyebrow">Techno Vivarta</div>
            <h1 className="tv-h1">Meet the<br /><span>Team.</span></h1>
            <div className="tv-rule"><div className="tv-rule-dot" /></div>
            <p className="tv-hero-p">
              At the helm of Techno Vivarta, you&apos;ll find our invaluable core team a dedicated group who serve as the driving force behind our community&apos;s growth and success. United by a passion for technology and innovation, they navigate the ever-evolving tech landscape with vision and grit.
            </p>
          </div>



          {/* LEADS */}
          <div ref={useReveal(.08)} className="rv-s sec-wrap">
            <div className="sec-title">Meet our Leads</div>
          </div>
          <div className="legend">
            <div className="leg-item"><div className="leg-dot" style={{ background: '#e11d48' }} /><span>Lead</span></div>
            <div className="leg-item"><div className="leg-dot" style={{ background: '#f59e0b' }} /><span>Point of Contact</span></div>
          </div>

          <div ref={mgmtLabel} className="rv sub-label">Management</div>
          <div ref={mgmtGrid} className="sg tg tg-lg">
            {managementLeads.map(m => <MemberCard key={m._id} member={m} variant="lead" large />)}
          </div>

          <div className="tv-divider"><div className="tv-divider-dot" /></div>

          <div ref={execLabel} className="rv sub-label">Executive</div>
          <div ref={execGrid} className="sg tg tg-lg">
            {executiveLeads.map(m => <MemberCard key={m._id} member={m} variant="lead" large />)}
          </div>

          <div className="tv-divider"><div className="tv-divider-dot" /></div>

          <div ref={domTitle} className="rv-s sec-wrap" style={{ marginTop: '1rem' }}>
            <div className="sec-title" style={{ fontSize: 'clamp(1.5rem,3.5vw,2.2rem)' }}>Domain Leads</div>
          </div>
          {domainOrder.map(d => (
            <DomainSection key={d} domain={d} members={teams.filter(m => m.domain === d)} />
          ))}

          <div className="tv-divider"><div className="tv-divider-dot" /></div>

          <div ref={coreTitle} className="rv-s sec-wrap" style={{ marginTop: '1rem' }}>
            <div className="sec-title">Core Team</div>
          </div>
          <div className="legend" style={{ marginBottom: '1.5rem' }}>
            <div className="leg-item"><div className="leg-dot" style={{ background: '#a78bfa' }} /><span>Core Team Member</span></div>
          </div>
          <div ref={coreGrid} className="sg tg">
            {CoreTeams.map(m => <MemberCard key={m._id} member={m} variant="core" />)}
          </div>

        </div>
      </div>
    </>
  );
}

export default Team;
