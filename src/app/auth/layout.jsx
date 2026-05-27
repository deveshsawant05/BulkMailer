import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, Send, Sparkles } from "lucide-react";
import "./auth-design.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-experience">
      <div className="auth-decoration" aria-hidden="true">
        <div className="auth-ambient"><span /><span /><span /></div>
        <div className="auth-grid" />
        <div className="auth-orbit auth-orbit-one" /><div className="auth-orbit auth-orbit-two" />
        <div className="auth-floating-message"><span className="auth-message-icon"><Mail size={20} strokeWidth={1.5} /></span><span className="auth-message-eyebrow">A PERSONAL TOUCH</span><strong>A little hello.<br />A new connection.</strong><div className="auth-message-lines"><span /><span /></div><span className="auth-message-spark"><Sparkles size={18} /></span></div>
        <div className="auth-floating-envelope"><Send size={32} strokeWidth={1.25} /><span>✦</span></div>
        <span className="auth-floating-tag">Made to connect.<ArrowUpRight size={12} /></span>
      </div>
      <Link href="/" className="auth-back-link"><ArrowLeft size={15} />Back to home</Link>
      <div className="auth-context-note"><span />YOUR NEXT CONNECTION STARTS HERE</div>
      {children}
      <div className="auth-page-footer">© {new Date().getFullYear()} BulkMailer<span />A personal touch in every email.</div>
    </div>
  );
}
