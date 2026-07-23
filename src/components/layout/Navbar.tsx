"use client";

import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useActiveNav } from '@/hooks/useActiveNav';
import { navbarData } from '@/data/content';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const activeSection = useActiveNav();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="nav-header">
        <nav className="nav-island" aria-label="Main Navigation">
          <a href="#hero" className="nav-logo" aria-label="Dat Nguyen Home" onClick={closeMobileMenu}>
            <span className="nav-logo-badge">{navbarData.logoInitials}</span>
            <span>{navbarData.logoName}</span>
          </a>

          <ul className="nav-links">
            {navbarData.links.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} className={`nav-link ${activeSection === link.href.replace('#', '') ? 'active' : ''}`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              id="theme-toggle"
              className="theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle Dark and Light theme"
            >
              {theme === 'dark' ? (
                <svg id="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg id="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <a
              href="https://github.com/datkrb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta btn-cta-primary"
              style={{ display: 'none' }}
            >
              <span>{navbarData.githubText}</span>
              <span className="btn-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </span>
            </a>

            {/* Mobile Hamburger Icon */}
            <button
              id="mobile-toggle"
              className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Open Mobile Menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-line line-1" />
              <span className="hamburger-line line-2" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Fullscreen Overlay */}
      <div id="mobile-menu" className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} aria-hidden={!mobileMenuOpen}>
        <ul className="mobile-menu-links">
          {navbarData.links.map((link, idx) => (
            <li key={idx}><a href={link.href} onClick={closeMobileMenu}>{link.label}</a></li>
          ))}
        </ul>
      </div>
    </>
  );
};
