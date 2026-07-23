"use client";

import React, { useState } from 'react';
import { EyebrowTag } from '../ui/EyebrowTag';
import { BezelCard } from '../ui/BezelCard';
import { contactData } from '@/data/content';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const emailText = contactData.email;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setStatusMessage(contactData.form.successMessage);
      (e.target as HTMLFormElement).reset();

      setTimeout(() => {
        setSubmitted(false);
        setStatusMessage('');
      }, 4000);
    }, 1200);
  };

  return (
    <section id="contact" className="section-spacing" aria-labelledby="contact-title">
      <div className="container">
        
        <div className="contact-grid">
          
          {/* Left Info */}
          <div className="reveal-on-scroll">
            <EyebrowTag text={contactData.tagline} />
            <h2 id="contact-title" className="heading-section" style={{ marginTop: '1rem' }}>
              {contactData.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '1rem' }}>
              {contactData.description}
            </p>

            {/* Quick Email Copy */}
            <div style={{ marginTop: '2rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.5rem' }}>
                {contactData.emailLabel}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <code style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--accent-cyan)',
                  background: 'rgba(6,182,212,0.08)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(6,182,212,0.2)'
                }}>
                  {emailText}
                </code>
                <button
                  type="button"
                  id="copy-email-btn"
                  className="btn-cta btn-cta-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                  onClick={handleCopyEmail}
                >
                  <span id="copy-tooltip">{copied ? contactData.copySuccess : contactData.copyDefault}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <BezelCard className="reveal-on-scroll" style={{ transitionDelay: '0.15s' }}>
            <form id="contact-form" onSubmit={handleSubmit} aria-label="Internship Contact Form">
              <div className="form-group">
                <label htmlFor="name">{contactData.form.nameLabel}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder={contactData.form.namePlaceholder}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{contactData.form.emailLabel}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder={contactData.form.emailPlaceholder}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">{contactData.form.messageLabel}</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  placeholder={contactData.form.messagePlaceholder}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-cta btn-cta-primary"
                disabled={submitting}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '0.5rem',
                  ...(submitted ? { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' } : {})
                }}
              >
                <span>
                  {submitting
                    ? contactData.form.submitLoading
                    : submitted
                    ? contactData.form.submitSuccess
                    : contactData.form.submitDefault}
                </span>
                {!submitting && !submitted && (
                  <span className="btn-icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>

              {statusMessage && (
                <p id="form-status" style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, color: '#10b981' }}>
                  {statusMessage}
                </p>
              )}
            </form>
          </BezelCard>

        </div>

      </div>
    </section>
  );
};
