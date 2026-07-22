import { supabase } from './supabaseClient';

import { useState, useEffect, useRef, useCallback } from "react";

const BRAND = { name: "AetherForge", tagline: "Institutional-Grade Trading Returns for Everyone", since: "2019" };

const PALETTE = {
  void: "#080C18", navy: "#0D1526", navyLight: "#131F35", steel: "#1A3050",
  teal: "#00D4AA", tealDim: "#009E80", gold: "#C9A84C", goldLight: "#E8C96E",
  text: "#E8EDF5", textMuted: "#8892A4", textDim: "#4A5568",
  danger: "#F56565", success: "#48BB78",
};

const CRYPTO_ASSETS = [
  { sym: "BTC/USD", price: 67842.30, chg: +2.14 }, { sym: "ETH/USD", price: 3521.88, chg: -0.87 },
  { sym: "SOL/USD", price: 182.44, chg: +5.32 }, { sym: "BNB/USD", price: 608.12, chg: +1.09 },
  { sym: "XRP/USD", price: 0.6218, chg: -1.44 }, { sym: "MATIC/USD", price: 0.9871, chg: +3.77 },
  { sym: "DOGE/USD", price: 0.1634, chg: -2.11 }, { sym: "ADA/USD", price: 0.5922, chg: +0.88 },
  { sym: "LTC/USD", price: 94.38, chg: -0.33 }, { sym: "AVAX/USD", price: 38.92, chg: +4.15 },
  { sym: "EUR/USD", price: 1.0842, chg: +0.12 }, { sym: "GBP/USD", price: 1.2714, chg: -0.08 },
  { sym: "GOLD/USD", price: 2341.60, chg: +0.55 }, { sym: "LINK/USD", price: 18.74, chg: +6.22 },
  { sym: "DOT/USD", price: 8.93, chg: -1.02 },
];

const PLANS = [
  { id: "silver", name: "Silver", min: 50, max: 400, daily: 2.5, duration: 3, color: "#A8B2C1", features: ["Basic AI Trading", "Email Support", "Daily Reports"] },
  { id: "gold", name: "Gold", min: 900, max: 1400, daily: 3.8, duration: 5, color: "#C9A84C", features: ["Advanced AI Trading", "Priority Support", "Daily Reports", "Market Insights"] },
  { id: "platinum", name: "Platinum", min: 1900, max: 2400, daily: 5.2, duration: 7, color: "#A0C4FF", features: ["Premium AI Suite", "24/7 Support", "Real-time Analytics", "Market Insights", "Dedicated Manager"] },
  { id: "diamond", name: "Diamond", min: 2900, max: 3400, daily: 6.8, duration: 10, color: "#B9F2FF", features: ["Elite AI Trading", "VIP Support", "Advanced Analytics", "Private Signals", "Account Manager", "Weekly Review"] },
  { id: "elite", name: "Elite", min: 3900, max: 4900, daily: 8.5, duration: 14, color: "#FF9CEE", features: ["Institutional Suite", "White-glove Support", "Full Analytics", "Exclusive Signals", "Senior Manager", "Tax Reports"] },
  { id: "vip", name: "VIP", min: 5400, max: 7900, daily: 10.2, duration: 21, color: "#00D4AA", features: ["Ultra AI Engine", "Dedicated Team", "Live Dashboard", "Block Trade Access", "C-Suite Advisor", "Tax + Legal"] },
  { id: "enterprise", name: "Enterprise", min: 8400, max: 12900, daily: 12.5, duration: 30, color: "#FFD700", features: ["Full HFT Access", "Private Desk", "Custom Dashboard", "OTC Trading", "Portfolio Rebalancing", "Full Compliance Suite"] },
  { id: "sovereign", name: "Sovereign", min: 13400, max: 50000, daily: 15.0, duration: 45, color: "#FF6B6B", features: ["Sovereign Desk", "Personal Quant Trader", "Bespoke Strategy", "Multi-asset Exposure", "Family Office Support", "Annual Performance Audit"] },
];

const CRYPTO_WALLETS = [
  { id: "btc", name: "Bitcoin", sym: "BTC", network: "Bitcoin Network", addr: "bc1q7qun0kvg94ycsq5qqm5unrl5n4hn0x70d46ehy", color: "#F7931A", icon: "₿" },
  { id: "eth", name: "Ethereum", sym: "ETH", network: "ERC-20", addr: "0xeFE806c661E32f152d3303b5D63212411aF49fE3", color: "#627EEA", icon: "Ξ" },
  { id: "usdt", name: "Tether USDT", sym: "USDT", network: "TRC-20 (Recommended - Low Fee)", addr: "TEGtt56SKPkg581qXEUWFCaeaBrWitzzqH", color: "#26A17B", icon: "₮" },
  { id: "bnb", name: "BNB", sym: "BNB", network: "BEP-20", addr: "0xeFE806c661E32f152d3303b5D63212411aF49fE3", color: "#F3BA2F", icon: "B" },
  { id: "sol", name: "Solana", sym: "SOL", network: "Solana Network", addr: "5Ne5A2684sieZnhSUxwJWyzZksipAYuGBZMsvpNaPHvT", color: "#9945FF", icon: "◎" },
  { id: "usdc", name: "USD Coin", sym: "USDC", network: "ERC-20", addr: "0xeFE806c661E32f152d3303b5D63212411aF49fE3", color: "#2775CA", icon: "$" },
];

const TESTIMONIALS = [
  { name: "Jonathan Whitfield", loc: "London, UK", role: "Retired Banker", text: "My portfolio has grown 340% in 14 months. The platinum plan is exactly what I needed.", stars: 5, img: "JW" },
  { name: "Mei Lin Tan", loc: "Singapore", role: "Tech Entrepreneur", text: "Withdrawals hit my account within the same day, every time. Impressive infrastructure.", stars: 5, img: "ML" },
  { name: "Carlos Ruiz", loc: "Madrid, Spain", role: "Portfolio Manager", text: "Their AI signals have outperformed my own models 3 months running. Remarkable.", stars: 5, img: "CR" },
  { name: "Sarah O'Brien", loc: "Dublin, Ireland", role: "Freelance Consultant", text: "Started with Silver to test. Now on Diamond. Customer support is world-class.", stars: 5, img: "SO" },
];

const LIVE_TRADES = [
  { time: "14:23:41", asset: "BTC/USD", type: "BUY", entry: 67420.50, exit: 67842.30, pnl: +421.80, pct: +0.63 },
  { time: "14:18:09", asset: "ETH/USD", type: "SELL", entry: 3548.20, exit: 3521.88, pnl: +263.20, pct: +0.74 },
  { time: "14:12:55", asset: "SOL/USD", type: "BUY", entry: 174.20, exit: 182.44, pnl: +824.00, pct: +4.73 },
  { time: "14:07:33", asset: "EUR/USD", type: "BUY", entry: 1.0819, exit: 1.0842, pnl: +230.00, pct: +0.21 },
  { time: "13:58:17", asset: "GOLD/USD", type: "BUY", entry: 2328.40, exit: 2341.60, pnl: +1320.00, pct: +0.57 },
  { time: "13:44:02", asset: "BNB/USD", type: "SELL", entry: 615.80, exit: 608.12, pnl: +768.00, pct: +1.25 },
];

const STATS = [
  { label: "Total Users", value: "284K+", icon: "👥" },
  { label: "Volume Traded", value: "$4.8B+", icon: "📊" },
  { label: "Total Paid Out", value: "$892M+", icon: "💸" },
  { label: "Days Online", value: "1,947", icon: "⚡" },
];

const fmt = (n, d = 2) => n?.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "0.00";
const fmtUSD = (n) => "$" + fmt(n);

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

function useInterval(cb, delay) {
  const saved = useRef(cb);
  useEffect(() => { saved.current = cb; }, [cb]);
  useEffect(() => {
    if (!delay) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function usePrices() {
  const [prices, setPrices] = useState(CRYPTO_ASSETS);
  useInterval(() => {
    setPrices(prev => prev.map(a => ({
      ...a,
      price: +(a.price * (1 + (Math.random() - 0.499) * 0.0008)).toFixed(a.price > 100 ? 2 : 4),
      chg: +(a.chg + (Math.random() - 0.5) * 0.1).toFixed(2),
    })));
  }, 1800);
  return prices;
}

// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
const S = {
  glassCard: { background: "rgba(19,31,53,0.9)", border: "1px solid rgba(0,212,170,0.12)", borderRadius: 16 },
  tealBtn: { background: `linear-gradient(135deg,${PALETTE.teal},${PALETTE.tealDim})`, color: "#080C18", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", transition: "opacity .2s" },
  outlineBtn: { background: "transparent", color: PALETTE.teal, border: `1.5px solid ${PALETTE.teal}`, borderRadius: 10, fontWeight: 600, cursor: "pointer", transition: "opacity .2s" },
  input: { background: "rgba(13,21,38,0.9)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 10, color: PALETTE.text, padding: "13px 14px", fontSize: 15, width: "100%", boxSizing: "border-box", outline: "none" },
  badge: { background: "rgba(0,212,170,0.12)", border: "1px solid rgba(0,212,170,0.3)", color: PALETTE.teal, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "inline-block" },
  label: { fontSize: 13, color: PALETTE.textMuted, marginBottom: 6, display: "block", fontWeight: 500 },
};

// ── TICKER ───────────────────────────────────────────────────────────────────
function LiveTicker({ prices }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let x = 0, raf;
    const go = () => { x -= 0.5; if (Math.abs(x) >= el.scrollWidth / 2) x = 0; el.style.transform = `translateX(${x}px)`; raf = requestAnimationFrame(go); };
    raf = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf);
  }, []);
  const items = [...prices, ...prices];
  return (
    <div style={{ overflow: "hidden", background: "rgba(0,212,170,0.04)", borderBottom: "1px solid rgba(0,212,170,0.08)", padding: "9px 0", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(to right,${PALETTE.void},transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(to left,${PALETTE.void},transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div ref={ref} style={{ display: "flex", gap: 40, whiteSpace: "nowrap", willChange: "transform" }}>
        {items.map((a, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <span style={{ color: PALETTE.textMuted, fontWeight: 600 }}>{a.sym}</span>
            <span style={{ color: PALETTE.text, fontWeight: 700 }}>{a.price > 100 ? fmtUSD(a.price) : `$${a.price.toFixed(4)}`}</span>
            <span style={{ color: a.chg >= 0 ? PALETTE.success : PALETTE.danger, fontSize: 11 }}>{a.chg >= 0 ? "▲" : "▼"} {Math.abs(a.chg).toFixed(2)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, user, setUser, setShowAuth }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const navItems = ["Home", "About", "Plans", "Markets", "Dashboard", "Affiliate", "FAQ", "Contact"];

  return (
    <nav style={{ background: "rgba(8,12,24,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: isMobile ? 58 : 68 }}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${PALETTE.teal},#006B55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff" }}>⬡</div>
          <span style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800, letterSpacing: "-0.03em" }}>Aether<span style={{ color: PALETTE.teal }}>Forge</span></span>
        </div>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 2 }}>
            {navItems.map(n => (
              <button key={n} onClick={() => setPage(n.toLowerCase())} style={{ background: "none", border: "none", color: page === n.toLowerCase() ? PALETTE.teal : PALETTE.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "6px 11px", borderRadius: 8 }}>{n}</button>
            ))}
          </div>
        )}

        {/* Auth + hamburger */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!isMobile && (user ? (
            <>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${PALETTE.teal},#006B55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{user.name?.[0] ?? "U"}</div>
              <button onClick={() => setUser(null)} style={{ ...S.outlineBtn, padding: "7px 14px", fontSize: 13 }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowAuth("login")} style={{ ...S.outlineBtn, padding: "7px 14px", fontSize: 13 }}>Login</button>
              <button onClick={() => setShowAuth("register")} style={{ ...S.tealBtn, padding: "8px 16px", fontSize: 13 }}>Get Started</button>
            </>
          ))}
          {isMobile && (
            <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: PALETTE.text, fontSize: 22, cursor: "pointer", padding: 4 }}>{open ? "✕" : "☰"}</button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobile && open && (
        <div style={{ background: PALETTE.navy, borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16 }}>
          {navItems.map(n => (
            <div key={n} onClick={() => { setPage(n.toLowerCase()); setOpen(false); }} style={{ padding: "14px 20px", color: page === n.toLowerCase() ? PALETTE.teal : PALETTE.textMuted, fontSize: 15, fontWeight: 600, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{n}</div>
          ))}
          <div style={{ padding: "14px 16px", display: "flex", gap: 10 }}>
            {user ? (
              <button onClick={() => { setUser(null); setOpen(false); }} style={{ ...S.outlineBtn, flex: 1, padding: "12px 0", fontSize: 14 }}>Logout</button>
            ) : (
              <>
                <button onClick={() => { setShowAuth("login"); setOpen(false); }} style={{ ...S.outlineBtn, flex: 1, padding: "12px 0", fontSize: 14 }}>Login</button>
                <button onClick={() => { setShowAuth("register"); setOpen(false); }} style={{ ...S.tealBtn, flex: 2, padding: "12px 0", fontSize: 14 }}>Get Started</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ mode, onClose, onSuccess }) {
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const isMobile = useIsMobile();

  const handle = async () => {
    if (!form.email || !form.password) {
      setErr("Please fill required fields.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      if (tab === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        onSuccess({
          id: data.user.id,
          name: profile?.name || form.email.split("@")[0],
          email: data.user.email,
          balance: profile?.balance || 0
        });
      } else {
        // Register
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { name: form.name }
          }
        });

        if (error) throw error;

        alert("Registration successful! Please check your email to confirm (if enabled).");
        onClose();
      }
    } catch (error) {
      setErr(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", background: "rgba(8,12,24,0.85)", backdropFilter: "blur(8px)" }}>
      <div style={{ ...S.glassCard, width: "100%", maxWidth: isMobile ? "100%" : 440, padding: isMobile ? "28px 20px 40px" : 40, borderRadius: isMobile ? "20px 20px 0 0" : 16, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: PALETTE.textMuted, fontSize: 22, cursor: "pointer" }}>✕</button>

        {/* Rest of your UI stays the same */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 4 }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", background: tab === t ? PALETTE.teal : "transparent", color: tab === t ? "#080C18" : PALETTE.textMuted, transition: "all .2s" }}>{t === "login" ? "Sign In" : "Register"}</button>
          ))}
        </div>

        {/* ... keep the rest of your AuthModal JSX exactly the same ... */}
        {/* Just replace the handle function above */}
      </div>
    </div>
  );
}

// ── PLAN CARD ────────────────────────────────────────────────────────────────
function PlanCard({ plan, onSelect }) {
  const [hover, setHover] = useState(false);
  const totalReturn = plan.daily * plan.duration;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ ...S.glassCard, padding: "22px 20px", transition: "all .25s", transform: hover ? "translateY(-3px)" : "none", boxShadow: hover ? `0 16px 48px rgba(0,0,0,0.4),0 0 0 1px ${plan.color}40` : "none", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${plan.color},${plan.color}40)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: PALETTE.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Investment Plan</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: plan.color }}>{plan.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: PALETTE.teal }}>{plan.daily}%</div>
          <div style={{ fontSize: 11, color: PALETTE.textMuted }}>Daily ROI</div>        </div>
      </div>
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13 }}>
        {[["Range", `${fmtUSD(plan.min)} – ${fmtUSD(plan.max)}`], ["Duration", `${plan.duration} Days`], ["Total Return", `+${totalReturn.toFixed(1)}%`]].map(([l, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < 2 ? 8 : 0 }}>
            <span style={{ color: PALETTE.textMuted }}>{l}</span>
            <span style={{ fontWeight: 700, color: i === 2 ? PALETTE.success : PALETTE.text }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 18 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
            <span style={{ color: PALETTE.teal, fontSize: 13, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 13, color: PALETTE.textMuted }}>{f}</span>
          </div>
        ))}
      </div>
      <button onClick={() => onSelect(plan)} style={{ ...S.tealBtn, width: "100%", padding: "13px 0", fontSize: 14 }}>Choose {plan.name}</button>
    </div>
  );
}

// ── PAGES ────────────────────────────────────────────────────────────────────
function HomePage({ prices, setPage, setShowAuth, setSelectedPlan }) {
  const isMobile = useIsMobile();

  return (
    <div>
      {/* HERO */}
      <div style={{ position: "relative", minHeight: isMobile ? "80vh" : "88vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: isMobile ? "60px 20px 48px" : "80px 24px 64px", background: "radial-gradient(ellipse 80% 60% at 50% -10%,rgba(0,212,170,0.12) 0%,transparent 60%)" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(${PALETTE.teal} 1px,transparent 1px),linear-gradient(90deg,${PALETTE.teal} 1px,transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 800, width: "100%" }}>
          <div style={{ ...S.badge, marginBottom: 18 }}>FCA Regulated · MAS Licensed · Est. 2019</div>
          <h1 style={{ fontSize: isMobile ? "clamp(30px,9vw,42px)" : "clamp(42px,5.5vw,72px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 20, background: `linear-gradient(135deg,#E8EDF5 0%,#E8EDF5 40%,${PALETTE.teal} 65%,${PALETTE.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Institutional-Grade<br />Trading Returns<br /><span style={{ fontStyle: "italic" }}>for Everyone.</span>
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 17, color: PALETTE.textMuted, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.75 }}>
            AI-powered strategies used by hedge funds — starting from just $50. Compliant, transparent, and proven.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowAuth("register")} style={{ ...S.tealBtn, padding: isMobile ? "14px 28px" : "15px 36px", fontSize: isMobile ? 15 : 16 }}>Start Investing →</button>
            <button onClick={() => setPage("plans")} style={{ ...S.outlineBtn, padding: isMobile ? "14px 28px" : "15px 36px", fontSize: isMobile ? 15 : 16 }}>View Plans</button>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 16 : 28, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
            {[["🏛️", "FCA & MAS Regulated"], ["⚡", "Same-Day Withdrawals"], ["🔒", "AES-256 Encrypted"], ["🤖", "AI Trading Engine"]].map(([ic, t]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: PALETTE.textMuted, fontSize: isMobile ? 12 : 13 }}><span>{ic}</span><span>{t}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: PALETTE.navyLight, borderTop: "1px solid rgba(0,212,170,0.1)", borderBottom: "1px solid rgba(0,212,170,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "32px 16px" : "52px 24px", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 24 : 0 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px 12px", borderRight: !isMobile && i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ fontSize: isMobile ? 28 : 40, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: isMobile ? 22 : 36, fontWeight: 900, color: PALETTE.teal, letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ color: PALETTE.textMuted, fontSize: 13, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PLANS PREVIEW */}
      <div style={{ background: PALETTE.navyLight, padding: isMobile ? "48px 16px" : "72px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={S.badge}>Investment Plans</div>
            <h2 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 10 }}>Choose Your Path to Returns</h2>
            <div style={{ color: PALETTE.textMuted, fontSize: isMobile ? 13 : 15 }}>Daily compounding returns. Principal protected.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
            {PLANS.slice(0, isMobile ? 3 : 4).map(p => (
              <PlanCard key={p.id} plan={p} onSelect={(plan) => { setSelectedPlan(plan); setPage("payment"); }} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button onClick={() => setPage("plans")} style={{ ...S.outlineBtn, padding: "13px 36px", fontSize: 14 }}>View All 8 Plans →</button>
          </div>
        </div>
      </div>

      {/* LIVE TRADES */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "48px 16px" : "72px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={S.badge}>Live Activity</div>
            <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, marginTop: 10 }}>Recent Platform Trades</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE.success, display: "inline-block" }} />
            <span style={{ color: PALETTE.success, fontSize: 13 }}>Live</span>
          </div>
        </div>
        {isMobile ? (
          // Mobile card layout for trades
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {LIVE_TRADES.map((t, i) => (
              <div key={i} style={{ ...S.glassCard, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{t.asset}</span>
                    <span style={{ background: t.type === "BUY" ? "rgba(72,187,120,0.15)" : "rgba(245,101,101,0.15)", color: t.type === "BUY" ? PALETTE.success : PALETTE.danger, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{t.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: PALETTE.textMuted, fontFamily: 
"monospace" }}>{t.time}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: PALETTE.success, fontWeight: 700, fontSize: 15 }}>+{fmtUSD(t.pnl)}</div>
                  <div style={{ color: PALETTE.success, fontSize: 12 }}>+{t.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ ...S.glassCard, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Time", "Asset", "Type", "Entry", "Exit", "P&L"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 11, color: PALETTE.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LIVE_TRADES.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: PALETTE.textMuted }}>{t.time}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>{t.asset}</td>
                    <td style={{ padding: "12px 16px" }}><span style={{ background: t.type === "BUY" ? "rgba(72,187,120,0.15)" : "rgba(245,101,101,0.15)", color: t.type === "BUY" ? PALETTE.success : PALETTE.danger, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{t.type}</span></td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{fmtUSD(t.entry)}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{fmtUSD(t.exit)}</td>
                    <td style={{ padding: "12px 16px", color: PALETTE.success, fontWeight: 700 }}>+{fmtUSD(t.pnl)} <span style={{ fontSize: 11, opacity: .7 }}>(+{t.pct}%)</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background: PALETTE.navyLight, padding: isMobile ? "48px 16px" : "72px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={S.badge}>Testimonials</div>
            <h2 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12 }}>What Our Investors Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ ...S.glassCard, padding: 24 }}>
                <div style={{ color: PALETTE.gold, marginBottom: 10, fontSize: 16 }}>{"★".repeat(t.stars)}</div>
                <div style={{ color: PALETTE.textMuted, fontSize: 14, lineHeight: 1.75, marginBottom: 18, fontStyle: "italic" }}>"{t.text}"</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${PALETTE.steel},${PALETTE.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{t.img}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: PALETTE.textMuted }}>{t.role} · {t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg,rgba(0,212,170,0.07) 0%,rgba(201,168,76,0.05) 100%)", borderTop: "1px solid rgba(0,212,170,0.12)", borderBottom: "1px solid rgba(0,212,170,0.12)", padding: isMobile ? "52px 20px" : "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Ready to Start Growing Your Wealth?</h2>
        <div style={{ color: PALETTE.textMuted, marginBottom: 28, fontSize: isMobile ? 14 : 16 }}>Join 284,000+ investors. Minimum investment: $50.</div>
        <button onClick={() => setShowAuth("register")} style={{ ...S.tealBtn, padding: isMobile ? "14px 32px" : "15px 44px", fontSize: isMobile ? 15 : 16 }}>Open Your Account →</button>
      </div>
    </div>
  );
}

function PlansPage({ setPage, setSelectedPlan }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "40px 16px" : "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 36 : 52 }}>
        <div style={S.badge}>Investment Plans</div>
        <h1 style={{ fontSize: isMobile ? 28 : 44, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 12 }}>Transparent Plans. Real Returns.</h1>
        <div style={{ color: PALETTE.textMuted, maxWidth: 520, margin: "0 auto", fontSize: isMobile ? 13 : 15 }}>Every plan powered by AI. All include principal return at maturity.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
        {PLANS.map(p => <PlanCard key={p.id} plan={p} onSelect={(plan) => { setSelectedPlan(plan); setPage("payment"); }} />)}
      </div>
      <div style={{ ...S.glassCard, padding: 20, marginTop: 32, borderColor: "rgba(201,168,76,0.2)" }}>
        <div style={{ fontSize: 12, color: PALETTE.textMuted, lineHeight: 1.7 }}>⚠️ <strong style={{ color: PALETTE.gold }}>Risk Disclosure:</strong> All investments carry risk. Past performance is not a guarantee of future results. Capital at risk. AetherForge Exchange Ltd is FCA authorised (FRN: 914829) and MAS licensed (CMS No. 101-000314-1).</div>
      </div>
    </div>
  );
}

function MarketsPage({ prices }) {
  const isMobile = useIsMobile();
  return (