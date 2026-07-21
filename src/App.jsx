import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import {
  motion,
  AnimatePresence,
  useInView,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const PROTOTYPE_URL = "https://yenommik-maker.github.io/smart-campus-dx-prototype/";

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

const FEATURES = [
  {
    icon: "🚌",
    title: "Smart Bus",
    desc: "버스 수요조사부터 노선·좌석 배정, QR 탑승 확인까지 한 흐름으로 처리합니다.",
    points: ["수요조사 자동 집계", "노선·좌석 배정", "QR 탑승 확인"],
  },
  {
    icon: "🛏️",
    title: "Smart Room",
    desc: "신청기간 내 본인 선택 후 규칙 기반 자동배정, 필요 시 수동조정까지 지원합니다.",
    points: ["본인 신청 접수", "규칙 기반 자동배정", "객실 수동조정"],
  },
  {
    icon: "🗓️",
    title: "Smart Schedule",
    desc: "시간표를 한 번 입력하면 앱·DID·QR까지 자동으로 연동됩니다.",
    points: ["시간표 일괄 입력", "앱·DID 연동", "강의실 QR 안내"],
  },
  {
    icon: "🔑",
    title: "Smart Access",
    desc: "역할별 권한관리부터 공지 발송, 모바일 학생증 QR까지 현장 운영을 통합합니다.",
    points: ["역할별 권한관리", "공지·알림 발송", "모바일 학생증 QR"],
  },
];

const PLATFORM_CHECKS = [
  "버스·객실·시간표를 하나의 앱에서",
  "운영자·교육생·관리자 역할별 화면",
  "실시간 수요 집계 및 자동 처리",
];

const HOW_STEPS = [
  { num: "01", title: "현황 분석", desc: "현황 분석 인터뷰를 통해 운영 요구사항을 도출합니다." },
  { num: "02", title: "프로토타입 검증", desc: "클릭형 프로토타입으로 검증한 뒤 MVP를 개발합니다." },
  { num: "03", title: "시범 운영", desc: "시범 운영으로 효과를 확인하고 전면 확대합니다." },
];

const STATS = [
  { value: 980, suffix: "h", label: "연간 절감 가능 업무시간" },
  { value: 106, suffix: "개", label: "연간 운영 과정 수" },
  { value: 0, suffix: "장", label: "종이 출력 목표" },
  { value: 70, suffix: "%", label: "반복업무 자동화율" },
];

const TICKER_ITEMS = [
  "Smart Bus",
  "Smart Room",
  "Smart Schedule",
  "Smart Access",
  "연간 980시간 절감",
  "페이퍼리스 연계",
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

/* ---------- 3D ---------- */

function IPadMesh({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.15 }) {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * rotationSpeed;
  });
  return (
    <group ref={group} position={position} scale={scale}>
      <RoundedBox args={[2.2, 3, 0.14]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#d6d1c8" roughness={0.15} metalness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[1.92, 2.72]} />
        <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.4} />
      </mesh>
    </group>
  );
}

function PhoneMesh({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.15 }) {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * rotationSpeed;
  });
  return (
    <group ref={group} position={position} scale={scale}>
      <RoundedBox args={[1.05, 2.15, 0.12]} radius={0.14} smoothness={4}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[0.9, 1.9]} />
        <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.4} />
      </mesh>
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 5]} intensity={1} />
      <directionalLight position={[-4, -2, 3]} intensity={0.4} />
    </>
  );
}

/* ---------- Cursor ---------- */

function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 30 });
  const sy = useSpring(y, { stiffness: 400, damping: 30 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      setHovering(!!e.target.closest("a, button"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-ink"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: hovering ? "difference" : "normal",
        backgroundColor: hovering ? "#F5F0E8" : "transparent",
      }}
      animate={{ width: hovering ? 48 : 12, height: hovering ? 48 : 12 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
    <div className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </div>
  );
}

const CARD =
  "rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40";

function GhostButton({ href, children, external = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="liquid-glass inline-block rounded-full px-10 py-4 text-sm font-medium text-white"
    >
      {children}
    </a>
  );
}

function CountUpNumber({ target, suffix = "", className = "text-[8vw]" }) {
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
    <span ref={ref} className={`font-display font-bold tracking-tight text-ink whitespace-nowrap leading-none ${className}`}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-5 py-6 text-left"
      >
        <span className="flex-1 text-base font-medium text-ink md:text-lg">{q}</span>
        <span
          className={`shrink-0 text-2xl font-light text-ink transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          +
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
            <p className="pb-6 pr-10 text-sm font-light leading-relaxed text-subtext">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Video Hero ---------- */

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
  const [videoFailed, setVideoFailed] = useState(false);
  return (
    <header className="relative min-h-screen overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}hero-bg.jpg)` }}
      />
      {!videoFailed && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={HERO_VIDEO_URL}
        />
      )}

      <nav className="relative z-10 mx-auto flex max-w-7xl flex-row items-center justify-between px-8 py-6">
        <a
          href="#top"
          className="text-3xl tracking-tight text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
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
          className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white"
        >
          프로토타입 보기
        </a>
      </nav>

      <section className="relative z-10 flex flex-col items-center px-6 pt-32 pb-40 text-center">
        <h1
          className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-white sm:text-7xl md:text-8xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          인재개발원 운영이{" "}
          <em className="not-italic" style={{ color: "hsl(var(--muted-foreground))" }}>
            스스로 돌아갑니다.
          </em>
        </h1>
        <p
          className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed sm:text-lg"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          연간 1,400시간의 반복업무를 자동화하고, 교육생 중심의 스마트 인재개발원을 구축합니다.
        </p>
        <div className="animate-fade-rise-delay-2 mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noreferrer"
            className="liquid-glass rounded-full px-14 py-5 text-white"
          >
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

/* ---------- Ticker ---------- */

function MarqueeTicker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-10 overflow-hidden border-y border-line bg-surface py-6">
      <div className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-ink/40">
        Trusted Building Blocks
      </div>
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-33.3333%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-lg font-light text-ink/40 md:text-xl">
            {t}
            <span className="text-ink/20">·</span>
          </span>
        ))}
      </motion.div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-32"
        style={{ background: "linear-gradient(90deg, #0A0A0A, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-32"
        style={{ background: "linear-gradient(270deg, #0A0A0A, transparent)" }}
      />
    </div>
  );
}

/* ---------- App ---------- */

export default function App() {
  return (
    <div id="top" className="bg-surface font-sans font-light text-ink">
      <CustomCursor />

      {/* 1. Hero */}
      <VideoHero />

      <MarqueeTicker />

      {/* 2. Problem — Before / After */}
      <FadeInSection id="problem" className="bg-surface px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Why It Matters</SectionLabel>
          <h2 className="mb-16 max-w-3xl font-display font-bold tracking-tight text-ink leading-[1.08] text-[5vw]">
            반복업무가 연수원 운영을 막고 있습니다
          </h2>
          <div className="grid items-stretch gap-6 md:grid-cols-2">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className={`${CARD} p-8`}
            >
              <div className="mb-7 text-[11px] font-medium uppercase tracking-[0.28em] text-ink/50">Before</div>
              <ul className="space-y-5">
                {BEFORE_ITEMS.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm font-light text-subtext md:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/50" />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className={`${CARD} flex flex-col justify-center gap-8 p-8`}
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink/50">After</div>
              <div className="grid grid-cols-2 gap-6">
                {AFTER_STATS.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-5xl font-bold tracking-tight text-accent md:text-6xl">{s.value}</div>
                    <div className="mt-2 text-sm font-light text-subtext">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </FadeInSection>

      {/* 3. Core Features */}
      <FadeInSection id="solution" className="bg-surfaceAlt px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Core Features</SectionLabel>
          <h2 className="mb-16 font-display font-bold tracking-tight text-ink leading-[1.08] text-[5vw]">
            연수원 운영의
            <br />
            모든 것을 자동화
          </h2>
          <div className="grid gap-5 md:grid-cols-6">
            {FEATURES.map((f, i) => {
              const span = [i % 4 === 0 || i % 4 === 3 ? "md:col-span-4" : "md:col-span-2"][0];
              return (
                <motion.div
                  key={f.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className={`${CARD} ${span} p-10`}
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-2xl ring-1 ring-accent/20">
                    {f.icon}
                  </div>
                  <div className="mb-3 font-display text-2xl font-bold text-ink">{f.title}</div>
                  <p className="mb-6 max-w-md text-sm font-light leading-relaxed text-subtext">{f.desc}</p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2.5 border-t border-line pt-6">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm font-light text-ink/80">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeInSection>

      {/* 4. Platform Overview */}
      <FadeInSection id="platform" className="bg-surface px-6 py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <div>
            <SectionLabel>Platform Overview</SectionLabel>
            <h2 className="mb-6 font-display font-bold tracking-tight text-ink leading-[1.1] text-[4vw]">
              실제 운영 화면을
              <br />
              직접 확인하세요
            </h2>
            <p className="mb-8 text-base font-light leading-relaxed text-subtext">
              클릭형 프로토타입에서 운영자·교육생·관리자 화면을 직접 눌러볼 수 있습니다.
            </p>
            <ul className="mb-10 space-y-3">
              {PLATFORM_CHECKS.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm font-light text-ink/90 md:text-base">
                  <span className="mt-0.5 font-bold text-accent">✓</span>
                  {c}
                </li>
              ))}
            </ul>
            <a
              href={PROTOTYPE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-accent px-8 py-4 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5"
            >
              프로토타입 열기 ↗
            </a>
          </div>
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className={`${CARD} overflow-hidden`}
          >
            <div className="flex items-center gap-2 border-b border-line px-5 py-4">
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="ml-4 text-xs font-light text-subtext">smart-campus-dx / dashboard</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6">
              {["버스 수요조사 92%", "객실 자동배정 완료", "오늘 강의 4교시", "탑승 QR 24/34"].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-line bg-white/[0.02] p-5 text-xs font-light text-ink/80"
                >
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </FadeInSection>

      {/* 5. How It Works */}
      <FadeInSection id="how" className="bg-surfaceAlt px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="mb-16 font-display font-bold tracking-tight text-ink leading-[1.08] text-[5vw]">
            3단계로 연수원을
            <br />
            스마트하게
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {HOW_STEPS.map((s, i) => (
              <motion.div
                key={s.num}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className={`${CARD} p-8`}
              >
                <div className="mb-6 font-display font-bold text-5xl text-ink/25">Step {s.num}</div>
                <div className="mb-3 text-xl font-medium text-ink">{s.title}</div>
                <p className="text-sm font-light leading-relaxed text-subtext">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 6. Stats */}
      <FadeInSection id="stats" className="bg-surface px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>By the Numbers</SectionLabel>
          <div className="grid grid-cols-2 gap-x-8 gap-y-14 border-t border-line pt-16 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
              >
                <CountUpNumber target={s.value} suffix={s.suffix} className="text-6xl md:text-7xl" />
                <div className="mt-3 text-sm font-light text-subtext">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 7. FAQ */}
      <FadeInSection id="faq" className="bg-surfaceAlt px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mb-16 font-display font-bold tracking-tight text-ink leading-[1.08] text-[5vw]">
            자주 묻는 질문
          </h2>
          <div className="border-t border-line">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 8. CTA */}
      <FadeInSection className="relative overflow-hidden bg-surfaceAlt px-6 py-36 text-center">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(198,242,78,0.10), transparent 65%)" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-12 font-display font-bold tracking-tight text-ink leading-[1.1] text-[5vw]">
            연수원 운영의 디지털 전환,
            <br />
            지금 시작합니다
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={PROTOTYPE_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-10 py-4 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5"
            >
              프로토타입 보기
            </a>
            <a
              href="#problem"
              className="rounded-full border border-white/30 px-10 py-4 text-sm font-medium text-ink transition-colors duration-300 hover:bg-white hover:text-black"
            >
              자세히 알아보기
            </a>
          </div>
        </div>
      </FadeInSection>

      {/* Footer */}
      <footer className="border-t border-line bg-surface px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.25em] text-ink">Smart Campus DX</div>
            <p className="mt-2 text-xs font-light text-subtext">공공기관 인재개발원 운영 디지털 전환 플랫폼</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm font-light text-ink/70">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
            <a href={PROTOTYPE_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
              프로토타입
            </a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-line pt-6 text-[11px] font-light uppercase tracking-[0.25em] text-subtext">
          © 2026 Smart Campus DX
        </div>
      </footer>
    </div>
  );
}
