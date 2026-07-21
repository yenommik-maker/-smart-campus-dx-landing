import React, { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";

const PROTOTYPE_URL = "https://yenommik-maker.github.io/smart-campus-dx-prototype/";
const BLUE = "#2563EB";
const C = { blue: "#2563EB", green: "#10B981", violet: "#7C3AED", amber: "#F59E0B", rose: "#F43F5E", cyan: "#06B6D4" };

const NAV_LINKS = [
  { href: "#problem", label: "소개" },
  { href: "#solution", label: "기능" },
  { href: "#stats", label: "효과" },
  { href: "#how", label: "로드맵" },
];

const BEFORE_ITEMS = [
  "버스 수요조사 수기 취합 3시간",
  "탑승 인원 현장 확인 4시간",
  "객실 배정 민원 전화 대응 3시간",
  "시간표 종이 출력·부착 2시간",
];

const AFTER_STATS = [
  { value: "1,400h", label: "연간 반복업무" },
  { value: "70%", label: "자동화 목표" },
];

const PLATFORM_CHECKS = [
  "버스·객실·시간표를 하나의 앱에서",
  "운영자·교육생·관리자 역할별 화면",
  "실시간 수요 집계 및 자동 처리",
];

const HOW_STEPS = [
  { num: "01", title: "현황 분석", desc: "현황 분석 인터뷰를 통해 운영 요구사항을 도출합니다.", color: C.blue, bg: "bg-blue-50" },
  { num: "02", title: "프로토타입 검증", desc: "클릭형 프로토타입으로 검증한 뒤 MVP를 개발합니다.", color: C.violet, bg: "bg-violet-50" },
  { num: "03", title: "시범 운영", desc: "시범 운영으로 효과를 확인하고 전면 확대합니다.", color: C.green, bg: "bg-emerald-50" },
];

const STATS = [
  { value: 980, suffix: "h", label: "연간 절감 가능 업무시간", color: C.blue, spark: [8, 14, 12, 20, 26, 34, 40] },
  { value: 106, suffix: "개", label: "연간 운영 과정 수", color: C.violet, spark: [30, 28, 32, 30, 34, 33, 36] },
  { value: 0, suffix: "장", label: "종이 출력 목표", color: C.green, spark: [40, 32, 26, 20, 14, 8, 3] },
  { value: 70, suffix: "%", label: "반복업무 자동화율", color: C.amber, spark: [10, 20, 30, 42, 52, 62, 70] },
];

const TICKER_ITEMS = [
  "Smart Bus",
  "Smart Room",
  "Smart Schedule",
  "Smart Access",
  "연간 980시간 절감",
  "페이퍼리스 연계",
];

const PLANS = [
  {
    phase: "1단계",
    name: "파일럿 도입",
    tagline: "가장 반복이 잦은 업무부터",
    highlight: false,
    features: ["Smart Bus 시범 운영", "1개 과정 적용", "현장 피드백 수집", "효과 측정 리포트"],
  },
  {
    phase: "2단계",
    name: "부분 도입",
    tagline: "검증된 기능을 확대",
    highlight: true,
    features: ["Smart Room·Schedule 추가", "다수 과정 동시 운영", "역할별 권한 관리", "운영 데이터 대시보드"],
  },
  {
    phase: "3단계",
    name: "전면 도입",
    tagline: "인재개발원 운영 전 과정으로",
    highlight: false,
    features: ["Smart Access 통합", "전 과정 표준 적용", "페이퍼리스 연계", "완전 자동화 운영"],
  },
];

const FAQS = [
  {
    q: "기존 내부 행정프로그램과 충돌하지 않나요?",
    a: "기존 시스템은 그대로 유지하면서 현장 운영 영역만 보완합니다. 행정·출결 등 기존 프로그램을 대체하지 않고 중복되는 수기 업무만 자동화합니다.",
  },
  {
    q: "예산이 얼마나 필요한가요?",
    a: "플랫폼 개발비는 별도 산정이며, 현장 Wi-Fi 구축은 초기 약 3,000만원 규모로 예상됩니다. 단계별 도입으로 초기 부담을 낮출 수 있습니다.",
  },
  {
    q: "교육생 기기가 없으면 어떻게 하나요?",
    a: "페이퍼리스 사업(아이패드 지급)과 연계하면 별도 장비 구입 없이 운영할 수 있습니다. 개인 스마트폰으로도 동일한 기능을 이용할 수 있도록 반응형으로 설계합니다.",
  },
  {
    q: "도입까지 얼마나 걸리나요?",
    a: "1단계 Smart Bus 시범 운영은 2026년 하반기를 목표로 하며, 검증 후 다음 단계로 순차 확대합니다.",
  },
];

/* ---------- Cursor ---------- */

function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    let raf;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      });
      setHovering(!!e.target.closest("a, button"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full transition-[width,height] duration-200"
      style={{
        width: hovering ? 46 : 12,
        height: hovering ? 46 : 12,
        backgroundColor: "#ffffff",
        mixBlendMode: "difference",
      }}
    />
  );
}

/* ---------- Shared ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function FadeInSection({ children, className = "", id }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </div>
  );
}

const CARD = "rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_30px_-12px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_55px_-18px_rgba(15,23,42,0.30)]";

/* ---------- Charts ---------- */

function Donut({ value, size = 132, stroke = 14, color = BLUE }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{value}%</span>
      </div>
    </div>
  );
}

function AreaChart({ data = [12, 18, 15, 24, 19, 30, 26, 36, 31, 42], color = BLUE, height = 100 }) {
  const gid = useId().replace(/:/g, "");
  const w = 320;
  const h = height;
  const pad = 10;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const step = w / (data.length - 1);
  const y = (d) => h - pad - ((d - min) / (max - min || 1)) * (h - pad * 2);
  const pts = data.map((d, i) => [i * step, y(d)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

function BarsMini({ data = [45, 68, 52, 84, 60, 96], color = BLUE, soft = "#EDE9FE", height = 100 }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2.5" style={{ height }}>
      {data.map((d, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-md"
          style={{ background: i === data.length - 1 ? color : soft }}
          initial={{ height: 0 }}
          whileInView={{ height: `${(d / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function Sparkline({ data, color = BLUE, height = 34 }) {
  const gid = useId().replace(/:/g, "");
  const w = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const step = w / (data.length - 1);
  const y = (d) => height - 4 - ((d - min) / (max - min || 1)) * (height - 8);
  const pts = data.map((d, i) => [i * step, y(d)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${height} L0,${height} Z`} fill={`url(#${gid})`} />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}

function QRGlyph() {
  const pattern = [
    1, 1, 1, 0, 1,
    1, 0, 1, 0, 1,
    1, 1, 0, 1, 0,
    0, 0, 1, 0, 1,
    1, 0, 1, 1, 1,
  ];
  return (
    <div className="grid w-fit grid-cols-5 gap-1.5">
      {pattern.map((c, i) => (
        <span key={i} className={`h-4 w-4 rounded-[3px] ${c ? "bg-slate-900" : "bg-slate-200"}`} />
      ))}
    </div>
  );
}

function MiniStat({ label, value, delta }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-lg ring-1 ring-slate-100">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="mt-0.5 flex items-center gap-2">
        <span className="text-sm font-bold text-slate-900">{value}</span>
        {delta && (
          <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

const FLOW = [
  { icon: "📋", label: "수요조사", sub: "자동 집계", color: C.blue, bg: "bg-blue-50" },
  { icon: "⚙️", label: "자동배정", sub: "규칙 기반", color: C.violet, bg: "bg-violet-50" },
  { icon: "📲", label: "알림·QR", sub: "앱 연동", color: C.amber, bg: "bg-amber-50" },
  { icon: "✅", label: "완료·집계", sub: "실시간 반영", color: C.green, bg: "bg-emerald-50" },
];

function FlowDiagram() {
  return (
    <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 text-sm font-semibold text-slate-900">자동화 처리 흐름</div>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        {FLOW.map((f, i) => (
          <React.Fragment key={f.label}>
            <motion.div
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className={`flex flex-1 items-center gap-3 rounded-2xl ${f.bg} p-4`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">{f.icon}</span>
              <div>
                <div className="text-sm font-bold" style={{ color: f.color }}>{f.label}</div>
                <div className="text-[11px] text-slate-500">{f.sub}</div>
              </div>
            </motion.div>
            {i < FLOW.length - 1 && (
              <span className="mx-auto text-slate-300 md:mx-0">
                <svg width="22" height="22" viewBox="0 0 24 24" className="rotate-90 md:rotate-0" fill="none">
                  <path d="M4 12h16m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function CountUpNumber({ target, suffix = "", className = "text-6xl md:text-7xl", colorOverride }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);
  return (
    <span
      ref={ref}
      className={`font-display font-bold tracking-tight ${colorOverride ? "" : "text-slate-900"} ${className}`}
      style={colorOverride ? { color: colorOverride } : undefined}
    >
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border transition-colors ${open ? "border-slate-200 bg-white shadow-sm" : "border-slate-200 bg-white"}`}>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-5 px-6 py-5 text-left">
        <span className="flex-1 text-base font-medium text-slate-900">{q}</span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg font-light transition-all duration-300 ${open ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>
          {open ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm font-light leading-relaxed text-slate-500">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Video Hero (dark, unchanged) ---------- */

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const HERO_NAV = [
  { href: "#problem", label: "소개" },
  { href: "#solution", label: "기능" },
  { href: "#stats", label: "효과" },
  { href: "#how", label: "로드맵" },
  { href: PROTOTYPE_URL, label: "프로토타입", external: true },
];

function VideoHero() {
  return (
    <header className="relative min-h-screen overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={HERO_VIDEO_URL}
      />

      <nav className="relative z-10 mx-auto flex max-w-7xl flex-row items-center justify-between px-5 py-6 md:px-8">
        <a href="#top" className="text-2xl tracking-tight text-white md:text-3xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Smart Campus DX
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {HERO_NAV.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href={PROTOTYPE_URL}
          target="_blank"
          rel="noreferrer"
          className="liquid-glass hidden rounded-full px-6 py-2.5 text-sm text-white sm:inline-block"
        >
          프로토타입 보기
        </a>
      </nav>

      <section className="relative z-10 flex flex-col items-center px-6 pt-32 pb-40 text-center">
        <h1
          className="animate-fade-rise max-w-7xl break-keep text-5xl font-normal leading-[1.04] tracking-[-1.5px] text-white sm:text-7xl md:text-8xl"
          style={{ fontFamily: "'Instrument Serif', serif", textShadow: "0 2px 24px rgba(4,12,28,0.45), 0 1px 2px rgba(4,12,28,0.35)" }}
        >
          건강보험 인재의 내일,{" "}
          <em className="not-italic" style={{ color: "hsl(var(--muted-foreground))" }}>
            디지털로 다시 설계합니다.
          </em>
        </h1>
        <p
          className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed sm:text-lg"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          국민건강보험공단 인재개발원의 연간 1,400시간 반복업무를 자동화하고, 담당자는 오직 교육에 집중할 수 있는 스마트 캠퍼스를 구축합니다.
        </p>
        <div className="animate-fade-rise-delay-2 mt-12 flex flex-wrap items-center justify-center gap-4">
          <a href={PROTOTYPE_URL} target="_blank" rel="noreferrer" className="liquid-glass rounded-full px-14 py-5 text-white">
            프로토타입 보기
          </a>
          <a
            href="#problem"
            className="rounded-full border border-white/30 px-14 py-5 text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            자세히 알아보기
          </a>
        </div>
      </section>
    </header>
  );
}

/* ---------- Ticker (light) ---------- */

function MarqueeTicker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative overflow-hidden border-b border-slate-200 bg-white py-6">
      <div className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
        Trusted Building Blocks
      </div>
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-33.3333%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-lg font-medium text-slate-400 md:text-xl">
            {t}
            <span className="text-slate-300">·</span>
          </span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32" style={{ background: "linear-gradient(90deg,#fff,transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32" style={{ background: "linear-gradient(270deg,#fff,transparent)" }} />
    </div>
  );
}

const H2 = "font-display font-bold tracking-tight text-slate-900 leading-[1.08] text-[clamp(2rem,5.2vw,4.5rem)]";

/* ---------- Scenic fixed background (sky + rolling hills) ---------- */

function SceneBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#E4EEFF 0%,#EFF5FF 34%,#FBFDFF 68%)" }} />
      {/* 태양광 글로우 */}
      <div className="absolute -top-32 right-[12%] h-[520px] w-[520px] rounded-full" style={{ background: "radial-gradient(circle,rgba(255,247,214,0.85),rgba(255,240,190,0.25) 42%,transparent 68%)" }} />
      <div className="absolute -top-24 left-[15%] h-[420px] w-[420px] rounded-full" style={{ background: "radial-gradient(circle,rgba(37,99,235,0.10),transparent 70%)" }} />
      <div className="absolute top-[30%] right-[8%] h-[380px] w-[380px] rounded-full" style={{ background: "radial-gradient(circle,rgba(124,58,237,0.08),transparent 70%)" }} />
      <div className="absolute bottom-[18vh] left-[40%] h-[320px] w-[320px] rounded-full" style={{ background: "radial-gradient(circle,rgba(16,185,129,0.10),transparent 70%)" }} />
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 340" preserveAspectRatio="none" style={{ height: "50vh" }}>
        <defs>
          {/* 대기 원근: 먼 언덕은 밝고 흐리게, 가까운 언덕은 진하고 선명하게 */}
          <linearGradient id="hillHaze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E9FBF0" />
            <stop offset="1" stopColor="#CBEFD8" />
          </linearGradient>
          <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D6FBE4" />
            <stop offset="1" stopColor="#98E1B7" />
          </linearGradient>
          <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9FF0BF" />
            <stop offset="1" stopColor="#4CBF80" />
          </linearGradient>
          <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5FE29A" />
            <stop offset="0.55" stopColor="#2FB672" />
            <stop offset="1" stopColor="#178A54" />
          </linearGradient>
          {/* 능선 겹침 그림자로 입체감 */}
          <linearGradient id="ridgeShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(4,66,44,0.34)" />
            <stop offset="1" stopColor="rgba(4,66,44,0)" />
          </linearGradient>
          <filter id="hazeBlur" x="-5%" y="-20%" width="110%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* 대기 헤이즈(가장 먼 능선) — 흐릿하게 */}
        <g filter="url(#hazeBlur)">
          <path fill="url(#hillHaze)" fillOpacity="0.85" d="M0,176 C220,132 470,206 720,178 C980,148 1220,204 1440,170 L1440,340 L0,340 Z" />
        </g>

        {/* 먼 언덕 */}
        <path fill="url(#hillFar)" fillOpacity="0.95" d="M0,214 C240,152 480,268 720,218 C960,170 1200,256 1440,200 L1440,340 L0,340 Z" />
        <path fill="none" stroke="#F3FEF7" strokeOpacity="0.75" strokeWidth="2.5" d="M0,214 C240,152 480,268 720,218 C960,170 1200,256 1440,200" />

        {/* 중간 언덕 + 겹침 그림자 */}
        <path fill="url(#ridgeShadow)" d="M0,252 C300,204 520,306 780,254 C1040,204 1240,290 1440,246 L1440,312 C1240,270 1040,352 780,298 C520,348 300,246 0,296 Z" />
        <path fill="url(#hillMid)" d="M0,252 C300,204 520,306 780,254 C1040,204 1240,290 1440,246 L1440,340 L0,340 Z" />
        <path fill="none" stroke="#DFFCEA" strokeOpacity="0.7" strokeWidth="2.5" d="M0,252 C300,204 520,306 780,254 C1040,204 1240,290 1440,246" />

        {/* 가까운 언덕 + 짙은 겹침 그림자 */}
        <path fill="url(#ridgeShadow)" d="M0,292 C360,258 600,326 900,294 C1140,270 1300,310 1440,294 L1440,336 C1300,356 1140,320 900,340 C600,366 360,300 0,332 Z" />
        <path fill="url(#hillNear)" d="M0,292 C360,258 600,326 900,294 C1140,270 1300,310 1440,294 L1440,340 L0,340 Z" />
        <path fill="none" stroke="#C4FAD8" strokeOpacity="0.8" strokeWidth="2.5" d="M0,292 C360,258 600,326 900,294 C1140,270 1300,310 1440,294" />
      </svg>
    </div>
  );
}

/* ---------- App ---------- */

export default function App() {
  return (
    <div id="top" className="relative bg-white font-sans text-slate-900">
      <CustomCursor />
      <SceneBackground />

      <div className="relative z-10">
      {/* 1. Hero (dark) */}
      <VideoHero />

      <MarqueeTicker />

      {/* 2. Problem — Before / After */}
      <FadeInSection id="problem" className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Why It Matters</SectionLabel>
          <h2 className={`mb-16 max-w-3xl ${H2}`}>반복업무가 인재개발원 운영을 막고 있습니다</h2>
          <div className="grid items-stretch gap-6 md:grid-cols-2">
            <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className={`${CARD} p-8`}>
              <div className="mb-7 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Before</div>
              <ul className="space-y-5">
                {BEFORE_ITEMS.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-slate-600 md:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="flex flex-col justify-center gap-8 rounded-3xl bg-slate-900 p-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">After</div>
              <div className="grid grid-cols-2 gap-6">
                {AFTER_STATS.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-5xl font-bold tracking-tight text-accentSoft md:text-6xl">{s.value}</div>
                    <div className="mt-2 text-sm text-white/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </FadeInSection>

      {/* 3. Core Features — Bento with charts */}
      <FadeInSection id="solution" className="bg-white/40 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Core Features</SectionLabel>
          <h2 className={`mb-16 ${H2}`}>
            인재개발원 운영의
            <br />
            모든 것을 자동화
          </h2>
          <div className="grid gap-5 md:auto-rows-fr md:grid-cols-6">
            {/* Smart Bus — wide, area chart + floating stats */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className={`${CARD} relative overflow-hidden p-8 md:col-span-4`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">🚌</span>
                    <span className="font-display text-2xl font-bold text-slate-900">Smart Bus</span>
                  </div>
                  <p className="max-w-sm text-sm font-light leading-relaxed text-slate-500">
                    수요조사부터 노선·좌석 배정, QR 탑승 확인까지 한 흐름으로 처리합니다.
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 자동 집계
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">노선별 수요 집계 (예시)</div>
              <div className="mt-3"><AreaChart /></div>
              <div className="pointer-events-none absolute bottom-6 right-6 hidden gap-3 sm:flex">
                <MiniStat label="현장 탑승 확인" value="4시간 → 0" delta="QR 자동" />
              </div>
            </motion.div>

            {/* dark accent live-stat card */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="flex flex-col justify-between rounded-3xl bg-slate-900 p-8 transition-transform duration-300 hover:-translate-y-1 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                <span className="h-2 w-2 rounded-full bg-accentSoft" /> 연간 절감 목표
              </div>
              <div>
                <div className="font-display text-6xl font-bold leading-none text-white">
                  980<span className="text-3xl text-white/50">시간</span>
                </div>
                <div className="mt-3 text-sm text-white/60">연 1,400시간 반복업무의 70% 자동화</div>
              </div>
            </motion.div>

            {/* Smart Room — donut (green) */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className={`${CARD} p-8 md:col-span-2`}>
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-lg">🛏️</span>
                <span className="font-display text-xl font-bold text-slate-900">Smart Room</span>
              </div>
              <p className="mb-5 text-sm font-light text-slate-500">규칙 기반 자동배정</p>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-slate-300 line-through">3시간</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-display text-4xl font-bold" style={{ color: C.green }}>즉시</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-400">객실 배정 민원 대응 시간</div>
              </div>
            </motion.div>

            {/* Smart Schedule — bars (violet) */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className={`${CARD} p-8 md:col-span-2`}>
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-lg">🗓️</span>
                <span className="font-display text-xl font-bold text-slate-900">Smart Schedule</span>
              </div>
              <p className="mb-4 text-sm font-light text-slate-500">교시별 앱·QR 반영</p>
              <BarsMini color={C.violet} soft="#EDE9FE" />
              <div className="mt-4 text-[11px] text-slate-400">종이 출력·부착 2시간 → 앱 실시간 반영</div>
            </motion.div>

            {/* Smart Access — QR (amber) */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className={`${CARD} p-8 md:col-span-2`}>
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-lg">🔑</span>
                <span className="font-display text-xl font-bold text-slate-900">Smart Access</span>
              </div>
              <p className="mb-5 text-sm font-light text-slate-500">모바일 학생증 QR</p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <QRGlyph />
                <div className="text-center">
                  <div className="font-display text-3xl font-bold" style={{ color: C.amber }}>1</div>
                  <div className="text-[11px] text-slate-400">개 QR로<br />출결·식사·탑승</div>
                </div>
              </div>
            </motion.div>
          </div>
          <FlowDiagram />
        </div>
      </FadeInSection>

      {/* 4. Platform Overview — dashboard mock */}
      <FadeInSection id="platform" className="px-6 py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <div>
            <SectionLabel>Platform Overview</SectionLabel>
            <h2 className={`mb-6 ${H2}`}>
              실제 운영 화면을
              <br />
              직접 확인하세요
            </h2>
            <p className="mb-8 text-base font-light leading-relaxed text-slate-500">
              클릭형 프로토타입에서 운영자·교육생·관리자 화면을 직접 눌러볼 수 있습니다.
            </p>
            <ul className="mb-10 space-y-3">
              {PLATFORM_CHECKS.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-slate-700 md:text-base">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">✓</span>
                  {c}
                </li>
              ))}
            </ul>
            <a href={PROTOTYPE_URL} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5">
              프로토타입 열기 →
            </a>
          </div>

          <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="h-3 w-3 rounded-full bg-slate-200" />
              <span className="h-3 w-3 rounded-full bg-slate-200" />
              <span className="h-3 w-3 rounded-full bg-slate-200" />
              <span className="ml-3 text-xs text-slate-400">smart-campus-dx / dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: "연 절감 목표", v: "980h", c: "text-accent" },
                { l: "연 반복업무", v: "1,400h", c: "text-slate-900" },
                { l: "종이 출력", v: "0장", c: "text-emerald-600" },
              ].map((t) => (
                <div key={t.l} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-[11px] text-slate-400">{t.l}</div>
                  <div className={`mt-1 text-lg font-bold ${t.c}`}>{t.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="col-span-2 rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 text-[11px] text-slate-400">누적 절감 시간 · 목표</div>
                <AreaChart height={72} data={[10, 16, 13, 22, 18, 28, 34]} />
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4">
                <Donut value={70} size={92} stroke={11} />
                <div className="mt-1 text-[11px] text-slate-400">자동화 목표</div>
              </div>
            </div>
          </motion.div>
        </div>
      </FadeInSection>

      {/* 5. How It Works */}
      <FadeInSection id="how" className="bg-white/40 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className={`mb-16 ${H2}`}>
            3단계로 인재개발원을
            <br />
            스마트하게
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {HOW_STEPS.map((s, i) => (
              <motion.div key={s.num} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className={`${CARD} p-8`}>
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg} font-display text-2xl font-bold`} style={{ color: s.color }}>
                  {s.num}
                </div>
                <div className="mb-3 text-xl font-bold text-slate-900">{s.title}</div>
                <p className="text-sm font-light leading-relaxed text-slate-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 6. Stats */}
      <FadeInSection id="stats" className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>By the Numbers</SectionLabel>
          <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-16 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div style={{ color: s.color }}>
                  <CountUpNumber target={s.value} suffix={s.suffix} className="text-5xl md:text-6xl" colorOverride={s.color} />
                </div>
                <div className="mt-4"><Sparkline data={s.spark} color={s.color} /></div>
                <div className="mt-4 text-sm font-light text-slate-500">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 6c. Adoption Plans */}
      <FadeInSection id="plans" className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Adoption Plan</SectionLabel>
          <h2 className={`mb-16 ${H2}`}>
            단계별로 부담 없이
            <br />
            도입합니다
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((p, i) => {
              const dark = p.highlight;
              return (
                <motion.div
                  key={p.name}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className={
                    dark
                      ? "flex flex-col rounded-3xl bg-slate-900 p-8 shadow-xl"
                      : `${CARD} flex flex-col p-8`
                  }
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-accentSoft" : "text-accent"}`}>{p.phase}</span>
                    {dark && <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white">추천</span>}
                  </div>
                  <div className={`mb-1 font-display text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{p.name}</div>
                  <p className={`mb-6 text-sm font-light ${dark ? "text-white/60" : "text-slate-500"}`}>{p.tagline}</p>
                  <ul className={`flex-1 space-y-3 border-t pt-6 ${dark ? "border-white/10" : "border-slate-100"}`}>
                    {p.features.map((f) => (
                      <li key={f} className={`flex items-start gap-3 text-sm font-light ${dark ? "text-white/85" : "text-slate-600"}`}>
                        <span className={`mt-0.5 font-bold ${dark ? "text-accentSoft" : "text-accent"}`}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeInSection>

      {/* 7. FAQ */}
      <FadeInSection id="faq" className="bg-white/40 px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className={`mb-16 ${H2}`}>자주 묻는 질문</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} {...f} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 8. CTA */}
      <FadeInSection className="relative overflow-hidden px-6 py-36 text-center">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(239,246,255,0.55),rgba(255,255,255,0.15))" }} />
        <div className="pointer-events-none absolute left-1/2 top-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.14), transparent 65%)" }} />
        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-12 font-display font-bold tracking-tight text-slate-900 leading-[1.1] text-[clamp(2rem,5.2vw,4.5rem)]">
            인재개발원 운영의 디지털 전환,
            <br />
            지금 시작합니다
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={PROTOTYPE_URL} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-10 py-4 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5">
              프로토타입 보기
            </a>
            <a href="#problem" className="rounded-full border border-slate-300 bg-white px-10 py-4 text-sm font-medium text-slate-900 transition-colors duration-300 hover:bg-slate-900 hover:text-white">
              자세히 알아보기
            </a>
          </div>
        </div>
      </FadeInSection>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 pt-16 pb-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <div className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs text-white">◆</span>
              Smart Campus DX
            </div>
            <p className="text-xs font-light leading-relaxed text-slate-500">
              공공기관 인재개발원 운영을 위한 스마트 디지털 전환 플랫폼. 반복업무는 시스템에게, 사람은 교육에.
            </p>
          </div>
          {[
            { h: "바로가기", items: [["소개", "#problem"], ["기능", "#solution"], ["효과", "#stats"], ["도입 단계", "#plans"]] },
            { h: "더 보기", items: [["도입 단계", "#plans"], ["FAQ", "#faq"], ["진행 절차", "#how"]] },
            { h: "링크", items: [["프로토타입", PROTOTYPE_URL, true]] },
          ].map((col) => (
            <div key={col.h}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">{col.h}</div>
              <ul className="space-y-2.5">
                {col.items.map(([label, href, ext]) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="text-sm font-light text-slate-600 transition-colors hover:text-slate-900"
                    >
                      {label}
                      {ext && " ↗"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-14 flex max-w-6xl items-center justify-between border-t border-slate-200 pt-6 text-[11px] font-light uppercase tracking-[0.25em] text-slate-400">
          <span>© 2026 Smart Campus DX</span>
          <span>Seoul · Korea</span>
        </div>
      </footer>
      </div>
    </div>
  );
}
