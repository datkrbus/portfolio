import React from 'react';
import { footerData } from '@/data/content';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {footerData.title}
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
              {footerData.copyright}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a
              href="https://github.com/datkrb"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}
            >
              {footerData.githubLinkText}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
