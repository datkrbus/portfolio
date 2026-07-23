import React from 'react';
import { SkillCategoryData } from '@/types';
import { BezelCard } from './BezelCard';

interface SkillCategoryProps {
  category: SkillCategoryData;
}

export const SkillCategory: React.FC<SkillCategoryProps> = ({ category }) => {
  return (
    <BezelCard
      className="reveal-on-scroll"
      style={category.delay ? { transitionDelay: category.delay } : undefined}
    >
      <div className="skill-category-title">
        <div className="skill-icon">{category.icon}</div>
        <h3>{category.title}</h3>
      </div>
      <div className="skill-list">
        {category.skills.map((skill, idx) => (
          <span key={idx} className="skill-pill">
            {skill}
          </span>
        ))}
      </div>
      {category.familiar && category.familiar.length > 0 && category.familiar[0] !== "" && (
        <>
          <div style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
            Familiar With:
          </div>
          <div className="skill-list">
            {category.familiar.map((skill, idx) => (
              skill && skill.trim() !== "" ? (
                <span key={`fam-${idx}`} className="skill-pill" style={{ opacity: 0.75, background: 'transparent' }}>
                  {skill}
                </span>
              ) : null
            ))}
          </div>
        </>
      )}
    </BezelCard>
  );
};
