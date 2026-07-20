import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform } from "framer-motion";

const PROTOTYPE_URL = "https://yenommik-maker.github.io/smart-campus-dx-prototype/";

const NAV_LINKS = [
  { href: "#problem", label: "문제" },
  { href: "#solution", label: "솔루션" },
  { href: "#devices", label: "디바이스" },
  { href: "#stats", label: "효과" },
  { href: "#synergy", label: "시너지" },
  { href: "#roadmap", label: "로드맵" },
  { href: "#faq", label: "FAQ" },
];

const PROBLEMS = [
  { emoji: "📋", title: "수요조사", desc: "버스·객실 수요조사지 배포와 취합", hours: "3h" },
  { emoji: "📊", title: "엑셀정리", desc: "설문 결과를 엑셀로 일일이 정리", hours: "2h" },
  { emoji: "📞", title: "업체연락", desc: "버스·식당 등 협력업체 유선 연락", hours: "2h" },
  { emoji: "🛏️", title: "객실배정", desc: "성별·조 편성을 고려한 수기 객실배정", hours: "3h" },
  { emoji: "🖨️", title: "종이출력", desc: "시간표·좌석표·안내문 출력과 게시", hours: "2h" },
  { emoji: "🚶", title: "현장확인", desc: "입퇴실·탑승 여부를 일일이 현장 확인", hours: "4h" },
];

const SOLUTIONS = [
  {
    icon: "🚌",
    title: "Smart Bus",
    desc: "버스 수요조사부터 탑승 확인까지 전 과정을 앱 하나로 자동화합니다.",
    steps: ["수요조사", "노선확정", "좌석선택", "탑승QR"],
  },
  {
    icon: "🛏️",
    title: "Smart Room",
    desc: "신청기간 내 본인선택, 마감 후 규칙 기반 자동배정으로 민원을 줄입니다.",
    steps: ["본인선택", "신청마감", "자동배정", "배정완료"],
  },
  {
    icon: "🗓️",
    title: "Smart Schedule",
    desc: "시간표를 한 번 입력하면 앱·DID·QR까지 자동으로 연동됩니다.",
    steps: ["시간표입력", "앱연동", "DID연동", "QR연동"],
  },
];

const DEVICE_FEATURES = [
  { icon: "🚌", label: "버스예약" },
  { icon: "🛏️", label: "객실확인" },
  { icon: "🗓️", label: "강의일정" },
  { icon: "📱", label: "출결QR" },
];

const STATS = [
  { value: 980, suffix: "시간", label: "연간 절감" },
  { value: 106, suffix: "개", label: "자동화 과정" },
  { value: 0, suffix: "장", label: "종이 출력 목표" },
  { value: 70, suffix: "%", label: "업무 자동화율" },
];

const ROADMAP = [
  {
    year: "2026",
    bg: "bg-primary",
    items: ["Smart Bus 파일럿 도입", "Smart Room 시범운영", "교육생 앱 베타 출시", "1개 인재개발원 적용"],
  },
  {
    year: "2027",
    bg: "bg-primaryDark",
    items: ["Smart Schedule 전면 도입", "페이퍼리스 사업 연계 확대", "전 인재개발원으로 확산", "운영 데이터 대시보드 구축"],
  },
  {
    year: "2028",
    bg: "bg-gold",
    items: ["AI 기반 수요예측 도입", "기관 전체 표준 플랫폼화", "외부 기관 벤치마킹 대응", "완전 자동화 운영체계 완성"],
  },
];

const TICKER_ITEMS = ["Smart Bus", "Smart Room", "Smart Schedule", "Smart Access", "Smart Campus DX"];
const WE_DO = ["Smart Bus", "Smart Room", "Smart Schedule"];

const FAQS = [
  {
    q: "기존 내부 시스템과 충돌하지 않나요?",
    a: "Smart Campus DX는 기존 행정프로그램과 별도로 동작하는 보조 플랫폼입니다. 기존 QR 출결·행정 시스템을 대체하지 않고, 중복되는 수기 업무만 자동화합니다.",
  },
  {
    q: "예산은 얼마나 필요한가요?",
    a: "단계별 파일럿 도입을 전제로 최소 비용으로 시작할 수 있습니다. 정확한 규모는 인재개발원 운영 현황 파악 후 별도 협의가 필요합니다.",
  },
  {
    q: "교육생 기기가 없으면 어떻게 하나요?",
    a: "페이퍼리스 사업과 연계해 아이패드를 지급하거나, 개인 스마트폰으로도 동일한 기능을 이용할 수 있도록 반응형으로 설계할 수 있습니다.",
  },
  {
    q: "도입까지 얼마나 걸리나요?",
    a: "클릭형 프로토타입 검증 후 파일럿 과정 1~2개에 우선 적용하며, 통상 3개월 내 첫 시범운영이 가능합니다.",
  },
];

function IPadMesh({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.15 }) {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * rotationSpeed;
  });
  return (
    <group ref={group} position={position} scale={scale}>
      <RoundedBox args={[2.2, 3, 0.14]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#e5e7eb" roughness={0.1} metalness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[1.92, 2.72]} />
        <meshStandardMaterial color="#050507" roughness={0.05} metalness={0.4} />
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
        <meshStandardMaterial color="#111827" roughness={0.1} metalness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[0.9, 1.9]} />
        <meshStandardMaterial color="#050507" roughness={0.05} metalness={0.4} />
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

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="text-sm font-black uppercase tracking-[0.15em] text-white">
          Smart Campus DX<span className="text-primary">®</span>
        </a>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-semibold text-subtext hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white text-surface text-xs font-bold px-4 py-2 hover:bg-primary hover:text-white transition-colors"
          >
            프로토타입 ↗
          </a>
        </div>
      </div>
    </nav>
  );
}

function FadeInSection({ children, className = "", id }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

function CountUpNumber({ target, suffix = "" }) {
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
    <span ref={ref} className="text-5xl md:text-6xl font-bold text-white whitespace-nowrap">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function FaqItem({ index, q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-b-0 py-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-5 text-left"
      >
        <span className="w-10 shrink-0 font-mono text-xs text-primary">
          /{String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-base font-semibold text-ink">{q}</span>
        <span
          className={`shrink-0 text-xl text-primary font-light transition-transform duration-300 ${open ? "rotate-45" : ""}`}
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
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pt-3 pl-10 text-sm text-subtext leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RevealLine({ text, delay = 0, className = "" }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function SectionHeader({ index, label, lines, sub }) {
  return (
    <div className="mb-14 border-t border-white/10 pt-6">
      <div className="mb-8 flex items-center justify-between">
        <span className="font-mono text-xs text-subtext">( {String(index).padStart(2, "0")} )</span>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{label}</span>
      </div>
      <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.02]">
        {lines.map((line, i) => (
          <RevealLine key={line} text={line} delay={i * 0.1} />
        ))}
      </h2>
      {sub && <p className="mt-5 max-w-md text-sm text-subtext">{sub}</p>}
    </div>
  );
}

function FloatingCard() {
  return (
    <motion.a
      href={PROTOTYPE_URL}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.6, delay: 0.6 },
        y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
      }}
      className="hidden sm:flex items-center gap-3 bg-card/90 backdrop-blur-md ring-1 ring-white/10 rounded-2xl pl-3 pr-4 py-3 shadow-xl hover:ring-primary/50 transition-colors"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary text-lg">
        🚀
      </span>
      <span className="text-left">
        <span className="block text-[11px] text-subtext">클릭형 데모</span>
        <span className="block text-sm font-bold text-white">프로토타입 바로가기 →</span>
      </span>
    </motion.a>
  );
}

function WeDoRow() {
  return (
    <div className="border-t border-white/10 pt-5 md:max-w-xs">
      <div className="text-xs font-semibold tracking-[0.2em] text-primary mb-2">WE DO</div>
      <div className="flex flex-wrap gap-x-1 gap-y-1">
        {WE_DO.map((w, i) => (
          <span key={w} className="text-sm text-subtext">
            {w}
            {i < WE_DO.length - 1 && <span className="mx-3 text-white/20">/</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function MarqueeTicker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/10 bg-surfaceAlt py-6">
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-33.3333%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-12 text-2xl md:text-3xl font-bold tracking-tight text-white/25"
          >
            {t}
            <span className="text-primary/40">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ServiceRow({ index, item, active, onEnter, onLeave }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative border-b border-white/10 py-8 first:pt-0 last:border-b-0"
    >
      <div className="flex items-start gap-8">
        <span className="w-12 shrink-0 pt-1 font-mono text-sm text-primary">
          /{String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <div className="text-2xl font-bold text-white transition-colors group-hover:text-primary">
            {item.title}
          </div>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-subtext">{item.desc}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {item.steps.map((step, i) => (
              <React.Fragment key={step}>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {step}
                </span>
                {i < item.steps.length - 1 && <span className="text-xs text-slate-600">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-none absolute right-8 top-1/2 hidden h-24 w-24 -translate-y-1/2 items-center justify-center rounded-3xl bg-primary/15 text-5xl ring-1 ring-primary/30 backdrop-blur-sm md:flex"
          >
            {item.icon}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServicesSection() {
  const [hovered, setHovered] = useState(null);
  return (
    <FadeInSection id="solution" className="bg-surface py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          index={2}
          label="What We Do"
          lines={["무엇을", "자동화하나요"]}
          sub="Smart Campus DX 3가지 핵심 서비스"
        />
        <div>
          {SOLUTIONS.map((s, i) => (
            <ServiceRow
              key={s.title}
              index={i}
              item={s}
              active={hovered === i}
              onEnter={() => setHovered(i)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}

function ProcessAccordion() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <FadeInSection id="roadmap" className="bg-surface py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader index={6} label="Roadmap" lines={["3개년 단계별", "추진 로드맵"]} />
        <div className="border-t border-white/10">
          {ROADMAP.map((r, i) => {
            const open = openIndex === i;
            return (
              <div key={r.year} className="border-b border-white/10">
                <button
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="group flex w-full items-center gap-6 py-7 text-left"
                >
                  <span className="w-12 shrink-0 font-mono text-sm text-primary">
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.bg}`} />
                  <span className="flex-1 text-2xl md:text-3xl font-bold text-white transition-colors group-hover:text-primary">
                    {r.year}년
                  </span>
                  <span
                    className={`shrink-0 text-2xl font-light text-primary transition-transform duration-300 ${open ? "rotate-45" : ""}`}
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
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-3 pb-8 pl-[4.5rem]">
                        {r.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-subtext">
                            <span className="mt-0.5 text-primary">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </FadeInSection>
  );
}

export default function App() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  return (
    <div id="top" className="font-sans text-ink bg-surface">
      <Navbar />

      {/* 1. Hero */}
      <section ref={heroRef} className="relative min-h-screen pt-32 pb-10 px-6 overflow-hidden flex flex-col">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroBgY }}>
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center blur-[2px]"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}hero-bg.jpg)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/75 to-surface/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-start justify-between gap-6 border-b border-white/10 pb-5"
            >
              <div className="flex flex-wrap items-center gap-x-10 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-subtext">
                <span>공공기관 인재개발원</span>
                <span className="hidden sm:inline">디지털 전환 플랫폼</span>
                <span className="hidden md:inline text-primary">EST. 2026</span>
              </div>
              <FloatingCard />
            </motion.div>
          </div>

          <h1 className="my-10 text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.95]">
            <RevealLine text="인재개발원 운영," />
            <RevealLine text="스스로 돌아갑니다" delay={0.12} />
          </h1>

          <div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 border-t border-white/10 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-md"
              >
                <p className="text-lg text-subtext leading-relaxed mb-8">
                  연간 1,400시간의 반복업무를 자동화하고
                  <br />
                  교육생 중심의 스마트 캠퍼스를 구축합니다
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href={PROTOTYPE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-primary text-white font-semibold px-7 py-3.5 hover:bg-blue-600 transition-colors"
                  >
                    프로토타입 보기 ↗
                  </a>
                  <a
                    href="#problem"
                    className="rounded-full border border-white/20 text-ink font-semibold px-7 py-3.5 hover:border-primary hover:text-primary transition-colors"
                  >
                    자세히 알아보기
                  </a>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="flex items-end gap-12"
              >
                <WeDoRow />
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden md:block pb-1 text-xs font-semibold uppercase tracking-[0.25em] text-subtext"
                >
                  Scroll ↓
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <MarqueeTicker />

      {/* 2. Problem */}
      <FadeInSection id="problem" className="bg-surfaceAlt py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader index={1} label="The Problem" lines={["지금 반복되는", "업무들"]} />
          <div className="mb-14 grid grid-cols-3 border border-white/10 divide-x divide-y divide-white/10 [&>*:nth-child(-n+3)]:border-t-0">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative p-7 transition-colors hover:bg-card"
              >
                <div className="mb-8 flex items-start justify-between">
                  <span className="font-mono text-xs text-subtext">
                    ( {String(i + 1).padStart(2, "0")} )
                  </span>
                  <span className="font-mono text-2xl font-bold text-red-400/80">{p.hours}</span>
                </div>
                <div className="text-3xl mb-3">{p.emoji}</div>
                <div className="text-lg font-bold text-white mb-1">{p.title}</div>
                <div className="text-sm text-subtext leading-relaxed">{p.desc}</div>
              </motion.div>
            ))}
          </div>
          <div className="relative overflow-hidden border border-white/10 px-8 py-8 text-center">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold/20 blur-[100px]" />
            <span className="relative text-white text-lg font-semibold">
              과정 1개당 16시간 × 연간 106개 = <span className="text-gold">연간 1,400시간 낭비</span>
            </span>
          </div>
        </div>
      </FadeInSection>

      {/* 3. Solution */}
      <ServicesSection />

      {/* 4. Device Mockup */}
      <FadeInSection id="devices" className="bg-primaryDark py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-8 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="font-mono text-xs text-subtext">( 03 )</span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">One Device</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.02] mb-6">
              <RevealLine text="아이패드 하나로" />
              <RevealLine text="모든 것을" delay={0.1} />
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-10">
              버스 예약부터 출결까지, 흩어져 있던 연수 과정 전체를
              <br />
              하나의 화면 안에서 끝냅니다.
            </p>
            <div className="flex flex-wrap gap-2">
              {DEVICE_FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-4 py-2"
                >
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-xs font-medium text-slate-200">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full h-[420px]">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
            </div>
            <Canvas camera={{ position: [0, 0, 7], fov: 35 }}>
              <SceneLights />
              <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
                <IPadMesh position={[-1.2, 0, 0]} scale={0.85} rotationSpeed={0.1} />
              </Float>
              <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.9}>
                <PhoneMesh position={[1.5, -0.4, 0.5]} scale={0.85} rotationSpeed={0.12} />
              </Float>
            </Canvas>
          </div>
        </div>
      </FadeInSection>

      {/* 5. Stats */}
      <FadeInSection id="stats" className="bg-surface py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader index={4} label="By the Numbers" lines={["숫자로 보는", "변화"]} />
          <div className="grid grid-cols-4 divide-x divide-white/10 border-y border-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="px-6 py-10 text-center first:pl-0 last:pr-0">
                <CountUpNumber target={s.value} suffix={s.suffix} />
                <div className="text-sm text-subtext font-medium mt-3">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 6. Paperless Synergy */}
      <FadeInSection id="synergy" className="bg-surfaceAlt py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader index={5} label="Synergy" lines={["페이퍼리스와 함께면", "더 강력합니다"]} />
          <div className="relative grid grid-cols-2 border border-white/10 divide-x divide-white/10">
            <div className="p-8">
              <div className="mb-8 flex items-start justify-between">
                <span className="font-mono text-xs text-subtext">( A )</span>
                <span className="text-3xl">📄</span>
              </div>
              <div className="text-lg font-bold text-white mb-2">페이퍼리스 사업</div>
              <div className="text-sm text-subtext leading-relaxed">
                전 교육생 아이패드 지급으로 종이 교재를 디지털로 전환합니다.
              </div>
            </div>
            <div className="p-8">
              <div className="mb-8 flex items-start justify-between">
                <span className="font-mono text-xs text-subtext">( B )</span>
                <span className="text-3xl">🚀</span>
              </div>
              <div className="text-lg font-bold text-white mb-2">Smart Campus DX</div>
              <div className="text-sm text-subtext leading-relaxed">
                버스·객실·일정·출결까지 인재개발원 운영 전 과정을 자동화합니다.
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/40 blur-2xl" />
              <div className="relative bg-primary text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                × 시너지
              </div>
            </div>
          </div>
          <div className="mt-10 border border-gold/40 bg-gold/10 px-8 py-6 text-center">
            <span className="text-gold text-lg font-bold">
              아이패드 1대 = 교재 + 정보 + 버스 + 객실 + 출결
            </span>
          </div>
        </div>
      </FadeInSection>

      {/* 7. Roadmap */}
      <ProcessAccordion />

      {/* 8. FAQ */}
      <FadeInSection id="faq" className="bg-surfaceAlt py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeader index={7} label="FAQ" lines={["자주 묻는", "질문"]} />
          <div className="border-t border-white/10">
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} index={i} {...f} />
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 9. CTA */}
      <FadeInSection className="relative bg-primaryDark py-32 px-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-gold/20 blur-[100px]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Get Started</div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.05] mb-10">
            <RevealLine text="스마트 캠퍼스 DX," />
            <RevealLine text="지금 시작하세요" delay={0.1} />
          </h2>
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full bg-gold text-white font-bold px-10 py-4 hover:brightness-110 transition-all mb-6"
          >
            프로토타입 시연하기 ↗
          </a>
          <p className="text-slate-300 text-sm">인재개발원 운영의 디지털 전환, 함께 만들어갑니다</p>
        </div>
      </FadeInSection>

      <footer className="bg-surface border-t border-white/10 px-6 pt-16 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 pb-16">
            <div className="max-w-xs">
              <div className="text-sm font-black uppercase tracking-[0.15em] text-white mb-3">
                Smart Campus DX<span className="text-primary">®</span>
              </div>
              <p className="text-xs text-subtext leading-relaxed">
                공공기관 인재개발원 운영 디지털 전환 플랫폼.
                <br />
                반복업무는 시스템에게, 사람은 교육에.
              </p>
            </div>
            <div className="flex gap-16">
              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-subtext">Menu</div>
                <ul className="space-y-2">
                  {NAV_LINKS.slice(0, 4).map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-sm text-slate-300 hover:text-white transition-colors">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-subtext">More</div>
                <ul className="space-y-2">
                  {NAV_LINKS.slice(4).map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-sm text-slate-300 hover:text-white transition-colors">{l.label}</a>
                    </li>
                  ))}
                  <li>
                    <a href={PROTOTYPE_URL} target="_blank" rel="noreferrer" className="text-sm text-primary hover:text-white transition-colors">프로토타입 ↗</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 py-5 text-[11px] uppercase tracking-[0.2em] text-subtext">
            <span>© 2026 Smart Campus DX</span>
            <span>Seoul · Korea</span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="select-none whitespace-nowrap text-center font-black tracking-tighter leading-none text-white/10 text-[8.5vw] -mb-[1.7vw]"
        >
          SMART CAMPUS DX
        </motion.div>
      </footer>
    </div>
  );
}
