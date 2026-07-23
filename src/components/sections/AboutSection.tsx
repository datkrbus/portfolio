import React from 'react';
import { EyebrowTag } from '../ui/EyebrowTag';
import { aboutData } from '@/data/content';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section-spacing" aria-labelledby="about-title">
      <div className="container">
        <div style={{ maxWidth: '750px' }} className="reveal-on-scroll">
          <EyebrowTag text={aboutData.tagline} />
          <h2 id="about-title" className="heading-section" style={{ marginTop: '1rem' }}>
            {aboutData.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1.25rem' }}>
            {aboutData.description}
          </p>
        </div>
      </div>
    </section>
  );
};
