import React from 'react';
import { EyebrowTag } from '../ui/EyebrowTag';
import { Button } from '../ui/Button';
import { BezelCard } from '../ui/BezelCard';
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
                href="https://github.com/datkrb"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                }
              >
                {heroData.secondaryButton}
              </Button>
            </div>

          </div>

          {/* Hero Doppelrand Code Window */}
          <div className="hero-visual reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <BezelCard innerClassName="code-window-card">
              <div className="code-window-header">
                <span className="window-dot window-dot-red" />
                <span className="window-dot window-dot-yellow" />
                <span className="window-dot window-dot-green" />
                <span style={{ marginLeft: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                  {heroData.codeWindow.title}
                </span>
              </div>
              <pre className="code-content">
                <code>
                  <span className="code-comment">{heroData.codeWindow.comment}</span>{'\n'}
                  <span className="code-keyword">const</span> <span className="code-function">{heroData.codeWindow.name}</span> = {'{\n'}
                  {'  '}name: <span className="code-string">&quot;{heroData.codeWindow.name}&quot;</span>,{'\n'}
                  {'  '}handle: <span className="code-string">&quot;{heroData.codeWindow.handle}&quot;</span>,{'\n'}
                  {'  '}role: <span className="code-string">&quot;{heroData.codeWindow.role}&quot;</span>,{'\n'}
                  {'  '}stack: [{heroData.codeWindow.stack.map((s, i) => <React.Fragment key={i}><span className="code-string">&quot;{s}&quot;</span>{i < heroData.codeWindow.stack.length - 1 ? ', ' : ''}</React.Fragment>)}],{'\n'}
                  {'  '}repos: [{'\n'}
                  {heroData.codeWindow.repos.map((repo, idx) => (
                    <React.Fragment key={idx}>
                      {'    '}<span className="code-string">&quot;{repo}&quot;</span>{idx < heroData.codeWindow.repos.length - 1 ? ',' : ''}{'\n'}
                    </React.Fragment>
                  ))}
                  {'  '}],{'\n'}
                  {'  '}availability: <span className="code-string">&quot;{heroData.codeWindow.availability}&quot;</span>{'\n'}
                  {'}'};{'\n\n'}
                  <span className="code-keyword">export default</span> {heroData.codeWindow.name};
                </code>
              </pre>
            </BezelCard>
          </div>

        </div>
      </div>
    </section>
  );
};
