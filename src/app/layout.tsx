import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dat Nguyen (datkrb) — Software Engineer Intern | Portfolio 2026',
  description: 'Official portfolio of Dat Nguyen (datkrb). Software Engineer Intern with projects in TypeScript (web apps), Kotlin (Android), Docker, and full-stack development.',
  keywords: [
    'Dat Nguyen',
    'datkrb',
    'Full-Stack Web Developer',
    'React Developer',
    'Next.js',
    'Node.js',
    'Express',
    'JavaScript',
    'TypeScript',
    'Xiangqi',
    'Smart Restaurant',
    'TicketBox',
    'ResFood App'
  ],
  authors: [{ name: 'Dat Nguyen (datkrb)' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    type: 'website',
    url: 'https://alexnguyen.dev/',
    title: 'Dat Nguyen (datkrb) — Full-Stack Web Developer Intern | Portfolio 2026',
    description: 'Portfolio of Dat Nguyen (@datkrb) featuring 4 full-stack projects (Xiangqi Real-Time Chess, Smart Restaurant SaaS, TicketBox Booking Engine, ResFood Marketplace).',
    siteName: 'Dat Nguyen Portfolio',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dat Nguyen (datkrb) — Full-Stack Web Developer Intern | Portfolio 2026',
    description: 'Portfolio of Dat Nguyen (@datkrb) featuring 4 full-stack projects (Xiangqi Real-Time Chess, Smart Restaurant SaaS, TicketBox Booking Engine, ResFood Marketplace).',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://alexnguyen.dev/#person",
      "name": "Dat Nguyen",
      "alternateName": "datkrb",
      "jobTitle": "Full-Stack Web Developer Intern",
      "description": "Full-Stack Web Developer specialized in building scalable web applications with JavaScript, TypeScript, React, Next.js, Node.js, Express, and Socket.io.",
      "url": "https://alexnguyen.dev/",
      "email": "datkrb.dev@gmail.com",
      "sameAs": [
        "https://github.com/datkrb"
      ],
      "knowsAbout": [
        "JavaScript (ES6+)",
        "TypeScript",
        "React 19",
        "Next.js",
        "Node.js",
        "Express.js",
        "Socket.io WebSockets",
        "PostgreSQL & MongoDB"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://alexnguyen.dev/#website",
      "url": "https://alexnguyen.dev/",
      "name": "Dat Nguyen (datkrb) Developer Portfolio",
      "description": "Official Web Developer Portfolio of Dat Nguyen (@datkrb).",
      "publisher": {
        "@id": "https://alexnguyen.dev/#person"
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://alexnguyen.dev/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://alexnguyen.dev/"
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
