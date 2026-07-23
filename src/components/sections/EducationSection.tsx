import React from 'react';
import { EyebrowTag } from '../ui/EyebrowTag';
import { BezelCard } from '../ui/BezelCard';
import { educationData, certificatesData } from '@/data/content';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="section-spacing" aria-labelledby="edu-title">
      <div className="container">
        
        {/* Education Section */}
        <div className="reveal-on-scroll" style={{ maxWidth: '600px' }}>
          <EyebrowTag text={educationData.tagline} />
          <h2 id="edu-title" className="heading-section" style={{ marginTop: '1rem' }}>
            {educationData.title}
          </h2>
        </div>

        <div className="timeline">
          <BezelCard className="reveal-on-scroll">
            <div className="timeline-header">
              <div>
                <h3 className="timeline-role">{educationData.degree}</h3>
                <span className="timeline-company">{educationData.university}</span>
              </div>
              <span className="timeline-date">{educationData.period}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {educationData.achievements.map((achievement, idx) => (
                <React.Fragment key={idx}>
                  • {achievement}<br />
                </React.Fragment>
              ))}
            </p>
          </BezelCard>
        </div>

        {/* Certificates Section */}
        <div className="reveal-on-scroll" style={{ maxWidth: '600px', marginTop: '4rem' }}>
          <EyebrowTag text={certificatesData.tagline} />
          <h2 id="cert-title" className="heading-section" style={{ marginTop: '1rem' }}>
            {certificatesData.title}
          </h2>
        </div>

        <div className="timeline" style={{ marginTop: '2rem' }}>
          {certificatesData.certificates.map((cert: any, idx) => (
            <BezelCard key={idx} className="reveal-on-scroll" style={{ marginBottom: '1.5rem' }}>
              <div className="timeline-header" style={{ marginBottom: '0.5rem' }}>
                <div>
                  <h3 className="timeline-role">{cert.title}</h3>
                </div>
                {cert.date && <span className="timeline-date">{cert.date}</span>}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {cert.description}
                {cert.link && cert.link !== "#" && (
                  <React.Fragment>
                    <br/><br/>
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
                      View Credential ↗
                    </a>
                  </React.Fragment>
                )}
              </p>
            </BezelCard>
          ))}
        </div>

      </div>
    </section>
  );
};
