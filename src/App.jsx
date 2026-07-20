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
  { href: "#problem", label: "소개", num: "01" },
  { href: "#solution", label: "기능", num: "02" },
  { href: "#stats", label: "효과", num: "03" },
  { href: "#roadmap", label: "로드맵", num: "04" },
];

const PROBLEMS = [
  { title: "수요조사", desc: "버스·객실 수요조사지 배포와 취합", hours: "3h" },
  { title: "엑셀정리", desc: "설문 결과를 엑셀로 일일이 정리", hours: "2h" },
  { title: "업체연락", desc: "버스·식당 등 협력업체 유선 연락", hours: "2h" },
  { title: "객실배정", desc: "성별·조 편성을 고려한 수기 객실배정", hours: "3h" },
  { title: "종이출력", desc: "시간표·좌석표·안내문 출력과 게시", hours: "2h" },
  { title: "현장확인", desc: "입퇴실·탑승 여부를 일일이 현장 확인", hours: "4h" },
];

const SOLUTIONS = [
  {
    title: "Smart Bus",
    desc: "버스 수요조사부터 탑승 확인까지 전 과정을 앱 하나로 자동화합니다.",
    steps: ["수요조사", "노선확정", "좌석선택", "탑승QR"],
  },
  {
    title: "Smart Room",
    desc: "신청기간 내 본인선택, 마감 후 규칙 기반 자동배정으로 민원을 줄입니다.",
    steps: ["본인선택", "신청마감", "자동배정", "배정완료"],
  },
  {
    title: "Smart Schedule",
    desc: "시간표를 한 번 입력하면 앱·DID·QR까지 자동으로 연동됩니다.",
    steps: ["시간표입력", "앱연동", "DID연동", "QR연동"],
  },
  {
    title: "Smart Access",
    desc: "QR 하나로 출결·식사·탑승 확인까지 현장 확인 업무를 대체합니다.",
    steps: ["QR발급", "출결확인", "식수확인", "탑승확인"],
  },
];

const DEVICE_FEATURES = [
  { label: "버스예약" },
  { label: "객실확인" },
  { label: "강의일정" },
  { label: "출결QR" },
];

const STATS = [
  { value: 980, suffix: "h", label: "연간 절감" },
  { value: 106, suffix: "개", label: "자동화 과정" },
  { value: 0, suffix: "장", label: "종이 출력 목표" },
  { value: 70, suffix: "%", label: "업무 자동화율" },
];

const ROADMAP = [
  {
    year: "2026",
    items: ["Smart Bus 파일럿 도입", "Smart Room 시범운영", "교육생 앱 베타 출시", "1개 인재개발원 적용"],
  },
  {
    year: "2027",
    items: ["Smart Schedule 전면 도입", "페이퍼리스 사업 연계 확대", "전 인재개발원으로 확산", "운영 데이터 대시보드 구축"],
  },
  {
    year: "2028~",
    items: ["AI 기반 수요예측 도입", "기관 전체 표준 플랫폼화", "외부 기관 벤치마킹 대응", "완전 자동화 운영체계 완성"],
  },
];

const TICKER_ITEMS = ["Smart Bus", "Smart Room", "Smart Schedule", "Smart Access", "Smart Campus DX"];

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
    <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-subtext">
      {children}
    </div>
  );
}

function GhostButton({ href, children, external = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="inline-block rounded-full border border-ink/40 px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-black"
    >
      {children}
    </a>
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
    <span ref={ref} className="font-serif italic font-bold text-ink whitespace-nowrap text-[8vw] leading-none">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function FaqItem({ index, q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line py-6">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-5 text-left">
        <span className="w-10 shrink-0 font-mono text-xs text-subtext">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-base font-medium text-ink">{q}</span>
        <span
          className={`shrink-0 text-xl font-light text-ink transition-transform duration-300 ${open ? "rotate-45" : ""}`}
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
            <p className="pt-3 pl-[3.75rem] text-sm font-light leading-relaxed text-subtext">{a}</p>
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
  { href: "#roadmap", label: "로드맵" },
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
    <div className="relative z-10 overflow-hidden border-b border-line bg-surface py-6">
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-33.3333%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-serif italic text-2xl md:text-3xl font-bold text-ink/20"
          >
            {t}
            <span className="text-ink/30">✦</span>
          </span>
        ))}
      </motion.div>
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

      {/* 2. Problem */}
      <FadeInSection id="problem" className="bg-surface px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Why We Built This</SectionLabel>
          <h2 className="mb-16 font-serif italic font-bold text-ink leading-[1.05] text-[6vw]">
            지금 반복되는
            <br />
            업무들
          </h2>
          <div className="border-t border-line">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                className="group flex items-baseline gap-8 border-b border-line py-7"
              >
                <span className="w-10 shrink-0 font-mono text-xs text-subtext">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <span className="text-xl font-normal text-ink md:text-2xl">{p.title}</span>
                  <span className="ml-5 hidden text-sm font-light text-subtext md:inline">{p.desc}</span>
                </div>
                <span className="shrink-0 font-serif italic text-2xl font-bold text-ink/0 transition-colors duration-300 group-hover:text-ink">
                  {p.hours}
                </span>
              </motion.div>
            ))}
          </div>
          <p className="mt-10 text-right text-sm font-light text-subtext">
            과정 1개당 16시간 × 연간 106개 = <span className="text-ink">연간 1,400시간 낭비</span>
          </p>
        </div>
      </FadeInSection>

      {/* 3. Solution */}
      <FadeInSection id="solution" className="bg-surface px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>What We Built</SectionLabel>
          <h2 className="mb-16 font-serif italic font-bold text-ink leading-[1.05] text-[6vw]">
            What We
            <br />
            Built
          </h2>
          <div className="grid gap-x-14 gap-y-12 md:grid-cols-2">
            {SOLUTIONS.map((s, i) => (
              <motion.div
                key={s.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="group border-l border-line pl-8 transition-colors duration-300 hover:border-ink"
              >
                <div className="mb-4 font-mono text-xs text-subtext">/{String(i + 1).padStart(2, "0")}</div>
                <div className="mb-3 font-serif italic text-3xl font-bold text-ink">{s.title}</div>
                <p className="mb-6 max-w-sm text-sm font-light leading-relaxed text-subtext">{s.desc}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-light text-subtext">
                  {s.steps.map((step, j) => (
                    <React.Fragment key={step}>
                      <span>{step}</span>
                      {j < s.steps.length - 1 && <span className="text-ink/30">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 4. Device Mockup */}
      <FadeInSection id="devices" className="bg-surfaceAlt px-6 py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-12">
          <div>
            <SectionLabel>One Device</SectionLabel>
            <h2 className="mb-6 font-serif italic font-bold text-ink leading-[1.05] text-[4.5vw]">
              아이패드 하나로
              <br />
              모든 것을
            </h2>
            <p className="mb-10 text-base font-light leading-relaxed text-subtext">
              버스 예약부터 출결까지, 흩어져 있던 연수 과정 전체를
              <br />
              하나의 화면 안에서 끝냅니다.
            </p>
            <div className="flex flex-wrap gap-2">
              {DEVICE_FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="rounded-full border border-line px-4 py-2 text-xs font-light text-ink/80"
                >
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[420px] w-full">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="h-80 w-80 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(245,240,232,0.06), transparent 70%)" }}
              />
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
      <FadeInSection id="stats" className="bg-surfaceAlt px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>By the Numbers</SectionLabel>
          <h2 className="mb-16 font-serif italic font-bold text-ink leading-[1.05] text-[6vw]">
            숫자로 보는
            <br />
            변화
          </h2>
          <div className="grid grid-cols-2 gap-x-10 gap-y-16 border-t border-line pt-16 md:grid-cols-2">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
              >
                <CountUpNumber target={s.value} suffix={s.suffix} />
                <div className="mt-4 text-sm font-light text-subtext">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 6. Paperless Synergy */}
      <FadeInSection id="synergy" className="bg-surface px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Synergy</SectionLabel>
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <h2 className="mb-8 font-serif italic font-bold text-ink leading-[1.1] text-[4.5vw]">
                아이패드 1대
                <br />= 모든 것
              </h2>
              <p className="mb-6 text-base font-light leading-relaxed text-subtext">
                페이퍼리스 사업이 전 교육생에게 아이패드를 지급해 종이 교재를 디지털로 전환하고,
                Smart Campus DX가 버스·객실·일정·출결까지 인재개발원 운영 전 과정을 자동화합니다.
              </p>
              <p className="text-sm font-light text-subtext">교재 + 정보 + 버스 + 객실 + 출결</p>
            </div>
            <div className="space-y-px">
              {["페이퍼리스 사업 — 종이 교재의 디지털 전환", "Smart Campus DX — 운영 전 과정의 자동화"].map(
                (t, i) => (
                  <motion.div
                    key={t}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    className="border border-line p-8 text-sm font-light text-ink/90 transition-colors duration-300 hover:border-ink/40"
                  >
                    <span className="mr-4 font-mono text-xs text-subtext">{i === 0 ? "( A )" : "( B )"}</span>
                    {t}
                  </motion.div>
                )
              )}
              <div className="border border-line p-8 text-center font-serif italic text-xl font-bold text-ink">
                A × B = 시너지
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* 7. Roadmap */}
      <FadeInSection id="roadmap" className="bg-surface px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Roadmap</SectionLabel>
          <h2 className="mb-16 font-serif italic font-bold text-ink leading-[1.05] text-[6vw]">
            3개년 단계별
            <br />
            추진 로드맵
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {ROADMAP.map((r, i) => (
              <motion.div
                key={r.year}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="border p-8 transition-colors duration-300 hover:border-ink/50"
                style={{ borderColor: "rgba(245,240,232,0.1)" }}
              >
                <div className="mb-7 font-serif italic text-4xl font-bold text-ink">{r.year}</div>
                <ul className="space-y-3">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-light leading-relaxed text-subtext">
                      <span className="mt-2 h-px w-4 shrink-0 bg-ink/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 8. FAQ */}
      <FadeInSection id="faq" className="bg-surface px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mb-16 font-serif italic font-bold text-ink leading-[1.05] text-[5vw]">
            자주 묻는 질문
          </h2>
          <div className="border-t border-line">
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} index={i} {...f} />
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 9. CTA */}
      <FadeInSection className="relative overflow-hidden bg-surface px-6 py-36 text-center">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245,240,232,0.05), transparent 65%)" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl">
          <SectionLabel>Get Started</SectionLabel>
          <h2 className="mb-12 font-serif italic font-bold text-ink leading-[1.08] text-[5.5vw]">
            스마트 캠퍼스 DX,
            <br />
            지금 시작하세요
          </h2>
          <div className="mb-8 flex items-center justify-center gap-4">
            <GhostButton href={PROTOTYPE_URL} external>
              프로토타입 보기
            </GhostButton>
            <GhostButton href="#problem">자세히 알아보기</GhostButton>
          </div>
          <p className="text-sm font-light text-subtext">인재개발원 운영의 디지털 전환, 함께 만들어갑니다</p>
        </div>
      </FadeInSection>

      {/* Footer */}
      <footer className="overflow-hidden border-t border-line bg-surface px-6 pt-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-10 pb-16 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <div className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-ink">
                Smart Campus DX
              </div>
              <p className="text-xs font-light leading-relaxed text-subtext">
                공공기관 인재개발원 운영 디지털 전환 플랫폼.
                <br />
                반복업무는 시스템에게, 사람은 교육에.
              </p>
            </div>
            <div className="flex gap-16">
              <div>
                <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-subtext">Menu</div>
                <ul className="space-y-2">
                  {NAV_LINKS.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-sm font-light text-ink/80 transition-colors hover:text-ink">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-subtext">More</div>
                <ul className="space-y-2">
                  <li>
                    <a href="#synergy" className="text-sm font-light text-ink/80 transition-colors hover:text-ink">시너지</a>
                  </li>
                  <li>
                    <a href="#faq" className="text-sm font-light text-ink/80 transition-colors hover:text-ink">FAQ</a>
                  </li>
                  <li>
                    <a
                      href={PROTOTYPE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-light text-ink transition-colors hover:text-subtext"
                    >
                      프로토타입 ↗
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line py-5 text-[11px] font-light uppercase tracking-[0.25em] text-subtext">
            <span>© 2026 Smart Campus DX</span>
            <span>Seoul · Korea</span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="select-none whitespace-nowrap text-center font-serif italic font-bold leading-none text-ink/10 text-[8.5vw] -mb-[1.7vw]"
        >
          Smart Campus DX
        </motion.div>
      </footer>
    </div>
  );
}
