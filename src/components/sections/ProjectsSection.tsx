"use client";

import React from 'react';
import { projectsData } from '@/data/projects';
import { EyebrowTag } from '../ui/EyebrowTag';
import { ProjectCard } from '../ui/ProjectCard';
import { projectsSectionData } from '@/data/content';

export const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="section-spacing" aria-labelledby="projects-title">
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto' }} className="reveal-on-scroll">
          <EyebrowTag text={projectsSectionData.tagline} style={{ margin: '0 auto' }} />
          <h2 id="projects-title" className="heading-section" style={{ marginTop: '1rem' }}>
            {projectsSectionData.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
            {projectsSectionData.description}
          </p>
        </div>

        {/* Projects List Container */}
        <div id="projects-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '3rem' }}>
          {projectsData.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
};
