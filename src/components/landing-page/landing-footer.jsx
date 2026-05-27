import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Logo from "@/components/logo";
import { Reveal } from "./landing-motion";

const links = [
  { label: "BulkMailer", href: "/" },
  { label: "Products", href: "#features" },
  { label: "Resources", href: "#how-it-works" },
  { label: "Blogs", href: "#" },
  { label: "Support", href: "#faq" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/deveshsawant05", icon: Facebook },
  { label: "Twitter", href: "https://twitter.com/deveshsawant05", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com/deveshsawant05", icon: Instagram },
  { label: "LinkedIn", href: "https://linkedin.com/in/deveshsawant05", icon: Linkedin },
];

export default function LandingFooter() {
  return (
    <footer className="landing-footer landing-container">
      <Reveal className="landing-footer-top">
        <div><Link href="/" aria-label="BulkMailer home"><Logo /></Link><p>More than an email.<br />A better way to connect.</p></div>
        <nav aria-label="Footer" className="landing-footer-nav">{links.map((link) => <a href={link.href} key={link.label}>{link.label}<ArrowUpRight size={12} aria-hidden="true" /></a>)}</nav>
      </Reveal>
      <Reveal className="landing-footer-bottom" delay={0.1}><p>© {new Date().getFullYear()} BulkMailer. All rights reserved.</p><div className="landing-footer-legal"><Link href="/terms-of-service">Terms of Service</Link><Link href="/privacy-policy">Privacy Policy</Link></div><div className="landing-socials">{socialLinks.map((social) => <a href={social.href} key={social.label} aria-label={social.label}><social.icon size={17} strokeWidth={1.6} aria-hidden="true" /></a>)}</div></Reveal>
    </footer>
  );
}
