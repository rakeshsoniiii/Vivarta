"use client"
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { client, urlFor } from '../../sanity';
import Link from "next/link";

// ─── Inline CSS ───────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap');

  /* ── Scroll-reveal animations ── */
  .rv        { opacity:0; transform:translateY(36px); transition: opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1); }
  .rv.vis    { opacity:1; transform:translateY(0); }
  .rv-l      { opacity:0; transform:translateX(-36px); transition: opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1); }
  .rv-l.vis  { opacity:1; transform:translateX(0); }
  .rv-s      { opacity:0; transform:scale(0.87); transition: opacity 0.55s cubic-bezier(.22,1,.36,1), transform 0.55s cubic-bezier(.22,1,.36,1); }
  .rv-s.vis  { opacity:1; transform:scale(1); }

  /* Stagger grid children */
  .sg > * { opacity:0; transform:translateY(28px); transition: opacity .5s cubic-bezier(.22,1,.36,1), transform .5s cubic-bezier(.22,1,.36,1); }
  .sg.vis > *:nth-child(1)  { opacity:1; transform:none; transition-delay:.04s }
  .sg.vis > *:nth-child(2)  { opacity:1; transform:none; transition-delay:.10s }
  .sg.vis > *:nth-child(3)  { opacity:1; transform:none; transition-delay:.16s }
  .sg.vis > *:nth-child(4)  { opacity:1; transform:none; transition-delay:.22s }
  .sg.vis > *:nth-child(5)  { opacity:1; transform:none; transition-delay:.28s }
  .sg.vis > *:nth-child(6)  { opacity:1; transform:none; transition-delay:.34s }
  .sg.vis > *:nth-child(7)  { opacity:1; transform:none; transition-delay:.40s }
  .sg.vis > *:nth-child(8)  { opacity:1; transform:none; transition-delay:.46s }
  .sg.vis > *:nth-child(n+9){ opacity:1; transform:none; transition-delay:.52s }

  /* ── Card base ── */
  .tc {
    position:relative; overflow:hidden; border-radius:18px;
    display:flex; flex-direction:column; align-items:center;
    padding:22px 14px 18px; cursor:default;
    transition: transform .38s cubic-bezier(.22,1,.36,1), box-shadow .38s cubic-bezier(.22,1,.36,1);
    will-change: transform;
  }
  .tc:hover { transform: translateY(-9px) scale(1.026); }

  /* Lead – deep indigo glass */
  .tc-lead {
    background: linear-gradient(145deg, rgba(13,18,40,.88) 0%, rgba(26,32,60,.93) 100%);
    border: 1px solid rgba(99,102,241,.32);
    box-shadow: 0 4px 22px rgba(99,102,241,.10);
  }
  .tc-lead:hover { border-color:rgba(129,140,248,.62); box-shadow:0 18px 50px rgba(99,102,241,.26); }

  /* POC – amber / gold glass */
  .tc-poc {
    background: linear-gradient(145deg, rgba(28,18,6,.90) 0%, rgba(44,28,10,.94) 100%);
    border: 1px solid rgba(245,158,11,.32);
    box-shadow: 0 4px 22px rgba(245,158,11,.08);
  }
  .tc-poc:hover { border-color:rgba(251,191,36,.65); box-shadow:0 18px 50px rgba(245,158,11,.24); }

  /* Core – teal glass */
  .tc-core {
    background: linear-gradient(145deg, rgba(8,24,28,.90) 0%, rgba(14,38,44,.94) 100%);
    border: 1px solid rgba(20,184,166,.28);
    box-shadow: 0 4px 20px rgba(20,184,166,.07);
  }
  .tc-core:hover { border-color:rgba(45,212,191,.58); box-shadow:0 18px 50px rgba(20,184,166,.22); }

  /* ── Photo wrapper ── */
  .pw {
    position:relative; width:154px; height:154px; border-radius:50%;
    overflow:hidden; flex-shrink:0; margin-bottom:13px;
    transition: box-shadow .38s ease;
  }
  @media(max-width:480px){ .pw{ width:118px; height:118px; } }

  .tc-lead .pw { box-shadow:0 0 0 3px rgba(99,102,241,.38); }
  .tc-lead:hover .pw { box-shadow:0 0 0 4px rgba(129,140,248,.78), 0 0 22px rgba(99,102,241,.46); }
  .tc-poc  .pw { box-shadow:0 0 0 3px rgba(245,158,11,.38); }
  .tc-poc:hover  .pw { box-shadow:0 0 0 4px rgba(251,191,36,.78), 0 0 22px rgba(245,158,11,.46); }
  .tc-core .pw { box-shadow:0 0 0 3px rgba(20,184,166,.32); }
  .tc-core:hover .pw { box-shadow:0 0 0 4px rgba(45,212,191,.72), 0 0 22px rgba(20,184,166,.42); }

  /* Photo zoom */
  .pw img {
    transition: transform .48s cubic-bezier(.22,1,.36,1), filter .48s ease !important;
    filter: brightness(.94) saturate(1.06);
  }
  .tc:hover .pw img { transform:scale(1.12) !important; filter:brightness(1.06) saturate(1.18); }

  /* Shimmer overlay */
  .pw::after {
    content:''; position:absolute; inset:0; border-radius:50%;
    background:linear-gradient(135deg,rgba(255,255,255,.20) 0%,transparent 58%);
    opacity:0; transition:opacity .35s ease; pointer-events:none;
  }
  .tc:hover .pw::after { opacity:1; }

  /* ── Typography ── */
  .cn {
    font-family:'Syne',sans-serif; font-size:.92rem; font-weight:700;
    letter-spacing:.03em; color:#f1f5f9; text-align:center;
    margin-bottom:3px; line-height:1.25;
  }
  .cd { font-family:'DM Sans',sans-serif; font-size:.76rem; text-align:center; opacity:.72; }
  .tc-lead .cd { color:#a5b4fc; }
  .tc-poc  .cd { color:#fcd34d; }
  .tc-core .cd { color:#5eead4; }

  /* Social row – slides up on hover */
  .sr {
    display:flex; gap:11px; margin-top:11px; justify-content:center;
    opacity:0; transform:translateY(7px);
    transition: opacity .3s ease, transform .3s ease;
  }
  .tc:hover .sr { opacity:1; transform:translateY(0); }
  @media(hover:none){ .sr{ opacity:1; transform:none; } }

  .si {
    display:flex; align-items:center; justify-content:center;
    width:30px; height:30px; border-radius:50%; color:#cbd5e1;
    transition: transform .22s ease, background .22s ease;
  }
  .tc-lead .si:hover { background:rgba(99,102,241,.30); color:#a5b4fc; transform:scale(1.22); }
  .tc-poc  .si:hover { background:rgba(245,158,11,.28); color:#fcd34d; transform:scale(1.22); }
  .tc-core .si:hover { background:rgba(20,184,166,.28); color:#5eead4; transform:scale(1.22); }

  /* ── Section headings ── */
  .sec-title {
    font-family:'Syne',sans-serif; font-weight:800; text-align:center;
    color:#f1f5f9; margin-bottom:2.2rem; letter-spacing:-.015em;
    font-size:clamp(1.55rem,4vw,2.3rem);
  }
  .sec-title::after {
    content:''; display:block; height:3px; border-radius:2px; margin:7px auto 0;
    width:70px; background:linear-gradient(90deg,#6366f1,#a78bfa,transparent);
  }

  .dom-badge {
    font-family:'Syne',sans-serif; font-weight:700; font-size:.78rem;
    letter-spacing:.1em; text-transform:uppercase;
    padding:5px 18px; border-radius:100px; display:inline-block;
    margin: 0 auto 1.2rem; position:relative; left:50%; transform:translateX(-50%);
  }

  /* ── Legend ── */
  .legend { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-bottom:1.8rem; }
  .leg-item { display:flex; align-items:center; gap:6px; font-family:'DM Sans',sans-serif; font-size:.78rem; color:#64748b; }
  .leg-dot { width:9px; height:9px; border-radius:50%; }
  .dot-lead { background:#6366f1; }
  .dot-poc  { background:#f59e0b; }
  .dot-core { background:#14b8a6; }

  /* Sub-section label */
  .sub-label {
    font-family:'Syne',sans-serif; font-weight:700; font-size:.73rem;
    letter-spacing:.12em; text-transform:uppercase; color:#475569;
    text-align:center; margin-bottom:.9rem;
  }

  /* ── Responsive grid ── */
  .tg {
    display:grid; gap:14px;
    grid-template-columns:repeat(auto-fill, minmax(180px,1fr));
    margin-bottom:3rem;
  }
  @media(max-width:480px){
    .tg{ grid-template-columns:repeat(2,1fr); gap:9px; margin-bottom:2rem; }
    .tc{ padding:14px 8px 12px; }
    .cn{ font-size:.75rem; }
    .cd{ font-size:.68rem; }
    .si{ width:24px; height:24px; }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeamMember {
  _id: string; name: string; designation: string; domain: string;
  image: string; linkedin?: string; facebook?: string; instagram?: string; featured: boolean;
}

const domainColors: Record<string, { text:string; bg:string; border:string }> = {
  'Robotics':                   { text:'#60a5fa', bg:'rgba(59,130,246,.12)',  border:'rgba(96,165,250,.35)'  },
  'Fun Events':                 { text:'#4ade80', bg:'rgba(34,197,94,.12)',   border:'rgba(74,222,128,.35)'  },
  'Gaming':                     { text:'#c084fc', bg:'rgba(168,85,247,.12)',  border:'rgba(192,132,252,.35)' },
  'Innovation and Management':  { text:'#fb923c', bg:'rgba(249,115,22,.12)', border:'rgba(251,146,60,.35)'  },
  'Mechmania':                  { text:'#f87171', bg:'rgba(239,68,68,.12)',   border:'rgba(248,113,113,.35)' },
  'Designing':                  { text:'#f472b6', bg:'rgba(236,72,153,.12)', border:'rgba(244,114,182,.35)' },
  'Public & Relations':         { text:'#2dd4bf', bg:'rgba(20,184,166,.12)', border:'rgba(45,212,191,.35)'  },
  'Computing':                  { text:'#38bdf8', bg:'rgba(14,165,233,.12)', border:'rgba(56,189,248,.35)'  },
};

// ─── useReveal ────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

// ─── MemberCard ───────────────────────────────────────────────────────────────
function MemberCard({ member, variant }: { member: TeamMember; variant: 'lead'|'poc'|'core' }) {
  const cls = variant === 'lead' ? 'tc-lead' : variant === 'poc' ? 'tc-poc' : 'tc-core';
  return (
    <div className={`tc ${cls}`}>
      <div className="pw">
        <Image src={member.image} alt={member.name} fill sizes="(max-width:480px) 118px, 154px"
          style={{ objectFit:'cover', objectPosition:'center top' }} />
      </div>
      <div className="cn">{member.name}</div>
      <div className="cd">{member.designation}</div>
      <div className="sr">
        {member.linkedin  && <Link href={member.linkedin}  target="_blank" rel="noopener noreferrer" className="si"><FaLinkedinIn size={14}/></Link>}
        {member.facebook  && <Link href={member.facebook}  target="_blank" rel="noopener noreferrer" className="si"><FaFacebook  size={14}/></Link>}
        {member.instagram && <Link href={member.instagram} target="_blank" rel="noopener noreferrer" className="si"><FaInstagram size={14}/></Link>}
      </div>
    </div>
  );
}

// ─── DomainSection ────────────────────────────────────────────────────────────
function DomainSection({ domain, members }: { domain:string; members:TeamMember[] }) {
  const ref = useReveal(0.08);
  if (!members.length) return null;
  const col = domainColors[domain] ?? { text:'#94a3b8', bg:'rgba(148,163,184,.1)', border:'rgba(148,163,184,.3)' };
  return (
    <div style={{ marginBottom:'2.5rem' }}>
      <div className="dom-badge" style={{ color:col.text, background:col.bg, border:`1px solid ${col.border}` }}>{domain}</div>
      <div ref={ref} className="sg tg">
        {members.map(m => {
          const isPoc = /point of contact|poc/i.test(m.designation);
          return <MemberCard key={m._id} member={m} variant={isPoc ? 'poc' : 'lead'} />;
        })}
      </div>
    </div>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
function Team() {
  const heroRef    = useReveal(0.05);
  const mgmtLabel  = useReveal(0.1);
  const mgmtGrid   = useReveal(0.08);
  const execLabel  = useReveal(0.1);
  const execGrid   = useReveal(0.08);
  const domTitle   = useReveal(0.1);
  const coreTitle  = useReveal(0.1);
  const coreGrid   = useReveal(0.08);

  const teams: TeamMember[] = [
    // Management
    { _id:'1',  name:'SHRUTI SHRIVASTAVA', designation:'Management Lead', domain:'Management', image:'/Shruti Shrivastava.JPEG', instagram:'https://www.instagram.com/shrutishri04', linkedin:'https://www.linkedin.com/in/shruti-shrivastava-a10774288/', featured:true },
    { _id:'3',  name:'HREETAM SENGUPTA',   designation:'Management Lead', domain:'Management', image:'/Hreetam Sengupta.JPEG',   linkedin:'https://www.linkedin.com/in/hreetam-sengupta-122739373/', instagram:'https://www.instagram.com/_hreetam_07', featured:true },
    { _id:'4',  name:'DIVYANSHI PRIYA',    designation:'Management Lead', domain:'Management', image:'/DIVYANSHI PRIYA.jpeg',    instagram:'https://www.instagram.com/divyanshi_kaushik', linkedin:'https://www.linkedin.com/in/divyanshi-priya-730a6727b/', featured:true },
    { _id:'5',  name:'ARYAN CHETTRI',      designation:'Management Lead', domain:'Management', image:'/ARYAN CHETTRI.JPEG',      linkedin:'https://www.linkedin.com/in/your1copywriter/', instagram:'https://www.instagram.com/_.chettri_/', featured:true },
    // Executive
    { _id:'6',  name:'VIKASH KUMAR SAHU',  designation:'Executive Lead',  domain:'Executive',  image:'/VIKASH KUMAR SAHU.JPEG',  linkedin:'https://www.linkedin.com/in/vikash-kumar-sahu-379240320/', instagram:'https://www.instagram.com/vikashkumarsahu_', featured:false },
    { _id:'7',  name:'ISTUTI SHARMA',      designation:'Executive Lead',  domain:'Executive',  image:'/ISTUTI SHARMA.JPEG',      instagram:'https://www.instagram.com/istuti_25_11', featured:false },
    // Robotics
    { _id:'9',  name:'RAKESH SONI',        designation:'Robotics Lead',        domain:'Robotics', image:'/RAKESH SONI.JPG',         instagram:'https://www.instagram.com/rakeshsoniiii/', linkedin:'https://www.linkedin.com/in/rakeshsoniiii/', featured:false },
    { _id:'19', name:'SHIBAM JOARDAR',     designation:'Point of Contact',     domain:'Robotics', image:'/SHIBAM JOARDAR.jpeg',     instagram:'https://www.instagram.com/shibamjoardar', featured:false },
    // Fun Events
    { _id:'10', name:'DHRITIMAN SARKAR',   designation:'Domain Lead', domain:'Fun Events', image:'/DHRITIMAN SARKAR.jpeg',   linkedin:'https://www.linkedin.com/in/dhritiman-sarkar-7861032b4/', instagram:'https://www.instagram.com/dhriti2342', featured:false },
    { _id:'11', name:'KRISHNA GOPAL BARIK',designation:'Domain Lead', domain:'Fun Events', image:'/KRISHNA GOPAL BARIK.jpeg',instagram:'https://www.instagram.com/itz_krishna.x03', featured:false },
    // Gaming
    { _id:'12', name:'SHRAYAN MISHRA',  designation:'Domain Lead', domain:'Gaming', image:'/SHRAYAN MISHRA.jpeg', instagram:'https://www.instagram.com/shrayan._.music', featured:false },
    { _id:'13', name:'SUPRODIPTO DAS', designation:'Domain Lead', domain:'Gaming', image:'/Suprodipto Das.jpeg', instagram:'https://www.instagram.com/sup_is_pro', featured:false },
    // Innovation and Management
    { _id:'14', name:'SHAMARTHI BASU', designation:'Domain Lead',      domain:'Innovation and Management', image:'/SHAMARTHI BASU.jpeg', instagram:'https://www.instagram.com/_shamarthi_', featured:false },
    { _id:'15', name:'KHUSHI KUMARI',  designation:'Point of Contact', domain:'Innovation and Management', image:'/KHUSHI KUMARI.jpeg',  instagram:'https://www.instagram.com/khushi.__.s', featured:false },
    // Mechmania
    { _id:'16', name:'DEBJIT PAUL',       designation:'Domain Lead',      domain:'Mechmania', image:'/Debjit Paul.jpeg',       instagram:'https://www.instagram.com/_pdeb.9304', featured:false },
    { _id:'17', name:'ARUNANGSHU HALDER', designation:'Point of Contact', domain:'Mechmania', image:'/ARUNANGSHU HALDER.jpeg', instagram:'https://www.instagram.com/_mr_greyyy', featured:false },
    // Designing
    { _id:'20',   name:'ZAYDAN ASAD', designation:'Point of Contact', domain:'Designing', image:'/Zaydan Asad.jpeg', instagram:'https://www.instagram.com/jet__skiii', featured:false },
    { _id:'20.1', name:'SAYAK PAUL',  designation:'Point of Contact', domain:'Designing', image:'/SAYAK PAUL.jpeg',  instagram:'https://www.instagram.com/alor_filament_', featured:false },
    // Public & Relations
    { _id:'21',   name:'SHREYOSEE DHAR', designation:'Domain Lead',      domain:'Public & Relations', image:'/Shreyosee.jpg',      instagram:'https://www.instagram.com/paintmyclouds', featured:false },
    { _id:'21.1', name:'RAUNAK DUTTA',   designation:'Point of Contact', domain:'Public & Relations', image:'/RAUNAK DUTTA.jpeg',  instagram:'https://www.instagram.com/raunak_dutta10', featured:false },
    // Computing
    { _id:'25', name:'ADARSH GUPTA', designation:'Point of Contact', domain:'Computing', image:'/ADARSH GUPTA.jpeg', instagram:'https://www.instagram.com/aaryan._.khan', featured:false },
  ];

  const CoreTeams: TeamMember[] = [
    { _id:'ct1',  name:'OLIVIA SAHA',          designation:'Member', domain:'Core Team', image:'/Olivia Saha.jpeg',        instagram:'https://www.instagram.com/olivia_saha_03', featured:false },
    { _id:'ct2',  name:'DEBASISH CHOWDHURY',   designation:'Member', domain:'Core Team', image:'/Debasish Chowdhury.jpeg', instagram:'https://www.instagram.com/debasish.chowdhury.3367174', featured:false },
    { _id:'ct3',  name:'RAJ KUMAR',            designation:'Member', domain:'Core Team', image:'/RAJ KUMARR.jpeg',         instagram:'https://www.instagram.com/raaaaj.k', featured:false },
    { _id:'ct4',  name:'Asmita Mallick',       designation:'Member', domain:'Core Team', image:'/Asmita.jpg', featured:false },
    { _id:'ct5',  name:'Animesh Maity',        designation:'Member', domain:'Core Team', image:'/animesh.jpg', featured:false },
    { _id:'ct6',  name:'Anirban Mallick',      designation:'Member', domain:'Core Team', image:'/Ani.JPG', featured:false },
    { _id:'ct7',  name:'Anuhya Bose',          designation:'Member', domain:'Core Team', image:'/Anuhya.JPG', featured:false },
    { _id:'ct8',  name:'Joydwipta Basak',      designation:'Member', domain:'Core Team', image:'/Joydwipta.jpg', featured:false },
    { _id:'ct9',  name:'Subhadeep Mondal',     designation:'Member', domain:'Core Team', image:'/Subhodeep.jpg', featured:false },
    { _id:'ct10', name:'Aditya Chowdhury',     designation:'Member', domain:'Core Team', image:'/Aditya.jpg', featured:false },
    { _id:'ct11', name:'Sandipto Das',         designation:'Member', domain:'Core Team', image:'/Sandipto.jpg', linkedin:'https://www.linkedin.com/in/sandipto-das-1bbb191b8', instagram:'https://www.instagram.com/the_menacing_mind', featured:false },
    { _id:'ct12', name:'Anushmita Saha',       designation:'Member', domain:'Core Team', image:'/Anushmita.jpg', featured:false },
    { _id:'ct13', name:'Rani Bhattacharya',    designation:'Member', domain:'Core Team', image:'/Rani .jpg', featured:false },
    { _id:'ct14', name:'Adwitiya Santra',      designation:'Member', domain:'Core Team', image:'/Adwitiya .jpg', featured:false },
    { _id:'ct15', name:'Pritha Guha Thakurta', designation:'Member', domain:'Core Team', image:'/Pritha.jpg', featured:false },
    { _id:'ct16', name:'Soumyadeep Saha',      designation:'Member', domain:'Core Team', image:'/Soumyadeep.jpg', featured:false },
    { _id:'ct17', name:'Istuti Sharma',        designation:'Member', domain:'Core Team', image:'/Istuti.jpeg', featured:false },
  ];

  const managementLeads = teams.filter(m => m.domain === 'Management');
  const executiveLeads  = teams.filter(m => m.domain === 'Executive');
  const domainOrder = ['Robotics','Fun Events','Gaming','Innovation and Management','Mechmania','Designing','Public & Relations','Computing'];

  return (
    <>
      <style>{styles}</style>
      <div>
        <div className="background" />
        <section className="teams-section" style={{ fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem 1rem 4rem' }}>

            {/* Hero */}
            <div ref={heroRef} className="rv" style={{ maxWidth:740, marginBottom:'3.5rem' }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(2rem,5vw,2.9rem)', fontWeight:800, marginBottom:'1rem', color:'#f1f5f9', letterSpacing:'-.02em', lineHeight:1.1 }}>
                Team
              </h2>
              <p style={{ fontSize:'clamp(.93rem,2.4vw,1.07rem)', lineHeight:1.78, color:'#94a3b8' }}>
                At the helm of Techno Vivarta, you&apos;ll find our invaluable core team — a dedicated group of individuals who serve as the driving force behind our community&apos;s growth and success. With a shared passion for technology and innovation, they provide the leadership and inspiration needed to navigate the ever-evolving tech landscape.
              </p>
            </div>

            {/* Leads heading */}
            <div ref={useReveal(.1)} className="rv-s" style={{ marginBottom:'.4rem' }}>
              <div className="sec-title">Meet our Leads</div>
            </div>

            {/* Legend */}
            <div className="legend">
              <div className="leg-item"><div className="leg-dot dot-lead"/><span>Lead / Domain Lead</span></div>
              <div className="leg-item"><div className="leg-dot dot-poc" /><span>Point of Contact</span></div>
            </div>

            {/* Management */}
            <div ref={mgmtLabel} className="rv sub-label">Management</div>
            <div ref={mgmtGrid}  className="sg tg">
              {managementLeads.map(m => <MemberCard key={m._id} member={m} variant="lead" />)}
            </div>

            {/* Executive */}
            <div ref={execLabel} className="rv sub-label">Executive</div>
            <div ref={execGrid}  className="sg tg">
              {executiveLeads.map(m => <MemberCard key={m._id} member={m} variant="lead" />)}
            </div>

            {/* Domain Leads heading */}
            <div ref={domTitle} className="rv-s" style={{ marginTop:'1rem', marginBottom:'1.6rem' }}>
              <div className="sec-title" style={{ fontSize:'clamp(1.2rem,3vw,1.65rem)' }}>Domain Leads</div>
            </div>

            {domainOrder.map(d => (
              <DomainSection key={d} domain={d} members={teams.filter(m => m.domain === d)} />
            ))}

            {/* Core Team */}
            <div ref={coreTitle} className="rv-s" style={{ marginTop:'2rem', marginBottom:'1.6rem' }}>
              <div className="sec-title">Meet our Core Team</div>
            </div>

            {/* Core legend */}
            <div className="legend" style={{ marginBottom:'1.5rem' }}>
              <div className="leg-item"><div className="leg-dot dot-core"/><span>Core Team Member</span></div>
            </div>

            <div ref={coreGrid} className="sg tg">
              {CoreTeams.map(m => <MemberCard key={m._id} member={m} variant="core" />)}
            </div>

          </div>
        </section>
      </div>
    </>
  );
}

export default Team;
