import React from 'react';
import { Project } from '@/types';
import { BezelCard } from './BezelCard';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <BezelCard
      className="reveal-on-scroll is-visible"
      dataId={project.id}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{project.title}</h3>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-icon-wrapper"
          aria-label={`View GitHub Repository for ${project.title}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1rem' }}>
        {project.description}
      </p>

      {project.contributions && project.contributions.length > 0 && (
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          {project.contributions.map((contribution, idx) => (
            <li key={idx} style={{ marginBottom: '0.25rem' }}>{contribution}</li>
          ))}
        </ul>
      )}

      <div className="project-tag-list">
        {project.tags.map((tag, idx) => (
          <span key={idx} className="tech-tag">{tag}</span>
        ))}
      </div>

      <div className="project-metrics">
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            GitHub Repository
          </a>
        </div>
      </div>
    </BezelCard>
  );
};
