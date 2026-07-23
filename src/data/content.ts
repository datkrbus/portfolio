import { SkillCategoryData } from '@/types';

export const heroData = {
  tagline: "Available for Software Engineer Internships 2026",
  titlePart1: "Full-Stack ",
  titleHighlight: "Software",
  titlePart2: " Engineer.",
  description: "Hi, I'm Dat Nguyen Ha  — a final-year Software Engineering student at University of Science (HCMUS) — VNU, I am seeking internship positions in Software Engineer, Full-stack Engineer, Frontend Engineer and Backend Engineer",
  primaryButton: "View My Projects",
  secondaryButton: "My Github @datkrb",
  codeWindow: {
    title: "datkrb_profile.ts",
    comment: "// Software Engineer Intern — Verified GitHub Data",
    name: "Dat Nguyen",
    handle: "@datkrb",
    role: "Software Engineer Intern",
    stack: ["TypeScript", "Kotlin", "Docker", "JavaScript"],
    repos: [
      "xiang-qi",
      "Smart-Restaurant",
      "TicketBox",
      "ResFood-App"
    ],
    availability: "Open for Internship 2026"
  }
};

export const aboutData = {
  tagline: "Technical Specialization",
  title: "Full-Stack Web Development.",
  description: "I specialize in building full-stack web applications with modern JavaScript/TypeScript ecosystems. I also have foundational knowledge in native Android app development using Kotlin. My GitHub repositories include a real-time Chinese Chess platform (xiang-qi), a restaurant management system (Smart-Restaurant), an event ticketing platform (TicketBox), and a food ordering Android app (ResFood-App)."
};

export const projectsSectionData = {
  tagline: "GitHub Repositories (@datkrb)",
  title: "Featured Projects",
  description: "A showcase of my full-stack web and mobile applications."
};

export const skillsData = {
  tagline: "Skills & Ecosystem",
  title: "Professional Skills",
  categories: [
    {
      title: "Programming Languages",
      icon: "💻",
      skills: ["Javascript/Typescript", "C++", "Python"],
      familiar: ["C#", "Java", "Kotlin"]
    },
    {
      title: "Frontend ",
      icon: "💻",
      skills: ["React / Next.js", "HTML5 & CSS3", "TailwindCSS"],
      familiar: [""]
    },
    {
      title: "Backend & Database",
      icon: "⚙️",
      skills: ["Node.js", "Express", "NestJS", "Redis", "Socket.io", "SQL(MySQL/PostgreSQL)", "NoSQL(MongoDB)"],
      familiar: []
    },
    {
      title: "Tools & Workflow",
      icon: "🛠️",
      skills: ["Git / GitHub ", "Docker", "Postman API Testing", "Vite / Vercel"],
    },
    {
      title: "Soft Skills",
      icon: "🤝",
      skills: ["Problem Solving", "Team Collaboration", "Agile/Scrum", "Time Management", "English Communication"],
    },
  ] as SkillCategoryData[]
};

export const educationData = {
  tagline: "Academic Background",
  title: "Education & Background",
  degree: "B.S. in Software Engineering",
  university: "University of Science - HCMUS",
  period: "2022 — 2027 (Expected Graduation)",
  achievements: [
    "GPA: 3.43/4.0 (8.1/10)",
  ]
};

export const certificatesData = {
  tagline: "Certificates",
  title: "Certificates",
  certificates: [
    {
      title: "Toeic 765 LR",
      date: "May 2026",
      description: "Description of the certificate",
      link: "#"
    },
  ]
};

export const contactData = {
  tagline: "Internship Contact",
  title: "Let's Connect & Discuss Opportunities.",
  description: "Looking for a Full-Stack Web Developer Intern skilled in JavaScript, TypeScript, React, Next.js, and Node.js? Get in touch with me directly.",
  emailLabel: "Direct Email Address:",
  email: "nguyenhadatkrb2k5@gmail.com",
  copySuccess: "Email Copied!",
  copyDefault: "Copy Email Address",
  form: {
    nameLabel: "Company Name / Recruiter Name",
    namePlaceholder: "Tech Company / HR Manager",
    emailLabel: "Contact Email",
    emailPlaceholder: "hr@company.com",
    messageLabel: "Internship Opportunity / Inquiry Details",
    messagePlaceholder: "Briefly describe the internship position or schedule an interview...",
    submitDefault: "Send Internship Message",
    submitLoading: "Sending Message...",
    submitSuccess: "Message Sent! ✓",
    successMessage: "Thank you! Your message has been routed to Dat Nguyen."
  }
};

export const navbarData = {
  logoInitials: "Đ",
  logoName: "Dat",
  links: [
    { href: "#about", label: "About Me" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" }
  ],
  githubText: "GitHub @datkrb"
};

export const footerData = {
  title: "Dat Nguyen (@datkrb) — Full-Stack Web Developer",
  copyright: "© 2026 Dat Nguyen. Built with High-End Visual Design & 100/100 SEO Standard.",
  githubLinkText: "GitHub @datkrb"
};
