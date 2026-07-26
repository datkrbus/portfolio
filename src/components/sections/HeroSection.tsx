import React from 'react';
import { EyebrowTag } from '../ui/EyebrowTag';
import { Button } from '../ui/Button';
import { SharkVisualizer } from '../ui/SharkVisualizer';
import { heroData } from '@/data/content';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid">
          
          {/* Hero Content */}
          <div className="hero-content reveal-on-scroll">
            <EyebrowTag text={heroData.tagline} />

            <h1 id="hero-title" className="heading-hero">
              {heroData.titlePart1}<span className="text-gradient">{heroData.titleHighlight}</span>{heroData.titlePart2}
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '580px' }} dangerouslySetInnerHTML={{ __html: heroData.description.replace('Dat Nguyen (@datkrb)', '<strong>Dat Nguyen (@datkrb)</strong>').replace('TypeScript', '<strong>TypeScript</strong>').replace('Kotlin', '<strong>Kotlin</strong>') }}>
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <Button href="#projects" variant="primary">
                {heroData.primaryButton}
              </Button>

              <Button
                href={heroData.cvLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                }
              >
                {heroData.secondaryButton}
              </Button>
            </div>

          </div>

          {/* Hero Doppelrand Deep Sea Shark */}
          <div className="hero-visual reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <SharkVisualizer />
          </div>

        </div>
      </div>
    </section>
  );
};
