"use client";

import type React from "react";
import { useState } from "react";
import { Mail, MapPin, Send, Github, Linkedin, Instagram } from "lucide-react";
import { useSectionInView } from "@/hooks/use-section-in-view";
import { sendMail } from "@/lib/send-mail";

const socialLinks = [
  { name: "GitHub", icon: Github, url: "https://github.com/LuqmanAristio" },
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/luqmanaristio" },
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/luqman_aristio/" },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { ref, isInView } = useSectionInView(0.3);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setStatus({ type: null, message: "" });

      await sendMail({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully.",
      });
    } catch (err) {
      console.error(err);

      setStatus({
        type: "error",
        message: "Failed to send your message. Please try again.",
      });
    } finally {
      setLoading(false);

      setTimeout(() => {
        setStatus({
          type: null,
          message: "",
        });
      }, 5000);
    }
  };

  // min-h-dvh (not h-dvh) on mobile: the form is taller than a small phone's
  // viewport, and a fixed height plus overflow-hidden clipped it away with no
  // way to reach the send button. FullPageWrapper adds a second snap stop for
  // any section that outgrows the viewport.
  return (
    <section
      ref={ref}
      id="contact"
      className="fullpage-section relative min-h-dvh md:h-dvh flex items-center justify-center overflow-hidden px-4 md:px-6 py-14 md:py-0 bg-secondary/20"
    >
      {/* Large background number */}
      <div 
        className="absolute left-0 md:left-12 top-1/2 -translate-y-1/2 text-[20rem] md:text-[28rem] font-bold text-foreground/6 select-none pointer-events-none leading-none"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(-50px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      >
        05
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Section header */}
        <div 
          className="flex items-center mt-6 lg:mt-0 gap-4 mb-4 lg:mb-12"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Contact info */}
          <div className="space-y-6">
            <div
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              <p className="text-muted-foreground leading-relaxed">
                Have a project in mind? Send me a message and let's create
                something amazing together.
              </p>
            </div>

            {/* Compact email — visible on mobile, where the detail panel below is hidden */}
            <a
              href="mailto:hello@itsluqman.com"
              className="md:hidden inline-flex items-center gap-2 text-sm font-medium text-accent"
            >
              <Mail className="w-4 h-4" />
              hello@itsluqman.com
            </a>

            <div
              className="space-y-4 hidden md:block"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              <a
                href="mailto:hello@itsluqman.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium group-hover:text-accent transition-colors duration-300">
                    hello@itsluqman.com
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">Bali, Indonesia</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div 
              className="lg:pt-4 pt-0"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              }}
            >
              <p className="text-sm text-muted-foreground mb-3">Connect</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300 hover:scale-110"
                    aria-label={social.name}
                    style={{
                      opacity: isInView ? 1 : 0,
                      transform: isInView ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
                      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + index * 0.1}s`,
                    }}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Contact form */}
          <form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(30px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                }}
              >
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-sm"
                  placeholder="Your name"
                  required
                />
              </div>
              <div
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                }}
              >
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-sm"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
              }}
            >
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 resize-none text-sm"
                placeholder="Tell me about your project..."
                required
              />
            </div>

            {status.type && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm transition-all duration-300 ${
                  status.type === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-foreground text-background font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-500 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}

              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
