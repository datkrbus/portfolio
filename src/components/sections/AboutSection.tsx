"use client";

import React from 'react';
import Image from 'next/image';
import { EyebrowTag } from '../ui/EyebrowTag';
import { BezelCard } from '../ui/BezelCard';
import { aboutData } from '@/data/content';

/* ─── Inline SVG Icons for Social Links ─── */
const SocialIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'email':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    default:
      return null;
  }
};

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section-spacing" aria-labelledby="about-title">
      <div className="container">

        {/* Section Header */}
        <div className="reveal-on-scroll" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto' }}>
          <EyebrowTag text={aboutData.tagline} style={{ margin: '0 auto' }} />
          <h2 id="about-title" className="heading-section" style={{ marginTop: '1rem' }}>
            Get to Know <span className="text-gradient">Me</span>
          </h2>
        </div>

        {/* About Grid: Avatar Card + Info */}
        <div className="about-grid">

          {/* ─── Left Column: Avatar Card ─── */}
          <div className="about-avatar-col reveal-on-scroll">
            <BezelCard className="about-avatar-card">
              {/* Avatar Image */}
              <div className="about-avatar-wrapper">
                <div className="about-avatar-ring">
                  <Image
                    src={aboutData.avatar}
                    alt={`${aboutData.name} — ${aboutData.role}`}
                    width={220}
                    height={220}
                    className="about-avatar-img"
                    priority
                  />
                </div>
                {/* Availability Badge */}
                <div className="about-status-badge">
                  <span className="about-status-dot" />
                  {aboutData.availability}
                </div>
              </div>

              {/* Name & Role */}
              <div className="about-identity">
                <h3 className="about-name">{aboutData.name}</h3>
                <p className="about-role">{aboutData.role}</p>
                <p className="about-location">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {aboutData.location}
                </p>
              </div>

              {/* Social Links */}
              <div className="about-socials">
                {aboutData.socials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-social-link"
                    aria-label={social.platform}
                    title={social.platform}
                  >
                    <SocialIcon type={social.icon} />
                  </a>
                ))}
              </div>
            </BezelCard>
          </div>

          {/* ─── Right Column: Bio + Highlights + Stats ─── */}
          <div className="about-info-col">

            {/* Bio Text */}
            <div className="about-bio reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
              <p className="about-bio-text">{aboutData.bio}</p>
              <p className="about-bio-text about-bio-extra">{aboutData.bioExtra}</p>
              {aboutData.bioThird && (
                <p className="about-bio-text about-bio-extra">{aboutData.bioThird}</p>
              )}
            </div>

            {/* Highlights */}
            <div className="about-highlights reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
              {aboutData.highlights.map((item, idx) => (
                <div key={idx} className="about-highlight-item">
                  <span className="about-highlight-icon">{item.icon}</span>
                  <span className="about-highlight-text">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="about-stats-grid reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
              {aboutData.stats.map((stat, idx) => (
                <BezelCard key={idx} className="about-stat-card">
                  <div className="about-stat-value">{stat.value}</div>
                  <div className="about-stat-label">{stat.label}</div>
                </BezelCard>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
