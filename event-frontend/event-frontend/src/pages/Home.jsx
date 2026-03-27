import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Theme ──
const theme = {
  bg: "#080810",
  surface: "#0f0f1a",
  card: "#12121f",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.14)",
  purple: "#6d28d9",
  purpleMid: "#7c3aed",
  purpleLight: "#a78bfa",
  accent: "#c084fc",
  accentWarm: "#e879f9",
  text: "#f4f4f8",
  muted: "#7070a0",
  mutedLight: "#9898c0",
};

// ── Global Styles ──
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${theme.bg};
    color: ${theme.text};
    font-family: 'Outfit', sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes floatA {
    0%, 100% { transform: translate(0,0) scale(1); }
    40%       { transform: translate(-18px,-24px) scale(1.04); }
    70%       { transform: translate(12px,10px) scale(0.97); }
  }
  @keyframes floatB {
    0%, 100% { transform: translate(0,0) scale(1); }
    30%       { transform: translate(20px,-14px) scale(1.05); }
    65%       { transform: translate(-10px,18px) scale(0.96); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.75); }
  }
  @keyframes shimmer {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes borderGlow {
    0%, 100% { box-shadow: 0 0 0px rgba(124,58,237,0); }
    50%       { box-shadow: 0 0 24px rgba(124,58,237,0.25); }
  }

  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.75s cubic-bezier(.16,1,.3,1), transform 0.75s cubic-bezier(.16,1,.3,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .nav-link {
    color: ${theme.muted};
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    transition: color 0.2s ease;
    cursor: pointer;
  }
  .nav-link:hover { color: ${theme.text}; }

  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: ${theme.purpleMid};
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 12px 26px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
    box-shadow: 0 4px 20px rgba(109,40,217,0.35);
  }
  .cta-primary:hover {
    background: #8b5cf6;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(109,40,217,0.45);
  }

  .cta-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: ${theme.mutedLight};
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 11px 24px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s, transform 0.2s;
  }
  .cta-ghost:hover {
    color: ${theme.text};
    border-color: rgba(255,255,255,0.22);
    transform: translateY(-2px);
  }

  .explore-tile {
    position: relative;
    border-radius: 18px;
    padding: 52px 44px;
    border: 1px solid ${theme.border};
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(.16,1,.3,1), border-color 0.3s, box-shadow 0.3s;
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .explore-tile:hover {
    transform: translateY(-8px);
  }
  .explore-tile .tile-bg-icon {
    position: absolute;
    right: -16px; bottom: -20px;
    font-size: 130px;
    opacity: 0.05;
    transition: transform 0.4s ease, opacity 0.3s;
    user-select: none;
    pointer-events: none;
  }
  .explore-tile:hover .tile-bg-icon {
    transform: scale(1.12) rotate(6deg);
    opacity: 0.09;
  }
  .explore-tile .tile-arrow {
    transition: transform 0.22s ease;
  }
  .explore-tile:hover .tile-arrow { transform: translateX(5px); }

  .feature-item:hover { background: #17172a !important; }

  .club-card-wrap:hover .club-card-inner {
    transform: translateY(-6px);
    border-color: rgba(124,58,237,0.4) !important;
    box-shadow: 0 20px 48px rgba(109,40,217,0.15);
  }
  .club-card-inner {
    transition: transform 0.3s cubic-bezier(.16,1,.3,1), border-color 0.3s, box-shadow 0.3s;
  }

  /* Noise texture overlay */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }
`;

// ── useReveal ──
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── useCounter ──
function useCounter(target, suffix = "", decimals = 0, trigger) {
  const [val, setVal] = useState("0" + suffix);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const duration = 1600;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = decimals ? (ease * target).toFixed(decimals) : Math.floor(ease * target);
      setVal(v + suffix);
      if (p < 1) requestAnimationFrame(step);
      else setVal(target + suffix);
    };
    requestAnimationFrame(step);
  }, [trigger]);
  return val;
}

// ── StatPill ──
function StatPill({ label, target, suffix, decimals, trigger, last }) {
  const val = useCounter(target, suffix, decimals, trigger);
  return (
    <div style={{
      padding: "22px 44px",
      textAlign: "center",
      flex: 1,
      borderRight: last ? "none" : `1px solid ${theme.border}`,
    }}>
      <div style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "2rem",
        fontWeight: 400,
        fontStyle: "italic",
        background: `linear-gradient(120deg, #fff 20%, ${theme.accent})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: trigger ? "countUp 0.4s ease both" : "none",
        letterSpacing: "-0.02em",
      }}>{val}</div>
      <div style={{
        fontSize: "0.72rem",
        color: theme.muted,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginTop: 4,
        fontWeight: 500,
      }}>{label}</div>
    </div>
  );
}

// ── ExploreTile ──
function ExploreTile({ label, title, desc, cta, bgIcon, variant, onClick }) {
  const isClubs = variant === "clubs";
  const color = isClubs ? theme.purpleLight : theme.accentWarm;
  const tagBg = isClubs ? "rgba(167,139,250,0.12)" : "rgba(232,121,249,0.12)";
  const borderHover = isClubs ? "rgba(167,139,250,0.35)" : "rgba(232,121,249,0.3)";
  const glowColor = isClubs ? "rgba(124,58,237,0.2)" : "rgba(232,121,249,0.16)";
  const gradFrom = isClubs ? "#14102b" : "#1a0f2b";

  return (
    <div
      className="explore-tile"
      onClick={onClick}
      style={{
        background: `linear-gradient(145deg, ${gradFrom} 0%, ${theme.bg} 100%)`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = borderHover;
        e.currentTarget.style.boxShadow = `0 24px 64px ${glowColor}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = theme.border;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="tile-bg-icon">{bgIcon}</div>

      <span style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 6,
        fontSize: "0.68rem",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 22,
        background: tagBg,
        color,
      }}>{label}</span>

      <h3 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "2.2rem",
        fontWeight: 400,
        fontStyle: "italic",
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        marginBottom: 14,
        color: theme.text,
      }}>{title}</h3>

      <p style={{
        color: theme.muted,
        fontSize: "0.92rem",
        lineHeight: 1.7,
        maxWidth: 300,
      }}>{desc}</p>

      <div style={{
        marginTop: 32,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        color,
        fontSize: "0.875rem",
        fontWeight: 500,
      }}>
        {cta}
        <span className="tile-arrow" style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: tagBg,
          fontSize: "0.85rem",
        }}>→</span>
      </div>
    </div>
  );
}

// ── FeatureItem ──
function FeatureItem({ icon, iconBg, title, desc }) {
  return (
    <div className="feature-item" style={{
      padding: "38px 34px",
      background: theme.card,
      transition: "background 0.25s",
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25rem",
        marginBottom: 18,
        background: iconBg,
      }}>{icon}</div>
      <h4 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "1rem",
        fontWeight: 600,
        marginBottom: 10,
        color: theme.text,
        letterSpacing: "-0.01em",
      }}>{title}</h4>
      <p style={{ color: theme.muted, fontSize: "0.875rem", lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

// ── ClubPreviewCard ──
function ClubPreviewCard({ bg, name, tagline, members, logoContent }) {
  return (
    <div className="club-card-wrap" style={{ cursor: "pointer" }}>
      <div className="club-card-inner" style={{
        borderRadius: 14,
        overflow: "hidden",
        background: theme.card,
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{
          width: "100%",
          height: 170,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>{logoContent}</div>
        <div style={{ padding: "18px 20px 20px" }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 600,
            marginBottom: 5,
            color: theme.text,
          }}>{name}</div>
          <div style={{
            fontSize: "0.8rem",
            color: theme.muted,
            lineHeight: 1.55,
          }}>{tagline}</div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginTop: 14,
            paddingTop: 14,
            borderTop: `1px solid ${theme.border}`,
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: theme.purpleLight,
              animation: "pulse 2.5s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "0.75rem", color: theme.muted }}>{members} members</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section Label ──
function SectionLabel({ text }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontSize: "0.7rem",
      fontWeight: 600,
      color: theme.purpleLight,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      marginBottom: 18,
    }}>
      <span style={{ display: "block", width: 24, height: 2, background: `linear-gradient(90deg, ${theme.purpleMid}, transparent)`, borderRadius: 2 }} />
      {text}
    </div>
  );
}

// ── MAIN ──
export default function EventopiaHome() {
  const navigate = useNavigate();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(),
        r4 = useReveal(), r5 = useReveal(), r6 = useReveal(),
        r7 = useReveal(), r8 = useReveal();

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goToDashboard = () => navigate("/dashboard");

  return (
    <>
      <style>{globalStyles}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 52px",
        height: 68,
        background: "rgba(8,8,16,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${theme.border}`,
      }}>
        {/* Logo */}
        <span style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "1.45rem",
          fontWeight: 400,
          fontStyle: "italic",
          background: `linear-gradient(120deg, #fff 30%, ${theme.accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.01em",
          cursor: "pointer",
        }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Eventopia
        </span>

        {/* spacer */}
        <div />

        {/* Right */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="cta-primary" onClick={() => navigate("/")} style={{ padding: "9px 22px", fontSize: "0.875rem" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "130px 24px 90px",
        overflow: "hidden",
        background: theme.bg,
      }}>
        {/* Mesh glows */}
        <div style={{
          position: "absolute",
          width: 800,
          height: 600,
          background: "radial-gradient(ellipse at 50% 40%, rgba(109,40,217,0.14) 0%, transparent 65%)",
          top: -60,
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          animation: "floatA 14s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          width: 500,
          height: 400,
          background: "radial-gradient(ellipse, rgba(192,132,252,0.08) 0%, transparent 70%)",
          bottom: 60,
          right: "8%",
          pointerEvents: "none",
          animation: "floatB 18s ease-in-out infinite",
        }} />

        {/* Decorative lines */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 16px",
          borderRadius: 100,
          background: "rgba(109,40,217,0.12)",
          border: "1px solid rgba(124,58,237,0.25)",
          fontSize: "0.72rem",
          fontWeight: 600,
          color: theme.purpleLight,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          marginBottom: 32,
          animation: "fadeUp 0.7s ease both",
        }}>
          <span style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: theme.accentWarm,
            animation: "pulse 2s ease-in-out infinite",
          }} />
          Your Campus. Your Community.
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(3.2rem, 7.5vw, 7rem)",
          fontWeight: 400,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
          maxWidth: 980,
          animation: "fadeUp 0.7s 0.1s ease both",
          animationFillMode: "both",
          color: theme.text,
        }}>
          One Platform for{" "}
          <span style={{
            fontStyle: "italic",
            background: `linear-gradient(110deg, ${theme.purpleLight} 10%, ${theme.accentWarm} 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Every Event &amp; Club</span>
        </h1>

        {/* Subtext */}
        <p style={{
          marginTop: 24,
          maxWidth: 520,
          fontSize: "1.05rem",
          fontWeight: 300,
          color: theme.muted,
          lineHeight: 1.75,
          animation: "fadeUp 0.7s 0.2s ease both",
          animationFillMode: "both",
          letterSpacing: "0.01em",
        }}>
          Discover, join, and manage campus clubs and events — all in one
          beautifully unified space built for students.
        </p>

        {/* CTAs */}
        <div style={{
          marginTop: 44,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "center",
          animation: "fadeUp 0.7s 0.3s ease both",
          animationFillMode: "both",
        }}>
          <button className="cta-primary" onClick={() => navigate("/login")} style={{ padding: "13px 30px", fontSize: "0.935rem" }}>
            Explore Now →
          </button>
          <a href="#features" className="cta-ghost" style={{ padding: "13px 28px", fontSize: "0.935rem" }}>
            See Features
          </a>
        </div>

        {/* Stats Bar */}
        <div ref={statsRef} style={{
          marginTop: 72,
          display: "flex",
          alignItems: "stretch",
          background: "rgba(15,15,26,0.8)",
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          overflow: "hidden",
          backdropFilter: "blur(12px)",
          animation: "fadeUp 0.7s 0.4s ease both",
          animationFillMode: "both",
        }}>
          <StatPill label="Active Clubs"    target={24}  suffix="+"  trigger={statsVisible} />
          <StatPill label="Events Hosted"   target={120} suffix="+"  trigger={statsVisible} />
          <StatPill label="Students"        target={3.2} suffix="K"  decimals={1} trigger={statsVisible} />
          <StatPill label="Departments"     target={15}  suffix="+"  trigger={statsVisible} last />
        </div>
      </section>

      {/* ── EXPLORE ── */}
      <section id="explore" style={{ padding: "110px 0", background: theme.bg }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 52px" }}>
          <div ref={r1} className="reveal">
            <SectionLabel text="Discover" />
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)",
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: theme.text,
            }}>Everything Starts Here</h2>
            <p style={{
              marginTop: 14,
              fontSize: "0.95rem",
              color: theme.muted,
              maxWidth: 480,
              lineHeight: 1.7,
            }}>
              Find your tribe, attend the events that matter, and make your campus experience unforgettable.
            </p>
          </div>

          <div ref={r2} className="reveal" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 22,
            marginTop: 52,
          }}>
            <ExploreTile
              variant="clubs"
              label="Clubs"
              bgIcon="🏛️"
              title="Explore All Clubs"
              desc="Browse through all student clubs, from technical societies to cultural groups. Find where you belong."
              cta="Browse Clubs"
              onClick={() => navigate("/login")}
            />
            <ExploreTile
              variant="events"
              label="Events"
              bgIcon="🎉"
              title="Explore All Events"
              desc="From hackathons to cultural fests — discover upcoming events and never miss what's happening around campus."
              cta="Browse Events"
              onClick={() => navigate("/login")}
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "110px 0", background: theme.surface }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 52px" }}>
          <div ref={r3} className="reveal">
            <SectionLabel text="Why Eventopia" />
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)",
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "-0.03em",
              color: theme.text,
            }}>Built for Campus Life</h2>
            <p style={{ marginTop: 14, fontSize: "0.95rem", color: theme.muted, maxWidth: 460, lineHeight: 1.7 }}>
              Everything you need to stay connected, organized, and in the loop.
            </p>
          </div>

          <div ref={r4} className="reveal" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            marginTop: 52,
            borderRadius: 18,
            overflow: "hidden",
            border: `1px solid ${theme.border}`,
          }}>
            {[
              { icon: "🔍", bg: "rgba(124,58,237,0.15)", title: "Smart Discovery",   desc: "Instantly search and filter clubs and events. Find exactly what you're looking for in seconds." },
              { icon: "📅", bg: "rgba(192,132,252,0.12)", title: "Event Management",  desc: "Organize registrations, track attendance, and manage everything from one sleek dashboard." },
              { icon: "👥", bg: "rgba(96,165,250,0.12)",  title: "Club Hub",          desc: "Create and manage your club, post updates, and grow your community with powerful tools." },
              { icon: "🔔", bg: "rgba(192,132,252,0.12)", title: "Live Updates",      desc: "Real-time notifications about events you care about — never miss an announcement again." },
              { icon: "🏆", bg: "rgba(124,58,237,0.15)", title: "Achievements",       desc: "Track participation history, earn badges, and build your campus profile over time." },
              { icon: "⚡", bg: "rgba(96,165,250,0.12)",  title: "Admin Controls",    desc: "Powerful admin tools to manage clubs, events, and users with full control and clarity." },
            ].map(f => (
              <FeatureItem key={f.title} icon={f.icon} iconBg={f.bg} title={f.title} desc={f.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CLUBS PREVIEW ── */}
      <section style={{ padding: "110px 0", background: theme.bg }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 52px" }}>
          <div ref={r5} className="reveal" style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}>
            <div>
              <SectionLabel text="Featured Clubs" />
              <h2 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)",
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "-0.03em",
                color: theme.text,
              }}>Top Clubs on Campus</h2>
            </div>
            <button className="cta-ghost" onClick={() => navigate("/login")}>
              View All Clubs →
            </button>
          </div>

          
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "80px 0", background: theme.bg }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 52px" }}>
          <div ref={r7} className="reveal" style={{
            borderRadius: 22,
            padding: "76px 64px",
            background: "linear-gradient(140deg, #160f35 0%, #0e0c24 50%, #160f35 100%)",
            border: "1px solid rgba(109,40,217,0.22)",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}>
            {/* glow */}
            <div style={{
              position: "absolute",
              top: -100,
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 350,
              background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            {/* grid pattern */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
              pointerEvents: "none",
              opacity: 0.6,
            }} />

            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(1.9rem, 3.8vw, 3.2rem)",
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 16,
              position: "relative",
              color: theme.text,
            }}>
              Ready to Make<br />Your Mark?
            </h2>
            <p style={{
              color: theme.muted,
              fontSize: "0.95rem",
              lineHeight: 1.75,
              maxWidth: 440,
              margin: "0 auto 38px",
              position: "relative",
            }}>
              Join thousands of students already using Eventopia to discover clubs,
              attend events, and build lasting connections.
            </p>
            <div style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              position: "relative",
            }}>
              <button className="cta-primary" onClick={() => navigate("/")} style={{ padding: "13px 30px" }}>
                Go to Dashboard →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${theme.border}`,
        padding: "38px 0",
        background: theme.bg,
      }}>
        <div ref={r8} style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "0 52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 18,
        }}>
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "1.2rem",
            fontStyle: "italic",
            background: `linear-gradient(120deg, #fff, ${theme.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Eventopia</span>

          <ul style={{ display: "flex", gap: 28, listStyle: "none", flexWrap: "wrap" }}>
            {[
              { label: "Browse Clubs & Events", action: () => navigate("/login") },
            ].map(item => (
              <li key={item.label}>
                <span
                  onClick={item.action}
                  className="nav-link"
                  style={{ fontSize: "0.82rem", cursor: "pointer" }}
                >{item.label}</span>
              </li>
            ))}
          </ul>

          <span style={{ fontSize: "0.78rem", color: theme.muted }}>
            © 2026 Eventopia · DYPDPU
          </span>
        </div>
      </footer>
    </>
  );
}