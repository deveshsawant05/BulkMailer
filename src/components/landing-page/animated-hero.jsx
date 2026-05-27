"use client";

import { useEffect, useRef } from "react";
import {
  motion, useMotionValue, useReducedMotion, useSpring,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, CheckCheck, Mail, Send, Sparkles } from "lucide-react";
import { MagneticLink } from "./landing-motion";

const connections = ["real connection.", "personal hello.", "great conversation."];
const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

function FloatingEmail({ className, initials, name, children, delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`hero-email-position ${className}`}
      initial={{ opacity: 0, y: reduced ? 0 : 25, scale: reduced ? 1 : 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: reduced ? 0 : delay, duration: reduced ? 0 : 1 }}
    >
      <motion.div className="hero-floating-email" drag={!reduced} dragConstraints={{ left: -25, right: 25, top: -25, bottom: 25 }} dragElastic={0.15} dragSnapToOrigin whileHover={reduced ? undefined : { scale: 1.05, rotate: 0 }} whileTap={reduced ? undefined : { scale: 0.97 }}>
        <div className="hero-email-top"><span>{initials}</span><div>{name}<small>A little more personal</small></div><Mail size={14} /></div>
        <p>{children}</p>
        <div className="hero-email-lines"><span /><span /></div>
        <div className="hero-email-sent"><CheckCheck size={12} />Made for you</div>
      </motion.div>
    </motion.div>
  );
}

export default function AnimatedHero() {
  const reduced = useReducedMotion();
  const headlineRef = useRef(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 60, damping: 22 });
  const y = useSpring(pointerY, { stiffness: 60, damping: 22 });

  useEffect(() => {
    const line = headlineRef.current;
    if (!line) return;
    let active = true;
    const prefix = line.querySelector(".hero-prefix");
    const measure = () => {
      if (!active) return;
      const gap = parseFloat(getComputedStyle(line).columnGap) || 0;
      const available = Math.max(1, line.clientWidth - prefix.getBoundingClientRect().width - gap);
      line.style.setProperty("--word-max-width", `${available}px`);
      line.querySelectorAll(".hero-headline-measure > span").forEach((word, index) => {
        line.style.setProperty(`--hero-word-width-${index}`, `${Math.ceil(word.getBoundingClientRect().width)}px`);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(line);
    observer.observe(prefix);
    document.fonts.ready.then(measure);
    return () => { active = false; observer.disconnect(); };
  }, []);

  function trackPointer(event) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left - rect.width / 2) * 0.018);
    pointerY.set((event.clientY - rect.top - rect.height / 2) * 0.025);
  }

  return (
    <section className="animated-hero" aria-labelledby="hero-title" onPointerMove={trackPointer} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
      <div className="hero-aurora" aria-hidden="true"><span /><span /><span /></div>
      <div className="hero-dot-field" aria-hidden="true" />
      <div className="hero-orbits" aria-hidden="true"><span /><span /><span /></div>
      <div className="hero-particles" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <span key={index} style={{ "--particle-index": index, left: `${8 + (index * 19) % 84}%`, top: `${18 + (index * 13) % 68}%` }} />)}</div>

      <motion.div className="hero-floating-scene" style={{ x: reduced ? 0 : x, y: reduced ? 0 : y }} aria-hidden="true">
        <FloatingEmail className="hero-email-left" initials="AC" name="Alex Chen" delay={0.7}>Hi <mark>Alex</mark>,<br />a little something just for you.</FloatingEmail>
        <FloatingEmail className="hero-email-right" initials="SR" name="Sam Rivera" delay={1}>Good things,<br />for <mark>your team.</mark></FloatingEmail>
        <div className="hero-flying-icon hero-flying-send"><Send size={27} strokeWidth={1.5} /></div>
        <div className="hero-flying-icon hero-flying-spark"><Sparkles size={24} strokeWidth={1.5} /></div>
        <span className="hero-floating-variable hero-variable-name">{"{{first_name}}"}</span>
        <span className="hero-floating-variable hero-variable-company">{"{{company}}"}</span>
      </motion.div>

      <motion.div className="animated-hero-content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.13 } } }}>
        <motion.div variants={rise} className="hero-announcement"><span className="hero-announcement-dot" /><span>THOUGHTFUL EMAIL. AT ANY SCALE.</span><Sparkles size={13} /></motion.div>
        <motion.h1 id="hero-title" variants={rise}>
          Every email.<br />
          <span ref={headlineRef} className="hero-connection-line" aria-hidden="true">
            <span className="hero-prefix">A</span>
            <span className="hero-rotating-word">{connections.map((connection, index) => <span key={connection} style={{ "--word-index": index }}>{connection}</span>)}</span>
            <span className="hero-headline-measure">{connections.map((connection) => <span key={connection}>{connection}</span>)}</span>
          </span>
          <span className="sr-only">A real connection.</span>
        </motion.h1>
        <motion.p variants={rise} className="hero-description">Make every send feel one-to-one. Beautiful templates, personalized messages, and all your campaigns in one simple workspace.</motion.p>
        <motion.div variants={rise} className="hero-actions"><MagneticLink href="/auth/login" className="hero-primary-button">Get started<ArrowUpRight size={18} /></MagneticLink><a href="#how-it-works" className="hero-secondary-link">See how it works<ArrowDown size={16} /></a></motion.div>
        <motion.div variants={rise} className="hero-bottom-note"><span /><p>Designed to send. Built to connect.</p><span /></motion.div>
      </motion.div>
    </section>
  );
}
