"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  animate, motion, MotionConfig, useInView, useMotionTemplate,
  useMotionValue, useReducedMotion, useScroll, useSpring, useTransform,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export function Reveal({ children, className, delay = 0, as = "div", ...props }) {
  const reduced = useReducedMotion();
  const Component = as === "section" ? motion.section : as === "article" ? motion.article : motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.75, delay: reduced ? 0 : delay, ease }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TiltCard({ children, className, delay = 0 }) {
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const rotateX = useSpring(useTransform(pointerY, [0, 100], [3, -3]), { stiffness: 160, damping: 24 });
  const rotateY = useSpring(useTransform(pointerX, [0, 100], [-3, 3]), { stiffness: 160, damping: 24 });
  const spotlightX = useMotionTemplate`${pointerX}%`;
  const spotlightY = useMotionTemplate`${pointerY}%`;

  function trackPointer(event) {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  }

  return (
    <motion.article
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      whileHover={reduced ? undefined : { y: -7 }}
      transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease }}
      onPointerMove={trackPointer}
      onPointerLeave={() => { pointerX.set(50); pointerY.set(50); }}
      style={{
        rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY,
        transformPerspective: 1000, "--spotlight-x": spotlightX, "--spotlight-y": spotlightY,
      }}
    >
      {children}
    </motion.article>
  );
}

export function AnimatedCount({ value }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (current) => Math.round(current).toLocaleString("en-US"));

  useEffect(() => {
    if (!visible) return;
    if (reduced) { count.set(value); return; }
    const animation = animate(count, value, { duration: 1.8, ease });
    return () => animation.stop();
  }, [visible, reduced, value, count]);

  return <span ref={ref}><motion.span aria-hidden="true">{rounded}</motion.span><span className="sr-only">{value}</span></span>;
}

export function ScrollPreview({ children, className }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotation = useSpring(useTransform(scrollYProgress, [0, 1], [7, 0]), { stiffness: 80, damping: 24 });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [0.94, 1]), { stiffness: 80, damping: 24 });

  return <motion.div ref={ref} className={className} style={{ rotateX: reduced ? 0 : rotation, scale: reduced ? 1 : scale, transformPerspective: 1400 }}>{children}</motion.div>;
}

export function MagneticLink({ children, href, className, ...props }) {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });

  function trackPointer(event) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.16);
  }

  return (
    <motion.span className="magnetic-link" style={{ x, y }} onPointerMove={trackPointer} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <Link href={href} className={className} {...props}>{children}</Link>
    </motion.span>
  );
}

export default function LandingMotion({ children }) {
  useEffect(() => {
    // Pause continuous decorative motion outside the viewport.
    const regions = document.querySelectorAll(
      ".animated-hero, .landing-overview, .motion-ticker, .landing-feature-card, .landing-workflow, .use-case-visual, .landing-closing-cta"
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { entry.target.dataset.motionActive = String(entry.isIntersecting); });
    }, { rootMargin: "100px" });
    regions.forEach((region) => observer.observe(region));
    return () => observer.disconnect();
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
