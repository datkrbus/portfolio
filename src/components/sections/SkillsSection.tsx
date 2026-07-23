import React from 'react';
import { EyebrowTag } from '../ui/EyebrowTag';
import { SkillCategory } from '../ui/SkillCategory';
import { skillsData } from '@/data/content';

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="section-spacing" aria-labelledby="skills-title">
      <div className="container">
        
        <div className="reveal-on-scroll" style={{ maxWidth: '600px' }}>
          <EyebrowTag text={skillsData.tagline} />
          <h2 id="skills-title" className="heading-section" style={{ marginTop: '1rem' }}>
            {skillsData.title}
          </h2>
        </div>

        <div className="skills-grid">
          {skillsData.categories.map((cat, idx) => (
            <SkillCategory key={idx} category={cat} />
          ))}
        </div>

      </div>
    </section>
  );
};
