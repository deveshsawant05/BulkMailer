"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnimatedCount, MagneticLink, Reveal, ScrollPreview, TiltCard } from "./landing-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCheck, ChevronDown,
  CircleCheck, LayoutDashboard, LayoutTemplate, Mail, Megaphone,
  MoreHorizontal, MousePointer2, Plus, Send, Settings2, ShieldCheck,
  Sparkles, Users, Variable, WandSparkles,
} from "lucide-react";

const campaignExamples = [
  { name: "The monthly edit", type: "Newsletter", recipients: "240", status: "Completed", progress: 100 },
  { name: "A warm welcome", type: "Customer onboarding", recipients: "86", status: "Sending", progress: 68 },
  { name: "Something new is coming", type: "Product update", recipients: "180", status: "Draft", progress: 0 },
];

const recipients = {
  Alex: { initials: "AC", name: "Alex Chen", company: "Studio North", color: "blue" },
  Sam: { initials: "SR", name: "Sam Rivera", company: "Good Company", color: "violet" },
};

const useCases = [
  {
    label: "Customer updates", icon: Users,
    description: "Product news, a helpful update, or a simple hello. Give every customer a reason to stay connected.",
    subject: "A little news from our team", greeting: "Hi Alex,",
    body: "We've been working on something we think you'll love. Here's a first look at what's new, and what it means for your team.",
    footer: "Thanks for being part of the journey.", tag: "Product update", heading: "Good things are on the way.",
  },
  {
    label: "Team communication", icon: Megaphone,
    description: "Keep important announcements and team updates clear, consistent, and easy to send from one place.",
    subject: "Your team's monthly roundup", greeting: "Hi Sam,",
    body: "A new month, a fresh perspective. Catch up on the projects, people, and little wins that are moving us forward together.",
    footer: "Here's to what we'll do next.", tag: "Team newsletter", heading: "A little update. A shared direction.",
  },
  {
    label: "Personal outreach", icon: Mail,
    description: "Start a conversation with thoughtful, personalized messages. Build a reusable template and make it your own.",
    subject: "A quick hello, just for you", greeting: "Hi Jordan,",
    body: "I came across your team's work and wanted to reach out. I think there's a great opportunity for us to create something together.",
    footer: "I'd love to hear what you think.", tag: "Introduction", heading: "Every connection starts somewhere.",
  },
];

const faqs = [
  { question: "How do I get started with BulkMailer?", answer: "Create an account, connect your Gmail account in Settings, and create an email template. Then add your recipients, choose your template, and create your first campaign." },
  { question: "Can I personalize my email templates?", answer: "Yes. The visual template editor supports custom variables, such as {{name}} or {{company}}, in your content. You can manage those variables and reuse your saved templates across campaigns." },
  { question: "Do I need to know how to code?", answer: "No. Use the visual email editor to build your layout, write your message, and save your template without writing HTML." },
  { question: "Can I check the status of a campaign?", answer: "Yes. Your campaign workspace shows campaign status and recipient delivery activity, so you can follow sending progress and review sent or failed messages." },
];

function Eyebrow({ children }) {
  return <p className="landing-eyebrow"><span />{children}</p>;
}

function PrimaryLink({ children, href = "/auth/login", className = "" }) {
  return <MagneticLink href={href} className={`landing-button ${className}`}>{children}<ArrowUpRight size={17} aria-hidden="true" /></MagneticLink>;
}

function ProductPreview() {
  return (
    <section className="landing-overview landing-container" aria-label="BulkMailer workspace preview">
      <div className="landing-preview-glow" aria-hidden="true" />
      <ScrollPreview className="workspace-preview">
        <div className="preview-browser-bar">
          <div className="preview-window-dots" aria-hidden="true"><span /><span /><span /></div>
          <span><ShieldCheck size={12} aria-hidden="true" />Your campaign workspace</span>
          <span className="demo-label">Illustrative preview</span>
        </div>
        <div className="workspace-layout">
          <aside className="preview-sidebar" aria-label="Preview sidebar">
            <div className="preview-brand"><span className="preview-brand-mark"><Mail size={18} /></span>Bulk<span>Mailer</span></div>
            <div className="preview-workspace-name"><span>Y</span>Your workspace<ChevronDown size={12} /></div>
            <div className="preview-nav"><LayoutDashboard size={16} />Overview</div>
            <div className="preview-nav is-active"><Megaphone size={16} />Campaigns<span>3</span></div>
            <div className="preview-nav"><LayoutTemplate size={16} />Templates</div>
            <div className="preview-sidebar-bottom"><Settings2 size={15} />Settings<div className="preview-profile"><span>JD</span><div>Jamie Davis<small>Personal workspace</small></div></div></div>
          </aside>
          <div className="preview-main">
            <div className="preview-page-heading"><div><p>YOUR WORKSPACE, AT A GLANCE</p><h2>Good morning, Jamie <span>✦</span></h2></div><span className="preview-create"><Plus size={13} />New campaign</span></div>
            <div className="preview-metrics">
              <div><span><Send size={14} />Emails sent</span><strong><AnimatedCount value={326} /><small>Across your campaigns</small></strong></div>
              <div><span><Users size={14} />Recipients</span><strong><AnimatedCount value={506} /><small>Connections that matter</small></strong></div>
              <div><span><LayoutTemplate size={14} />Templates</span><strong><AnimatedCount value={8} /><small>Ready for your next idea</small></strong></div>
            </div>
            <div className="preview-campaign-heading"><h3>Your campaigns <span>3</span></h3><MoreHorizontal size={18} /></div>
            <div className="preview-campaign-list">
              {campaignExamples.map((campaign, index) => <motion.div className="preview-campaign-row" key={campaign.name} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.6 }} whileHover={{ x: 5 }}>
                <span className={`preview-campaign-icon campaign-icon-${index}`}><Mail size={17} /></span>
                <div className="preview-campaign-name"><strong>{campaign.name}</strong><small>{campaign.type} · {campaign.recipients} recipients</small></div>
                <div className="preview-campaign-progress"><motion.span initial={{ width: 0 }} whileInView={{ width: `${campaign.progress}%` }} viewport={{ once: true }} transition={{ duration: 1.5, delay: index * 0.2 }} /></div>
                <span className={`preview-status status-${campaign.status.toLowerCase()}`}>{campaign.status === "Completed" && <Check size={10} />}{campaign.status}</span>
              </motion.div>)}
            </div>
            <div className="preview-bottom-note"><CircleCheck size={13} />A clear view of every campaign. A personal touch in every email.</div>
          </div>
          <div className="preview-email-pane">
            <div className="preview-email-pane-heading"><Mail size={13} />Email preview<MoreHorizontal size={15} /></div>
            <div className="preview-email-meta"><small>SUBJECT</small><strong>A little news, just for you</strong><small>TO</small><span>alex@example.com</span></div>
            <div className="preview-email-content"><div className="preview-email-art"><span className="email-art-circle" /><Mail size={35} strokeWidth={1.2} /><span className="email-art-spark">✦</span></div><p className="preview-email-kicker">THE MONTHLY EDIT</p><h3>Something good.<br />In your inbox.</h3><p>Hi <span className="inline-variable">Alex</span>,</p><p>A few ideas, a little inspiration, and the latest from our team. Curated just for you.</p><span className="preview-email-cta">Explore what&apos;s new<ArrowRight size={11} /></span><div className="preview-email-signature">Made with care. Sent with BulkMailer.</div></div>
          </div>
        </div>
      </ScrollPreview>
      <div className="overview-caption"><p>One workspace. <strong>Every connection.</strong></p><div><span><WandSparkles size={15} />Personalized templates</span><span><Send size={15} />Simple campaigns</span><span><CheckCheck size={15} />Delivery visibility</span></div></div>
      <a href="#features" className="landing-scroll-cue" aria-label="Explore BulkMailer features"><ArrowDown size={16} /></a>
    </section>
  );
}

function MotionTicker() {
  const messages = ["Create with care", "Make it personal", "Send with confidence", "Stay connected"];
  return <div className="motion-ticker" aria-label={messages.join(". ")}><div className="motion-ticker-track" aria-hidden="true">{[0, 1, 2, 3].map((copy) => <div className="motion-ticker-group" key={copy}>{messages.map((message) => <span key={message}>{message}<Sparkles size={15} /></span>)}</div>)}</div></div>;
}

function PersonalizationDemo() {
  const [selected, setSelected] = useState("Alex");
  const recipient = recipients[selected];
  const reduced = useReducedMotion();
  const tokenAnimation = { initial: { opacity: 0, y: reduced ? 0 : 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.35 } };
  return (
    <div className="personalization-demo">
      <div className="personalization-template">
        <div className="demo-panel-label"><Variable size={14} />YOUR TEMPLATE</div>
        <p>Hi <span className="variable-token">{"{{name}}"}</span>,</p>
        <p>A little something for the team at <span className="variable-token">{"{{company}}"}</span>.</p>
        <div className="template-token-list"><span>{"{{name}}"}</span><span>{"{{company}}"}</span><span>+ your variables</span></div>
      </div>
      <span className="personalization-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
      <div className="personalization-result">
        <div className="demo-panel-label"><Sparkles size={14} />THEIR EMAIL</div>
        <p>Hi <motion.span key={selected} className={`resolved-variable ${recipient.color}`} {...tokenAnimation}>{selected}</motion.span>,</p>
        <p>A little something for the team at <motion.span key={recipient.company} className={`resolved-variable ${recipient.color}`} {...tokenAnimation}>{recipient.company}</motion.span>.</p>
        <div className="recipient-switcher" role="group" aria-label="Choose a sample recipient">
          {Object.entries(recipients).map(([name, item]) => <motion.button type="button" key={name} aria-pressed={selected === name} onClick={() => setSelected(name)} className={selected === name ? "selected" : ""} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><span className={`recipient-avatar ${item.color}`}>{item.initials}</span>{name}{selected === name && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={12} /></motion.span>}</motion.button>)}
        </div>
        <span className="sr-only" aria-live="polite">Preview for {recipient.name} at {recipient.company}</span>
      </div>
    </div>
  );
}

function Features() {
  return <section id="features" className="landing-features landing-container">
    <Reveal className="landing-section-heading"><div><Eyebrow>THOUGHTFULLY BUILT</Eyebrow><h2>Big on reach.<br /><span>Personal by design.</span></h2></div><p>All the essentials for thoughtful email.<br className="desktop-break" /> Brought together in one simple workspace.</p></Reveal>
    <div className="landing-feature-grid">
      <TiltCard className="landing-feature-card feature-personalization"><div className="feature-icon"><Variable size={21} /></div><h3>One template. A personal touch.</h3><p>Turn a single message into something that feels written for each recipient with dynamic variables.</p><PersonalizationDemo /><span className="feature-footnote"><MousePointer2 size={12} />Try a different recipient in this example</span></TiltCard>
      <TiltCard className="landing-feature-card feature-editor" delay={0.12}><div className="feature-icon"><LayoutTemplate size={21} /></div><h3>Your ideas, beautifully delivered.</h3><p>Build reusable emails with a visual editor. More creativity, less busywork.</p><div className="editor-demo" aria-label="Illustrative visual email editor"><div className="editor-demo-tools"><span><LayoutTemplate size={14} /></span><span className="editor-tool-text">T</span><span><Mail size={14} /></span><span><Plus size={14} /></span></div><div className="editor-demo-canvas"><div className="editor-demo-banner"><span>YOUR NEXT<br /><strong>great idea.</strong></span><span className="editor-banner-star">✳</span></div><div className="editor-selected-block"><span className="editor-block-label">Text block</span><span className="editor-block-handle handle-top-left" /><span className="editor-block-handle handle-top-right" /><span className="editor-block-handle handle-bottom-left" /><span className="editor-block-handle handle-bottom-right" /><strong>A message worth opening.</strong><div className="editor-text-line" /><div className="editor-text-line short" /></div><span className="editor-demo-button">Make it yours <ArrowUpRight size={11} /></span></div><span className="editor-demo-cursor"><MousePointer2 size={18} fill="currentColor" /><small>You</small></span></div></TiltCard>
      <TiltCard className="landing-feature-card feature-campaigns" delay={0.06}><div className="feature-icon"><Send size={21} /></div><h3>Less juggling. More sending.</h3><p>Choose your template, add your recipients, and keep every campaign organized from draft to delivery.</p><div className="campaign-flow" aria-label="Campaign setup example"><div><span><LayoutTemplate size={17} /></span><p>Choose a template<small>The monthly edit</small></p><CircleCheck size={16} /></div><div><span><Users size={17} /></span><p>Add your audience<small>Your recipients, in one place</small></p><CircleCheck size={16} /></div><div><span><Send size={17} /></span><p>Ready when you are<small>Review. Send. Stay connected.</small></p><ArrowUpRight size={17} /></div></div></TiltCard>
      <TiltCard className="landing-feature-card feature-delivery" delay={0.18}><div className="feature-icon"><CheckCheck size={21} /></div><h3>Stay in the know, as you send.</h3><p>Follow campaign progress and recipient delivery status without losing sight of the bigger picture.</p><div className="delivery-demo"><div className="delivery-demo-heading"><span><span className="live-dot" />Campaign activity</span><small>Example</small></div><div className="delivery-progress-track"><motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.8 }} style={{ transformOrigin: "left" }} /></div><div className="delivery-progress-label"><strong>Sending in progress</strong><span>68%</span></div><div className="delivery-event"><span className="delivery-avatar">AC</span><div>alex@example.com<small>Just now</small></div><span><CheckCheck size={13} />Sent</span></div><div className="delivery-event"><span className="delivery-avatar avatar-violet">SR</span><div>sam@example.com<small>A moment ago</small></div><span><CheckCheck size={13} />Sent</span></div></div></TiltCard>
    </div>
  </section>;
}

function Workflow() {
  const steps = [
    { number: "01", icon: Mail, title: "Connect your account", description: "Bring your Gmail account into BulkMailer. Send from an address your audience already knows." },
    { number: "02", icon: LayoutTemplate, title: "Make it your own", description: "Design your template, write your message, and add the variables that make each email personal." },
    { number: "03", icon: Send, title: "Send with confidence", description: "Add your recipients, review your campaign, and follow its progress from your workspace." },
  ];
  return (
    <section id="how-it-works" className="landing-workflow">
      <div className="landing-container">
        <Reveal className="landing-section-heading">
          <div><Eyebrow>THREE STEPS. ONE SIMPLE FLOW.</Eyebrow><h2>From first draft<br /><span>to their inbox.</span></h2></div>
          <Link href="/auth/login" className="landing-text-link">Let&apos;s get you started <ArrowUpRight size={17} /></Link>
        </Reveal>
        <div className="workflow-steps">
          {steps.map((step, index) => <Reveal as="article" key={step.number} className="workflow-step" delay={index * 0.16}>
            <div className="workflow-step-top"><span className="workflow-step-icon"><step.icon size={24} strokeWidth={1.5} /></span><span className="workflow-step-number">{step.number}</span></div>
            <h3>{step.title}</h3><p>{step.description}</p>
          </Reveal>)}
        </div>
        <Reveal className="workflow-note" delay={0.25}><ShieldCheck size={15} /><span>Your account. Your templates. Your connections.</span></Reveal>
      </div>
    </section>
  );
}

function UseCases() {
  const [selected, setSelected] = useState(0);
  const useCase = useCases[selected];
  const reduced = useReducedMotion();
  return (
    <section id="use-cases" className="landing-use-cases landing-container">
      <Reveal className="use-cases-copy">
        <Eyebrow>FOR THE WAY YOU CONNECT</Eyebrow><h2>Made for messages<br /><span>that matter.</span></h2>
        <p>A newsletter, an introduction, a team update.<br className="desktop-break" /> Whatever you have to say, make it feel personal.</p>
        <div className="use-case-options" role="group" aria-label="Explore email use cases">
          {useCases.map((item, index) => <motion.button layout type="button" key={item.label} className={`use-case-option${selected === index ? " selected" : ""}`} aria-pressed={selected === index} aria-controls="use-case-preview" onClick={() => setSelected(index)} whileHover={reduced ? undefined : { x: 5 }} whileTap={reduced ? undefined : { scale: 0.98 }}>
            <span className="use-case-option-icon"><item.icon size={19} /></span>
            <span><strong>{item.label}</strong>{selected === index && <motion.small initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 0.15 }}>{item.description}</motion.small>}</span><ArrowUpRight size={17} />
          </motion.button>)}
        </div>
      </Reveal>
      <Reveal className="use-case-visual" delay={0.15}>
        <div className="use-case-visual-grid" aria-hidden="true" /><span className="use-case-floating-tag"><Sparkles size={14} />A little more personal.</span>
        <div id="use-case-preview" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={useCase.label} className="use-case-email" initial={{ opacity: 0, y: reduced ? 0 : 18, rotate: reduced ? 0 : 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -12, rotate: reduced ? 0 : -1 }} transition={{ duration: reduced ? 0 : 0.35 }}>
              <div className="use-case-email-header"><span className="use-case-sender"><Mail size={18} /></span><div><strong>Your team</strong><small>to your next connection</small></div><MoreHorizontal size={18} /></div>
              <div className="use-case-email-subject"><small>SUBJECT</small><span>{useCase.subject}</span></div>
              <div className="use-case-email-body"><span className="use-case-email-tag">{useCase.tag}</span><h3>{useCase.heading}</h3><p>{useCase.greeting}</p><p>{useCase.body}</p><p>{useCase.footer}</p><div className="use-case-signoff"><span className="use-case-signoff-line" /><span>Your team<small>Sent with a personal touch.</small></span></div></div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="use-case-bottom-tag"><CircleCheck size={15} />One platform. So many ways to say hello.</div><span className="use-case-example-label">Illustrative email example</span>
      </Reveal>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  const reduced = useReducedMotion();
  return (
    <section id="faq" className="landing-faq landing-container">
      <Reveal className="faq-heading"><Eyebrow>A LITTLE MORE CLARITY</Eyebrow><h2>Good questions.<br /><span>Simple answers.</span></h2><p>Everything you need to take the first step.</p><Link href="/auth/login" className="landing-text-link">Get started with BulkMailer <ArrowUpRight size={16} /></Link></Reveal>
      <Reveal className="faq-list" delay={0.1}>
        {faqs.map((faq, index) => <div className="faq-item" key={faq.question}>
          <button className="faq-trigger" type="button" aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{faq.question}</span><motion.span animate={{ rotate: open === index ? 45 : 0 }} transition={{ duration: reduced ? 0 : 0.25 }}><Plus size={18} aria-hidden="true" /></motion.span></button>
          <AnimatePresence initial={false}>
            {open === index && <motion.div id={`faq-answer-${index}`} className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}><p>{faq.answer}</p></motion.div>}
          </AnimatePresence>
        </div>)}
      </Reveal>
    </section>
  );
}

function ClosingCta() {
  return <Reveal as="section" className="landing-container landing-cta-container"><div className="landing-closing-cta"><div className="cta-grid" aria-hidden="true" /><div className="cta-envelope cta-envelope-left" aria-hidden="true"><Mail size={46} strokeWidth={1.1} /><span>✦</span></div><div className="cta-envelope cta-envelope-right" aria-hidden="true"><Send size={40} strokeWidth={1.1} /><span>✦</span></div><div className="cta-content"><Eyebrow>LESS FRICTION. MORE CONNECTION.</Eyebrow><h2>Your next great email<br />starts here.</h2><p>Make every message feel a little more personal.</p><PrimaryLink className="landing-button-white">Get started</PrimaryLink></div></div></Reveal>;
}

export default function LandingContent() {
  return <><ProductPreview /><MotionTicker /><Features /><Workflow /><UseCases /><Faq /><ClosingCta /></>;
}
