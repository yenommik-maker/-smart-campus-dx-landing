import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";

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
        <meshStandardMaterial color="#2563EB" roughness={0.15} metalness={0.1} />
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
        <meshStandardMaterial color="#2563EB" roughness={0.15} metalness={0.1} />
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="text-lg font-bold text-primaryDark tracking-tight">
          Smart Campus DX
        </a>
        <div className="flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-subtext hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
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
    <span ref={ref} className="text-5xl font-bold text-primaryDark">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-b-0 py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left gap-4"
      >
        <span className="text-base font-semibold text-ink">{q}</span>
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
            <p className="pt-3 text-sm text-subtext leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <div id="top" className="font-sans text-ink bg-white">
      <Navbar />

      {/* 1. Hero */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              ✨ 공공기관 인재개발원 디지털 전환
            </div>
            <h1 className="text-5xl font-bold text-ink leading-[1.25] mb-6">
              인재개발원 운영,
              <br />
              이제 스스로 돌아갑니다
            </h1>
            <p className="text-lg text-subtext leading-relaxed mb-10">
              연간 1,400시간의 반복업무를 자동화하고
              <br />
              교육생 중심의 스마트 캠퍼스를 구축합니다
            </p>
            <div className="flex items-center gap-4">
              <a
                href={PROTOTYPE_URL}
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors"
              >
                프로토타입 보기
              </a>
              <a
                href="#problem"
                className="border border-slate-300 text-ink font-semibold px-6 py-3.5 rounded-xl hover:border-primary hover:text-primary transition-colors"
              >
                자세히 알아보기
              </a>
            </div>
          </motion.div>

          <div className="w-full h-[480px]">
            <Canvas camera={{ position: [0, 0, 6], fov: 35 }}>
              <SceneLights />
              <IPadMesh position={[0, -0.1, 0]} rotationSpeed={0.15} />
            </Canvas>
          </div>
        </div>
      </section>

      {/* 2. Problem */}
      <FadeInSection id="problem" className="bg-[#F8FAFC] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-ink text-center mb-14">
            지금 인재개발원에서는 매일 이런 일이 반복됩니다
          </h2>
          <div className="grid grid-cols-3 gap-6 mb-14">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{p.emoji}</span>
                  <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    {p.hours}
                  </span>
                </div>
                <div className="text-base font-bold text-ink mb-1">{p.title}</div>
                <div className="text-sm text-subtext leading-relaxed">{p.desc}</div>
              </motion.div>
            ))}
          </div>
          <div className="bg-primaryDark rounded-2xl px-8 py-6 text-center">
            <span className="text-white text-lg font-semibold">
              과정 1개당 16시간 × 연간 106개 = <span className="text-gold">연간 1,400시간 낭비</span>
            </span>
          </div>
        </div>
      </FadeInSection>

      {/* 3. Solution */}
      <FadeInSection id="solution" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-ink text-center mb-14">
            Smart Campus DX 3가지 핵심 서비스
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {SOLUTIONS.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-8 ring-1 ring-slate-200 hover:ring-2 hover:ring-primary hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-4xl mb-5">{s.icon}</div>
                <div className="text-xl font-bold text-ink mb-3">{s.title}</div>
                <p className="text-sm text-subtext leading-relaxed mb-6">{s.desc}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {s.steps.map((step, i) => (
                    <React.Fragment key={step}>
                      <span className="text-xs font-medium text-primary bg-blue-50 px-2.5 py-1 rounded-full">
                        {step}
                      </span>
                      {i < s.steps.length - 1 && <span className="text-slate-300 text-xs">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 4. Device Mockup */}
      <FadeInSection id="devices" className="bg-primaryDark py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white leading-[1.3] mb-6">
              교육생은 아이패드 하나로
              <br />
              모든 것을
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-10">
              버스 예약부터 출결까지, 흩어져 있던 연수 과정 전체를
              <br />
              하나의 화면 안에서 끝냅니다.
            </p>
            <div className="grid grid-cols-4 gap-4">
              {DEVICE_FEATURES.map((f) => (
                <div key={f.label} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                    {f.icon}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-[420px]">
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
      <FadeInSection id="stats" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#F8FAFC] rounded-2xl p-8 text-center ring-1 ring-slate-100">
              <CountUpNumber target={s.value} suffix={s.suffix} />
              <div className="text-sm text-subtext font-medium mt-3">{s.label}</div>
            </div>
          ))}
        </div>
      </FadeInSection>

      {/* 6. Paperless Synergy */}
      <FadeInSection id="synergy" className="bg-[#F8FAFC] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-ink text-center mb-14">
            페이퍼리스 사업과 함께하면 더 강력합니다
          </h2>
          <div className="relative grid grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 ring-1 ring-slate-200">
              <div className="text-3xl mb-4">📄</div>
              <div className="text-lg font-bold text-ink mb-2">페이퍼리스 사업</div>
              <div className="text-sm text-subtext leading-relaxed">
                전 교육생 아이패드 지급으로 종이 교재를 디지털로 전환합니다.
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 ring-1 ring-slate-200">
              <div className="text-3xl mb-4">🚀</div>
              <div className="text-lg font-bold text-ink mb-2">Smart Campus DX</div>
              <div className="text-sm text-subtext leading-relaxed">
                버스·객실·일정·출결까지 인재개발원 운영 전 과정을 자동화합니다.
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              × 시너지
            </div>
          </div>
          <div className="mt-10 bg-gold rounded-2xl px-8 py-6 text-center">
            <span className="text-white text-lg font-bold">
              아이패드 1대 = 교재 + 정보 + 버스 + 객실 + 출결
            </span>
          </div>
        </div>
      </FadeInSection>

      {/* 7. Roadmap */}
      <FadeInSection id="roadmap" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-ink text-center mb-14">3개년 단계별 추진 로드맵</h2>
          <div className="grid grid-cols-3 gap-6">
            {ROADMAP.map((r) => (
              <div key={r.year} className={`rounded-2xl p-7 ${r.bg}`}>
                <div className="text-white text-2xl font-bold mb-5">{r.year}</div>
                <ul className="space-y-3">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-white/90 text-sm leading-relaxed">
                      <span className="mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 8. FAQ */}
      <FadeInSection id="faq" className="bg-[#F8FAFC] py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-ink text-center mb-14">자주 묻는 질문</h2>
          <div className="bg-white rounded-2xl px-8 ring-1 ring-slate-100">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* 9. CTA */}
      <FadeInSection className="bg-primaryDark py-28 px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">스마트 캠퍼스 DX, 지금 시작하세요</h2>
        <a
          href={PROTOTYPE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-gold text-white font-bold px-8 py-4 rounded-xl hover:brightness-110 transition-all mb-6"
        >
          프로토타입 시연하기
        </a>
        <p className="text-slate-300 text-sm">인재개발원 운영의 디지털 전환, 함께 만들어갑니다</p>
      </FadeInSection>

      <footer className="bg-white py-8 text-center text-xs text-subtext border-t border-slate-100">
        © 2026 Smart Campus DX
      </footer>
    </div>
  );
}
