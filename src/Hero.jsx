import React, { useState } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#", hasChevron: true },
  { label: "Reviews", href: "#" },
  { label: "Contact us", href: "#" },
];

/* ---------- Inline icons ---------- */

function ChevronDown({ className = "" }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ---------- Logo ---------- */
/*
 * Replace the `d` below with the full "Future" logo path.
 * The brief supplied a truncated path
 * ("M1.04356 6.35771L13.6437 0.666504…"), so this is a faithful
 * placeholder mark kept in the same style: white fill, ~28px tall.
 */
function Logo({ className = "" }) {
  return (
    <svg
      className={className}
      width="34"
      height="28"
      viewBox="0 0 34 28"
      fill="none"
      aria-label="Future"
      role="img"
    >
      <path
        d="M1.04356 6.35771L13.6437 0.666504L21.2 4.3v6.9l-7.556 3.63L1.04356 8.9V6.35771Z"
        fill="#ffffff"
      />
      <path
        d="M14.9 15.6l7.55-3.63L33 16.9v2.55l-12.6 5.69-5.5-2.64v-6.9Z"
        fill="#ffffff"
        fillOpacity="0.75"
      />
    </svg>
  );
}

/* ---------- Navbar ---------- */

function Navbar({ onOpenMenu }) {
  return (
    <nav className="relative z-20 w-full px-6 py-[16px] md:px-[120px]">
      <div className="flex items-center justify-between gap-8">
        {/* Left cluster: logo + desktop links */}
        <div className="flex items-center gap-10">
          <a href="#" aria-label="Home" className="shrink-0">
            <Logo />
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center gap-1 font-['Manrope'] text-[14px] font-medium text-white transition-opacity hover:opacity-80"
                >
                  {link.label}
                  {link.hasChevron && <ChevronDown className="mt-[1px]" />}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right cluster: desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="rounded-[8px] border border-[#d4d4d4] bg-white px-[18px] py-[9px] font-['Manrope'] text-[14px] font-semibold text-[#171717] transition-colors hover:bg-[#f5f5f5]"
          >
            Sign In
          </a>
          <a
            href="#"
            className="rounded-[8px] bg-[#7b39fc] px-[18px] py-[9px] font-['Manrope'] text-[14px] font-semibold text-[#fafafa] shadow-[0_4px_14px_rgba(123,57,252,0.35)] transition-colors hover:bg-[#8f56fc]"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="text-white transition-opacity hover:opacity-80 md:hidden"
        >
          <MenuIcon />
        </button>
      </div>
    </nav>
  );
}

/* ---------- Mobile menu overlay ---------- */

function MobileMenu({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black md:hidden">
      <div className="flex items-center justify-between px-6 py-[16px]">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="text-white transition-opacity hover:opacity-80"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="flex items-center gap-2 py-3 font-['Manrope'] text-2xl font-medium text-white transition-opacity hover:opacity-80"
          >
            {link.label}
            {link.hasChevron && <ChevronDown className="mt-1 h-5 w-5" />}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-3 px-8 pb-12">
        <a
          href="#"
          onClick={onClose}
          className="rounded-[8px] border border-[#d4d4d4] bg-white px-5 py-3 text-center font-['Manrope'] text-[15px] font-semibold text-[#171717]"
        >
          Sign In
        </a>
        <a
          href="#"
          onClick={onClose}
          className="rounded-[8px] bg-[#7b39fc] px-5 py-3 text-center font-['Manrope'] text-[15px] font-semibold text-[#fafafa] shadow-[0_4px_14px_rgba(123,57,252,0.35)]"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#2b2344]">
      {/* Opaque full-screen video background — no overlay */}
      <video
        className="absolute inset-0 z-0 h-full min-h-screen w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* Foreground column */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar onOpenMenu={() => setMenuOpen(true)} />

        {/* Centered hero content */}
        <div className="relative z-10 mt-32 flex flex-col items-center px-6 text-center">
          {/* Tagline pill (glassmorphism) */}
          <div className="flex h-[38px] items-center gap-2 rounded-[10px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] pl-[6px] pr-4 backdrop-blur-md">
            <span className="rounded-[6px] bg-[#7b39fc] px-2 py-[3px] font-['Cabin'] text-[13px] font-medium leading-none text-white">
              New
            </span>
            <span className="font-['Cabin'] text-[14px] font-medium text-white">
              Say Hello to Datacore v3.2
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-8 max-w-[900px] font-['Instrument_Serif'] text-5xl font-normal leading-[1.1] text-white md:text-[96px]">
            Book your perfect stay instantly{" "}
            <em className="italic" style={{ letterSpacing: "0.01em" }}>
              and
            </em>{" "}
            hassle-free
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-[662px] font-['Inter'] text-[18px] font-normal leading-relaxed text-white/70">
            Discover handpicked hotels, resorts, and stays across your favorite
            destinations. Enjoy exclusive deals, fast booking, and 24/7 support.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#"
              className="rounded-[10px] bg-[#7b39fc] px-7 py-[14px] font-['Cabin'] text-[16px] font-medium text-white shadow-[0_6px_20px_rgba(123,57,252,0.4)] transition-colors hover:bg-[#8f56fc]"
            >
              Book a Free Demo
            </a>
            <a
              href="#"
              className="rounded-[10px] bg-[#2b2344] px-7 py-[14px] font-['Cabin'] text-[16px] font-medium text-[#f6f7f9] transition-colors hover:bg-[#3a305c]"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </section>
  );
}
